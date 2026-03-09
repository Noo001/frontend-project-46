import { describe, it, expect } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('gendiff flat structures', () => {
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

describe('gendiff nested structures', () => {
  it('should compare two nested JSON files correctly', () => {
    const file1 = getFixturePath('file1-nested.json');
    const file2 = getFixturePath('file2-nested.json');

    const expected = `{
    common: {
        + follow: false
          setting1: Value 1
        - setting2: 200
        - setting3: true
        + setting3: null
        + setting4: blah blah
        + setting5: {
              key5: value5
          }
          setting6: {
              doge: {
                  - wow: 
                  + wow: so much
              }
              key: value
              + ops: vops
          }
    }
    group1: {
        - baz: bas
        + baz: bars
          foo: bar
        - nest: {
              key: value
          }
        + nest: str
    }
    - group2: {
          abc: 12345
          deep: {
              id: 45
          }
      }
    + group3: {
          deep: {
              id: {
                  number: 45
              }
          }
          fee: 100500
      }
}`;

    const result = genDiff(file1, file2);
    expect(result).toBe(expected);
  });

  it('should compare two nested YAML files correctly', () => {
    const file1 = getFixturePath('file1-nested.yml');
    const file2 = getFixturePath('file2-nested.yml');

    const expected = `{
    common: {
        + follow: false
          setting1: Value 1
        - setting2: 200
        - setting3: true
        + setting3: null
        + setting4: blah blah
        + setting5: {
              key5: value5
          }
          setting6: {
              doge: {
                  - wow: 
                  + wow: so much
              }
              key: value
              + ops: vops
          }
    }
    group1: {
        - baz: bas
        + baz: bars
          foo: bar
        - nest: {
              key: value
          }
        + nest: str
    }
    - group2: {
          abc: 12345
          deep: {
              id: 45
          }
      }
    + group3: {
          deep: {
              id: {
                  number: 45
              }
          }
          fee: 100500
      }
}`;

    const result = genDiff(file1, file2);
    expect(result).toBe(expected);
  });

  it('should handle nested structures with mixed formats', () => {
    const jsonFile = getFixturePath('file1-nested.json');
    const yamlFile = getFixturePath('file2-nested.yml');

    const result = genDiff(jsonFile, yamlFile);
    expect(result).toBeDefined();
    expect(result).toContain('common');
    expect(result).toContain('group1');
    expect(result).toContain('group2');
    expect(result).toContain('group3');
  });
});

describe('gendiff error handling', () => {
  it('should throw error for unsupported file format', () => {
    const unsupportedFile = getFixturePath('unsupported.txt');
    const file1 = getFixturePath('file1.json');

    expect(() => {
      genDiff(unsupportedFile, file1);
    }).toThrow(/Unsupported file format/);
  });

  it('should throw error for file not found', () => {
    const nonExistentFile = getFixturePath('nonexistent.json');
    const file1 = getFixturePath('file1.json');

    expect(() => {
      genDiff(nonExistentFile, file1);
    }).toThrow(/File not found/);
  });
});