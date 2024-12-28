var authenticator = require('./authenticator')

// Ref: https://developers.strava.com/docs/webhooks/

var pushSubscriptions = function (client) {
  this.client = client
}

var _allowedPostProps = [
  'object_type',
  'aspect_type',
  'callback_url',
  'verify_token'
]

pushSubscriptions.prototype.create = function (args) {
  if (typeof args.callback_url === 'undefined') {
    throw new Error('required args missing')
  }

  // The Strava API currently only has one valid value for these,
  // so set them as the default.
  if (args.object_type === undefined) {
    args.object_type = 'activity'
  }

  if (args.aspect_type === undefined) {
    args.aspect_type = 'create'
  }

  args.body = this.client.getRequestBodyObj(_allowedPostProps, args)

  args.body.client_secret = authenticator.getClientSecret()
  args.body.client_id = authenticator.getClientId()

  return this.client._requestHelper({
    headers: { Authorization: null },
    baseUrl: this.baseUrl,
    url: 'push_subscriptions',
    method: 'POST',
    form: args.body
  })
}

pushSubscriptions.prototype.list = function () {
  var qs = this.client.getQS(['client_secret', 'client_id'], {
    client_secret: authenticator.getClientSecret(),
    client_id: authenticator.getClientId()
  })
  return this.client._requestHelper({
    headers: { Authorization: null },
    baseUrl: this.baseUrl,
    url: 'push_subscriptions?' + qs
  })
}

pushSubscriptions.prototype.delete = function (args) {
  // require subscription id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a push subscription id')
  }

  var qs = this.client.getQS(['client_secret', 'client_id'], {
    client_secret: authenticator.getClientSecret(),
    client_id: authenticator.getClientId()
  })

  return this.client._requestHelper({
    headers: { Authorization: null },
    baseUrl: this.baseUrl,
    url: 'push_subscriptions/' + args.id + '?' + qs,
    method: 'DELETE'
  })
}

module.exports = pushSubscriptions
