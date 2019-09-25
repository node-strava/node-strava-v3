/**
 * Created by austin on 9/22/14.
 */

var util = require('./util')
var authenticator = require('./authenticator')
var request = require('request')
var querystring = require('querystring')

var oauth = {}

oauth.endpointBase = "https://www.strava.com/oauth/";

oauth.getRequestAccessURL = function (args) {
  var endpoint = "authorize?";
  var url = this.endpointBase + endpoint,  
  var oauthArgs = {
    client_id: args.client_id || authenticator.getClientId(),
    redirect_uri: args.redirect_uri || authenticator.getRedirectUri(),
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

oauth.exchangeToken = function(args, code, done) {
    var endpoint = "token";
    var tokenArgs = {
        code: code,
        client_secret: args.client_secret || authenticator.getClientSecret(),
        client_id: args.client_id || authenticator.getClientId(),
        grant_type: "authorization_code"
    };
    var options = {
        url: this.endpointBase + endpoint,
        method: "POST",
        json: true,
        body: tokenArgs
    };
    util._requestHelper(options, done);
};

oauth.refreshTokens = function(args, refreshToken, done){
    var endpoint = "token";
    var tokenArgs = {
        refresh_token: refreshToken,
        client_secret: args.client_secret || authenticator.getClientSecret(),
        client_id: args.client_id || authenticator.getClientId(),
        grant_type: "refresh_token"
    };
    var options = {
        url: this.endpointBase + endpoint,
        method: "POST",
        json: true,
        body: tokenArgs
    };
    util._requestHelper(options, done);
};

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

  util._requestHelper(options, done);
}

module.exports = oauth
