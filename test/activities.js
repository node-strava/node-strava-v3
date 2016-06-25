/**
 * Created by austin on 9/20/14.
 */

var should = require("should")
    , sinon = require('sinon')
    , strava = require("../")
    , testHelper = require("./_helper")
    , authenticator = require('../lib/authenticator');

var testActivity = {}
    , _sampleActivityPreEdit
    , _sampleActivity;

describe('activities_test', function() {

    before(function(done) {

        testHelper.getSampleActivity(function(err,sampleActivity) {

            _sampleActivity = sampleActivity;
            _sampleActivityPreEdit = sampleActivity;
            done();
        });
    });

    describe('#create()', function () {

        it('should create an activity', function(done) {

            var args = {
                name:"Most Epic Ride EVER!!!"
                , elapsed_time:18373
                , distance: 1557840
                , start_date_local: "2013-10-23T10:02:13Z"
                , type: "Ride"
            };

            strava.activities.create(args, function (err, payload) {

                if (!err) {
                    //console.log(payload);
                    testActivity = payload;
                    (payload.resource_state).should.be.exactly(3);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

    describe('#get()', function () {

        it('should return information about the corresponding activity', function(done) {
            strava.activities.get({id: testActivity.id}, function (err, payload) {

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

        it('should work with a specified access token', function(done) {
            var token = testHelper.getAccessToken();
            var tokenStub = sinon.stub(authenticator, 'getToken', function () {
                return undefined;
            });

            strava.activities.get({
              id: testActivity.id,
              access_token: token
            }, function(err, payload) {
              (payload.resource_state).should.be.exactly(3);
              tokenStub.restore();
              done();
            });
        });

        it('should run with a null context', function(done) {
          strava.activities.get.call(null, {id: testActivity.id}, function (err, payload) {

            if (!err) {
              (payload.resource_state).should.be.exactly(3);
            } else {
              console.log(err);
            }

            done();
          });
        });
    });

    describe('#update()', function () {

        it('should update an activity', function(done) {

            var name = "Run like the wind!!"
                , args = {
                    id:testActivity.id
                    , name:name
                };

            strava.activities.update(args, function (err, payload) {

                if (!err) {
                    (payload.resource_state).should.be.exactly(3);
                    (payload.name).should.be.exactly(name);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

    //TODO can't test b/c this requires premium account
    describe('#listZones()', function () {

        it('should list heart rate and power zones relating to activity', function(done) {

            strava.activities.listZones({id:testActivity.id}, function (err, payload) {

                if (!err) {
                    //console.log(payload);
                    //payload.should.be.instanceof(Array);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

    describe('#listLaps()', function () {

        it('should list laps relating to activity', function(done) {

            strava.activities.listLaps({id:testActivity.id}, function (err, payload) {

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

    describe('#listComments()', function () {

        it('should list comments relating to activity', function(done) {

            strava.activities.listComments({id:testActivity.id}, function (err, payload) {

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

    describe('#listKudos()', function () {

        it('should list kudos relating to activity', function(done) {

            strava.activities.listKudos({id:testActivity.id}, function (err, payload) {

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

    //TODO check w/ strava dudes, this is returning undefined instead of an empty array (no photos)
    describe('#listPhotos()', function () {

        it('should list photos relating to activity', function(done) {

            strava.activities.listPhotos({id:testActivity.id}, function (err, payload) {

                if (!err) {
                    //console.log(payload);
                    //payload.should.be.instanceof(Array);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

    //TODO ideally we'd test for some real related activities but since we created a
    // fake activity without location data, there are no related activities.
    describe('#listRelated()', function () {

        it('should list activities related to activity', function(done) {

            strava.activities.listRelated({id:testActivity.id}, function (err, payload) {

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

    describe('#delete()', function () {

        it('should delete an activity', function(done) {

            var args = {
                id:testActivity.id
            };

            strava.activities.delete(args, function (err, payload) {

                if (err)  {
                    console.log(err);
                }

                done();
            });
        });
    });

    describe('#listFriends()', function () {

        it('should list activities of friends associated to current athlete', function(done) {

            strava.activities.listFriends({}, function (err, payload) {

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
