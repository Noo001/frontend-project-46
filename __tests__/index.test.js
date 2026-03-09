import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import path from 'path';
import fs from 'fs';
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

  it('should handle identical JSON files', () => {
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
});

describe('gendiff flat YAML comparison', () => {
  it('should compare two flat YAML files (.yml extension) correctly', () => {
    const file1 = getFixturePath('file1.yml');
    const file2 = getFixturePath('file2.yml');

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

  it('should compare two flat YAML files (.yaml extension) correctly', () => {
    const file1 = getFixturePath('file1.yaml');
    const file2 = getFixturePath('file2.yaml');

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

  it('should handle identical YAML files', () => {
    const file1 = getFixturePath('file1.yml');
    const file1Copy = getFixturePath('file1.yml');

    const expected = `{
    follow: false
    host: hexlet.io
    proxy: 123.234.53.22
    timeout: 50
}`;

    const result = genDiff(file1, file1Copy);
    expect(result).toBe(expected);
  });

  it('should handle empty YAML file', () => {
    const emptyFile = getFixturePath('empty.yml');
    const file1 = getFixturePath('file1.yml');

    // Создаем пустой YAML файл для теста, если его нет
    if (!fs.existsSync(emptyFile)) {
      fs.writeFileSync(emptyFile, '');
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
});

describe('gendiff mixed formats comparison', () => {
  it('should compare JSON and YAML files', () => {
    const jsonFile = getFixturePath('file1.json');
    const yamlFile = getFixturePath('file2.yml');

    const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

    const result = genDiff(jsonFile, yamlFile);
    expect(result).toBe(expected);
  });

  it('should compare YAML and JSON files', () => {
    const yamlFile = getFixturePath('file1.yml');
    const jsonFile = getFixturePath('file2.json');

    const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

    const result = genDiff(yamlFile, jsonFile);
    expect(result).toBe(expected);
  });
});

describe('gendiff error handling', () => {
  it('should throw error for unsupported file format', () => {
    const unsupportedFile = getFixturePath('unsupported.txt');
    const file1 = getFixturePath('file1.json');

    // Создаем файл с неподдерживаемым расширением
    if (!fs.existsSync(unsupportedFile)) {
      fs.writeFileSync(unsupportedFile, 'content');
    }

    expect(() => {
      genDiff(unsupportedFile, file1);
    }).toThrow(/Unsupported file format/);
  });

  it('should throw error for invalid YAML', () => {
    const invalidYaml = getFixturePath('invalid.yml');
    const file1 = getFixturePath('file1.yml');

    // Создаем файл с некорректным YAML
    if (!fs.existsSync(invalidYaml)) {
      fs.writeFileSync(invalidYaml, 'invalid: yaml: : :');
    }

    expect(() => {
      genDiff(invalidYaml, file1);
    }).toThrow();
  });

  it('should throw error for file not found', () => {
    const nonExistentFile = getFixturePath('nonexistent.yml');
    const file1 = getFixturePath('file1.yml');

    expect(() => {
      genDiff(nonExistentFile, file1);
    }).toThrow(/File not found/);
  });
});

it('should handle empty YAML file', () => {
  const emptyFile = getFixturePath('empty.yml');
  const file1 = getFixturePath('file1.yml');

  // Убедимся, что файл существует
  if (!fs.existsSync(emptyFile)) {
    fs.writeFileSync(emptyFile, '');
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

it('should handle empty JSON file', () => {
  const emptyFile = getFixturePath('empty.json');
  const file1 = getFixturePath('file1.json');

  // Убедимся, что файл существует
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

it('should handle both files empty', () => {
  const empty1 = getFixturePath('empty1.yml');
  const empty2 = getFixturePath('empty2.yml');

  // Создаем пустые файлы
  if (!fs.existsSync(empty1)) {
    fs.writeFileSync(empty1, '');
  }
  if (!fs.existsSync(empty2)) {
    fs.writeFileSync(empty2, '');
  }

  const expected = `{}`;

  const result = genDiff(empty1, empty2);
  expect(result).toBe(expected);
});