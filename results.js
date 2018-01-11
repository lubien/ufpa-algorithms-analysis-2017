const serial = require('p-series')
const execa = require('execa')

const algorithms = Object.keys(require('./algorithms'))
const inputs = [100, 500, 1000, 5000, 10000, 15000, 20000]

benchAlgorithm('countingSort')
  .then(console.log)

async function benchAlgorithm(algorithm) {
  return await serial(inputs.map(input => async () => {
    const tests = await serial(Array(5).fill(() =>
      benchAlgorithmForInput(algorithm, input))
    )
  
    return { input, tests, mean: meanTests(tests) }
  }))
}

function benchAlgorithmForInput(algorithm, input) {
  return execa('node', ['./bench.js', '-j', '-a', algorithm, '-f', `input/${input}.txt`])
    .then(r => JSON.parse(r.stdout))
}

function meanTests(tests) {
  return tests
    .map(({seconds, nanoseconds}) => seconds + (nanoseconds / 1e9))
    .reduce((a, b) => a + b)
    / tests.length
}
