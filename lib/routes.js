var routes = function (client) {
  this.client = client
}

var _qsAllowedProps = []

//= ==== routes endpoint =====
routes.prototype.get = function (args) {
  var endpoint = 'routes/'
  var qs = this.client.getQS(_qsAllowedProps, args)

  _requireRouteId(args)

  endpoint += args.id + '?' + qs
  return this.client.getEndpoint(endpoint, args)
}

routes.prototype.getFile = function (args) {
  var endpoint = 'routes/'

  _requireRouteId(args)

  return this._getFileHelper(endpoint, args)
}
//= ==== routes endpoint =====

//= ==== helpers =====
var _requireRouteId = function (args) {
  if (!args.id || typeof args.id !== 'string') {
    throw new Error('args must include a valid route id')
  }
}

routes.prototype._getFileHelper = function (endpoint, args) {
  var qs = this.client.getQS(_qsAllowedProps, args)
  endpoint += args.id + `/export_${args.file_type}` + '?' + qs

  return this.client.getEndpoint(endpoint, args)
}
//= ==== helpers =====

module.exports = routes
