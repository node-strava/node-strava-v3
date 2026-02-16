/**
 * @typedef {import('../index').SegmentDetailArgs} SegmentDetailArgs
 * @typedef {import('../index').SegmentListStarredArgs} SegmentListStarredArgs
 * @typedef {import('../index').SegmentStarArgs & { form?: Record<string, unknown> }} SegmentStarArgs
 * @typedef {import('../index').SegmentEffortsArgs} SegmentEffortsArgs
 * @typedef {import('../index').SegmentExploreArgs} SegmentExploreArgs
 * @typedef {import('../index').DetailedSegment} DetailedSegment
 * @typedef {import('../index').SummarySegment} SummarySegment
 * @typedef {import('../index').DetailedSegmentEffort} DetailedSegmentEffort
 * @typedef {import('../index').ExplorerSegment} ExplorerSegment
 */

/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 */

/**
 * Segments API client.
 * @param {StravaRouteClient} client - HTTP client instance for Strava API requests
 */
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

/**
 * Internal: Throws if args does not include a segment id.
 * @param {{ id?: string }} args
 * @throws {Error} When args.id is missing
 */
var _requireSegmentId = function (args) {
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a segment id')
  }
}

/**
 * Get detailed information about a segment.
 * @param {SegmentDetailArgs} args - Must include segment id
 * @returns {Promise<DetailedSegment>}
 */
segments.prototype.get = async function (args) {
  _requireSegmentId(args)

  var endpoint = 'segments/' + args.id
  return /** @type {Promise<DetailedSegment>} */ (this.client.getEndpoint(endpoint, args))
}

/**
 * List segments currently starred by the authenticated athlete.
 * @param {SegmentListStarredArgs} [args] - Optional pagination and filter params
 * @returns {Promise<SummarySegment[]>}
 */
segments.prototype.listStarred = async function (args) {
  args = args || {}
  var qs = this.client.getQS(_qsAllowedProps, args)
  var endpoint = 'segments/starred?' + qs

  return /** @type {Promise<SummarySegment[]>} */ (this.client.getEndpoint(endpoint, args))
}

/**
 * Star or unstar a segment.
 * @param {SegmentStarArgs} args - Must include segment id and starred flag
 * @returns {Promise<DetailedSegment>}
 */
segments.prototype.starSegment = async function (args) {
  _requireSegmentId(args)

  var form = this.client.getRequestBodyObj(_updateAllowedProps, args)
  var endpoint = 'segments/' + args.id + '/starred'
  args.form = form

  return /** @type {Promise<DetailedSegment>} */ (this.client.putEndpoint(endpoint, args))
}

/**
 * List all efforts for a segment by the current athlete.
 * @param {SegmentEffortsArgs} args - Must include segment id; optional pagination and date filters
 * @returns {Promise<DetailedSegmentEffort[]>}
 */
segments.prototype.listEfforts = async function (args) {
  return await this._listHelper('all_efforts', args)
}

/**
 * Find popular segments within a bounding box.
 * @param {SegmentExploreArgs} args - Must include bounds; optional activity_type, min_cat, max_cat
 * @returns {Promise<ExplorerSegment[]>}
 */
segments.prototype.explore = async function (args) {
  var qs = this.client.getQS(_qsAllowedProps, args)
  var endpoint = 'segments/explore?' + qs

  return /** @type {Promise<ExplorerSegment[]>} */ (this.client.getEndpoint(endpoint, args))
}

/**
 * Internal: lists segment efforts for a segment by id.
 * @param {'all_efforts'} listType - Sub-resource to list
 * @param {SegmentEffortsArgs} args - Must include segment id
 * @returns {Promise<DetailedSegmentEffort[]>}
 */
segments.prototype._listHelper = async function (listType, args) {
  _requireSegmentId(args)

  var qs = this.client.getQS(_qsAllowedProps, args)
  var endpoint = 'segments/' + args.id + '/' + listType + '?' + qs
  return /** @type {Promise<DetailedSegmentEffort[]>} */ (this.client.getEndpoint(endpoint, args))
}

module.exports = segments
