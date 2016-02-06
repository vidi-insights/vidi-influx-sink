# seneca-influx-stats-store

An InfluxDb store for seneca-stats.

## Work in progress
This module is currently a work in progress.

## As a plugin
You can install this module as a plugin for seneca-stats via npm.

```js
npm install seneca-stats
npm install seneca-influx-stats-store
```

To load the plugin simply follow Seneca best practice conventions.

```js
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


## Options

```js
{
  // The name seneca uses for this plugin
  plugin: 'influx-stats-store',

  // If false plugin is disabled, any errors from InfluxDb
  // will flip this to false, a restart will be required
  enabled: true,

  // console.log this plugins input before it gets processed
  log_output: false,

  // console.log this plugins output before it goes to InfluxDb
  log_output: false,

  // Default config for influx, matches the
  // compose file we provide, test/influx.yml
  influx: {
    host:'localhost',
    port:'8086',
    username:'stats',
    password:'stats',
    database:'seneca_stats'
  }
}
```
