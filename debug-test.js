import genDiff from './src/index.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = (filename) => {
  return path.join(__dirname, '__fixtures__', filename)
}

console.log('=== ПРОВЕРКА СОДЕРЖИМОГО ФАЙЛОВ ===')

const file1Path = getFixturePath('file1.json')
console.log('\nfile1.json:')
console.log(fs.readFileSync(file1Path, 'utf8'))

const file2Path = getFixturePath('file2.json')
console.log('\nfile2.json:')
console.log(fs.readFileSync(file2Path, 'utf8'))

console.log('\n=== РЕАЛЬНЫЙ ВЫВОД ПРОГРАММЫ ===')
const result = genDiff(file1Path, file2Path)
console.log(result)

console.log('\n=== СИМВОЛЫ В ВЫВОДЕ (показаны escape-последовательности) ===')
console.log(JSON.stringify(result))

console.log('\n=== ПЕРВЫЕ 20 СИМВОЛОВ ===')
console.log('Первые 20 символов:', JSON.stringify(result.substring(0, 20)))

const lines = result.split('\n')
console.log('\n=== РАЗБОР ПО СТРОКАМ ===')
lines.forEach((line, index) => {
  console.log(`Строка ${index}: "${line}" (длина: ${line.length})`)
})
