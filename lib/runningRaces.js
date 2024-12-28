var runningRaces = function (client) {
  this.client = client
}

var _qsAllowedProps = [
  'year'
]

runningRaces.prototype.get = function (args) {
  var endpoint = 'running_races/'

  // require running race id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a race id')
  }

  endpoint += args.id
  return this.client.getEndpoint(endpoint, args)
}

runningRaces.prototype.listRaces = function (args) {
  var qs = this.client.getQS(_qsAllowedProps, args)
  var endpoint = 'running_races?' + qs

  return this.client.getEndpoint(endpoint, args)
}

module.exports = runningRaces
