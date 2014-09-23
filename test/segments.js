
var should = require("should")
    , strava = require("../");

var segment_id = "5100058";

describe('segments', function() {

    describe('#get()', function () {

        it('should return detailed athlete information about segment (level 3)', function (done) {

            strava.segments.get({id:segment_id}, function (err, payload) {

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

            strava.segments.listEfforts({id:segment_id,page:1,per_page:2}, function (err, payload) {

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

    describe.only('#listLeaderboard()', function () {

        it('should list leaderboard for segment', function (done) {

            strava.segments.listLeaderboard({id:segment_id,page:1,per_page:4,gender:"F"}, function (err, payload) {

                if (!err) {
                    console.log(payload);
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