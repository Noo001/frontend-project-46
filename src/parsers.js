import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import resolveFilePath from './fileResolver.js'

export const getFileFormat = (filepath) => {
  const ext = path.extname(filepath).toLowerCase().slice(1)

  const supportedFormats = {
    json: 'json',
    yml: 'yaml',
    yaml: 'yaml',
  }

  if (!supportedFormats[ext]) {
    throw new Error(`Unsupported file format: .${ext}. Supported formats: .json, .yml, .yaml`)
  }

  return supportedFormats[ext]
}

export const parseContent = (content, format) => {
  const supportedFormats = ['json', 'yaml']
  if (!supportedFormats.includes(format)) {
    throw new Error(`Unsupported format for parsing: ${format}`)
  }

  if (!content || content.trim() === '') {
    return {}
  }

  switch (format) {
    case 'json':
      return JSON.parse(content)
    case 'yaml': {
      const result = yaml.load(content)
      return result || {}
    }
    default:
      throw new Error(`Unsupported format for parsing: ${format}`)
  }
}

export const readAndParseFile = (filepath) => {
  try {
    const resolvedPath = resolveFilePath(filepath)
    const content = fs.readFileSync(resolvedPath, 'utf-8')
    const format = getFileFormat(filepath)

    return parseContent(content, format)
  }
  catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filepath}`)
    }
    if (error instanceof SyntaxError || error instanceof yaml.YAMLException) {
      throw new Error(`Invalid ${path.extname(filepath)} format in file: ${filepath}`)
    }
    throw error
  }
}
