/**
 * Created by austin on 9/18/14.
 */

const oauth = require('./lib/oauth')
const athlete = require('./lib/athlete')
const athletes = require('./lib/athletes')
const activities = require('./lib/activities')
const clubs = require('./lib/clubs')
const gear = require('./lib/gear')
const segments = require('./lib/segments')
const segmentEfforts = require('./lib/segmentEfforts')
const streams = require('./lib/streams')
const uploads = require('./lib/uploads')
const runningRaces = require('./lib/runningRaces')
const routes = require('./lib/routes')

const strava = {}

// assign various api segments to strava object
strava.oauth = oauth
strava.athlete = athlete
strava.athletes = athletes
strava.activities = activities
strava.clubs = clubs
strava.gear = gear
strava.segments = segments
strava.segmentEfforts = segmentEfforts
strava.streams = streams
strava.uploads = uploads
strava.runningRaces = runningRaces
strava.routes = routes

// and export
module.exports = strava
