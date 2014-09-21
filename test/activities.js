/**
 * Created by austin on 9/20/14.
 */

var should = require("should")
    , strava = require("../");

var activity_id = "196688702";

describe('activities', function() {

    describe('#get()', function () {

        it('should return information about the corresponding activity', function(done) {
            strava.activities.get({id: activity_id}, function (err, payload) {

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
                    (payload.resource_state).should.be.exactly(3);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

    describe('#update()', function () {

        it('should update an activity', function(done) {

            var args = {
                id:activity_id
                , description:"that description done been edited"
            };

            strava.activities.update(args, function (err, payload) {

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

    describe('#delete()', function () {

        it('should delete an activity', function(done) {

            var args = {
                id:"fakeID"
            };

            strava.activities.delete(args, function (err, payload) {

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

    describe('#listZones()', function () {

        it('should list heartrate and power zones relating to activity', function(done) {

            strava.activities.listZones({id:activity_id}, function (err, payload) {

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

    describe.only('#listLaps()', function () {

        it('should list laps relating to activity', function(done) {

            strava.activities.listLaps({id:activity_id}, function (err, payload) {

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

            strava.activities.listComments({id:activity_id}, function (err, payload) {

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

            strava.activities.listKudos({id:activity_id}, function (err, payload) {

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

    describe.only('#listPhotos()', function () {

        it('should list photos relating to activity', function(done) {

            strava.activities.listPhotos({id:activity_id}, function (err, payload) {

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