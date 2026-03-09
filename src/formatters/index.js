import formatStylish from './stylish.js';
import formatPlain from './plain.js';

const formatters = {
  stylish: formatStylish,
  plain: formatPlain,
};

/**
 * Возвращает функцию форматирования для указанного формата
 * @param {string} formatName - Название формата (stylish, plain)
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