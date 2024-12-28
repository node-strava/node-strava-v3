var streams = function (client) {
  this.client = client
}

var _qsAllowedProps = [
  'resolution',
  'series_type'
]

//= ==== streams endpoint =====
streams.prototype.activity = function (args) {
  var endpoint = 'activities'
  return this._typeHelper(endpoint, args)
}

streams.prototype.effort = function (args) {
  var endpoint = 'segment_efforts'
  return this._typeHelper(endpoint, args)
}

streams.prototype.segment = function (args) {
  var endpoint = 'segments'
  return this._typeHelper(endpoint, args)
}

streams.prototype.route = function (args) {
  var endpoint = 'routes'
  return this._typeHelper(endpoint, args)
}
//= ==== streams endpoint =====

//= ==== helpers =====
streams.prototype._typeHelper = function (endpoint, args) {
  var qs = this.client.getQS(_qsAllowedProps, args)

  // require id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include an id')
  }
  // require types
  if (typeof args.types === 'undefined') {
    throw new Error('args must include types')
  }

  endpoint += '/' + args.id + '/streams/' + args.types + '?' + qs
  return this.client.getEndpoint(endpoint, args)
}
//= ==== helpers =====

module.exports = streams
