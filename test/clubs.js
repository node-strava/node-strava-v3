/**
 * Created by austin on 9/22/14.
 */

var should = require("should")
    , strava = require("../");

var club_id = "81417";

describe.only('clubs', function() {

    describe('#get()', function () {

        it('should return club detailed information', function(done) {

            strava.clubs.get({id:club_id}, function(err,payload) {

                if(!err) {
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

    describe('#listMembers()', function () {

        it('should return a summary list of athletes in club', function(done) {

            strava.clubs.listMembers({id:club_id}, function(err,payload) {

                if(!err) {
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

    describe('#listActivities()', function () {

        it('should return a list of club activities', function(done) {

            strava.clubs.listActivities({id:club_id}, function(err,payload) {

                if(!err) {
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
