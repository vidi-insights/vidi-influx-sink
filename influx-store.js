'use strict'

var influx = require('influx')
var _ = require('lodash')

var defaults = {
  plugin: 'vidi-influx-store',
  role: 'metrics',
  enabled: true,
  log_input: false,
  log_output: false,
  influx: {
    host:'localhost',
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
  seneca.add({role: opts.role, cmd: 'store'}, handle_storage)

  function handle_storage (msg, done) {
    this.prior(msg, function (err, data) {
      if (!opts.enabled) {
        return done(null, data)
      }

      if (opts.log_input) {
        console.log(JSON.stringify(data, null, 2))
      }

      var client = influx(opts.influx)
      var series = {}

      _.each(data.stats, (stat) => {

        var id = stat.stat

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
