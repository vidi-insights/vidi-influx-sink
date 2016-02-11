'use strict'

var influx = require('influx')
var _ = require('lodash')

var defaults = {
  plugin: 'vidi-influx-sink',
  role: 'metrics',
  enabled: true,
  influx: {
    host: 'localhost',
    port: '8086',
    username: 'metrics',
    password: 'metrics',
    database: 'vidi_metrics'
  }
}


module.exports = function (opts) {
  var seneca = this
  var extend = seneca.util.deepextend

  opts = extend(defaults, opts)
  seneca.add({role: opts.role, hook: 'sink'}, handle_storage)

  var client = influx(opts.influx)

  function handle_storage (msg, done) {
    this.prior(msg, function (err) {
      if (!opts.enabled) {
        return done()
      }

      var metric = msg.metric
      var name = metric.name
      var values = metric.values
      var tags = metric.tags

      client.writePoint(name, values, tags, (err) => {
        if (err) {
          seneca.log.error(err)
          opts.enabled = false
        }

        done()
      })
    })
  }

  return opts.plugin
}
