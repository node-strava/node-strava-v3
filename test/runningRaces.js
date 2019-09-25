/* eslint handle-callback-err: 0 */
var strava = require('../')
var testHelper = require('./_helper')

var _sampleRunningRace

describe('running_race_test', function () {
  before(function (done) {
    testHelper.getSampleRunningRace(function (err, sampleRunningRace) {
      _sampleRunningRace = sampleRunningRace
      done()
    })
  })

  describe('#get()', function () {
    it('should return information about the corresponding race', function (done) {
      strava.runningRaces.get({ id: _sampleRunningRace.id }, function (err, payload) {
        if (!err) {
          (payload.resource_state).should.be.exactly(3)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })
})
