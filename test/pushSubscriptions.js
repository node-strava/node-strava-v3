'use strict'
const nock = require('nock')
const assert = require('assert')
const querystring = require('querystring')
const strava = require('../')

describe('pushSubscriptions_test', function () {
  beforeEach(function () {
    process.env.STRAVA_CLIENT_ID = 'test-client-id'
    process.env.STRAVA_CLIENT_SECRET = 'test-client-secret'
  })

  afterEach(function () {
    delete process.env.STRAVA_CLIENT_ID
    delete process.env.STRAVA_CLIENT_SECRET
    nock.cleanAll()
  })

  describe('#list()', function () {
    it('should not sent Authorization header to Strava', async () => {
      nock('https://www.strava.com')
        .get('/api/v3/push_subscriptions')
        .query(true)
        .once()
        .reply(200, function () {
          return { headers: this.req.headers }
        })

      const result = await strava.pushSubscriptions.list()
      assert.ok(!result.headers.authorization)
    })

    it('should return list of subscriptions', async () => {
      nock('https://www.strava.com')
        .get('/api/v3/push_subscriptions')
        .query(true)
        .once()
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

      const result = await strava.pushSubscriptions.list()
      assert.deepStrictEqual(result, [
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

  describe('#create({callback_url:...})', function () {
    it('should reject with no params', async () => {
      await assert.rejects(
        () => strava.pushSubscriptions.create({}),
        { message: 'required args missing: callback_url and verify_token are required' }
      )
    })

    it('should not sent Authorization header to Strava', async () => {
      nock('https://www.strava.com')
        .post('/api/v3/push_subscriptions')
        .once()
        .reply(200, function () {
          return { headers: this.req.headers }
        })

      const result = await strava.pushSubscriptions.create({
        'callback_url': 'http://you.com/callback/',
        'verify_token': 'node-strava-v3'
      })
      assert.ok(!result.headers.authorization)
    })

    it('should return details of created activity', async () => {
      nock('https://www.strava.com')
        .post('/api/v3/push_subscriptions')
        .once()
        .reply(200, {
          'id': 1,
          'object_type': 'activity',
          'aspect_type': 'create',
          'callback_url': 'http://you.com/callback/',
          'created_at': '2015-04-29T18:11:09.400558047-07:00',
          'updated_at': '2015-04-29T18:11:09.400558047-07:00'
        })

      const result = await strava.pushSubscriptions.create({
        'callback_url': 'http://you.com/callback/',
        'verify_token': 'node-strava-v3'
      })
      assert.deepStrictEqual(result, {
        'id': 1,
        'object_type': 'activity',
        'aspect_type': 'create',
        'callback_url': 'http://you.com/callback/',
        'created_at': '2015-04-29T18:11:09.400558047-07:00',
        'updated_at': '2015-04-29T18:11:09.400558047-07:00'
      })
    })

    it('should send the subscription payload in the request body', async () => {
      let sentBody

      nock('https://www.strava.com')
        .post('/api/v3/push_subscriptions')
        .once()
        .reply(function (uri, body) {
          sentBody = body
          return [200, { id: 1 }]
        })

      await strava.pushSubscriptions.create({
        'callback_url': 'http://you.com/callback/',
        'verify_token': 'node-strava-v3'
      })

      const sent = querystring.parse(sentBody)
      assert.strictEqual(sent.object_type, 'activity')
      assert.strictEqual(sent.aspect_type, 'create')
      assert.strictEqual(sent.callback_url, 'http://you.com/callback/')
      assert.strictEqual(sent.verify_token, 'node-strava-v3')
      assert.ok(sent.client_id, 'client_id should be sent')
      assert.ok(sent.client_secret, 'client_secret should be sent')
    })
  })

  describe('#delete({id:...})', function () {
    it('should reject with no id', async () => {
      await assert.rejects(
        () => strava.pushSubscriptions.delete({}),
        { message: 'args must include a push subscription id' }
      )
    })

    it('should not sent Authorization header to Strava', async () => {
      nock('https://www.strava.com')
        .delete('/api/v3/push_subscriptions/1')
        .query(true) // Accept any query parameters
        .once()
        .reply(200, function () {
          return { headers: this.req.headers }
        })

      const result = await strava.pushSubscriptions.delete({ id: 1 })
      assert.ok(!result.headers.authorization)
    })

    it('Should return 204 after successful delete', async () => {
      // The status is not normally returned in the body.
      // We return it here because the test can't easily access the HTTP status code.
      nock('https://www.strava.com')
        .delete('/api/v3/push_subscriptions/1')
        .query(true) // Accept any query parameters
        .once()
        .reply(204, { status: 204 })

      const result = await strava.pushSubscriptions.delete({ id: 1 })
      assert.deepStrictEqual(result, { status: 204 })
    })
  })
})
