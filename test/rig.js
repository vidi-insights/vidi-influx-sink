'strict'

const config = {
  stats: {collector: true, log_metrics: false}
}

require('seneca')()
  .use('stats', config.stats)
  .use('toolbag-stats')
  .use('..')
  .listen()
