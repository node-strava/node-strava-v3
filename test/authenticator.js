
var should = require('should')
    , mockFS = require('mock-fs')
    , authenticator = require('../lib/authenticator');
    var testHelper = require('./_helper')

describe('authenticator_test', function() {
    describe('#getToken()', function() {
        it('should read the access token from the config file', function() {
            mockFS({
                'data/strava_config': JSON.stringify({
                    'access_token': 'abcdefghi',
                    'client_id': 'jklmnopqr',
                    'client_secret': 'stuvwxyz',
                    'redirect_uri': 'https://sample.com'
                })
            });
            delete process.env.STRAVA_ACCESS_TOKEN;
            authenticator.purge();

            (authenticator.getToken()).should.be.exactly('abcdefghi');

            mockFS.restore();
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

    describe('#getClientId()', function() {
        it('should read the client id from the config file', function() {
            mockFS({
                'data/strava_config': JSON.stringify({
                    'access_token': 'abcdefghi',
                    'client_id': 'jklmnopqr',
                    'client_secret': 'stuvwxyz',
                    'redirect_uri': 'https://sample.com'
                })
            });
            delete process.env.STRAVA_CLIENT_ID;
            authenticator.purge();

            (authenticator.getClientId()).should.be.exactly('jklmnopqr');

            mockFS.restore();
            authenticator.purge();
        });

        it('should read the client id from the env vars', function() {
            mockFS({
                'data': {}
            });
            process.env.STRAVA_CLIENT_ID = 'abcdefghi';

            authenticator.purge();

            (authenticator.getClientId()).should.be.exactly('abcdefghi');

            mockFS.restore();
            delete process.env.STRAVA_CLIENT_ID;

            authenticator.purge();
        });
    });

    describe('#getClientSecret()', function() {
        it('should read the client secret from the config file', function() {
            mockFS({
                'data/strava_config': JSON.stringify({
                    'access_token': 'abcdefghi',
                    'client_id': 'jklmnopqr',
                    'client_secret': 'stuvwxyz',
                    'redirect_uri': 'https://sample.com'
                })
            });
            delete process.env.STRAVA_CLIENT_SECRET;
            authenticator.purge();

            (authenticator.getClientSecret()).should.be.exactly('stuvwxyz');

            mockFS.restore();
            authenticator.purge();
        });

        it('should read the client secret from the env vars', function() {
            mockFS({
                'data': {}
            });
            process.env.STRAVA_CLIENT_SECRET = 'abcdefghi';

            authenticator.purge();

            (authenticator.getClientSecret()).should.be.exactly('abcdefghi');

            mockFS.restore();
            delete process.env.STRAVA_CLIENT_SECRET;

            authenticator.purge();
        });
    });

    describe('#getRedirectUri()', function() {
        it('should read the redirect URI from the config file', function() {
            mockFS({
                'data/strava_config': JSON.stringify({
                    'access_token': 'abcdefghi',
                    'client_id': 'jklmnopqr',
                    'client_secret': 'stuvwxyz',
                    'redirect_uri': 'https://sample.com'
                })
            });
            delete process.env.STRAVA_REDIRECT_URI;
            authenticator.purge();

            (authenticator.getRedirectUri()).should.be.exactly('https://sample.com');

            mockFS.restore();
            authenticator.purge();
        });

        it('should read the redirect URI from the env vars', function() {
            mockFS({
                'data': {}
            });
            process.env.STRAVA_REDIRECT_URI = 'https://sample.com';

            authenticator.purge();

            (authenticator.getRedirectUri()).should.be.exactly('https://sample.com');

            mockFS.restore();
            delete process.env.STRAVA_REDIRECT_URI;

            authenticator.purge();
        });
    });
});
