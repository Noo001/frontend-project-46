import formatStylish from './stylish.js';
import formatPlain from './plain.js';
import formatJson from './json.js';

const formatters = {
  stylish: formatStylish,
  plain: formatPlain,
  json: formatJson,
};

/**
 * Возвращает функцию форматирования для указанного формата
 * @param {string} formatName - Название формата (stylish, plain, json)
 * @returns {Function} Функция форматирования
 */
export const getFormatter = (formatName) => {
  const formatter = formatters[formatName];
  if (!formatter) {
    throw new Error(`Unknown format: ${formatName}. Supported formats: ${Object.keys(formatters).join(', ')}`);
  }
  return formatter;
};

export default formatters;