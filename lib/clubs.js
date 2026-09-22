/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 * @typedef {import('../index').ClubsRoutesArgs} ClubsRoutesArgs
 * @typedef {import('../index').DetailedClub} DetailedClub
 */

/**
 * Clubs API client.
 * @param {StravaRouteClient} client - HTTP client instance for Strava API requests
 */
var clubs = function (client) {
  this.client = client
}

/**
 * Get club details.
 * @param {ClubsRoutesArgs} args - Must include club id
 * @returns {Promise<DetailedClub>}
 */
clubs.prototype.get = async function (args) {
  var endpoint = 'clubs/'

  // require club id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a club id')
  }

  endpoint += args.id
  return await /** @type {Promise<DetailedClub>} */ (this.client.getEndpoint(endpoint, args))
}

/**
 * List club members.
 * Removed from the Strava API (changelog 2026-09-01).
 * @deprecated Strava removed GET /clubs/{id}/members.
 * @returns {Promise<never>}
 */
clubs.prototype.listMembers = async function () {
  throw new Error(
    'strava.clubs.listMembers is unavailable: Strava removed GET /clubs/{id}/members from the API (changelog 2026-09-01)'
  )
}

/**
 * List club activities.
 * Removed from the Strava API (changelog 2026-09-01).
 * @deprecated Strava removed GET /clubs/{id}/activities.
 * @returns {Promise<never>}
 */
clubs.prototype.listActivities = async function () {
  throw new Error(
    'strava.clubs.listActivities is unavailable: Strava removed GET /clubs/{id}/activities from the API (changelog 2026-09-01)'
  )
}

/**
 * List club admins.
 * Removed from the Strava API (changelog 2026-09-01).
 * @deprecated Strava removed GET /clubs/{id}/admins.
 * @returns {Promise<never>}
 */
clubs.prototype.listAdmins = async function () {
  throw new Error(
    'strava.clubs.listAdmins is unavailable: Strava removed GET /clubs/{id}/admins from the API (changelog 2026-09-01)'
  )
}

module.exports = clubs
