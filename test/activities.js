/**
 * Created by austin on 9/20/14.
 */

var should = require("should")
    , strava = require("../")
    , testHelper = require("./_helper");

var testActivity = {}
    , _sampleActivityPreEdit
    , _sampleActivity;

describe('activities', function() {

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
                    console.log(payload);
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
            strava.activities.get({id: _sampleActivity.id}, function (err, payload) {

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

            var name = "Run like the wind!!"
                , args = {
                    id:_sampleActivity.id
                    , name:name
                };

            strava.activities.update(args, function (err, payload) {

                if (!err) {
                    (payload.resource_state).should.be.exactly(3);
                    (payload.name).should.be.exactly(name);

                    //great! that works, so revert the activity data back to what it was
                    args = {
                        id:_sampleActivity.id
                        , description:_sampleActivityPreEdit.description
                        , name:_sampleActivityPreEdit.name
                    };
                    strava.activities.update(args,function(err,payload){

                        (payload.resource_state).should.be.exactly(3);
                        (payload.name).should.be.exactly(_sampleActivityPreEdit.name);
                        done();
                    });
                }
                else {
                    console.log(err);
                    done();
                }
            });
        });
    });

    describe('#listZones()', function () {

        it('should list heart rate and power zones relating to activity', function(done) {

            strava.activities.listZones({id:_sampleActivity.id}, function (err, payload) {

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

    describe('#listLaps()', function () {

        it('should list laps relating to activity', function(done) {

            strava.activities.listLaps({id:_sampleActivity.id}, function (err, payload) {

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

            strava.activities.listComments({id:_sampleActivity.id}, function (err, payload) {

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

            strava.activities.listKudos({id:_sampleActivity.id}, function (err, payload) {

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

    describe('#listPhotos()', function () {

        it('should list photos relating to activity', function(done) {

            strava.activities.listPhotos({id:_sampleActivity.id}, function (err, payload) {

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