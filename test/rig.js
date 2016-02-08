'strict'

const config = {
  stats: {collector: true},
  influx_store: {influx: {host: '192.168.99.100'}}
}

require('seneca')()
  .use('stats', config.stats)
  .use('toolbag-stats')
  .use('..', config.influx_store)
  .listen()
