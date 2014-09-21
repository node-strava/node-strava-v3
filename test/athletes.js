
var should = require("should")
    , strava = require("../");

var athlete_id = "2402496";

describe('athletes', function(){

    describe('#get()',function(){
        it('should return basic athlete information (level 2)', function(done){

            strava.athletes.get({id:athlete_id},function(err,payload){

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

            strava.athletes.listFriends({id:athlete_id},function(err,payload){

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

            strava.athletes.listFollowers({id:athlete_id},function(err,payload){

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

    describe('#listKoms()',function(){
        it('should return list of athlete K/QOMs/CRs', function(done){

            strava.athletes.listKoms({
                id:athlete_id
                , page:1
                , per_page:2
            },function(err,payload){

                if(!err) {
                    console.log(payload);
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
