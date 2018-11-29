/**
 * Created by austin on 9/22/14.
 */

var util = require('./util')

var authenticator = require('./authenticator')

var request = require('request')

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
  var endpoint = 'oauth/token'

  var args = {}

  var form = {
    code: code,
    client_secret: authenticator.getClientSecret(),
    client_id: authenticator.getClientId()
  }

  args.form = form
  util.postEndpoint(endpoint, args, done)
}

oauth.deauthorize = function (args, done) {
  var endpoint = 'https://www.strava.com/oauth/deauthorize'

  var url = endpoint

  var options = {
    url: url,
    method: 'POST',
    json: true,
    headers: {
      Authorization: 'Bearer ' + args.access_token
    }
  }

  request(options, function (err, response, payload) {
    if (!err) {
      // console.log(payload);
    } else {
      console.log('api call error')
      console.log(err)
    }

    done(err, payload)
  })
}

module.exports = oauth
