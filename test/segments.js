
var should = require("should")
    , strava = require("../")
    , testHelper = require("./_helper");

var _sampleSegment;

describe.skip('segments_test', function() {

    before(function(done) {

        testHelper.getSampleSegment(function(err,payload) {

            _sampleSegment = payload;
            done();
        });
    });

    describe('#get()', function () {

        it('should return detailed information about segment (level 3)', function (done) {

            strava.segments.get({id:_sampleSegment.id}, function (err, payload) {

                if (!err) {
                    //console.log(payload);
                    (payload.resource_state).should.be.exactly(3);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });

        it('should run with a null context', function (done) {

            strava.segments.get.call(null, {id:_sampleSegment.id}, function (err, payload) {

                if (!err) {
                    //console.log(payload);
                    (payload.resource_state).should.be.exactly(3);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

    describe('#listStarred()', function () {

        it('should list segments currently starred by athlete', function (done) {

            strava.segments.listStarred({page:1,per_page:2}, function (err, payload) {

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

    describe('#listEfforts()', function () {

        it('should list efforts on segment by current athlete', function (done) {

            strava.segments.listEfforts({id:_sampleSegment.id,page:1,per_page:2}, function (err, payload) {

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

        it('should only provide efforts between dates if `start_date_local` & `end_date_local` parameters provided', function(done) {
            var startDate = new Date(new Date() - 604800000); // last week
            var endDate = new Date();

            var startString = startDate.toISOString();
            var endString = endDate.toISOString();

            strava.segments.listEfforts({id:_sampleSegment.id,page:1,per_page:10,start_date_local:startString,end_date_local:endString}, function (err, payload) {

                if (!err) {
                    payload.forEach(function(item) {
                        var resultDate = new Date(item.start_date_local);
                        resultDate.should.be.greaterThan(startDate);
                        resultDate.should.be.lessThan(endDate);
                    });
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

    describe('#listLeaderboard()', function () {

        it('should list leaderboard for segment', function (done) {

            strava.segments.listLeaderboard({
                id:_sampleSegment.id
                ,page:1
                ,per_page:4
                ,gender:"M"
            }, function (err, payload) {

                if (!err) {
                    //console.log(payload);
                    payload.entries.should.be.instanceof(Array);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

    describe('#explore()', function () {

        it('should return up to 10 segments w/i the given bounds', function (done) {

            strava.segments.explore({
                bounds:"37.821362,-122.505373,37.842038,-122.465977"
                , activity_type: "running"
            }, function (err, payload) {

                if (!err) {
                    //console.log(payload);
                    payload.segments.should.be.instanceof(Array);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

});
