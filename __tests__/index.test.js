import { describe, it, expect } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

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

    // Создаем пустой файл для теста
    const fs = require('fs');
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
      .map(line => line.match(/\w+(?=:)/)[0]);

    expect(keys).toEqual(['follow', 'host', 'proxy', 'timeout', 'timeout', 'verbose']);
  });
});