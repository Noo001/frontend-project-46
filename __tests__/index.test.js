import { describe, it, expect } from '@jest/globals'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import genDiff from '../src/index.js'
import { readAndParseFile, getFileFormat, parseContent } from '../src/parsers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename)

describe('gendiff stylish format', ( ) => {
  it('should compare two flat JSON files correctly', ( ) => {
    const file1 = getFixturePath('file1.json')
    const file2 = getFixturePath('file2.json')

    const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`

    const result = genDiff(file1, file2, 'stylish')
    expect(result).toBe(expected)
  })

  it('should handle identical JSON files', ( ) => {
    const file1 = getFixturePath('file1.json')
    const file1Copy = getFixturePath('file1.json')

    const expected = `{
    follow: false
    host: hexlet.io
    proxy: 123.234.53.22
    timeout: 50
}`

    const result = genDiff(file1, file1Copy, 'stylish')
    expect(result).toBe(expected)
  })
})

describe('gendiff plain format', ( ) => {
  it('should compare two nested JSON files in plain format', ( ) => {
    const file1 = getFixturePath('file1-nested.json')
    const file2 = getFixturePath('file2-nested.json')

    const expected = [
      'Property \'common.follow\' was added with value: false',
      'Property \'common.setting2\' was removed',
      'Property \'common.setting3\' was updated. From true to null',
      'Property \'common.setting4\' was added with value: \'blah blah\'',
      'Property \'common.setting5\' was added with value: [complex value]',
      'Property \'common.setting6.doge.wow\' was updated. From \'\' to \'so much\'',
      'Property \'common.setting6.ops\' was added with value: \'vops\'',
      'Property \'group1.baz\' was updated. From \'bas\' to \'bars\'',
      'Property \'group1.nest\' was updated. From [complex value] to \'str\'',
      'Property \'group2\' was removed',
      'Property \'group3\' was added with value: [complex value]',
    ].join('\n')

    const result = genDiff(file1, file2, 'plain')
    expect(result).toBe(expected)
  })

  it('should compare two flat JSON files in plain format', ( ) => {
    const file1 = getFixturePath('file1.json')
    const file2 = getFixturePath('file2.json')

    const expected = [
      'Property \'follow\' was removed',
      'Property \'proxy\' was removed',
      'Property \'timeout\' was updated. From 50 to 20',
      'Property \'verbose\' was added with value: true',
    ].sort().join('\n')

    const result = genDiff(file1, file2, 'plain')
    const sortedResult = result.split('\n').sort().join('\n')
    expect(sortedResult).toBe(expected)
  })

  it('should handle identical files in plain format', ( ) => {
    const file1 = getFixturePath('file1.json')
    const file1Copy = getFixturePath('file1.json')

    const result = genDiff(file1, file1Copy, 'plain')
    expect(result).toBe('')
  })

  it('should format values correctly', ( ) => {
    const file1 = getFixturePath('file1-nested.json')
    const file2 = getFixturePath('file2-nested.json')

    const result = genDiff(file1, file2, 'plain')

    expect(result).toContain('\'blah blah\'')
    expect(result).toContain('\'so much\'')
    expect(result).toContain('\'str\'')
    expect(result).toContain('true')
    expect(result).toContain('false')
    expect(result).toContain('null')
    expect(result).toContain('[complex value]')
  })
})

describe('parsers module tests', ( ) => {
  it('should get file format correctly', ( ) => {
    expect(getFileFormat('test.json')).toBe('json')
    expect(getFileFormat('test.yml')).toBe('yaml')
    expect(getFileFormat('test.yaml')).toBe('yaml')
    expect(( ) => getFileFormat('test.txt')).toThrow(/Unsupported file format/)
  })

  it('should parse content correctly', ( ) => {
    expect(parseContent('{"key": "value"}', 'json')).toEqual({ key: 'value' })
    expect(parseContent('key: value', 'yaml')).toEqual({ key: 'value' })
    expect(parseContent('', 'json')).toEqual({})
    expect(parseContent('', 'yaml')).toEqual({})
    expect(parseContent('  ', 'json')).toEqual({})
    expect(( ) => parseContent('invalid json', 'json')).toThrow()
    expect(( ) => parseContent('invalid: yaml: :', 'yaml')).toThrow()
    expect(( ) => parseContent('', 'unsupported')).toThrow('Unsupported format for parsing: unsupported')
  })

  it('should read and parse files with different paths', ( ) => {
    const file1 = getFixturePath('file1.json')
    const data = readAndParseFile(file1)
    expect(data).toHaveProperty('host', 'hexlet.io')

    expect(( ) => readAndParseFile('nonexistent.json')).toThrow()
  })
})

describe('gendiff error handling', ( ) => {
  it('should throw error for unsupported file format', ( ) => {
    const unsupportedFile = getFixturePath('unsupported.txt')
    const file1 = getFixturePath('file1.json')

    if (!fs.existsSync(unsupportedFile)) {
      fs.writeFileSync(unsupportedFile, 'content')
    }

    expect(( ) => {
      genDiff(unsupportedFile, file1)
    }).toThrow(/Unsupported file format/)
  })

  it('should throw error for file not found', ( ) => {
    const nonExistentFile = getFixturePath('nonexistent.json')
    const file1 = getFixturePath('file1.json')

    expect(( ) => {
      genDiff(nonExistentFile, file1)
    }).toThrow(/File not found/)
  })

  it('should throw error for unknown format', ( ) => {
    const file1 = getFixturePath('file1.json')
    const file2 = getFixturePath('file2.json')

    expect(( ) => {
      genDiff(file1, file2, 'unknown')
    }).toThrow(/Unknown format/)
  })

  it('should handle invalid JSON files', ( ) => {
    const invalidFile = getFixturePath('invalid.json')

    if (!fs.existsSync(invalidFile)) {
      fs.writeFileSync(invalidFile, '{ invalid json }')
    }

    const file1 = getFixturePath('file1.json')

    expect(( ) => {
      genDiff(invalidFile, file1)
    }).toThrow(/Invalid .json format/)
  })

  it('should handle invalid YAML files', ( ) => {
    const invalidFile = getFixturePath('invalid.yml')
    const file1 = getFixturePath('file1.yml')

    expect(( ) => {
      genDiff(invalidFile, file1)
    }).toThrow(/Invalid .yml format/)
  })
})

describe('gendiff json format', ( ) => {
  it('should compare two nested JSON files in json format', ( ) => {
    const file1 = getFixturePath('file1-nested.json')
    const file2 = getFixturePath('file2-nested.json')

    const result = genDiff(file1, file2, 'json')

    expect(( ) => JSON.parse(result)).not.toThrow()

    const parsed = JSON.parse(result)

    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed.length).toBeGreaterThan(0)

    const rootKeys = parsed.map((item) => item.key)
    expect(rootKeys).toContain('common')
    expect(rootKeys).toContain('group1')
    expect(rootKeys).toContain('group2')
    expect(rootKeys).toContain('group3')
  })

  it('should compare two flat JSON files in json format', ( ) => {
    const file1 = getFixturePath('file1.json')
    const file2 = getFixturePath('file2.json')

    const result = genDiff(file1, file2, 'json')

    expect(( ) => JSON.parse(result)).not.toThrow()

    const parsed = JSON.parse(result)

    expect(Array.isArray(parsed)).toBe(true)

    const types = parsed.map((item) => item.type)
    expect(types).toContain('added')
    expect(types).toContain('deleted')
    expect(types).toContain('changed')
    expect(types).toContain('unchanged')
  })

  it('should handle identical files in json format', ( ) => {
    const file1 = getFixturePath('file1.json')
    const file1Copy = getFixturePath('file1.json')

    const result = genDiff(file1, file1Copy, 'json')

    expect(( ) => JSON.parse(result)).not.toThrow()

    const parsed = JSON.parse(result)

    const allUnchanged = parsed.every((item) => item.type === 'unchanged')
    expect(allUnchanged).toBe(true)
  })
})