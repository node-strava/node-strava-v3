const authenticator = require('./authenticator')
const { httpRequest } = require('../axiosUtility')
const querystring = require('querystring')

const oauth = {}

/**
 * Options for building the OAuth authorization URL.
 * @typedef {Object} GetRequestAccessURLArgs
 * @property {string} [scope] - OAuth scope
 * @property {string} [state] - OAuth state
 * @property {"prompt"|"auto"} [approval_prompt] - OAuth consent: "prompt" (always show) or "auto" (skip if previously authorized). Replaces deprecated "force".
 */

/**
 * Response shape returned when exchanging an authorization code for tokens.
 * @typedef {Object} TokenExchangeResponse
 * @property {string} token_type
 * @property {number} expires_at
 * @property {number} expires_in
 * @property {string} refresh_token
 * @property {string} access_token
 * @property {import('../index').SummaryAthlete} athlete
 */

/**
 * Response shape returned when refreshing an access token.
 * @typedef {Object} TokenRefreshResponse
 * @property {string} token_type
 * @property {number} expires_at
 * @property {number} expires_in
 * @property {string} refresh_token
 * @property {string} access_token
 */

/**
 * Response shape returned from the deauthorize endpoint.
 * Success: may include access_token (revoked). Error (e.g. 401): includes message.
 * @typedef {Object} DeauthorizeResponse
 * @property {string} [access_token] - Access token that was revoked (success)
 * @property {string} [message] - Error message (e.g. 401)
 */

/**
 * Returns the Strava OAuth authorization URL to send the user to.
 * @param {GetRequestAccessURLArgs} [args]
 * @returns {string}
 */
oauth.getRequestAccessURL = function (args) {
  if (!authenticator.getRedirectUri() || !authenticator.getClientId()) {
    throw new Error('The redirect_uri or the client_id was not provided, you must provide both of them!')
  }

  const oauthArgs = /** @type {Record<string, string>} */ ({
    client_id: authenticator.getClientId(),
    redirect_uri: authenticator.getRedirectUri(),
    response_type: 'code'
  })

  if (args && args.scope) oauthArgs.scope = args.scope
  if (args && args.state) oauthArgs.state = args.state
  if (args && args.approval_prompt) oauthArgs.approval_prompt = args.approval_prompt

  const qs = querystring.stringify(oauthArgs)
  return 'https://www.strava.com/oauth/authorize?' + qs
}

/**
 * Implement OAuth Token Exchange.
 *
 * @param {string} authorizationCode - Authorization code from OAuth callback
 * @returns {Promise<TokenExchangeResponse>}
 * @see http://developers.strava.com/docs/authentication/
 */
oauth.getToken = async function (authorizationCode) {
  const options = {
    method: 'POST',
    url: 'https://www.strava.com/oauth/token',
    json: true,
    qs: {
      code: authorizationCode,
      client_secret: authenticator.getClientSecret(),
      client_id: authenticator.getClientId(),
      grant_type: 'authorization_code'
    }
  }

  return /** @type {Promise<TokenExchangeResponse>} */ (httpRequest(options))
}

/**
 * Deauthorizes a user.
 *
 * @param {{access_token: string}} args - Includes the access token to be deauthorized
 * @returns {Promise<DeauthorizeResponse>} Resolves with the deauthorization response
 */
oauth.deauthorize = async function (args) {
  const options = {
    url: 'https://www.strava.com/oauth/deauthorize',
    method: 'POST',
    json: true,
    // We want to consider some 30x responses valid as well
    // 'simple' would only consider 2xx responses successful
    simple: false,
    headers: {
      Authorization: 'Bearer ' + args.access_token
    }
  }

  return /** @type {Promise<DeauthorizeResponse>} */ (httpRequest(options))
}

/**
 * Exchange a refresh token for a new access token.
 * Client ID and secret must be pre-configured.
 *
 * @param {string} refreshToken - Refresh token from initial OAuth exchange
 * @returns {Promise<TokenRefreshResponse>}
 * @see http://developers.strava.com/docs/authentication/#refresh-expired-access-tokens
 */
oauth.refreshToken = async function (refreshToken) {
  const options = {
    url: 'https://www.strava.com/oauth/token',
    method: 'POST',
    json: true,
    simple: true,
    qs: {
      refresh_token: refreshToken,
      client_id: authenticator.getClientId(),
      client_secret: authenticator.getClientSecret(),
      grant_type: 'refresh_token'
    }
  }

  return /** @type {Promise<TokenRefreshResponse>} */ (httpRequest(options))
}

module.exports = oauth
