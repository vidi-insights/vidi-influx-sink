'strict'

const config = {
  stats: {collector: true, log_metrics: true}
}

require('seneca')()
  .use('stats', config.stats)
  .use('toolbag-stats')
  .use('..')
  .listen()
