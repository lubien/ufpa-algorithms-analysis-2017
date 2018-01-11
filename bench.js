const fs = require('fs')
const program = require('commander')
const algorithms = require('./algorithms')

program
  .option('-f --file <file>', 'Input file to test')
  .option('-a --algorithm <algorithm>', 'Sorting algorithm')
  .parse(process.argv)

if (!algorithms[program.algorithm]) {
  console.error('Error: Invalid algorithm %s', program.algorithm)
  process.exit(1)
}

const input = getInput(program.file)
const algorithm = algorithms[program.algorithm]

const startTime = process.hrtime()
algorithm(input)
const diffTime = process.hrtime(startTime)

console.log(`Benchmark took ${diffTime[0]} seconds and ${diffTime[1]} nanoseconds`)

function getInput(file) {
  const content = fs.readFileSync(file, { encoding: 'utf8' })
  return content.split('\n').map(str => +str.trim())
}

