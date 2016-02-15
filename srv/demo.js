'strict'

const Bole = require('bole')
const Through = require('through2').obj

const Config = {
  influx_sink: {influx: { host: '192.168.99.100'}},
  metrics: {collector: {enabled: enabled}},
  bole: {level: 'debug',stream: process.stdout}
}

Bole.output(Config.bole)
require('seneca')({log: 'silent'})
  .use('vidi-metrics', Config.metrics)
  .use('vidi-toolbag-metrics')
  .use(require('..'), Config.influx_sink)
  .listen({port: 8502})
