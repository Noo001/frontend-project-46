import fs from 'fs';
import path from 'path';

/**
 * Читает и парсит JSON файл
 * @param {string} filepath - Путь к файлу
 * @returns {Object} Распарсенные данные
 */
export const readAndParseFile = (filepath) => {
  try {
    const absolutePath = path.resolve(process.cwd(), filepath);
    const content = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filepath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format in file: ${filepath}`);
    }
    throw error;
  }
};