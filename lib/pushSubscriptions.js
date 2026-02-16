var authenticator = require('./authenticator')

// Ref: https://developers.strava.com/docs/webhooks/

/**
 * @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient
 * @typedef {import('../index').ListPushSubscriptionResponse} ListPushSubscriptionResponse
 * @typedef {import('../index').CreatePushSubscriptionResponse} CreatePushSubscriptionResponse
 */

/**
 * Args for create push subscription. callback_url and verify_token required per Strava API; object_type and aspect_type default to 'activity' and 'create'.
 * @typedef {Object} CreatePushSubscriptionArgs
 * @property {string} callback_url - Required. Address where webhook events will be sent (max 255 chars).
 * @property {string} verify_token - Required. String chosen by the app for client security; echoed in Strava's validation GET.
 * @property {string} [object_type]
 * @property {string} [aspect_type]
 * @property {Record<string, string|number|boolean>} [body] - Populated internally from other args; do not set when calling.
 */

/**
 * Args for delete push subscription.
 * @typedef {Object} DeletePushSubscriptionArgs
 * @property {string|number} id - Push subscription id
 */

/**
 * Push (webhook) subscriptions API client; uses app client credentials, not user OAuth.
 * @param {StravaRouteClient} client - HTTP client instance for Strava API requests
 * @this {{ client: StravaRouteClient; baseUrl?: string }}
 */
var pushSubscriptions = function (client) {
  this.client = client
}

/** @type {string[]} */
var _allowedPostProps = [
  'object_type',
  'aspect_type',
  'callback_url',
  'verify_token'
]

/**
 * Returns client credentials for push subscription API calls; throws if not configured.
 * @returns {{ clientSecret: string, clientId: string }}
 */
function _requireClientCredentials () {
  var clientSecret = authenticator.getClientSecret()
  var clientId = authenticator.getClientId()
  if (clientSecret == null || clientSecret === '') {
    throw new Error('Strava client_secret is not configured; set it before calling push subscription APIs')
  }
  if (clientId == null || clientId === '') {
    throw new Error('Strava client_id is not configured; set it before calling push subscription APIs')
  }
  return { clientSecret, clientId }
}

/**
 * Create a push subscription.
 * @this {{ client: StravaRouteClient; baseUrl?: string }}
 * @param {CreatePushSubscriptionArgs} args
 * @returns {Promise<CreatePushSubscriptionResponse>}
 */
pushSubscriptions.prototype.create = async function (args) {
  if (typeof args.callback_url === 'undefined' || typeof args.verify_token === 'undefined') {
    throw new Error('required args missing: callback_url and verify_token are required')
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

  var credentials = _requireClientCredentials()
  args.body.client_secret = credentials.clientSecret
  args.body.client_id = credentials.clientId

  return await /** @type {Promise<CreatePushSubscriptionResponse>} */ (this.client._requestHelper({
    headers: { Authorization: null },
    baseUrl: this.baseUrl,
    url: 'push_subscriptions',
    method: 'POST',
    form: args.body
  }))
}

/**
 * List push subscriptions for the application.
 * @this {{ client: StravaRouteClient; baseUrl?: string }}
 * @returns {Promise<ListPushSubscriptionResponse[]>}
 */
pushSubscriptions.prototype.list = function () {
  var credentials = _requireClientCredentials()
  var qs = this.client.getQS(['client_secret', 'client_id'], {
    client_secret: credentials.clientSecret,
    client_id: credentials.clientId
  })
  return /** @type {Promise<ListPushSubscriptionResponse[]>} */ (this.client._requestHelper({
    headers: { Authorization: null },
    baseUrl: this.baseUrl,
    url: 'push_subscriptions?' + qs
  }))
}

/**
 * Delete a push subscription.
 * @this {{ client: StravaRouteClient; baseUrl?: string }}
 * @param {DeletePushSubscriptionArgs} args
 * @returns {Promise<void>}
 */
pushSubscriptions.prototype.delete = async function (args) {
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a push subscription id')
  }

  var credentials = _requireClientCredentials()
  var qs = this.client.getQS(['client_secret', 'client_id'], {
    client_secret: credentials.clientSecret,
    client_id: credentials.clientId
  })

  return await /** @type {Promise<void>} */ (/** @type {unknown} */ (this.client._requestHelper({
    headers: { Authorization: null },
    baseUrl: this.baseUrl,
    url: 'push_subscriptions/' + args.id + '?' + qs,
    method: 'DELETE'
  })))
}

module.exports = pushSubscriptions
