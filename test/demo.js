'strict'

const config = {
  metrics: {collector: true},
  influx_store: {influx: {host: '192.168.99.100'}}
}

require('seneca')()
  .use('vidi-metrics', config.metrics)
  .use('vidi-toolbag-metrics')
  .use('..', config.influx_store)
  .listen()
