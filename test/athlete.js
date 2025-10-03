const should = require('should')
const strava = require('../')
const testHelper = require('./_helper')

describe('athlete_test', function () {
  describe('#get()', function () {
    it('should return detailed athlete information about athlete associated to access_token (level 3)', async () => {
      const response = await strava.athlete.get({})
      response.resource_state.should.be.exactly(3)
    })
  })

  describe('#listActivities()', function () {
    it('should return information about activities associated to athlete with access_token', async () => {
      var nowSeconds = Math.floor(Date.now() / 1000)
      const response = await strava.athlete.listActivities({
        after: nowSeconds + 3600,
        before: nowSeconds + 3600
      })
      response.should.be.instanceof(Array)
    })
  })

  describe('#listClubs()', function () {
    it('should return information about clubs associated to athlete with access_token', async () => {
      const response = await strava.athlete.listClubs({})
      response.should.be.instanceof(Array)
    })
  })

  describe('#listRoutes()', function () {
    it('should return information about routes associated to athlete with access_token', async () => {
      const response = await strava.athlete.listRoutes({})
      response.should.be.instanceof(Array)
    })
  })

  describe('#listZones()', function () {
    it('should return information about heart-rate zones associated to athlete with access_token', async () => {
      const response = await strava.athlete.listZones({})
      response.should.be.instanceof(Object)
    })
  })

  describe('#update()', function () {
    // grab the athlete so we can revert changes
    var _athletePreEdit
    before(async () => {
      _athletePreEdit = await testHelper.getSampleAthlete()
    })

    it('should update the weight of the current athlete and revert to original', async () => {
      var weight = 149

      const response = await strava.athlete.update({ weight })
      should(response.weight).equal(weight)

      // great! we've proven our point, let's reset the athlete data
      const updateResponse = await strava.athlete.update({ city: _athletePreEdit.city, weight: _athletePreEdit.weight })
      should(updateResponse.city).equal(_athletePreEdit.city)
      should(updateResponse.weight).equal(_athletePreEdit.weight)
    })
  })
})
