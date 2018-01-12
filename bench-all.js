const fs = require('fs')
const program = require('commander')
const serial = require('p-series')
const execa = require('execa')
const ora = require('ora')
const prettyjson = require('prettyjson')

const spinner = ora('Starting').start()

const algorithms = Object.keys(require('./algorithms'))
const inputs = [100, 500, 1000, 5000, 10000, 15000, 20000]

program
  .option('-s, --save', 'Update chart')
  .parse(process.argv)

main()

async function main() {
  const data = await serial(algorithms.map(algorithm => async () => {
    return {
      algorithm, benchmark: await benchAlgorithm(algorithm)
    }
  }))

  spinner.text = 'Finishing'

  if (program.save) {
    const highchartData = toHighchart(data)
    fs.writeFileSync('./static/chart.json', JSON.stringify(highchartData), {encoding: 'utf8'})
    console.log('Saved at %s', 'static/chart.json');
  } else {
    console.log(prettyjson.render(data))
  }

  spinner.stop()
}

async function benchAlgorithm(algorithm) {
  return await serial(inputs.map(input => async () => {
    const tests = await serial(Array(5).fill(() =>
      benchAlgorithmForInput(algorithm, input))
    )

    return {
      input,
      tests: tests.map(({seconds, nanoseconds}) => seconds + (nanoseconds / 1e9)),
      mean: meanTests(tests)
    }
  }))
}

function benchAlgorithmForInput(algorithm, input) {
  spinner.text = `${algorithm} [${input}.txt]`
  return execa('node', ['./bench.js', '-j', '-a', algorithm, '-f', `input/${input}.txt`])
    .then(r => JSON.parse(r.stdout))
}

function meanTests(tests) {
  return tests
    .map(({seconds, nanoseconds}) => seconds + (nanoseconds / 1e9))
    .reduce((a, b) => a + b)
    / tests.length
}

function toHighchart(data) {
  return {
    chart: {
      type: 'line',
      zoomType: 'xy',
    },

    title: { text: 'Sorting Algorithms' },

    subtitle: { text: 'Code from my Algorithms Analysis class at UFPA with @filipesaraiva' },

    xAxis: { categories: inputs },

    yAxis: { title: { text: 'Time' } },

    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    series: data.map(({algorithm, benchmark}) => ({
      name: algorithm,
      data: benchmark.map(({mean}) => mean),
    })),

    plotOptions: {
      line: {
      },
    },

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    },
  }
}
