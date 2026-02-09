/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 * @typedef {import('../index').DetailRoute} DetailRoute
 * @typedef {import('../index').DetailedSegmentEffort} DetailedSegmentEffort
 */

/**
 * Segment efforts API client.
 * @param {StravaRouteClient} client - HTTP client instance for Strava API requests
 */
var segmentEfforts = function (client) {
  this.client = client
}

/**
 * Returns a segment effort by id.
 * @param {DetailRoute} args - Must include segment effort id
 * @returns {Promise<DetailedSegmentEffort>}
 */
segmentEfforts.prototype.get = function (args) {
  var endpoint = 'segment_efforts/'

  // require segment id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a segment effort id')
  }

  endpoint += args.id
  return /** @type {Promise<DetailedSegmentEffort>} */ (this.client.getEndpoint(endpoint, args))
}

module.exports = segmentEfforts
