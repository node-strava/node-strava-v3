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
  if (typeof args.id === 'undefined') {
    throw new Error('args must include an athlete id')
  }
  var endpoint = 'athletes/' + args.id + '/stats?' + this.client.getPaginationQS(args)
  return /** @type {Promise<ActivityStats>} */ (this.client.getEndpoint(endpoint, args))
}

module.exports = athletes
