/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 * @typedef {import('../index').DetailRoute} DetailRoute
 * @typedef {import('../index').StreamSet} StreamSet
 */

/**
 * Streams API query parameters (Strava allows these on stream endpoints).
 * @typedef {Object} StreamsQueryParams
 * @property {string[]} [keys] - Stream types to return (e.g. 'time', 'latlng', 'altitude')
 * @property {boolean} [key_by_type] - If true, group streams by type in the response
 */

/**
 * Args for stream endpoints (id plus optional keys, key_by_type, etc.).
 * @typedef {DetailRoute & StreamsQueryParams} StreamsArgs
 */

/**
 * Streams API client for activity, segment effort, segment, and route time-series data.
 * @param {StravaRouteClient} client - HTTP client instance for Strava API requests
 */
var streams = function (client) {
  this.client = client
}

var _qsAllowedProps = [
  'keys',
  'key_by_type',
  'original_size',
  'resolution',
  'series_type'
]

/**
 * Returns streams (e.g. time, latlng, altitude) for an activity by id.
 * @param {StreamsArgs} args - Must include id (activity/effort/segment/route id)
 * @returns {Promise<StreamSet[]>}
 */
streams.prototype.activity = function (args) {
  var endpoint = 'activities'
  return this._typeHelper(endpoint, args)
}

/**
 * Returns streams for a segment effort by id.
 * @param {StreamsArgs} args - Must include id (segment effort id)
 * @returns {Promise<StreamSet[]>}
 */
streams.prototype.effort = function (args) {
  var endpoint = 'segment_efforts'
  return this._typeHelper(endpoint, args)
}

/**
 * Returns streams for a segment by id.
 * @param {StreamsArgs} args - Must include id (segment id)
 * @returns {Promise<StreamSet[]>}
 */
streams.prototype.segment = function (args) {
  var endpoint = 'segments'
  return this._typeHelper(endpoint, args)
}

/**
 * Returns streams for a route by id.
 * @param {StreamsArgs} args - Must include id (route id)
 * @returns {Promise<StreamSet[]>}
 */
streams.prototype.route = function (args) {
  var endpoint = 'routes'
  return this._typeHelper(endpoint, args)
}

/**
 * Internal: GETs streams for a given endpoint and resource id.
 * @param {string} endpoint - Base endpoint name (e.g. 'activities', 'segment_efforts')
 * @param {StreamsArgs} args - Must include id; may include stream query params
 * @returns {Promise<StreamSet[]>}
 */
streams.prototype._typeHelper = function (endpoint, args) {
  // require id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include an id')
  }

  const qs = this.client.getQS(_qsAllowedProps, args)

  endpoint += '/' + args.id + '/streams' + '?' + qs
  return /** @type {Promise<StreamSet[]>} */ (this.client.getEndpoint(endpoint, args))
}

module.exports = streams
