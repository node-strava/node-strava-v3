
var should = require("should")
    , strava = require("../");

describe('athlete', function(){

    describe('#get()', function() {

        it('should return detailed athlete information about athlete associated to access_token (level 3)', function(done) {

            strava.athlete.get({},function(err,payload){

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

    describe('#listFriends()', function() {

        it('should return information about friends associated to athlete with access_token', function(done) {

            strava.athlete.listFriends({},function(err,payload){

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

    describe('#listFollowers()', function() {

        it('should return information about followers associated to athlete with access_token', function(done) {

            strava.athlete.listFollowers({},function(err,payload){

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

    describe('#listActivities()', function() {

        it('should return information about activities associated to athlete with access_token', function(done) {

            strava.athlete.listActivities({},function(err,payload){

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

    describe('#listClubs()', function() {

        it('should return information about clubs associated to athlete with access_token', function(done) {

            strava.athlete.listClubs({},function(err,payload){

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

    describe('#update()', function() {

        it('should update the city of the current athlete', function(done) {

            strava.athlete.update({city:"Seattle"},function(err,payload){

                if(!err) {
                    //console.log(payload);
                    (payload.resource_state).should.be.exactly(3);
                    (payload.city).should.be.exactly("Seattle");
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

});
