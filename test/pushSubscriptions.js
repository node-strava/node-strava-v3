"use strict"
var nock = require("nock")
    , assert = require("assert")
    , should = require("should")
    , strava = require("../")
    //, Promise = require('bluebird');
 



describe("pushSubscriptions_test", function() {

   var stravahost;

  describe('#list()', function() {

    before(() => {
     stravahost = nock('https://www.strava.com')
                     .filteringPath(() => '/api/v3/push_subscriptions/')
                     .get(/^\/api\/v3\/push_subscriptions/)
                     .reply(200, [
                         {
                           "id": 1,
                           "object_type": "activity",
                           "aspect_type": "create",
                           "callback_url": "http://you.com/callback/",
                           "created_at": "2015-04-29T18:11:09.400558047-07:00",
                           "updated_at": "2015-04-29T18:11:09.400558047-07:00"
                         }
                     ]);
    })  

    it("should return list of subscriptions", () => {
      return Promise.resolve(strava.pushSubscriptions.list())
        .then(result => {
            result.should.eql([
                    {
                      "id": 1,
                      "object_type": "activity",
                      "aspect_type": "create",
                      "callback_url": "http://you.com/callback/",
                      "created_at": "2015-04-29T18:11:09.400558047-07:00",
                      "updated_at": "2015-04-29T18:11:09.400558047-07:00"
                    }
                ])
        })
    });


  });

  describe('#post({object_type:...,aspect_type:...,callback_url:...})', function() {
     before(() => {
       var stravahost = nock('https://www.strava.com')
                       .filteringPath(() => '/api/v3/push_subscriptions')
                       .post(/^\/api\/v3\/push_subscriptions/)
                       .reply(200, {
                             "id": 1,
                             "object_type": "activity",
                             "aspect_type": "create",
                             "callback_url": "http://you.com/callback/",
                             "created_at": "2015-04-29T18:11:09.400558047-07:00",
                             "updated_at": "2015-04-29T18:11:09.400558047-07:00"
                           });
    })


    it("should throw with no params", () => {
      assert.throws(() => strava.pushSubscriptions.post())
    })

    it("should return details of created activity", () => {
      return Promise.resolve(strava.pushSubscriptions.post({
             "object_type": "activity",
             "aspect_type": "create",
             "callback_url": "http://you.com/callback/",
         }))
        .then(result => {
            result.should.eql( {
                      "id": 1,
                      "object_type": "activity",
                      "aspect_type": "create",
                      "callback_url": "http://you.com/callback/",
                      "created_at": "2015-04-29T18:11:09.400558047-07:00",
                      "updated_at": "2015-04-29T18:11:09.400558047-07:00"
                    }
                )
        })
      })

  });

  describe('#delete({id:...})', function() {
    before(() => {
      // The status is not normally returned in the body.
      // We return it here because the test can't easily access the HTTP status code.
       var stravahost = nock('https://www.strava.com')
                       .filteringPath(() => '/api/v3/push_subscriptions/1/')
                       .delete(/^\/api\/v3\/push_subscriptions\/1/)
                       .reply(204,function(uri, requestBody) {
                          requestBody = JSON.parse('{"status":204}');
                          return requestBody;
                        });
    })

    it("should throw with no id", () => {
      assert.throws(() => strava.pushSubscriptions.delete())
    })

    it("Should return 204 after successful delete", () => {
      return Promise.resolve(strava.pushSubscriptions.delete({id:1}))
        .then(result => result.should.eql({status:204}))
    })

    after(() => nock.restore())


  });


});
