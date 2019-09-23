var streams = function (client) {
  this.client = client
}

var _qsAllowedProps = [
  'resolution',
  'series_type'
]

//= ==== streams endpoint =====
streams.prototype.activity = function (args, done) {
  var endpoint = 'activities'
  return this._typeHelper(endpoint, args, done)
}

streams.prototype.effort = function (args, done) {
  var endpoint = 'segment_efforts'
  return this._typeHelper(endpoint, args, done)
}

streams.prototype.segment = function (args, done) {
  var endpoint = 'segments'
  return this._typeHelper(endpoint, args, done)
}

streams.prototype.route = function (args, done) {
  var endpoint = 'routes'
  return this._typeHelper(endpoint, args, done)
}
//= ==== streams endpoint =====

//= ==== helpers =====
streams.prototype._typeHelper = function (endpoint, args, done) {
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
  return this.client.getEndpoint(endpoint, args, done)
}
//= ==== helpers =====

module.exports = streams
