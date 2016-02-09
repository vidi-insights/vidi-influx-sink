# vidi-influx-store

An InfluxDb store for vidi-metrics

## Work in progress
This module is currently a work in progress.

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
