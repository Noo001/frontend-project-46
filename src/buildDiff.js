import _ from 'lodash'

const isObject = (value) => {
  return value && typeof value === 'object' && !Array.isArray(value)
}

const buildDiff = (obj1, obj2) => {
  const allKeys = _.union(Object.keys(obj1 || {}), Object.keys(obj2 || {}))
  const sortedKeys = _.sortBy(allKeys)

  return sortedKeys.map((key) => {
    const value1 = obj1?.[key]
    const value2 = obj2?.[key]

    const hasInFirst = Object.hasOwn(obj1 || {}, key)
    const hasInSecond = Object.hasOwn(obj2 || {}, key)

    if (hasInFirst && hasInSecond && isObject(value1) && isObject(value2)) {
      return {
        key,
        type: 'nested',
        children: buildDiff(value1, value2),
      }
    }

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

    if (hasInFirst && !hasInSecond) {
      return {
        key,
        type: 'deleted',
        value: value1,
      }
    }

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
