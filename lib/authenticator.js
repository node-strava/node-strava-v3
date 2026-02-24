var fs = require('fs')

var configPath = 'data/strava_config'

/** @type {string | undefined} */
var token
/** @type {string | undefined} */
var clientId
/** @type {string | undefined} */
var clientSecret
/** @type {string | undefined} */
var redirectUri
/** @type {boolean} */
var configLoaded = false

/**
 * Config object for Strava credentials (file, env, or passed directly).
 * @typedef {{
 *   access_token?: string;
 *   client_id?: string;
 *   client_secret?: string;
 *   redirect_uri?: string;
 * }} StravaConfig
 */

/**
 * Reads config from the config file and populates module-level credentials.
 * @returns {void}
 */
var readConfigFile = function () {
  try {
    var configStr = fs.readFileSync(configPath, { encoding: 'utf-8' })
    var config = /** @type {StravaConfig} */ (JSON.parse(configStr))
    if (config.access_token) token = config.access_token
    if (config.client_id) clientId = config.client_id
    if (config.client_secret) clientSecret = config.client_secret
    if (config.redirect_uri) redirectUri = config.redirect_uri
  } catch {
    // Config file does not exist. This may be a valid case if the config is
    // either passed directly as an argument or via environment variables
  }
}

/**
 * Reads config from environment variables and populates module-level credentials.
 * @returns {void}
 */
var readEnvironmentVars = function () {
  if (typeof process.env.STRAVA_ACCESS_TOKEN !== 'undefined') { token = process.env.STRAVA_ACCESS_TOKEN }
  if (typeof process.env.STRAVA_CLIENT_ID !== 'undefined') { clientId = process.env.STRAVA_CLIENT_ID }
  if (typeof process.env.STRAVA_CLIENT_SECRET !== 'undefined') { clientSecret = process.env.STRAVA_CLIENT_SECRET }
  if (typeof process.env.STRAVA_REDIRECT_URI !== 'undefined') { redirectUri = process.env.STRAVA_REDIRECT_URI }
}

/**
 * Loads config from the given object, or from file and env if config is omitted.
 * @param {StravaConfig} [config] - Optional config object.
 * @returns {void}
 */
var fetchConfig = function (config) {
  if (config) {
    if (config.access_token) token = config.access_token
    if (config.client_id) clientId = config.client_id
    if (config.client_secret) clientSecret = config.client_secret
    if (config.redirect_uri) redirectUri = config.redirect_uri
  } else {
    readConfigFile()
    readEnvironmentVars()
  }
  configLoaded = true
}

/**
 * Authenticator module interface (fetchConfig, getToken, getClientId, etc.).
 * @typedef {{
 *   fetchConfig: (config?: StravaConfig) => void;
 *   getToken: () => string | undefined;
 *   getClientId: () => string | undefined;
 *   getClientSecret: () => string | undefined;
 *   getRedirectUri: () => string | undefined;
 *   purge: () => void;
 * }} Authenticator
 */

/** @type {Authenticator} */
module.exports = {
  fetchConfig: fetchConfig,
  /**
   * Returns the current access token (loads config if needed).
   * @returns {string | undefined}
   */
  getToken: function () {
    if (!configLoaded) {
      fetchConfig()
    }

    if (token) {
      return token
    } else {
      return undefined
    }
  },
  /**
   * Returns the Strava application client ID.
   * @returns {string | undefined}
   */
  getClientId: function () {
    if (!configLoaded) {
      fetchConfig()
    }

    if (clientId) {
      return clientId
    } else {
      console.log('No client id found')
      return undefined
    }
  },
  /**
   * Returns the Strava application client secret.
   * @returns {string | undefined}
   */
  getClientSecret: function () {
    if (!configLoaded) {
      fetchConfig()
    }

    if (clientSecret) {
      return clientSecret
    } else {
      console.log('No client secret found')
      return undefined
    }
  },
  /**
   * Returns the OAuth redirect URI.
   * @returns {string | undefined}
   */
  getRedirectUri: function () {
    if (!configLoaded) {
      fetchConfig()
    }

    if (redirectUri) {
      return redirectUri
    } else {
      console.log('No redirectUri found')
      return undefined
    }
  },
  /**
   * Clears all in-memory config (token, client id/secret, redirect URI).
   * @returns {void}
   */
  purge: function () {
    token = undefined
    clientId = undefined
    clientSecret = undefined
    redirectUri = undefined
    configLoaded = false
  }
}
