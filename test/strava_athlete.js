
var should = require("should")
    , strava = require("../");

var athlete_id = "2402496";

describe('strava', function(){

    describe('#getCurrent()', function() {

        it('should return detailed athlete information about athlete associated to access_token (level 3)', function(done) {

            strava.athlete.getCurrent({},function(err,payload){

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

    describe('#listCurrentFriends()', function() {

        it('should return information about friends associated to athlete with access_token', function(done) {

            strava.athlete.listCurrentFriends({},function(err,payload){

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

    describe('#listCurrentFollowers()', function() {

        it('should return information about followers associated to athlete with access_token', function(done) {

            strava.athlete.listCurrentFollowers({},function(err,payload){

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

    describe('#get()',function(){
        it('should return basic athlete information (level 2)', function(done){

            strava.athlete.get({id:athlete_id},function(err,payload){

                if(!err) {
                    //console.log(payload);
                    (payload.resource_state).should.be.exactly(2);
                }
                else {
                    console.log(err);
                }

                done();
            });
        })
    });

    describe('#listFriends()',function(){
        it('should return information about friends associated to athlete id', function(done){

            strava.athlete.listFriends({id:athlete_id},function(err,payload){

                if(!err) {
                    //console.log(payload);
                    payload.should.be.instanceof(Array);
                }
                else {
                    console.log(err);
                }

                done();
            });
        })
    });

    describe('#listFollowers()',function(){
        it('should return information about followers associated to athlete id', function(done){

            strava.athlete.listFollowers({id:athlete_id},function(err,payload){

                if(!err) {
                    //console.log(payload);
                    payload.should.be.instanceof(Array);
                }
                else {
                    console.log(err);
                }

                done();
            });
        })
    });

    describe('#getKoms()',function(){
        it('should return detailed athlete information', function(done){

            strava.athlete.getKoms({
                id:athlete_id
                , page:1
                , per_page:2
            },function(err,payload){

                if(!err) {
                    //console.log(payload);
                    payload.should.be.instanceof(Array);
                }
                else {
                    console.log(err);
                }

                done();
            });
        })
    });
});
