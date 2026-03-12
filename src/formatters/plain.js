import _ from 'lodash'

/**
 * Форматирует значение для plain вывода
 * @param {*} value - Значение для форматирования
 * @returns {string} Отформатированное значение
 */
const formatValue = (value) => {
  if (value === null) {
    return 'null'
  }
  if (typeof value === 'string') {
    return `'${value}'`
  }
  if (typeof value === 'object') {
    return '[complex value]'
  }
  return String(value)
}

/**
 * Собирает путь к свойству
 * @param {Array} path - Массив частей пути
 * @returns {string} Путь в формате "property.subproperty"
 */
const buildPath = (path) => path.join('.')

/**
 * Форматирует AST в plain стиле
 * @param {Array} diff - Внутреннее представление различий
 * @param {Array} path - Текущий путь к свойству
 * @returns {Array} Массив строк с описанием изменений
 */
const plain = (diff, path = []) => {
  const lines = diff.flatMap((node) => {
    const { key, type } = node
    const currentPath = [...path, key]
    const propertyPath = buildPath(currentPath)

    switch (type) {
    case 'nested':
      return plain(node.children, currentPath)

    case 'added':
      return `Property '${propertyPath}' was added with value: ${formatValue(node.value)}`

    case 'deleted':
      return `Property '${propertyPath}' was removed`

    case 'changed':
      return `Property '${propertyPath}' was updated. From ${formatValue(node.value1)} to ${formatValue(node.value2)}`

    case 'unchanged':
      return []

    default:
      return []
    }
  })

  return lines
}

/**
 * Форматирует AST в plain стиле (основная функция)
 * @param {Array} diff - Внутреннее представление различий
 * @returns {string} Отформатированная строка
 */
const formatPlain = (diff) => {
  const lines = plain(diff)
  return lines.join('\n')
}

export default formatPlain
