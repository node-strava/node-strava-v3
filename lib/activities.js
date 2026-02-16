/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 * @typedef {import('../index').DetailRoute} DetailRoute
 * @typedef {import('../index').DetailedActivity} DetailedActivity
 * @typedef {import('../index').ActivityZone} ActivityZone
 * @typedef {import('../index').Lap} Lap
 * @typedef {import('../index').Comment} Comment
 * @typedef {import('../index').SummaryAthlete} SummaryAthlete
 * @typedef {DetailRoute & { include_all_efforts?: boolean }} ActivityGetArgs
 * @typedef {import('../index').ActivityCreateArgs & { body?: Record<string, unknown> }} ActivityCreateArgs
 * @typedef {import('../index').ActivityUpdateArgs & { form?: Record<string, unknown> }} ActivityUpdateArgs
 * @typedef {import('../index').ActivityCommentsArgs} ActivityCommentsArgs
 * @typedef {import('../index').ActivityKudoersArgs} ActivityKudoersArgs
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
activities.prototype.get = async function (args) {
  _requireActivityId(args)

  var qs = this.client.getQS(_qsAllowedProps, args)
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
activities.prototype.update = async function (args) {
  _requireActivityId(args)

  var form = this.client.getRequestBodyObj(_updateAllowedProps, args)
  var endpoint = 'activities/' + args.id

  args.form = form

  return /** @type {Promise<DetailedActivity>} */ (this.client.putEndpoint(endpoint, args))
}
/**
 * List activity zones (heart rate or power). No pagination; only activity id is used.
 * @param {DetailRoute} args
 * @returns {Promise<ActivityZone[]>}
 * @throws {Error} When args.id is missing
 */
activities.prototype.listZones = async function (args) {
  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '/zones'

  return /** @type {Promise<ActivityZone[]>} */ (this._listHelper(endpoint, args))
}
/**
 * List activity laps.
 * @param {DetailRoute} args
 * @returns {Promise<Lap[]>}
 * @throws {Error} When args.id is missing
 */
activities.prototype.listLaps = async function (args) {
  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '/laps'

  return /** @type {Promise<Lap[]>} */ (this._listHelper(endpoint, args))
}
/**
 * List activity comments.
 * @param {ActivityCommentsArgs} args
 * @returns {Promise<Comment[]>}
 * @throws {Error} When args.id is missing
 */
activities.prototype.listComments = async function (args) {
  _requireActivityId(args)

  var endpoint = 'activities/' + args.id + '/comments'

  return /** @type {Promise<Comment[]>} */ (this._listHelper(endpoint, args))
}
/**
 * List activity kudoers.
 * @param {ActivityKudoersArgs} args
 * @returns {Promise<SummaryAthlete[]>}
 * @throws {Error} When args.id is missing
 */
activities.prototype.listKudoers = async function (args) {
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
 * @param {DetailRoute|ActivityCommentsArgs|ActivityKudoersArgs} args
 * @returns {Promise<ActivityZone[]|Lap[]|Comment[]|SummaryAthlete[]>}
 */
activities.prototype._listHelper = function (endpoint, args) {
  /** @type {import('./httpClient').CursorPaginationArgs} */
  var cursorArgs = {}
  if ('page_size' in args && args.page_size !== undefined) cursorArgs.page_size = args.page_size
  if ('after_cursor' in args && args.after_cursor !== undefined) cursorArgs.after_cursor = args.after_cursor
  var qs = this.client.getCursorPaginationQS(
    Object.keys(cursorArgs).length > 0 ? cursorArgs : undefined
  )

  endpoint += '?' + qs
  return /** @type {Promise<ActivityZone[]|Lap[]|Comment[]|SummaryAthlete[]>} */ (this.client.getEndpoint(endpoint, args))
}

module.exports = activities
