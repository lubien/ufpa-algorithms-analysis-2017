// Load app style
import '@/styles/app.scss'
import 'bootstrap'

// Scripts
import './scripts'
import axios from 'axios'

// Charts
import '@/scripts/highchart-theme.js'
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
Exporting(Highcharts)

axios.get('static/chart.json')
  .then(({data}) => {
    Highcharts.chart('chart-container', data)
  })
