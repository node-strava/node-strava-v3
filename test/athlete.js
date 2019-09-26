const should = require('should')
const strava = require('../')
const testHelper = require('./_helper')

describe('athlete_test', function () {
  describe('#get()', function () {
    it('should return detailed athlete information about athlete associated to access_token (level 3)', function (done) {
      strava.athlete.get({}, function (err, payload) {
        if (!err) {
          (payload.resource_state).should.be.exactly(3)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#listActivities()', function () {
    it('should return information about activities associated to athlete with access_token', function (done) {
      var nowSeconds = Math.floor(Date.now() / 1000)
      strava.athlete.listActivities({
        after: nowSeconds + 3600,
        before: nowSeconds + 3600
      }, function (err, payload) {
        if (!err) {
          // console.log(payload);
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#listClubs()', function () {
    it('should return information about clubs associated to athlete with access_token', function (done) {
      strava.athlete.listClubs({}, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#listRoutes()', function () {
    it('should return information about routes associated to athlete with access_token', function (done) {
      strava.athlete.listRoutes({}, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#listZones()', function () {
    it('should return information about heart-rate zones associated to athlete with access_token', function (done) {
      strava.athlete.listZones({}, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Object)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#update()', function () {
    // grab the athlete so we can revert changes
    var _athletePreEdit
    before(function (done) {
      testHelper.getSampleAthlete(function (err, payload) {
        should(err).be.null()
        _athletePreEdit = payload
        done()
      })
    })

    it('should update the weight of the current athlete and revert to original', function (done) {
      var weight = 149

      strava.athlete.update({ weight }, function (err, payload) {
        if (!err) {
          should(payload.weight).equal(weight)

          // great! we've proven our point, let's reset the athlete data
          strava.athlete.update({ city: _athletePreEdit.city }, function (err, payload) {
            should(err).be.null()
            should(payload.city).equal(_athletePreEdit.city)
            done()
          })
        } else {
          console.log(err)
          done()
        }
      })
    })
  })
})
