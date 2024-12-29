const should = require('should')
const strava = require('../')
const testHelper = require('./_helper')

describe('athlete_test', function () {
  describe('#get()', function () {
    it('should return detailed athlete information about athlete associated to access_token (level 3)', function (done) {
      strava.athlete.get({})
        .then(function (payload) {
          payload.resource_state.should.be.exactly(3)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })

  describe('#listActivities()', function () {
    it('should return information about activities associated to athlete with access_token', function (done) {
      const nowSeconds = Math.floor(Date.now() / 1000)
      strava.athlete.listActivities({
        after: nowSeconds + 3600,
        before: nowSeconds + 3600
      })
        .then(function (payload) {
          payload.should.be.instanceof(Array)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })

  describe('#listClubs()', function () {
    it('should return information about clubs associated to athlete with access_token', function (done) {
      strava.athlete.listClubs({})
        .then(function (payload) {
          payload.should.be.instanceof(Array)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })

  describe('#listRoutes()', function () {
    it('should return information about routes associated to athlete with access_token', function (done) {
      strava.athlete.listRoutes({})
        .then(function (payload) {
          payload.should.be.instanceof(Array)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })

  describe('#listZones()', function () {
    it('should return information about heart-rate zones associated to athlete with access_token', function (done) {
      strava.athlete.listZones({})
        .then(function (payload) {
          payload.should.be.instanceof(Object)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })

  describe('#update()', function () {
    // grab the athlete so we can revert changes
    let _athletePreEdit

    before(function (done) {
      // Convert to promise-based from testHelper
      testHelper.getSampleAthlete()
        .then(function (payload) {
          _athletePreEdit = payload
          done()
        })
        .catch(done)
    })

    it('should update the weight of the current athlete and revert to original', function (done) {
      const weight = 149

      // Update athlete
      strava.athlete.update({ weight })
        .then(function (payload) {
          should(payload.weight).equal(weight)

          // revert the athlete data
          return strava.athlete.update({ city: _athletePreEdit.city })
        })
        .then(function (payload) {
          should(payload.city).equal(_athletePreEdit.city)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })
})
