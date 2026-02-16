/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 * @typedef {import('../index').DetailRoute} DetailRoute
 * @typedef {import('../index').RouteFile} RouteFile
 * @typedef {import('../index').Route} Route
 */

/**
 * Routes API client.
 * @param {StravaRouteClient} client - HTTP client instance for Strava API requests
 */
var routes = function (client) {
  this.client = client
}

const _qsAllowedProps = /** @type {string[]} */ ([])

/**
 * Returns route details by id.
 * @param {DetailRoute} args - Must include route id
 * @returns {Promise<Route>}
 */
routes.prototype.get = async function (args) {
  _requireRouteId(args)

  var endpoint = 'routes/' + args.id + '?' + this.client.getQS(_qsAllowedProps, args)
  return /** @type {Promise<Route>} */ (this.client.getEndpoint(endpoint, args))
}

/**
 * Exports a route as a file (e.g. gpx) by id and file_type.
 * @param {RouteFile} args - Must include route id and file_type
 * @returns {Promise<string>}
 */
routes.prototype.getFile = async function (args) {
  _requireRouteId(args)

  return this._getFileHelper('routes/', args)
}

/**
 * Throws if args lacks a valid route id.
 * @param {DetailRoute | RouteFile} args
 * @returns {void}
 * @throws {Error} When args.id is missing or not a string
 */
var _requireRouteId = function (args) {
  if (!args.id || typeof args.id !== 'string') {
    throw new Error('args must include a valid route id')
  }
}

/**
 * Internal: GETs route export file (e.g. gpx) for the given route id and file_type.
 * @param {string} endpoint - Base endpoint (e.g. 'routes/')
 * @param {RouteFile} args - Must include id and file_type
 * @returns {Promise<string>}
 */
routes.prototype._getFileHelper = function (endpoint, args) {
  var qs = this.client.getQS(_qsAllowedProps, args)

  endpoint += args.id + `/export_${args.file_type}` + '?' + qs

  var requestArgs = Object.assign({}, args, { responseType: 'text' })

  return /** @type {Promise<string>} */ (this.client.getEndpoint(endpoint, requestArgs))
}

module.exports = routes
