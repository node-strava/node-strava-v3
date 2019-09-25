var athletes = function (client) {
  this.client = client
}

//= ==== athletes endpoint =====
athletes.prototype.get = function (args, done) {
  return this._listHelper('', args, done)
}
athletes.prototype.stats = function (args, done) {
  return this._listHelper('stats', args, done)
}
//= ==== athletes endpoint =====

//= ==== helpers =====
athletes.prototype._listHelper = function (listType, args, done) {
  var endpoint = 'athletes/'
  var qs = this.client.getPaginationQS(args)

  // require athlete id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include an athlete id')
  }

  endpoint += args.id + '/' + listType + '?' + qs
  return this.client.getEndpoint(endpoint, args, done)
}
//= ==== helpers =====

module.exports = athletes
