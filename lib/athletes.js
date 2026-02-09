/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 * @typedef {import('../index').AthleteRouteArgs} AthleteRouteArgs
 * @typedef {import('../index').ActivityStats} ActivityStats
 */

/**
 * Athletes API client for other athletes' stats (by id).
 * @param {StravaRouteClient} client - HTTP client instance for Strava API requests
 */
var athletes = function (client) {
  this.client = client
}

/**
 * Returns stats for another athlete by id.
 * @param {AthleteRouteArgs} args - Must include athlete id
 * @returns {Promise<ActivityStats>}
 */
athletes.prototype.stats = function (args) {
  return /** @type {Promise<ActivityStats>} */ (this._listHelper('stats', args))
}

/**
 * Internal: fetches an athlete sub-resource (stats) by athlete id.
 * @param {'stats'} listType - The athlete stats sub-endpoint
 * @param {AthleteRouteArgs} args - Must include athlete id
 * @returns {Promise<ActivityStats>}
 */
athletes.prototype._listHelper = function (listType, args) {
  var endpoint = 'athletes/'
  var qs = this.client.getPaginationQS(args)

  // require athlete id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include an athlete id')
  }

  endpoint += args.id + '/' + listType + '?' + qs
  return /** @type {Promise<ActivityStats>} */ (this.client.getEndpoint(endpoint, args))
}

module.exports = athletes
