const HttpClient = require('./lib/httpClient')
const oauth = require('./lib/oauth')
const authenticator = require('./lib/authenticator')

const Athlete = require('./lib/athlete')
const Athletes = require('./lib/athletes')
const Activities = require('./lib/activities')
const Clubs = require('./lib/clubs')
const Gear = require('./lib/gear')
const Segments = require('./lib/segments')
const SegmentEfforts = require('./lib/segmentEfforts')
const Streams = require('./lib/streams')
const Uploads = require('./lib/uploads')
const rateLimiting = require('./lib/rateLimiting')
const Routes = require('./lib/routes')
const PushSubscriptions = require('./lib/pushSubscriptions')
const { axiosInstance, httpRequest } = require('./axiosUtility')
const version = require('./package.json').version

const strava = {}

strava.defaultRequest = axiosInstance.create({
  baseURL: 'https://www.strava.com/api/v3/',
  headers: {
    'User-Agent': 'node-strava-v3 v' + version
  }
})

/**
 * Creates an authenticated Strava API client. Call with `new strava.client(token, request)`.
 * Instance has: access_token, athlete, athletes, activities, clubs, gear, segments,
 * segmentEfforts, streams, uploads, rateLimiting, routes.
 *
 * @function
 * @param {string} token - OAuth access token.
 * @param {import('./lib/httpClient').RequestFunction} [request] - HTTP request function (defaults to httpRequest).
 */
strava.client = function (token, request = httpRequest) {
  if (!(this instanceof strava.client)) {
    // eslint-disable-next-line new-cap
    return new strava.client(token, request)
  }
  this.access_token = token

  const headers = {
    Authorization: 'Bearer ' + this.access_token
  }

  const httpClient = new HttpClient(async (options) => {
    options.headers = {
      'User-Agent': 'node-strava-v3 v' + version,
      ...headers,
      ...(options.headers || {})
    }
    return await request(options) // Await the Promise
  })

  this.athlete = new Athlete(httpClient)
  this.athletes = new Athletes(httpClient)
  this.activities = new Activities(httpClient)
  this.clubs = new Clubs(httpClient)
  this.gear = new Gear(httpClient)
  this.segments = new Segments(httpClient)
  this.segmentEfforts = new SegmentEfforts(httpClient)
  this.streams = new Streams(httpClient)
  this.uploads = new Uploads(httpClient)
  this.rateLimiting = rateLimiting
  this.routes = new Routes(httpClient)
  // No Push subscriptions on the client object because they don't use OAuth.
}

strava.config = authenticator.fetchConfig

strava.oauth = oauth

strava.defaultHttpClient = new HttpClient(async (options) => {
  options.headers = {
    'User-Agent': 'node-strava-v3 v' + version,
    Authorization: 'Bearer ' + authenticator.getToken(),
    ...(options.headers || {})
  }
  return await httpRequest(options) // Await the Promise
})

strava.athlete = new Athlete(strava.defaultHttpClient)
strava.athletes = new Athletes(strava.defaultHttpClient)
strava.activities = new Activities(strava.defaultHttpClient)
strava.clubs = new Clubs(strava.defaultHttpClient)
strava.gear = new Gear(strava.defaultHttpClient)
strava.segments = new Segments(strava.defaultHttpClient)
strava.segmentEfforts = new SegmentEfforts(strava.defaultHttpClient)
strava.streams = new Streams(strava.defaultHttpClient)
strava.uploads = new Uploads(strava.defaultHttpClient)
strava.rateLimiting = rateLimiting
strava.routes = new Routes(strava.defaultHttpClient)
strava.pushSubscriptions = new PushSubscriptions(strava.defaultHttpClient)

// and export
module.exports = strava
