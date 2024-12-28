var athletes = function (client) {
  this.client = client
}

//= ==== athletes endpoint =====
athletes.prototype.get = function (args) {
  return this._listHelper('', args)
}

athletes.prototype.stats = function (args) {
  return this._listHelper('stats', args)
}
//= ==== athletes endpoint =====

//= ==== helpers =====
athletes.prototype._listHelper = function (listType, args) {
  var endpoint = 'athletes/'
  var qs = this.client.getPaginationQS(args)

  // require athlete id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include an athlete id')
  }

  endpoint += args.id + '/' + listType + '?' + qs
  return this.client.getEndpoint(endpoint, args)
}
//= ==== helpers =====

module.exports = athletes
