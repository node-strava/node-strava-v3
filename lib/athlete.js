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
athlete.prototype.get = async function (args) {
  var endpoint = 'athlete'
  return await this.client.getEndpoint(endpoint, args)
}
athlete.prototype.listActivities = async function (args) {
  return await this._listHelper('activities', args)
}
athlete.prototype.listRoutes = async function (args) {
  return await this._listHelper('routes', args)
}
athlete.prototype.listClubs = async function (args) {
  return await this._listHelper('clubs', args)
}
athlete.prototype.listZones = async function (args) {
  return await this._listHelper('zones', args)
}

athlete.prototype.update = async function (args) {
  var endpoint = 'athlete'
  args.body = this.client.getRequestBodyObj(_updateAllowedProps, args)
  return await this.client.putEndpoint(endpoint, args)
}
//= ==== athlete.prototype endpoint =====

//= ==== helpers =====
athlete.prototype._listHelper = async function (listType, args) {
  var endpoint = 'athlete/'
  var qs = this.client.getQS(_qsAllowedProps, args)

  endpoint += listType + '?' + qs
  return await this.client.getEndpoint(endpoint, args)
}
//= ==== helpers =====

module.exports = athlete
