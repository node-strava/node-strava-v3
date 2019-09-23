var routes = function (client) {
  this.client = client
}

var _qsAllowedProps = []

//= ==== routes endpoint =====
routes.prototype.get = function (args, done) {
  var endpoint = 'routes/'
  var qs = this.client.getQS(_qsAllowedProps, args)

  // require route id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include an route id')
  }

  endpoint += args.id + '?' + qs
  return this.client.getEndpoint(endpoint, args, done)
}
//= ==== routes endpoint =====

module.exports = routes
