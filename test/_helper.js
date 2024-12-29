var fs = require('fs')
var strava = require('../')

var testsHelper = {}

// Retrieves the current athlete
testsHelper.getSampleAthlete = async function () {
  return await strava.athlete.get({})
}

testsHelper.getSampleActivity = async function () {
  const payload = await strava.athlete.listActivities({ include_all_efforts: true })

  if (!payload.length) {
    throw new Error('Must have at least one activity posted to Strava to test with.')
  }

  // Look for an activity with an achievement to ensure it contains a segment
  function hasAchievement (activity) {
    return activity.achievement_count > 1
  }

  const withSegment = payload.find(hasAchievement)
  if (!withSegment) {
    throw new Error('Must have at least one activity posted to Strava with a segment effort to test with.')
  }

  return await strava.activities.get({ id: withSegment.id, include_all_efforts: true })
}

testsHelper.getSampleClub = async function () {
  const payload = await strava.athlete.listClubs({})
  if (!payload.length) {
    throw new Error('Must have joined at least one club on Strava to test with.')
  }
  return payload[0]
}

testsHelper.getSampleRoute = async function () {
  const payload = await strava.athlete.listRoutes({})
  if (!payload.length) {
    throw new Error('Must have created at least one route on Strava to test with.')
  }
  return payload[0]
}

testsHelper.getSampleGear = async function () {
  const athlete = await this.getSampleAthlete()

  if (athlete.bikes && athlete.bikes.length) {
    return athlete.bikes[0]
  } else if (athlete.shoes && athlete.shoes.length) {
    return athlete.shoes[0]
  } else {
    throw new Error('Must post at least one bike or shoes to Strava to test with.')
  }
}

testsHelper.getSampleSegmentEffort = async function () {
  const activity = await this.getSampleActivity()
  if (!activity.segment_efforts.length) {
    throw new Error('Must have at least one segment effort posted to Strava to test with.')
  }
  return activity.segment_efforts[0]
}

testsHelper.getSampleSegment = async function () {
  const effort = await this.getSampleSegmentEffort()
  return effort.segment
}

testsHelper.getSampleRunningRace = async function () {
  const payload = await strava.runningRaces.listRaces({ year: 2015 })
  // Races can be an empty array, but we just return the first item
  return payload[0]
}

testsHelper.getAccessToken = function () {
  try {
    var config = fs.readFileSync('data/strava_config', { encoding: 'utf-8' })
    return JSON.parse(config).access_token
  } catch (e) {
    return process.env.STRAVA_ACCESS_TOKEN
  }
}

module.exports = testsHelper
