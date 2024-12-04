const authenticator = require('./authenticator')
const { httpRequest } = require('../axiosUtility')
const querystring = require('querystring')

const oauth = {}

oauth.getRequestAccessURL = function (args) {
  if (!authenticator.getRedirectUri() || !authenticator.getClientId()) {
    throw new Error('The redirect_uri or the client_id was not provided, you must provide both of them!')
  }

  var url = 'https://www.strava.com/oauth/authorize?'
  var oauthArgs = {
    client_id: authenticator.getClientId(),
    redirect_uri: authenticator.getRedirectUri(),
    response_type: 'code'
  }

  if (args.scope) { oauthArgs.scope = args.scope }
  if (args.state) { oauthArgs.state = args.state }
  if (args.approval_prompt) { oauthArgs.approval_prompt = args.approval_prompt }

  var qs = querystring.stringify(oauthArgs)

  url += qs
  return url
}

/*
 *  oauth.getToken(authorization_code)
 *
 *  Implement OAuth Token Exchange.
 *
 *  Example Response:
 *
 *  {
 *     "token_type": "Bearer",
 *     "access_token": "987654321234567898765432123456789",
 *     "athlete": {
 *       #{summary athlete representation}
 *     },
 *     "refresh_token": "1234567898765432112345678987654321",
 *     "expires_at": 1531378346,
 *     "state": "STRAVA"
 *   }
 *
 *  Ref: http://developers.strava.com/docs/authentication/
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

  return await httpRequest(options)
}

/**
 * Deauthorizes a user
 * @param {Object} args - Includes the access token to be deauthorized
 * @returns {Promise} - Resolves with the deauthorization response
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

  return await httpRequest(options)
}

/**
 *
 *    oauth.refreshToken(refreshToken)
 *
 * Returns a promise. (Callback API is not supported)
 *
 * client ID and secret must be pre-configured.
 *
 * Exchange a refresh token for a new access token
 * Structure returned from Strava looks like:
 *
 * {
 *    "access_token": "38c8348fc7f988c39d6f19cf8ffb17ab05322152",
 *    "expires_at": 1568757689,
 *    "expires_in": 21432,
 *    "refresh_token": "583809f59f585bdb5363a4eb2a0ac19562d73f05",
 *    "token_type": "Bearer"
 *  }
 *  Ref: http://developers.strava.com/docs/authentication/#refresh-expired-access-tokens
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

  return await httpRequest(options)
}

module.exports = oauth
