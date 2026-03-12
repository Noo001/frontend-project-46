import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Определяет формат файла по расширению
 * @param {string} filepath - Путь к файлу
 * @returns {string} Формат файла (json, yml, yaml)
 */
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

/**
 * Парсит содержимое файла в зависимости от формата
 * @param {string} content - Содержимое файла
 * @param {string} format - Формат файла (json или yaml)
 * @returns {Object} Распарсенные данные
 */
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
  case 'yaml':
    // eslint-disable-next-line no-case-declarations
    const result = yaml.load(content)
    return result || {}
  default:
    throw new Error(`Unsupported format for parsing: ${format}`)
  }
}

/**
 * Находит полный путь к файлу, проверяя несколько возможных расположений
 * @param {string} filepath - Исходный путь к файлу
 * @returns {string} Полный путь к существующему файлу
 */
const resolveFilePath = (filepath) => {
  if (fs.existsSync(filepath)) {
    return path.resolve(filepath)
  }

  const cwdPath = path.resolve(process.cwd(), filepath)
  if (fs.existsSync(cwdPath)) {
    return cwdPath
  }

  const fixturesPath = path.resolve(process.cwd(), '__fixtures__', path.basename(filepath))
  if (fs.existsSync(fixturesPath)) {
    return fixturesPath
  }

  const projectFixturesPath = path.resolve(__dirname, '..', '__fixtures__', path.basename(filepath))
  if (fs.existsSync(projectFixturesPath)) {
    return projectFixturesPath
  }

  return filepath
}

/**
 * Читает и парсит файл (JSON или YAML)
 * @param {string} filepath - Путь к файлу
 * @returns {Object} Распарсенные данные
 */
export const readAndParseFile = (filepath) => {
  try {
    const resolvedPath = resolveFilePath(filepath)
    const content = fs.readFileSync(resolvedPath, 'utf-8')
    const format = getFileFormat(filepath)

    return parseContent(content, format)
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filepath}`)
    }
    if (error instanceof SyntaxError || error instanceof yaml.YAMLException) {
      throw new Error(`Invalid ${path.extname(filepath)} format in file: ${filepath}`)
    }
    throw error
  }
}

export default {
  readAndParseFile,
  getFileFormat,
  parseContent,
}
