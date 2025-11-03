const strava = require('../')
const authenticator = require('../lib/authenticator')

var testsHelper = {}

testsHelper.setupMockAuth = function () {
  strava.config({
    access_token: 'test_token',
    client_id: 'test_id',
    client_secret: 'test_secret',
    redirect_uri: 'http://localhost'
  })
}

testsHelper.cleanupAuth = function () {
  authenticator.purge()
}

testsHelper.getSampleAthlete = async function () {
  return await strava.athlete.get({})
}

testsHelper.getSampleActivity = function (done) {
  strava.athlete.listActivities({ include_all_efforts: true }, function (err, payload) {
    if (err) { return done(err) }

    if (!payload.length) { return done(new Error('Must have at least one activity posted to Strava to test with.')) }

    // If we find an activity with an achievement, there's a better chance
    // that it contains a segment.
    // This is necessary for getSampleSegment, which uses this function.
    function hasAchievement (activity) { return activity.achievement_count > 1 }

    var withSegment = payload.filter(hasAchievement)[0]

    if (!withSegment) { return done(new Error('Must have at least one activity posted to Strava with a segment effort to test with.')) }

    return strava.activities.get({ id: withSegment.id, include_all_efforts: true }, done)
  })
}

testsHelper.getSampleClub = function (done) {
  strava.athlete.listClubs({}, function (err, payload) {
    if (err) { return done(err) }

    if (!payload.length) { return done(new Error('Must have joined at least one club on Strava to test with.')) }

    done(err, payload[0])
  })
}

testsHelper.getSampleRoute = function (done) {
  strava.athlete.listRoutes({}, function (err, payload) {
    if (err) { return done(err) }

    if (!payload.length) { return done(new Error('Must have created at least one route on Strava to test with.')) }

    done(err, payload[0])
  })
}

testsHelper.getSampleGear = async function () {
  const payload = await this.getSampleAthlete()

  var gear

  if (payload.bikes && payload.bikes.length) {
    gear = payload.bikes[0]
  } else if (payload.shoes) {
    gear = payload.shoes[0]
  } else {
    throw new Error('Must post at least one bike or shoes to Strava to test with')
  }

  return gear
}

testsHelper.getSampleSegmentEffort = function (done) {
  this.getSampleActivity(function (err, payload) {
    if (err) { return done(err) }

    if (!payload.segment_efforts.length) { return done(new Error('Must have at least one segment effort posted to Strava to test with.')) }

    done(err, payload.segment_efforts[0])
  })
}

testsHelper.getSampleSegment = function (done) {
  this.getSampleSegmentEffort(function (err, payload) {
    if (err) { return done(err) }

    done(err, payload.segment)
  })
}

testsHelper.getSampleRunningRace = function (done) {
  strava.runningRaces.listRaces({ 'year': 2015 }, function (err, payload) {
    done(err, payload[0])
  })
}

module.exports = testsHelper
