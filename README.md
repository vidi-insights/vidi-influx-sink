# seneca-influx-stats-store

An InfluxDb store for seneca-stats.

## Work in progress
This module is currently a work in progress.

## As a plugin
You can install this module as a plugin for seneca-stats via npm.

```
npm install seneca-stats
npm install seneca-influx-stats-store
```

To load the plugin simply follow Seneca best practice conventions.

```
'strict'

// Stats are only stored when collectors process them
// This is why we use {collector: true} on seneca-stats

require('seneca')()
  .use('stats', {collector: true})
  .use('toolbag-stats')
  .use('message-stats')
  .use('influx-stats-store')
  .listen()

```

__Note:__ Order is important, `*-stat-store` should always be loaded ___after___
mapping plugins.

## As a microservice
This project contains the necessary pieces to run as a microservice. To see it
in action simply,

1. Run `docker-compose -f test/influx.yml up` to spin an instance of InfluxDb
2. Run `npm run rig` to the microservice

The rig microservice uses toolbag to capture stats about itself. These stats
are then passed to this plugin to be persisted in InfluxDb.

__Note:__ The rig microservice makes a perfect springboard for your own
seneca-stats based microservices.
