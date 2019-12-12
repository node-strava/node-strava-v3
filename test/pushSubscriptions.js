'use strict'
var nock = require('nock')
var assert = require('assert')
var should = require('should')
var strava = require('../')

describe('pushSubscriptions_test', function () {
  describe('#list()', function () {
    before(() => {
      nock('https://www.strava.com')
        .filteringPath(() => '/api/v3/push_subscriptions/')
        .get(/^\/api\/v3\/push_subscriptions/)
      // The first reply just echo's the request headers so we can test them.
        .reply(200, function (uri, requestBody) {
          return { headers: this.req.headers }
        })
        .get(/^\/api\/v3\/push_subscriptions/)
        .reply(200, [
          {
            'id': 1,
            'object_type': 'activity',
            'aspect_type': 'create',
            'callback_url': 'http://you.com/callback/',
            'created_at': '2015-04-29T18:11:09.400558047-07:00',
            'updated_at': '2015-04-29T18:11:09.400558047-07:00'
          }
        ])
    })

    it('should not sent Authorization header to Strava', () => {
      return strava.pushSubscriptions.list()
        .then(result => {
          should.not.exist(result.headers.authorization)
        })
    })

    it('should return list of subscriptions', () => {
      return strava.pushSubscriptions.list()
        .then(result => {
          result.should.eql([
            {
              'id': 1,
              'object_type': 'activity',
              'aspect_type': 'create',
              'callback_url': 'http://you.com/callback/',
              'created_at': '2015-04-29T18:11:09.400558047-07:00',
              'updated_at': '2015-04-29T18:11:09.400558047-07:00'
            }
          ])
        })
    })
  })

  describe('#create({callback_url:...})', function () {
    before(() => {
      nock('https://www.strava.com')
        .filteringPath(() => '/api/v3/push_subscriptions')
      // The first reply just echo's the request headers so we can test them.
        .post(/^\/api\/v3\/push_subscriptions/)
        .reply(200, function (uri, requestBody) {
          return { headers: this.req.headers }
        })
        .post(/^\/api\/v3\/push_subscriptions/)
        .reply(200, {
          'id': 1,
          'object_type': 'activity',
          'aspect_type': 'create',
          'callback_url': 'http://you.com/callback/',
          'created_at': '2015-04-29T18:11:09.400558047-07:00',
          'updated_at': '2015-04-29T18:11:09.400558047-07:00'
        })
    })

    it('should throw with no params', () => {
      assert.throws(() => strava.pushSubscriptions.create())
    })

    it('should not sent Authorization header to Strava', () => {
      return strava.pushSubscriptions.create({
        'callback_url': 'http://you.com/callback/'
      })
        .then(result => {
          should.not.exist(result.headers.authorization)
        })
    })

    it('should return details of created activity', () => {
      return strava.pushSubscriptions.create({
        'callback_url': 'http://you.com/callback/'
      })
        .then(result => {
          result.should.eql({
            'id': 1,
            'object_type': 'activity',
            'aspect_type': 'create',
            'callback_url': 'http://you.com/callback/',
            'created_at': '2015-04-29T18:11:09.400558047-07:00',
            'updated_at': '2015-04-29T18:11:09.400558047-07:00'
          }
          )
        })
    })
  })

  describe('#delete({id:...})', function () {
    before(() => {
      // The status is not normally returned in the body.
      // We return it here because the test can't easily access the HTTP status code.
      nock('https://www.strava.com')
        .filteringPath(() => '/api/v3/push_subscriptions/1/')
      // The first reply just echo's the request headers so we can test them.
        .delete(/^\/api\/v3\/push_subscriptions\/1/)
        .reply(200, function (uri, requestBody) {
          return { headers: this.req.headers }
        })
        .delete(/^\/api\/v3\/push_subscriptions\/1/)
        .reply(204, function (uri, requestBody) {
          requestBody = JSON.parse('{"status":204}')
          return requestBody
        })
    })

    it('should throw with no id', () => {
      assert.throws(() => strava.pushSubscriptions.delete())
    })

    it('should not sent Authorization header to Strava', () => {
      return strava.pushSubscriptions.delete({ id: 1 })
        .then(result => {
          should.not.exist(result.headers.authorization)
        })
    })

    it('Should return 204 after successful delete', () => {
      return strava.pushSubscriptions.delete({ id: 1 })
        .then(result => result.should.eql({ status: 204 }))
    })

    after(() => nock.restore())
  })
})
