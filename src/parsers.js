import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Находит полный путь к файлу, проверяя несколько возможных расположений
 * @param {string} filepath - Исходный путь к файлу
 * @returns {string} Полный путь к существующему файлу
 */
const resolveFilePath = (filepath) => {
  // Если файл уже существует по указанному пути
  if (fs.existsSync(filepath)) {
    return path.resolve(filepath);
  }

  // Проверяем относительно текущей рабочей директории
  const cwdPath = path.resolve(process.cwd(), filepath);
  if (fs.existsSync(cwdPath)) {
    return cwdPath;
  }

  // Проверяем в папке __fixtures__ относительно текущей директории
  const fixturesPath = path.resolve(process.cwd(), '__fixtures__', path.basename(filepath));
  if (fs.existsSync(fixturesPath)) {
    return fixturesPath;
  }

  // Проверяем в папке __fixtures__ относительно корня проекта
  const projectFixturesPath = path.resolve(__dirname, '..', '__fixtures__', path.basename(filepath));
  if (fs.existsSync(projectFixturesPath)) {
    return projectFixturesPath;
  }

  // Возвращаем исходный путь - он вызовет ошибку при чтении
  return filepath;
};

/**
 * Читает и парсит JSON файл
 * @param {string} filepath - Путь к файлу
 * @returns {Object} Распарсенные данные
 */
export const readAndParseFile = (filepath) => {
  try {
    const resolvedPath = resolveFilePath(filepath);
    const content = fs.readFileSync(resolvedPath, 'utf-8');

    // Проверяем, что файл не пустой
    if (!content.trim()) {
      return {};
    }

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

export default readAndParseFile;