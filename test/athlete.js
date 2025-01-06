const should = require('should')
const strava = require('../')
const testHelper = require('./_helper')

describe('athlete_test', function () {
  describe('#get()', function () {
    it('should return detailed athlete information about athlete associated to access_token (level 3)', async function (done) {
      try {
        const payload = await strava.athlete.get({})
        payload.resource_state.should.be.exactly(3)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#listActivities()', function () {
    it('should return information about activities associated to athlete with access_token', async function (done) {
      try {
        const nowSeconds = Math.floor(Date.now() / 1000)
        const payload = await strava.athlete.listActivities({
          after: nowSeconds + 3600,
          before: nowSeconds + 3600
        })
        payload.should.be.instanceof(Array)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#listClubs()', function () {
    it('should return information about clubs associated to athlete with access_token', async function (done) {
      try {
        const payload = await strava.athlete.listClubs({})
        payload.should.be.instanceof(Array)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#listRoutes()', function () {
    it('should return information about routes associated to athlete with access_token', async function (done) {
      try {
        const payload = await strava.athlete.listRoutes({})
        payload.should.be.instanceof(Array)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#listZones()', function () {
    it('should return information about heart-rate zones associated to athlete with access_token', async function (done) {
      try {
        const payload = await strava.athlete.listZones({})
        payload.should.be.instanceof(Object)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#update()', function () {
    // Grab the athlete so we can revert changes
    let _athletePreEdit

    before(async function (done) {
      try {
        _athletePreEdit = await testHelper.getSampleAthlete()
        done()
      } catch (err) {
        done(err)
      }
    })

    it('should update the weight of the current athlete and revert to original', async function (done) {
      try {
        const weight = 149

        // Update athlete
        const payload = await strava.athlete.update({ weight })
        should(payload.weight).equal(weight)

        // revert the athlete data
        const reverted = await strava.athlete.update({ city: _athletePreEdit.city })
        should(reverted.city).equal(_athletePreEdit.city)

        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })
})
