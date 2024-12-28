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
segments.prototype.get = function (args) {
  var endpoint = 'segments/'
  this.client.getPaginationQS(args)

  // require segment id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include an segment id')
  }

  endpoint += args.id
  return this.client.getEndpoint(endpoint, args)
}

segments.prototype.listStarred = function (args) {
  var qs = this.client.getQS(_qsAllowedProps, args)
  var endpoint = 'segments/starred?' + qs

  return this.client.getEndpoint(endpoint, args)
}

segments.prototype.starSegment = function (args) {
  var endpoint = 'segments/'
  var form = this.client.getRequestBodyObj(_updateAllowedProps, args)

  if (typeof args.id === 'undefined') {
    throw new Error('args must include an segment id')
  }

  endpoint += args.id + '/starred'
  args.form = form

  return this.client.putEndpoint(endpoint, args)
}

segments.prototype.listEfforts = function (args) {
  return this._listHelper('all_efforts', args)
}

segments.prototype.explore = function (args) {
  var qs = this.client.getQS(_qsAllowedProps, args)
  var endpoint = 'segments/explore?' + qs

  return this.client.getEndpoint(endpoint, args)
}
//= ==== segments endpoint =====

//= ==== helpers =====
segments.prototype._listHelper = function (listType, args) {
  var endpoint = 'segments/'
  var qs = this.client.getQS(_qsAllowedProps, args)

  // require segment id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a segment id')
  }

  endpoint += args.id + '/' + listType + '?' + qs
  return this.client.getEndpoint(endpoint, args)
}
//= ==== helpers =====

module.exports = segments
