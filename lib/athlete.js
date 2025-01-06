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
athlete.prototype.get = function (args) {
  var endpoint = 'athlete'
  return this.client.getEndpoint(endpoint, args)
}

athlete.prototype.listActivities = function (args) {
  return this._listHelper('activities', args)
}

athlete.prototype.listClubs = function (args) {
  return this._listHelper('clubs', args)
}

athlete.prototype.listRoutes = function (args) {
  return this._listHelper('routes', args)
}

athlete.prototype.listZones = function (args) {
  return this._listHelper('zones', args)
}

athlete.prototype.update = function (args) {
  var endpoint = 'athlete'
  var form = this.client.getRequestBodyObj(_updateAllowedProps, args)

  args.form = form
  return this.client.putEndpoint(endpoint, args)
}
//= ==== athlete.prototype endpoint =====

//= ==== helpers =====
athlete.prototype._listHelper = function (listType, args) {
  var endpoint = 'athlete/'
  var qs = this.client.getQS(_qsAllowedProps, args)

  endpoint += listType + '?' + qs
  return this.client.getEndpoint(endpoint, args)
}
//= ==== helpers =====

module.exports = athlete
