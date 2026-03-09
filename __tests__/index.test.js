import { describe, it, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';
import { readAndParseFile } from '../src/parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('gendiff flat JSON comparison', () => {
  it('should compare two flat JSON files correctly', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');

    const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

    const result = genDiff(file1, file2);
    expect(result).toBe(expected);
  });

  it('should handle identical files', () => {
    const file1 = getFixturePath('file1.json');
    const file1Copy = getFixturePath('file1.json');

    const expected = `{
    follow: false
    host: hexlet.io
    proxy: 123.234.53.22
    timeout: 50
}`;

    const result = genDiff(file1, file1Copy);
    expect(result).toBe(expected);
  });

  it('should handle empty file', () => {
    const emptyFile = getFixturePath('empty.json');
    const file1 = getFixturePath('file1.json');

    // Создаем пустой файл для теста, если его нет
    if (!fs.existsSync(emptyFile)) {
      fs.writeFileSync(emptyFile, '{}');
    }

    const expected = `{
  - follow: false
  - host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
}`;

    const result = genDiff(file1, emptyFile);
    expect(result).toBe(expected);
  });

  it('should handle file with added keys', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');

    // Проверяем, что ключи отсортированы
    const result = genDiff(file1, file2);
    const lines = result.split('\n');

    // Проверяем порядок ключей (алфавитный)
    const keys = lines
      .filter(line => line.match(/[+-]?\s+\w+:/))
      .map(line => line.match(/\w+(?=:)/)[0])
      .filter(Boolean);

    const expectedKeys = ['follow', 'host', 'proxy', 'timeout', 'timeout', 'verbose'];
    expect(keys).toEqual(expectedKeys);
  });

  // Новые тесты для улучшения покрытия

  it('should handle file not found error', () => {
    const nonExistentFile = getFixturePath('nonexistent.json');
    const file1 = getFixturePath('file1.json');

    expect(() => {
      genDiff(nonExistentFile, file1);
    }).toThrow();
  });

  it('should handle invalid JSON format error', () => {
    const invalidFile = getFixturePath('invalid.json');

    // Создаем файл с некорректным JSON
    if (!fs.existsSync(invalidFile)) {
      fs.writeFileSync(invalidFile, '{ invalid json }');
    }

    const file1 = getFixturePath('file1.json');

    expect(() => {
      genDiff(invalidFile, file1);
    }).toThrow();
  });

  it('should handle different value types', () => {
    const typesFile1 = getFixturePath('types1.json');
    const typesFile2 = getFixturePath('types2.json');

    // Создаем файлы с разными типами данных
    if (!fs.existsSync(typesFile1)) {
      fs.writeFileSync(typesFile1, JSON.stringify({
        string: 'value1',
        number: 42,
        boolean: true,
        nullValue: null,
      }, null, 2));
    }

    if (!fs.existsSync(typesFile2)) {
      fs.writeFileSync(typesFile2, JSON.stringify({
        string: 'value2',
        number: 100,
        boolean: false,
        nullValue: null,
      }, null, 2));
    }

    const result = genDiff(typesFile1, typesFile2);
    expect(result).toContain('- string: value1');
    expect(result).toContain('+ string: value2');
    expect(result).toContain('- number: 42');
    expect(result).toContain('+ number: 100');
    expect(result).toContain('- boolean: true');
    expect(result).toContain('+ boolean: false');
    expect(result).toContain('    nullValue: null');
  });

  it('should handle absolute paths', () => {
    const absolutePath1 = path.resolve(getFixturePath('file1.json'));
    const absolutePath2 = path.resolve(getFixturePath('file2.json'));

    const result = genDiff(absolutePath1, absolutePath2);
    expect(result).toBeDefined();
    expect(result).toContain('follow');
    expect(result).toContain('verbose');
  });

  it('should test readAndParseFile directly', () => {
    const file1 = getFixturePath('file1.json');
    const data = readAndParseFile(file1);

    expect(data).toBeDefined();
    expect(data.host).toBe('hexlet.io');
    expect(data.timeout).toBe(50);
    expect(data.proxy).toBe('123.234.53.22');
    expect(data.follow).toBe(false);
  });
});