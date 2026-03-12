import _ from 'lodash'

/**
 * Проверяет, является ли значение объектом (не null и не массив)
 * @param {*} value - Проверяемое значение
 * @returns {boolean} true, если значение - объект
 */
const isObject = ( value ) => value && typeof value === 'object' && !Array.isArray(value)

/**
 * Строит внутреннее представление различий между двумя объектами
 * @param {Object} obj1 - Первый объект
 * @param {Object} obj2 - Второй объект
 * @returns {Array} Массив узлов с информацией о различиях
 */
const buildDiff = (obj1, obj2) => {
  // Получаем все уникальные ключи
  const allKeys = _.union(Object.keys(obj1 || {}), Object.keys(obj2 || {}))
  const sortedKeys = _.sortBy(allKeys)

  return sortedKeys.map((key) => {
    const value1 = obj1?.[key]
    const value2 = obj2?.[key]

    const hasInFirst = Object.hasOwn(obj1 || {}, key)
    const hasInSecond = Object.hasOwn(obj2 || {}, key)

    // Если ключ есть в обоих объектах и оба значения - объекты (но не массивы)
    if (hasInFirst && hasInSecond && isObject(value1) && isObject(value2)) {
      return {
        key,
        type: 'nested',
        children: buildDiff(value1, value2),
      }
    }

    // Если ключ есть в обоих объектах
    if (hasInFirst && hasInSecond) {
      if (_.isEqual(value1, value2)) {
        return {
          key,
          type: 'unchanged',
          value: value1,
        }
      }
      return {
        key,
        type: 'changed',
        value1,
        value2,
      }
    }

    // Если ключ только в первом объекте
    if (hasInFirst && !hasInSecond) {
      return {
        key,
        type: 'deleted',
        value: value1,
      }
    }

    // Если ключ только во втором объекте
    if (!hasInFirst && hasInSecond) {
      return {
        key,
        type: 'added',
        value: value2,
      }
    }

    return null
  }).filter(Boolean)
}

export default buildDiff
