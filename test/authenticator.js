
var should = require('should')
    , mockFS = require('mock-fs')
    , authenticator = require('../lib/authenticator');
    var testHelper = require('./_helper')

describe('authenticator_test', function() {
    describe('getToken()', function() {
        it('should read the access token from the config file', function() {
            mockFS({
                'data/strava_config': JSON.stringify({
                    'access_token': 'abcdefghi',
                    'client_id': 'jklmnopqr',
                    'client_secret': 'stuvwxyz',
                    'redirect_uri': 'https://sample.com'
                })
            });
            var envAccessToken = process.env.access_token;
            delete process.env.STRAVA_ACCESS_TOKEN;

            authenticator.purge();

            (authenticator.getToken()).should.be.exactly('abcdefghi');

            mockFS.restore();
            process.env.STRAVA_ACCESS_TOKEN = envAccessToken;

            authenticator.purge();
        });

        it('should read the access token from the env vars', function() {
            mockFS({
                'data': {}
            });
            process.env.STRAVA_ACCESS_TOKEN = 'abcdefghi';

            authenticator.purge();

            (authenticator.getToken()).should.be.exactly('abcdefghi');

            mockFS.restore();
            delete process.env.STRAVA_ACCESS_TOKEN;

            authenticator.purge();
        });
    });
});
