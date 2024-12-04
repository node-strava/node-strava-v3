/* eslint camelcase: 0 */
const JSONbig = require('json-bigint')
const querystring = require('querystring')
const fs = require('fs')
const rateLimiting = require('./rateLimiting')

// request.debug = true

var HttpClient = function (request) {
  this.request = request
}

//= ==== generic GET =====
HttpClient.prototype.getEndpoint = async function (endpoint, args) {
  if (!args) {
    args = {}
  }

  var options = { url: endpoint }

  if (args.access_token) {
    options.headers = { Authorization: 'Bearer ' + args.access_token }
  }

  return this._requestHelper(options)
}

//= ==== generic PUT =====
HttpClient.prototype.putEndpoint = async function (endpoint, args) {
  if (!args) {
    args = {}
  }

  // stringify the body object for passage
  let qs = querystring.stringify(args.body)

  const options = {
    url: endpoint,
    method: 'PUT',
    body: qs
  }

  if (args.access_token) {
    options.headers = { Authorization: 'Bearer ' + args.access_token }
  }

  // add form data if present
  if (args.form) { options.form = args.form }

  return this._requestHelper(options)
}

//= ==== generic POST =====
HttpClient.prototype.postEndpoint = async function (endpoint, args) {
  if (!args) {
    args = {}
  }

  var options = {
    url: endpoint,
    method: 'POST',
    body: args.body
  }

  if (args.access_token) {
    options.headers = { Authorization: 'Bearer ' + args.access_token }
  }

  // add form data if present
  if (args.form) { options.form = args.form }

  // add multipart data if present
  if (args.multipart) { options.multipart = args.multipart }

  return this._requestHelper(options)
}

//= ==== generic DELETE =====
HttpClient.prototype.deleteEndpoint = async function (endpoint, args) {
  if (!args) {
    args = {}
  }

  // stringify the body object for passage
  const qs = querystring.stringify(args.body)

  var options = {
    url: endpoint,
    method: 'DELETE',
    body: qs
  }

  if (args.access_token) {
    options.headers = { Authorization: 'Bearer ' + args.access_token }
  }

  return this._requestHelper(options)
}

//= ==== postUpload =====
HttpClient.prototype.postUpload = async function (args = {}) {
  var options = {
    url: 'uploads',
    method: 'POST',
    formData: {
      ...args.formData,
      file: fs.createReadStream(args.file)
    }
  }

  if (args.access_token) {
    options.headers = { Authorization: 'Bearer ' + args.access_token }
  }

  return this.request.post(options)
}

//= ==== get pagination query string =====
HttpClient.prototype.getPaginationQS = function (args) {
  // setup pagination query args
  var page = typeof args.page !== 'undefined' ? args.page : null
  // eslint-disable-next-line camelcase
  var per_page = typeof args.per_page !== 'undefined' ? args.per_page : null
  var qa = {}
  var qs

  if (page) { qa.page = page }
  // eslint-disable-next-line camelcase
  if (per_page !== null) { qa.per_page = per_page }

  qs = querystring.stringify(qa)

  return qs
}
//= ==== generic get query string =====
HttpClient.prototype.getQS = function (allowedProps, args) {
  var qa = {}
  var qs

  for (var i = 0; i < allowedProps.length; i++) {
    if (args.hasOwnProperty(allowedProps[i])) { qa[allowedProps[i]] = args[allowedProps[i]] }
  }

  qs = querystring.stringify(qa)
  return qs
}

//= ==== get request body object =====
HttpClient.prototype.getRequestBodyObj = function (allowedProps, args) {
  var body = {}

  for (var i = 0; i < allowedProps.length; i++) {
    if (args.hasOwnProperty(allowedProps[i])) { body[allowedProps[i]] = args[allowedProps[i]] }
  }

  return body
}

//= ==== helpers =====
HttpClient.prototype._requestHelper = async function (options) {
  // We need the full response so we can get at the headers
  options.resolveWithFullResponse = true

  // reject promise with 'StatusCodeError' for non-2xx responses.
  // This would include 3xx redirects and 304 Request-Not-Modified,
  // Neither of which the Strava API is expected to return.
  options.simple = true

  try {
    const response = await this.request(options)
  
    // Update rate limits using headers from the successful response
    rateLimiting.updateRateLimits(response.headers)
  
    // Return the parsed response body
    return JSONbig.parse(response.body)
  } catch (e) {
    // If the error includes a response, update the rate limits using its headers
    if (e.response && e.response.headers) {
      rateLimiting.updateRateLimits(e.response.headers)
    }
  
    // Re-throw the error to ensure it's handled elsewhere
    throw e
  }
}

//= ==== helpers =====

module.exports = HttpClient
