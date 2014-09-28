/**
 * Created by austin on 9/22/14.
 */



var should = require("should")
    , strava = require("../");

var _tokenExchangeCode = "a248c4c5dc49e71336010022efeb3a268594abb7";

describe.skip('oauth_test', function() {

    describe('#getRequestAccessURL()', function () {

        it('should return the full request url for view_private and write permissions', function () {

            var url = strava.oauth.getRequestAccessURL({scope:"view_private write"});
            console.log(url);

        });
    });

    describe('#getToken()', function () {

        it('should return an access_token', function (done) {

            strava.oauth.getToken(_tokenExchangeCode,function(err,payload) {

                done();
            });

        });
    });
});
