var segments = function (client) {
  this.client = client
}

// Validation could be tightened up here by only allowing the properties to validate
// for the single endpoint they are valid for.
var _qsAllowedProps = [

  // pagination
  'page',
  'per_page',

  // listSegments
  'athlete_id',
  'gender',
  'age_group',
  'weight_class',
  'following',
  'club_id',
  'date_range',
  'start_date_local',
  'end_date_local',

  // explore
  'bounds',
  'activity_type',
  'min_cat',
  'max_cat',
  // leaderboard
  'context_entries'
]
var _updateAllowedProps = [
  // star segment
  'starred'
]

//= ==== segments endpoint =====
segments.prototype.get = function (args, done) {
  var endpoint = 'segments/'
  this.client.getPaginationQS(args)

  // require segment id
  if (typeof args.id === 'undefined') {
    const err = { msg: 'args must include an segment id' }
    return done(err)
  }

  endpoint += args.id
  return this.client.getEndpoint(endpoint, args, done)
}

segments.prototype.listStarred = function (args, done) {
  var qs = this.client.getQS(_qsAllowedProps, args)
  var endpoint = 'segments/starred?' + qs

  return this.client.getEndpoint(endpoint, args, done)
}

segments.prototype.starSegment = function (args, done) {
  var endpoint = 'segments/'
  var form = this.client.getRequestBodyObj(_updateAllowedProps, args)
  var err = null

  if (typeof args.id === 'undefined') {
    err = { msg: 'args must include an segment id' }
    return done(err)
  }

  endpoint += args.id + '/starred'
  args.form = form

  this.client.putEndpoint(endpoint, args, done)
}

segments.prototype.listEfforts = function (args, done) {
  return this._listHelper('all_efforts', args, done)
}

segments.prototype.listLeaderboard = function (args, done) {
  return this._listHelper('leaderboard', args, done)
}

segments.prototype.explore = function (args, done) {
  var qs = this.client.getQS(_qsAllowedProps, args)
  var endpoint = 'segments/explore?' + qs

  return this.client.getEndpoint(endpoint, args, done)
}
//= ==== segments endpoint =====

//= ==== helpers =====
segments.prototype._listHelper = function (listType, args, done) {
  var endpoint = 'segments/'
  var err = null
  var qs = this.client.getQS(_qsAllowedProps, args)

  // require segment id
  if (typeof args.id === 'undefined') {
    err = { msg: 'args must include a segment id' }
    return done(err)
  }

  endpoint += args.id + '/' + listType + '?' + qs
  return this.client.getEndpoint(endpoint, args, done)
}
//= ==== helpers =====

module.exports = segments
