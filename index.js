import _ from 'lodash'
import { readAndParseFile } from './src/parsers.js'

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

const buildDiffString = (data1, data2) => {
  const allKeys = _.union(Object.keys(data1), Object.keys(data2))
  const sortedKeys = _.sortBy(allKeys)

  const lines = ['{']

  sortedKeys.forEach((key) => {
    const hasInFirst = Object.hasOwn(data1, key)
    const hasInSecond = Object.hasOwn(data2, key)

    if (hasInFirst && !hasInSecond) {
      lines.push(`  - ${key}: ${formatValue(data1[key])}`)
    } else if (!hasInFirst && hasInSecond)
    {
      lines.push(`  + ${key}: ${formatValue(data2[key])}`)
    } else if (hasInFirst && hasInSecond)
    {
      if (data1[key] === data2[key]) {
        lines.push(`    ${key}: ${formatValue(data1[key])}`)
      } else
      {
        lines.push(`  - ${key}: ${formatValue(data1[key])}`)
        lines.push(`  + ${key}: ${formatValue(data2[key])}`)
      }
    }
  })

  lines.push('}')
  return lines.join('\n')
}

export default function genDiff(filepath1, filepath2) {
  try {
    const data1 = readAndParseFile(filepath1)
    const data2 = readAndParseFile(filepath2)
    return buildDiffString(data1, data2)
  } catch (error)
  {
    throw new Error(`Failed to process files: ${error.message}`)
  }
}
