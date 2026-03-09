import { readAndParseFile } from './parsers.js';
import buildDiff from './buildDiff.js';
import formatStylish from './formatters/stylish.js';

/**
 * Сравнивает два конфигурационных файла и возвращает разницу
 * @param {string} filepath1 - Путь к первому файлу
 * @param {string} filepath2 - Путь ко второму файлу
 * @param {string} _format - Формат вывода (stylish, plain, json) - пока не используется
 * @returns {string} Отформатированная строка с различиями
 */
export default function genDiff(filepath1, filepath2, _format = 'stylish') {
  try {
    const data1 = readAndParseFile(filepath1);
    const data2 = readAndParseFile(filepath2);

    const diff = buildDiff(data1, data2);

    // Пока поддерживаем только stylish формат
    return formatStylish(diff);
  } catch (error) {
    throw new Error(`Failed to process files: ${error.message}`);
  }
}