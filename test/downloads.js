/**
 * Created by dhritzkiv on 12/18/15.
 */

var should = require('should')
var strava = require('../')
var testHelper = require('./_helper')

var _sampleRoute

describe('downloads_test', function() {
  before(function(done) {
    testHelper.getSampleRoute(function(err, sampleRoute) {
      _sampleRoute = sampleRoute
      done()
    })
  })

  describe('#route()', function() {
    it('should return exported file for the corresponding route', function(done) {
      strava.downloads.route({
        id: _sampleRoute.id,
        type: 'gpx'
      }, function(err, payload) {
        if (!err) {
          should.exist(payload);
        } else {
          console.log(err)
        }

        done()
      })
    })

    it('should fail if wrong type is passed', function(done) {
      strava.downloads.route({
        id: _sampleRoute.id,
        type: 'foo'
      }, function(err, payload) {
        err.msg.should.equal('args must include a file type (either gpx or tcx)')

        done()
      })
    })
  })
})
