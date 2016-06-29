
var should = require("should")
    , strava = require("../")
    , testHelper = require("./_helper");

var _sampleAthlete;

describe('athletes', function(){

    //get the athlete so we have access to an id for testing
    before(function(done) {

        testHelper.getSampleAthlete(function(err,payload){
            _sampleAthlete = payload;
            done();
        });
    });

    describe('#get()',function(){
        it('should return basic athlete information (level 2)', function(done){

            strava.athletes.get({id:_sampleAthlete.id},function(err,payload){

                if(!err) {
                    //console.log(payload);
                    (payload.resource_state).should.be.within(2,3);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });

        it('should run with a null context', function(done){

            strava.athletes.get.call(null, {id:_sampleAthlete.id},function(err,payload){

                if(!err) {
                    //console.log(payload);
                    (payload.resource_state).should.be.within(2,3);
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

            strava.athletes.listFriends({id:_sampleAthlete.id},function(err,payload){

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

            strava.athletes.listFollowers({id:_sampleAthlete.id},function(err,payload){

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

    describe('#stats()',function(){
        it('should return athlete stats information', function(done){

            strava.athletes.stats({id:_sampleAthlete.id},function(err,payload){

                if(!err) {
                    //console.log(payload);
                    payload.should.have.property('biggest_ride_distance');
                }
                else {
                    console.log(err);
                }

                done();
            });
        });

        it('should run with a null context', function(done){

            strava.athletes.stats.call(null, {id:_sampleAthlete.id},function(err,payload){

                if(!err) {
                    //console.log(payload);
                    payload.should.have.property('biggest_ride_distance');
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

    describe('#listKoms()',function(){
        it('should return list of athlete K/QOMs/CRs', function(done){

            strava.athletes.listKoms({
                id:_sampleAthlete.id
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
