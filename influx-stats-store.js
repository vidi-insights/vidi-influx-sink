'use strict'

var influx = require('influx')
var _ = require('lodash')

var defaults = {
  plugin: 'influx-stats-store',
  enabled: true,
  log_output: false,
  influx: {
    host:'192.168.99.100',
    port:'8086',
    username:'stats',
    password:'stats',
    database:'seneca_stats'
  }
}

module.exports = function (opts) {
  var seneca = this
  var extend = seneca.util.deepextend

  opts = extend(defaults, opts)
  seneca.add({role: 'stats', cmd: 'store'}, handleStorage)

  function handleStorage (msg, done) {
    this.prior(msg, function (err, data) {
      if (!opts.enabled) {
        return done(null, data)
      }

      var client = influx(opts.influx)
      var series = {}

      _.each(data.metrics, (stat) => {

        var id = stat.metric

        series[id] = series[id] || []
        series[id].push([stat.values, stat.tags])
      })

      if (opts.log_output) {
        console.log(JSON.stringify(series, null, 2))
      }

      client.writeSeries(series, (err) => {
        if (err) {
          seneca.log.error(err)
          opts.enabled = false
        }

        done(null, data)
      })
    })
  }

  return opts.plugin
}
