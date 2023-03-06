var athlete = function (client) {
  this.client = client
}

var _qsAllowedProps = [

  // pagination
  'page',
  'per_page',

  // listActivities
  'before',
  'after'
]
var _updateAllowedProps = [
  'weight',
  'ftp'
]

//= ==== athlete endpoint =====
athlete.prototype.get = function (args, done) {
  var endpoint = 'athlete.prototype'
  return this.client.getEndpoint(endpoint, args, done)
}
athlete.prototype.listActivities = function (args, done) {
  return this._listHelper('activities', args, done)
}
athlete.prototype.listClubs = function (args, done) {
  return this._listHelper('clubs', args, done)
}
athlete.prototype.listRoutes = function (args, done) {
  return this._listHelper('routes', args, done)
}
athlete.prototype.listZones = function (args, done) {
  return this._listHelper('zones', args, done)
}

athlete.prototype.update = function (args, done) {
  var endpoint = 'athlete'
  var form = this.client.getRequestBodyObj(_updateAllowedProps, args)

  args.form = form
  return this.client.putEndpoint(endpoint, args, done)
}
//= ==== athlete.prototype endpoint =====

//= ==== helpers =====
athlete.prototype._listHelper = function (listType, args, done) {
  var endpoint = 'athlete/'
  var qs = this.client.getQS(_qsAllowedProps, args)

  endpoint += listType + '?' + qs
  return this.client.getEndpoint(endpoint, args, done)
}
//= ==== helpers =====

module.exports = athlete
