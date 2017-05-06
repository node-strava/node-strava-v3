/**
 * Created by OzQu on 6.5.2017
 */

var should = require("should")
    , strava = require("../")
    , testHelper = require("./_helper");

var _sampleGroupEvent;

describe('groupEvents_test', function() {

    before(function(done) {

        testHelper.getSampleGroupEvent(function(err,payload) {
        // Requires that your sample club (first of your clubs) has group event.

            _sampleGroupEvent = payload;
            done();
        });
    });

    describe('#get()', function () {

        it('should return detailed information about group event', function (done) {

            strava.groupEvents.get({id:_sampleGroupEvent.id}, function (err, payload) {

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

        it('should run with a null context', function(done) {
            strava.groupEvents.get.call(null, {id:_sampleGroupEvent.id}, function(err,payload) {
                if(!err) {
                    //console.log(payload);
                    (payload.resource_state).should.be.exactly(3);
                } else {
                    console.log(err);
                }

                done();
            });
        });
    });

    describe('#listAthletes()', function() {

        it('should return a summary list of atheletes in group event', function(done) {
            strava.groupEvents.listAthletes({id:_sampleGroupEvent.id}, function(err,payload) {
                if(!err) {
                    //console.log(payload);
                    payload.should.be.instanceof(Array);
                } else {
                    console.log(err);
                }
                done();
            });
        });
    });
});

