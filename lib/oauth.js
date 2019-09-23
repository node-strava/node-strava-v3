var authenticator = require('./authenticator')
var Promise = require('bluebird')
var request = require('request-promise')
var querystring = require('querystring')

var oauth = {}

oauth.getRequestAccessURL = function (args) {
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

oauth.getToken = function (code, done) {
  return request({
    method: 'POST',
    url: 'https://www.strava.com/api/v3/oauth/token',
    json: true,
    form: {
      code: code,
      client_secret: authenticator.getClientSecret(),
      client_id: authenticator.getClientId()
    }
  }, done)
}

oauth.deauthorize = function (args, done) {
  var endpoint = 'https://www.strava.com/oauth/deauthorize'

  var url = endpoint
  var options = {
    url: url,
    method: 'POST',
    json: true,
    // We want to consider some 30x responses valid as well
    // 'simple' would only consider 2xx responses successful
    simple: false,
    headers: {
      Authorization: 'Bearer ' + args.access_token
    }
  }

  // Promise.resolve is used to convert the promise returned
  // to a Bluebird promise
  // asCallback is used to support both Promise and callback-based APIs
  return Promise.resolve(request(options)).asCallback(done)
}

module.exports = oauth
