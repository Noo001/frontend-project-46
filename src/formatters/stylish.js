import _ from 'lodash';

/**
 * Форматирует значение для вывода
 * @param {*} value - Значение для форматирования
 * @returns {string} Отформатированное значение
 */
const formatValue = (value) => {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return '[complex value]';
  }
  return JSON.stringify(value);
};

/**
 * Форматирует объект с отступами
 * @param {Object} obj - Объект для форматирования
 * @param {number} depth - Текущая глубина
 * @returns {string} Отформатированная строка
 */
const formatObject = (obj, depth = 1) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return formatValue(obj);
  }

  const indent = '    '.repeat(depth);
  const bracketIndent = '    '.repeat(depth - 1);
  const entries = Object.entries(obj).map(([key, value]) =>
    `${indent}${key}: ${formatObject(value, depth + 1)}`);

  return `{\n${entries.join('\n')}\n${bracketIndent}}`;
};

/**
 * Генерирует отступ для текущей глубины
 * @param {number} depth - Глубина вложенности
 * @param {string} symbol - Символ для отступа (+/-/пробел)
 * @returns {string} Отформатированный отступ
 */
const getIndent = (depth, symbol = ' ') => {
  const indentSize = 4;

  if (depth === 0) {
    if (symbol !== ' ') {
      return ' '.repeat(4) + `${symbol} `;
    }
    return ' '.repeat(6);
  }

  const baseIndent = depth * indentSize;

  if (symbol !== ' ') {
    return ' '.repeat(baseIndent + 4) + `${symbol} `;
  }

  return ' '.repeat(baseIndent + 6);
};

/**
 * Форматирует AST в стиле stylish
 * @param {Array} diff - Внутреннее представление различий
 * @param {number} depth - Текущая глубина
 * @returns {string} Отформатированная строка
 */
const stylish = (diff, depth = 0) => {
  console.log(diff);
  const lines = diff.map((node) => {
    const { key, type } = node;

    switch (type) {
    case 'nested':
      return `${getIndent(depth, ' ')}${key}: {\n${stylish(node.children, depth + 1)}\n${getIndent(depth, ' ')}}`;

    case 'added':
      return `${getIndent(depth, '+')}${key}: ${formatObject(node.value, depth + 1)}`;

    case 'deleted':
      return `${getIndent(depth, '-')}${key}: ${formatObject(node.value, depth + 1)}`;

    case 'changed':
      return [
        `${getIndent(depth, '-')}${key}: ${formatObject(node.value1, depth + 1)}`,
        `${getIndent(depth, '+')}${key}: ${formatObject(node.value2, depth + 1)}`,
      ].join('\n');

    case 'unchanged':
      return `${getIndent(depth, ' ')}${key}: ${formatObject(node.value, depth + 1)}`;

    default:
      return '';
    }
  });

  return lines.join('\n');
};

/**
 * Форматирует AST в стиле stylish (основная функция)
 * @param {Array} diff - Внутреннее представление различий
 * @returns {string} Отформатированная строка
 */
const formatStylish = (diff) => {
  if (diff.length === 0) {
    return '{}';
  }
  return `{\n${stylish(diff, 0)}\n}`;
};

export default formatStylish;