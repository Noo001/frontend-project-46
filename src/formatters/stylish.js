import _ from 'lodash';

const formatValue = (value) => {
  if (value === null) return 'null';
  if (typeof value === 'string') return value;
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'object' && !Array.isArray(value)) return '[complex value]';
  return JSON.stringify(value);
};

const isObject = (value) => {
  return value && typeof value === 'object' && !Array.isArray(value);
};

const getIndent = (depth, symbol = ' ') => {
  const indentSize = 4;

  if (depth === 0) {
    if (symbol === ' ') {
      return '      ';
    }
    return '    ' + symbol + ' ';
  }

  const baseIndent = depth * indentSize;
  if (symbol === ' ') {
    return ' '.repeat(baseIndent + 4);
  }
  return ' '.repeat(baseIndent + 2) + symbol + ' ';
};

const stylish = (diff, depth = 0) => {
  const lines = diff.map((node) => {
    const { key, type } = node;

    switch (type) {
    case 'nested':
      return `${getIndent(depth, ' ')}${key}: {\n${stylish(node.children, depth + 1)}\n${getIndent(depth, ' ')}}`;

    case 'added': {
      if (isObject(node.value)) {
        const nestedDiff = Object.entries(node.value).map(([k, v]) => ({
          key: k,
          type: 'added',
          value: v,
        }));
        return `${getIndent(depth, '+')}${key}: {\n${stylish(nestedDiff, depth + 1)}\n${getIndent(depth, ' ')}}`;
      }
      return `${getIndent(depth, '+')}${key}: ${formatValue(node.value)}`;
    }

    case 'deleted': {
      if (isObject(node.value)) {
        const nestedDiff = Object.entries(node.value).map(([k, v]) => ({
          key: k,
          type: 'deleted',
          value: v,
        }));
        return `${getIndent(depth, '-')}${key}: {\n${stylish(nestedDiff, depth + 1)}\n${getIndent(depth, ' ')}}`;
      }
      return `${getIndent(depth, '-')}${key}: ${formatValue(node.value)}`;
    }

    case 'changed': {
      const lines = [];

      if (isObject(node.value1)) {
        const nestedDiff = Object.entries(node.value1).map(([k, v]) => ({
          key: k,
          type: 'unchanged',
          value: v,
        }));
        lines.push(`${getIndent(depth, '-')}${key}: {\n${stylish(nestedDiff, depth + 1)}\n${getIndent(depth, ' ')}}`);
      } else {
        lines.push(`${getIndent(depth, '-')}${key}: ${formatValue(node.value1)}`);
      }

      if (isObject(node.value2)) {
        const nestedDiff = Object.entries(node.value2).map(([k, v]) => ({
          key: k,
          type: 'unchanged', 
          value: v,
        }));
        lines.push(`${getIndent(depth, '+')}${key}: {\n${stylish(nestedDiff, depth + 1)}\n${getIndent(depth, ' ')}}`);
      } else {
        lines.push(`${getIndent(depth, '+')}${key}: ${formatValue(node.value2)}`);
      }

      return lines.join('\n');
    }

    case 'unchanged': {
      if (isObject(node.value)) {
        const nestedDiff = Object.entries(node.value).map(([k, v]) => ({
          key: k,
          type: 'unchanged',
          value: v,
        }));
        return `${getIndent(depth, ' ')}${key}: {\n${stylish(nestedDiff, depth + 1)}\n${getIndent(depth, ' ')}}`;
      }
      return `${getIndent(depth, ' ')}${key}: ${formatValue(node.value)}`;
    }

    default:
      return '';
    }
  });

  return lines.join('\n');
};

const formatStylish = (diff) => {
  if (diff.length === 0) return '{}';
  return `{\n${stylish(diff, 0)}\n}`;
};

export default formatStylish;