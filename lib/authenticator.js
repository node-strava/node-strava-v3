var fs = require('fs')

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
      if(config.client_id) clientId = config.clientId;
      if(config.client_secret) clientSecret = config.clientSecret;
      if(config.redirect_uri) redirectUri = config.redirect_uri;
  } catch (err) {
    // Config file does not exist. This may be a valid case if the config is
    // either passed directly as an argument or via environment variables
  }
}

var readEnvironmentVars = function() {
  if(process.env.STRAVA_ACCESS_TOKEN) token = process.env.STRAVA_ACCESS_TOKEN;
  if(process.env.STRAVA_CLIENT_SECRET) clientId = process.env.STRAVA_CLIENT_SECRET;
  if(process.env.STRAVA_CLIENT_ID) clientId = process.env.STRAVA_CLIENT_ID;
  if(process.env.STRAVA_REDIRECT_URI) redirectUri = process.env.STRAVA_REDIRECT_URI;
}

var fetchToken = function() {
  readConfigFile();
  readEnvironmentVars();
}

module.exports = {
    getToken: function() {
        if(!token) {
          fetchToken();
        }

        if(token) {
          return token;
        } else {
          console.log('No logon token found')
          return undefined;
        }
    }
};
