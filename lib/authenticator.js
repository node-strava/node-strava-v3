var fs = require('fs');

var configPath = 'data/strava_config';

var token;
var clientId;
var clientSecret;
var redirectUri;

var readConfigFile = function() {
  try {
      var config = fs.readFileSync(configPath, {encoding: 'utf-8'});
      config = JSON.parse(config);
      if(config.access_token) token = config.access_token;
      if(config.client_id) clientId = config.client_id;
      if(config.client_secret) clientSecret = config.client_secret;
      if(config.redirect_uri) redirectUri = config.redirect_uri;
  } catch (err) {
    // Config file does not exist. This may be a valid case if the config is
    // either passed directly as an argument or via environment variables
  }
};

var readEnvironmentVars = function() {
  if(typeof process.env.STRAVA_ACCESS_TOKEN !== 'undefined')
      token = process.env.STRAVA_ACCESS_TOKEN;
  if(typeof process.env.STRAVA_CLIENT_ID !== 'undefined')
      clientId = process.env.STRAVA_CLIENT_ID;
  if(typeof process.env.STRAVA_CLIENT_SECRET !== 'undefined')
      clientSecret = process.env.STRAVA_CLIENT_SECRET;
  if(typeof process.env.STRAVA_REDIRECT_URI !== 'undefined')
      redirectUri = process.env.STRAVA_REDIRECT_URI;
};

var fetchConfig = function() {
  readConfigFile();
  readEnvironmentVars();
};

module.exports = {
    getToken: function() {
        if(!token) {
          fetchConfig();
        }

        if(token) {
          return token;
        } else {
          return undefined;
        }
    },
    getClientId: function() {
        if(!clientId) {
            fetchConfig();
        }

        if(clientId) {
          return clientId;
        } else {
          console.log('No client id found');
          return undefined;
        }
    },
    getClientSecret: function() {
        if(!clientSecret) {
            fetchConfig();
        }

        if(clientSecret) {
            return clientSecret;
        } else {
            console.log('No client secret found');
            return undefined;
        }
    },
    getRedirectUri: function() {
        if(!redirectUri) {
            fetchConfig();
        }

        if(redirectUri) {
            return redirectUri;
        } else {
            console.log('No redirectUri found');
            return undefined;
        }
    },
    purge: function() {
      token = undefined;
      clientId = undefined;
      clientSecret = undefined;
      redirectUri = undefined;
    }
};
