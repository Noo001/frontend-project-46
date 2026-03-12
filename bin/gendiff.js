#!/usr/bin/env node

import { Command } from 'commander'
import genDiff from '../src/index.js'

const program = new Command()

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0', '-V, --version', 'output the version number')
  .helpOption('-h, --help', 'display help for command')
  .option('-f, --format <type>', 'output format (stylish, plain, json)', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2, options) => {
    try {
      const diff = genDiff(filepath1, filepath2, options.format)
      console.log(diff)
    } catch (error) {
      console.error('❌ Error:', error.message)
      process.exit(1)
    }
  })

program.parse(process.argv)
