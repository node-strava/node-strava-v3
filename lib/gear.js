/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 * @typedef {import('../index').DetailRoute} DetailRoute
 * @typedef {import('../index').DetailedGear} DetailedGear
 */

/**
 * Gear API client for bikes and other equipment.
 * @param {StravaRouteClient} client - HTTP client instance for Strava API requests
 */
var gear = function (client) {
  this.client = client
}

/**
 * Returns gear (bike/equipment) details by id.
 * @param {DetailRoute} args - Must include gear id
 * @returns {Promise<DetailedGear>}
 */
gear.prototype.get = async function (args) {
  var endpoint = 'gear/'

  // require gear id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a gear id')
  }

  endpoint += args.id
  return /** @type {Promise<DetailedGear>} */ (this.client.getEndpoint(endpoint, args))
}

module.exports = gear
