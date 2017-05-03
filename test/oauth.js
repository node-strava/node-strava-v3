/**
 * Created by austin on 9/22/14.
 */

var should = require('should')
    , authenticator = require('../lib/authenticator')
    , querystring = require('querystring')
    , strava = require('../');

var _tokenExchangeCode = "a248c4c5dc49e71336010022efeb3a268594abb7";

describe('oauth_test', function() {
    describe('#getRequestAccessURL()', function () {
        it('should return the full request access url', function () {
            var clientId = authenticator.getClientId();
            var redirectUri = authenticator.getRedirectUri();
            var targetUrl = 'https://www.strava.com/oauth/authorize?'
                + querystring.stringify({
                  client_id: authenticator.getClientId(),
                  redirect_uri: authenticator.getRedirectUri(),
                  response_type: 'code',
                  scope: 'view_private,write'
                });

            var url = strava.oauth.getRequestAccessURL({
              scope:"view_private,write"
            });

            url.should.be.exactly(targetUrl);
        });
    });

    describe('#deauthorize()', function () {
        it("Should have method deauthorize", function () {
           strava.oauth.should.have.property('deauthorize')
        });

        it("Should return 401 with invalid token", function (done) {
          strava.oauth.deauthorize({ access_token: 'BOOM'}, function (err, payload) {
            (payload).should.have.property('message').eql('Authorization Error')
            done();
          });
        });

        it("Should return 401 with invalid token (Promise API)", function () {
          return strava.oauth.deauthorize({ access_token: 'BOOM'}).
              then(function (payload) {
                (payload).should.have.property('message').eql('Authorization Error')
              });
        });
        // Not sure how to test since we don't have a token that we want to deauthorize
    })

    // TODO: Figure out a way to get a valid oAuth code for the token exchange
    describe.skip('#getToken()', function () {
        it('should return an access_token', function (done) {
            strava.oauth.getToken(_tokenExchangeCode,function(err,payload) {
                done();
            });
        });
    });
});
