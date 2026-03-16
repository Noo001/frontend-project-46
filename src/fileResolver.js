import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

export default resolveFilePath
