import { readAndParseFile } from './parsers.js'
import buildDiff from './buildDiff.js'
import { getFormatter } from './formatters/index.js'

export default function genDiff(filepath1, filepath2, formatName = 'stylish') {
  try {
    const data1 = readAndParseFile(filepath1)
    const data2 = readAndParseFile(filepath2)

    const diff = buildDiff(data1, data2)
    const formatter = getFormatter(formatName)

    return formatter(diff)
  } catch (error)
  {
    throw new Error(`Failed to process files: ${error.message}`)
  }
}
