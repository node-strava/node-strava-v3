/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 * @typedef {import('../index').DetailRoute} DetailRoute
 * @typedef {import('../index').DetailedActivity} DetailedActivity
 * @typedef {import('../index').ActivityZone} ActivityZone
 * @typedef {import('../index').Lap} Lap
 * @typedef {import('../index').Comment} Comment
 * @typedef {import('../index').SummaryAthlete} SummaryAthlete
 * @typedef {DetailRoute & { page?: number; per_page?: number; include_all_efforts?: boolean }} ActivityGetArgs
 * @typedef {import('../index').ActivityCreateArgs & { body?: Record<string, unknown> }} ActivityCreateArgs
 * @typedef {import('../index').ActivityUpdateArgs & { form?: Record<string, unknown> }} ActivityUpdateArgs
 * @typedef {DetailRoute & { page_size?: number; after_cursor?: string }} ActivityListArgs
 */

/**
 * Activities API client.
 * @class
 * @param {StravaRouteClient} client - HTTP client instance for Strava API requests
 */
var activities = function (client) {
  this.client = client
}

var _qsAllowedProps = [
  // get activity
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

/**
 * Get a single activity by ID.
 * @param {ActivityGetArgs} args
 * @returns {Promise<DetailedActivity>}
 * @throws {Error} When args.id is missing
 */
activities.prototype.get = function (args) {
  var qs = this.client.getQS(_qsAllowedProps, args)

  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '?' + qs
  return /** @type {Promise<DetailedActivity>} */ (this.client.getEndpoint(endpoint, args))
}
/**
 * Create a manual activity.
 * @param {ActivityCreateArgs} args
 * @returns {Promise<DetailedActivity>}
 */
activities.prototype.create = function (args) {
  var endpoint = 'activities'

  args.body = this.client.getRequestBodyObj(_createAllowedProps, args)
  return /** @type {Promise<DetailedActivity>} */ (this.client.postEndpoint(endpoint, args))
}
/**
 * Update an activity.
 * @param {ActivityUpdateArgs} args
 * @returns {Promise<DetailedActivity>}
 * @throws {Error} When args.id is missing
 */
activities.prototype.update = function (args) {
  var form = this.client.getRequestBodyObj(_updateAllowedProps, args)

  _requireActivityId(args)

  var endpoint = 'activities/' + args.id

  args.form = form

  return /** @type {Promise<DetailedActivity>} */ (this.client.putEndpoint(endpoint, args))
}
/**
 * List activity zones (heart rate or power).
 * @param {ActivityListArgs} args
 * @returns {Promise<ActivityZone[]>}
 * @throws {Error} When args.id is missing
 */
activities.prototype.listZones = function (args) {
  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '/zones'

  return /** @type {Promise<ActivityZone[]>} */ (this._listHelper(endpoint, args))
}
/**
 * List activity laps.
 * @param {ActivityListArgs} args
 * @returns {Promise<Lap[]>}
 * @throws {Error} When args.id is missing
 */
activities.prototype.listLaps = function (args) {
  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '/laps'

  return /** @type {Promise<Lap[]>} */ (this._listHelper(endpoint, args))
}
/**
 * List activity comments.
 * @param {ActivityListArgs} args
 * @returns {Promise<Comment[]>}
 * @throws {Error} When args.id is missing
 */
activities.prototype.listComments = function (args) {
  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '/comments'

  return /** @type {Promise<Comment[]>} */ (this._listHelper(endpoint, args))
}
/**
 * List activity kudoers.
 * @param {ActivityListArgs} args
 * @returns {Promise<SummaryAthlete[]>}
 * @throws {Error} When args.id is missing
 */
activities.prototype.listKudoers = function (args) {
  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '/kudos'

  return /** @type {Promise<SummaryAthlete[]>} */ (this._listHelper(endpoint, args))
}

/**
 * Internal: Throws if args does not include an activity id.
 * @param {{ id?: string }} args
 * @throws {Error} When args.id is missing
 */
var _requireActivityId = function (args) {
  if (typeof args.id === 'undefined') {
    throw new Error('args must include an activity id')
  }
}
/**
 * Internal: GETs a paginated activity sub-resource (zones, laps, comments, kudos).
 * @param {string} endpoint
 * @param {ActivityListArgs} args
 * @returns {Promise<ActivityZone[]|Lap[]|Comment[]|SummaryAthlete[]>}
 */
activities.prototype._listHelper = function (endpoint, args) {
  var qs = this.client.getCursorPaginationQS(args)

  endpoint += '?' + qs
  return /** @type {Promise<ActivityZone[]|Lap[]|Comment[]|SummaryAthlete[]>} */ (this.client.getEndpoint(endpoint, args))
}

module.exports = activities
