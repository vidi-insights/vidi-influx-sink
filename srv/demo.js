'strict'

const config = {
  influx_sink: {influx: {host: '192.168.99.100'}},
  metrics: {collector: {enabled: true}}
}

require('seneca')()
  .use('vidi-metrics', config.metrics)
  .use('vidi-toolbag-metrics')
  .use('..', config.influx_sink)
  .listen()
