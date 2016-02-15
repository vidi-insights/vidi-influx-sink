'use strict'

var influx = require('influx')
var _ = require('lodash')
var bole = require('bole')
var through = require('through2')

var locals = {
  plugin: 'vidi-influx-sink',
  role: 'metrics',
  enabled: true,
  batch: {
    max: 5,
    timeout: 500,
  },
  influx: {
    host: 'localhost',
    port: '8086',
    username: 'metrics',
    password: 'metrics',
    database: 'vidi_metrics'
  }
}

module.exports = function (options) {
  var seneca = this
  var extend = seneca.util.deepextend

  locals = extend(locals, options)

  locals.log = bole(locals.plugin)
  locals.client = influx(locals.influx)

  locals.batch.list = {}
  locals.batch.count = 0
  locals.batch.stream = through.obj(on_write)
  locals.batch.stream.on('error', on_stream_err)
  locals.batch.next = Date.now() + locals.batch.timeout

  seneca.add({role: locals.role, hook: 'sink'}, sink)
  seneca.add({role: locals.role, enabled: '*'}, enable_disable)

  locals.log.info('started')
  locals.log.info(`batch size: ${locals.batch.max}`)
  locals.log.info(`batch timeout: ${locals.batch.timeout}`)

  return locals.plugin
}

function on_stream_err (err) {
  locals.log.err('write stream error:')
  locals.log.err(err)
}

function sink (msg, done) {
  var stream = locals.batch.stream
  var client = locals.client

  if (locals.enabled && msg && msg.metric) {
    stream.write(msg.metric)
  }

  done()
}

function enable_disable (msg, done) {
  locals.enabled = msg.enabled

  done()
}

// Called each time the stream is written to
function on_write (metric, enc, done) {
  var name = metric.name
  var values = metric.values
  var tags = metric.tags

  locals.batch.list[name] = locals.batch.list[name] || []
  locals.batch.list[name].push([values, tags])
  locals.batch.count = locals.batch.count + 1

  var exceeded = locals.batch.count >= locals.batch.max
  var expired = Date.now() > locals.batch.next

  if (exceeded || expired) {
    write_batch()
  }

  done()
}

function write_batch () {
  var db = `${locals.influx.database}:${locals.influx.port}`
  var written = locals.batch.count
  var batches = locals.batch.list

  locals.batch.list = {}
  locals.batch.count = 0

  reset_timeout()

  function on_err (err) {
    if (err) {
      locals.log.error('error writing to influx:')
      locals.log.error(err)
    }
    else {
      locals.log.info(`${written} metric(s) written to ${db}`)
    }
  }

  locals.client.writeSeries(batches, on_err)
}

function reset_timeout () {
  var timeout = locals.batch.timeout
  var next = locals.batch.next

  if (timeout) {
    clearTimeout(locals.batch.timer)
  }

  locals.batch.timer = setTimeout(() => {write_batch()}, timeout)
  locals.batch.next = Date.now() + next
}
