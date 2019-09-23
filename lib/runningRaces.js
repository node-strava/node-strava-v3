var runningRaces = function (client) {
  this.client = client
}

var _qsAllowedProps = [
  'year'
]

runningRaces.prototype.get = function (args, done) {
  var endpoint = 'running_races/'

  // require running race id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include an race id')
  }

  endpoint += args.id
  return this.client.getEndpoint(endpoint, args, done)
}

runningRaces.prototype.listRaces = function (args, done) {
  var qs = this.client.getQS(_qsAllowedProps, args)
  var endpoint = 'running_races?' + qs

  return this.client.getEndpoint(endpoint, args, done)
}

module.exports = runningRaces
