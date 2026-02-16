/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 * @typedef {import('../index').ClubsRoutesArgs} ClubsRoutesArgs
 * @typedef {import('../index').ClubsRoutesListArgs} ClubsRoutesListArgs
 * @typedef {import('../index').DetailedClub} DetailedClub
 * @typedef {import('../index').SummaryAthlete} SummaryAthlete
 * @typedef {import('../index').ClubActivity} ClubActivity
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
 * @param {ClubsRoutesListArgs} args - Must include club id; optional page, per_page
 * @returns {Promise<SummaryAthlete[]>}
 */
clubs.prototype.listMembers = function (args) {
  return /** @type {Promise<SummaryAthlete[]>} */ (this._listHelper('members', args))
}

/**
 * List club activities.
 * @param {ClubsRoutesListArgs} args - Must include club id; optional page, per_page
 * @returns {Promise<ClubActivity[]>}
 */
clubs.prototype.listActivities = function (args) {
  return /** @type {Promise<ClubActivity[]>} */ (this._listHelper('activities', args))
}

/**
 * List club admins.
 * @param {ClubsRoutesListArgs} args - Must include club id; optional page, per_page
 * @returns {Promise<SummaryAthlete[]>}
 */
clubs.prototype.listAdmins = function (args) {
  return /** @type {Promise<SummaryAthlete[]>} */ (this._listHelper('admins', args))
}

/**
 * Internal: lists a club sub-resource (members, activities, or admins).
 * @param {'members'|'activities'|'admins'} listType - Sub-resource to list
 * @param {ClubsRoutesListArgs} args - Must include club id; optional page, per_page
 * @returns {Promise<SummaryAthlete[]|ClubActivity[]>}
 */
clubs.prototype._listHelper = async function (listType, args) {
  var endpoint = 'clubs/'
  var qs = this.client.getPaginationQS(args)

  // require club id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a club id')
  }

  endpoint += args.id + '/' + listType + '?' + qs

  return await /** @type {Promise<SummaryAthlete[]|ClubActivity[]>} */ (this.client.getEndpoint(endpoint, args))
}

module.exports = clubs
