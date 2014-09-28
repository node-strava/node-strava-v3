/**
 * Created by austin on 9/24/14.
 */

var should = require("should")
    , strava = require("../")
    , testHelper = require("./_helper");

var _activity_id = '62215796'
    , _segmentEffort_id = '1171408632'
    , _segment_id = "5100058"
    ;

var _sampleActivity;

describe('streams_test', function() {

    before(function(done) {

        testHelper.getSampleActivity(function(err,payload) {

            _sampleActivity = payload;

            _activity_id = _sampleActivity.id;
            _segmentEffort_id = _sampleActivity.segment_efforts[0].id;
            _segment_id = _sampleActivity.segment_efforts[0].segment.id;

            done();
        });
    });

    describe('#activity()', function () {

        it('should return raw data associated to activity', function(done) {
            strava.streams.activity({
                id: _activity_id
                , types: 'time,distance'
                , resolution: 'low'
            }, function (err, payload) {

                if (!err) {
                    //console.log(payload);
                    payload.should.be.instanceof(Array);
                }
                else {
                    console.log(err);
                }

                done();

            });
        });
    });

    describe('#effort()', function () {

        it('should return raw data associated to segment_effort', function(done) {
            strava.streams.effort({
                id: _segmentEffort_id
                , types: 'distance'
                , resolution: 'low'
            }, function (err, payload) {

                if (!err) {
                    //console.log(payload);
                    payload.should.be.instanceof(Array);
                }
                else {
                    console.log(err);
                }

                done();

            });
        });
    });

    describe('#segment()', function () {

        it('should return raw data associated to segment', function(done) {
            strava.streams.segment({
                id: _segment_id
                , types: 'distance'
                , resolution: 'low'
            }, function (err, payload) {

                if (!err) {
                    //console.log(payload);
                    payload.should.be.instanceof(Array);
                }
                else {
                    console.log(err);
                }

                done();

            });
        });
    });

});