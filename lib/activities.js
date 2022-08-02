var activities = function (client) {
  this.client = client
}

var _qsAllowedProps = [

  // pagination
  'page',
  'per_page',

  // getSegment
  'include_all_efforts'
]
var _createAllowedProps = [
  'name',
  'type',
  'sport_type',
  'start_date_local',
  'elapsed_time',
  'description',
  'distance',
  'private',
  'commute'
]
var _updateAllowedProps = [
  'name',
  'type',
  'sport_type',
  'private',
  'commute',
  'trainer',
  'description',
  'gear_id'
]

//= ==== activities endpoint =====
activities.prototype.get = function (args, done) {
  var qs = this.client.getQS(_qsAllowedProps, args)

  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '?' + qs
  return this.client.getEndpoint(endpoint, args, done)
}
activities.prototype.create = function (args, done) {
  var endpoint = 'activities'

  args.body = this.client.getRequestBodyObj(_createAllowedProps, args)
  return this.client.postEndpoint(endpoint, args, done)
}
activities.prototype.update = function (args, done) {
  var form = this.client.getRequestBodyObj(_updateAllowedProps, args)

  _requireActivityId(args)

  var endpoint = 'activities/' + args.id

  args.form = form

  return this.client.putEndpoint(endpoint, args, done)
}

activities.prototype.listZones = function (args, done) {
  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '/zones'

  return this._listHelper(endpoint, args, done)
}
activities.prototype.listLaps = function (args, done) {
  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '/laps'

  return this._listHelper(endpoint, args, done)
}
activities.prototype.listComments = function (args, done) {
  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '/comments'

  return this._listHelper(endpoint, args, done)
}
activities.prototype.listKudos = function (args, done) {
  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '/kudos'

  return this._listHelper(endpoint, args, done)
}
//= ==== activities endpoint =====

//= ==== helpers =====
var _requireActivityId = function (args) {
  if (typeof args.id === 'undefined') {
    throw new Error('args must include an activity id')
  }
}

activities.prototype._listHelper = function (endpoint, args, done) {
  var qs = this.client.getPaginationQS(args)

  endpoint += '?' + qs
  return this.client.getEndpoint(endpoint, args, done)
}
//= ==== helpers =====

module.exports = activities
