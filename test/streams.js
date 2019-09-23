/*  eslint camelcase: 0 */

var strava = require('../')
var testHelper = require('./_helper')

var _activity_id = '2725479568'
var _segmentEffort_id = '68090153244'
var _segment_id = '68090153244'
var _route_id = ''

var _sampleActivity

describe('streams_test', function () {
  before(function (done) {
    this.timeout(5000)

    testHelper.getSampleActivity(function (err, payload) {
      if (err) { return done(err) }

      _sampleActivity = payload

      _activity_id = _sampleActivity.id
      // _segmentEffort_id = _sampleActivity.segment_efforts[0].id;
      // _segment_id = _sampleActivity.segment_efforts[0].segment.id;

      testHelper.getSampleRoute(function (err, payload) {
        _route_id = payload && payload.id

        done(err)
      })
    })
  })

  describe('#activity()', function () {
    it('should return raw data associated to activity', function (done) {
      strava.streams.activity({
        id: _activity_id,
        types: 'time,distance',
        resolution: 'low'
      }, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe.skip('#effort()', function () {
    it('should return raw data associated to segment_effort', function (done) {
      strava.streams.effort({
        id: _segmentEffort_id,
        types: 'distance',
        resolution: 'low'
      }, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe.skip('#segment()', function () {
    it('should return raw data associated to segment', function (done) {
      strava.streams.segment({
        id: _segment_id,
        types: 'distance',
        resolution: 'low'
      }, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#route()', function () {
    this.timeout(5000)

    it('should return raw data associated to route', function (done) {
      strava.streams.route({
        id: _route_id,
        types: '',
        resolution: 'low'
      }, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })
})
