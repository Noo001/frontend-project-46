import _ from 'lodash'
import { readAndParseFile } from './parsers.js'

/**
 * Форматирует значение для вывода
 * @param {*} value - Значение для форматирования
 * @returns {string} Отформатированное значение
 */
const formatValue = (value) => {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value)
  }
  if (value === null) {
    return 'null'
  }
  return JSON.stringify(value)
}

/**
 * Строит строку различий между двумя объектами
 * @param {Object} data1 - Данные первого файла
 * @param {Object} data2 - Данные второго файла
 * @returns {string} Отформатированная строка с различиями
 */
const buildDiffString = (data1, data2) => {
  // Получаем все уникальные ключи и сортируем их
  const allKeys = _.union(Object.keys(data1), Object.keys(data2))
  const sortedKeys = _.sortBy(allKeys)

  // Строим массив строк для вывода
  const lines = ['{']

  sortedKeys.forEach((key) => {
    const hasInFirst = Object.hasOwn(data1, key)
    const hasInSecond = Object.hasOwn(data2, key)

    if (hasInFirst && !hasInSecond) {
      // Ключ только в первом файле (удален)
      lines.push(`  - ${key}: ${formatValue(data1[key])}`)
    } else if (!hasInFirst && hasInSecond) {
      // Ключ только во втором файле (добавлен)
      lines.push(`  + ${key}: ${formatValue(data2[key])}`)
    } else if (hasInFirst && hasInSecond) {
      // Ключ есть в обоих файлах
      if (data1[key] === data2[key]) {
        // Значения одинаковые
        lines.push(`    ${key}: ${formatValue(data1[key])}`)
      } else {
        // Значения разные - выводим обе строки
        lines.push(`  - ${key}: ${formatValue(data1[key])}`)
        lines.push(`  + ${key}: ${formatValue(data2[key])}`)
      }
    }
  })

  lines.push('}')
  return lines.join('\n')
}

/**
 * Сравнивает два конфигурационных файла и возвращает разницу
 * @param {string} filepath1 - Путь к первому файлу
 * @param {string} filepath2 - Путь ко второму файлу
 * @returns {string} Отформатированная строка с различиями
 */
export default function genDiff(filepath1, filepath2) {
  try {
    const data1 = readAndParseFile(filepath1)
    const data2 = readAndParseFile(filepath2)

    return buildDiffString(data1, data2)
  } catch (error) {
    throw new Error(`Failed to process files: ${error.message}`)
  }
}
