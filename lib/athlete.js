/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 * @typedef {import('../index').SummaryAthlete} SummaryAthlete
 * @typedef {import('../index').DetailedActivity} DetailedActivity
 * @typedef {import('../index').Route} Route
 * @typedef {import('../index').SummaryClub} SummaryClub
 * @typedef {import('../index').ActivityZone} ActivityZone
 */

/**
 * Args for athlete list endpoints (activities, routes, clubs, zones).
 * @typedef {import('./httpClient').GetEndpointArgs & {
 *   page?: number;
 *   per_page?: number;
 *   before?: number;
 *   after?: number;
 * }} AthleteListArgs
 */

/**
 * Args for athlete update endpoint.
 * @typedef {Object} AthleteUpdateArgs
 * @property {number} [weight] - Athlete weight in kg
 * @property {number} [ftp] - Functional threshold power
 * @property {Record<string, string|number|boolean>} [body] - Populated by client
 */

/**
 * Athlete API client for the authenticated user.
 * @param {StravaRouteClient} client - HTTP client instance for Strava API requests
 */
var athlete = function (client) {
  this.client = client
}

var _qsAllowedProps = [

  // pagination
  'page',
  'per_page',

  // listActivities
  'before',
  'after'
]
var _updateAllowedProps = [
  'weight',
  'ftp'
]

/**
 * Get the currently authenticated athlete.
 * @param {import('./httpClient').GetEndpointArgs} [args]
 * @returns {Promise<SummaryAthlete>}
 */
athlete.prototype.get = async function (args) {
  var endpoint = 'athlete'
  return await /** @type {Promise<SummaryAthlete>} */ (this.client.getEndpoint(endpoint, args))
}

/**
 * List authenticated athlete's activities.
 * @param {AthleteListArgs} [args]
 * @returns {Promise<DetailedActivity[]>}
 */
athlete.prototype.listActivities = async function (args) {
  return await /** @type {Promise<DetailedActivity[]>} */ (this._listHelper('activities', args))
}

/**
 * List authenticated athlete's routes.
 * @param {AthleteListArgs} [args]
 * @returns {Promise<Route[]>}
 */
athlete.prototype.listRoutes = async function (args) {
  return await /** @type {Promise<Route[]>} */ (this._listHelper('routes', args))
}

/**
 * List clubs the authenticated athlete belongs to.
 * @param {AthleteListArgs} [args]
 * @returns {Promise<SummaryClub[]>}
 */
athlete.prototype.listClubs = async function (args) {
  return await /** @type {Promise<SummaryClub[]>} */ (this._listHelper('clubs', args))
}

/**
 * List authenticated athlete's heart rate and power zones.
 * @param {AthleteListArgs} [args]
 * @returns {Promise<ActivityZone[]>}
 */
athlete.prototype.listZones = async function (args) {
  return await /** @type {Promise<ActivityZone[]>} */ (this._listHelper('zones', args))
}

/**
 * Update the currently authenticated athlete.
 * @param {AthleteUpdateArgs} args
 * @returns {Promise<SummaryAthlete>}
 */
athlete.prototype.update = async function (args) {
  var endpoint = 'athlete'
  args.body = this.client.getRequestBodyObj(_updateAllowedProps, args)
  return await /** @type {Promise<SummaryAthlete>} */ (this.client.putEndpoint(endpoint, args))
}

/**
 * Internal: lists a given athlete sub-resource (activities, routes, clubs, or zones).
 * @param {'activities'|'routes'|'clubs'|'zones'} listType
 * @param {AthleteListArgs} [args]
 * @returns {Promise<DetailedActivity[]|Route[]|SummaryClub[]|ActivityZone[]>}
 */
athlete.prototype._listHelper = async function (listType, args) {
  var endpoint = 'athlete/'
  var qs = this.client.getQS(_qsAllowedProps, args)

  endpoint += listType + '?' + qs
  return await /** @type {Promise<DetailedActivity[]|Route[]|SummaryClub[]|ActivityZone[]>} */ (this.client.getEndpoint(endpoint, args))
}

module.exports = athlete
