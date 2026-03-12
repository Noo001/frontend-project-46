import {
  describe, it, expect, beforeEach, afterEach,
} from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import genDiff from '../src/index.js'
import buildDiff from '../src/buildDiff.js'
import formatStylish from '../src/formatters/stylish.js'
import formatPlain from '../src/formatters/plain.js'
import { readAndParseFile } from '../src/parsers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename)

describe('Coverage tests for stylish.js', () => {
  it('should format different value types correctly', () => {
    // Тестируем строку 10 - форматирование значений
    const diff = [
      { key: 'string', type: 'added', value: 'test' },
      { key: 'number', type: 'added', value: 42 },
      { key: 'boolean', type: 'added', value: true },
      { key: 'null', type: 'added', value: null },
      { key: 'object', type: 'added', value: { nested: 'value' } },
      { key: 'array', type: 'added', value: [1, 2, 3] },
    ]

    const result = formatStylish(diff)

    expect(result).toContain('test')
    expect(result).toContain('42')
    expect(result).toContain('true')
    expect(result).toContain('null')
    // В stylish формате объекты и массивы выводятся полностью, а не как [complex value]
    expect(result).toContain('nested: value')
    expect(result).toContain('1,2,3')
  })

  it('should handle different node types', () => {
    // Тестируем строки 59-65 - обработка разных типов узлов
    const diff = [
      { key: 'nested', type: 'nested', children: [] },
      { key: 'added', type: 'added', value: 'value' },
      { key: 'deleted', type: 'deleted', value: 'value' },
      {
        key: 'changed', type: 'changed', value1: 'old', value2: 'new',
      },
      { key: 'unchanged', type: 'unchanged', value: 'value' },
    ]

    const result = formatStylish(diff)

    expect(result).toContain('nested')
    expect(result).toContain('added')
    expect(result).toContain('deleted')
    expect(result).toContain('changed')
    expect(result).toContain('unchanged')
  })

  it('should handle empty objects', () => {
    // Тестируем строки 35-40 - форматирование объектов
    const diff = [
      { key: 'empty', type: 'nested', children: [] },
    ]

    const result = formatStylish(diff)
    expect(result).toContain('empty: {')
    expect(result).toContain('}')
  })

  it('should handle deep nesting', () => {
    // Тестируем строки 80,98,112 - глубокую вложенность
    const diff = [
      {
        key: 'level1',
        type: 'nested',
        children: [
          {
            key: 'level2',
            type: 'nested',
            children: [
              {
                key: 'level3',
                type: 'added',
                value: 'deep value',
              },
            ],
          },
        ],
      },
    ]

    const result = formatStylish(diff)
    expect(result).toContain('level1')
    expect(result).toContain('level2')
    expect(result).toContain('level3')
  })
})

describe('Coverage tests for parsers.js', () => {
  const tempFiles = []

  beforeEach(() => {
    const validJson = getFixturePath('temp-valid.json')
    const invalidJson = getFixturePath('temp-invalid.json')
    const validYaml = getFixturePath('temp-valid.yml')
    const invalidYaml = getFixturePath('temp-invalid.yml')
    const emptyFile = getFixturePath('temp-empty.json')

    fs.writeFileSync(validJson, '{"key": "value"}')
    fs.writeFileSync(invalidJson, '{ invalid json }')
    fs.writeFileSync(validYaml, 'key: value')
    fs.writeFileSync(invalidYaml, 'invalid: yaml: : :')
    fs.writeFileSync(emptyFile, '')

    tempFiles.push(validJson, invalidJson, validYaml, invalidYaml, emptyFile)
  })

  afterEach(() => {
    tempFiles.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
      }
    })
  })

  it('should handle file not found error', () => {
    expect(() => readAndParseFile('nonexistent-file.json')).toThrow(/File not found/)
  })

  it('should handle invalid JSON format error', () => {
    const invalidFile = getFixturePath('temp-invalid.json')
    expect(() => readAndParseFile(invalidFile)).toThrow(/Invalid .json format/)
  })

  it('should handle invalid YAML format error', () => {
    const invalidFile = getFixturePath('temp-invalid.yml')
    expect(() => readAndParseFile(invalidFile)).toThrow(/Invalid .yml format/)
  })

  it('should handle empty files', () => {
    const emptyFile = getFixturePath('temp-empty.json')
    const data = readAndParseFile(emptyFile)
    expect(data).toEqual({})
  })
})

describe('Coverage tests for buildDiff.js', () => {
  it('should handle line 74 - special case', () => {
    const obj1 = { key: null }
    const obj2 = { key: undefined }

    const diff = buildDiff(obj1, obj2)

    const changedNode = diff.find((node) => node.key === 'key' && node.type === 'changed')
    expect(changedNode).toBeDefined()
    expect(changedNode.value1).toBeNull()
    expect(changedNode.value2).toBeUndefined()
  })

  it('should handle objects with different value types', () => {
    const obj1 = { key: 'string' }
    const obj2 = { key: 42 }

    const diff = buildDiff(obj1, obj2)

    const changedNode = diff.find((node) => node.key === 'key' && node.type === 'changed')
    expect(changedNode).toBeDefined()
    expect(changedNode.value1).toBe('string')
    expect(changedNode.value2).toBe(42)
  })
})

describe('Coverage tests for plain.js', () => {
  it('should handle line 57 - default case in switch', () => {
    const diff = [
      { key: 'unknown', type: 'unknown' },
    ]

    expect(() => formatPlain(diff)).not.toThrow()
  })
})

describe('Integration tests for all formatters', () => {
  it('should handle all formatters with same data', () => {
    const file1 = getFixturePath('file1-nested.json')
    const file2 = getFixturePath('file2-nested.json')

    const stylishResult = genDiff(file1, file2, 'stylish')
    const plainResult = genDiff(file1, file2, 'plain')
    const jsonResult = genDiff(file1, file2, 'json')

    expect(stylishResult).toBeDefined()
    expect(plainResult).toBeDefined()
    expect(jsonResult).toBeDefined()
    expect(() => JSON.parse(jsonResult)).not.toThrow()
  })

  it('should handle empty diff in all formatters', () => {
    const file1 = getFixturePath('file1.json')
    const file1Copy = getFixturePath('file1.json')

    const stylishResult = genDiff(file1, file1Copy, 'stylish')
    const plainResult = genDiff(file1, file1Copy, 'plain')
    const jsonResult = genDiff(file1, file1Copy, 'json')

    expect(stylishResult).toBeDefined()
    expect(plainResult).toBe('')
    expect(() => JSON.parse(jsonResult)).not.toThrow()
  })
})
