/**
 * Created by austin on 9/18/14.
 */

var request = require('request')
var querystring = require('querystring')
var fs = require('fs')
var authenticator = require('./authenticator')

// request.debug = true

var util = {}
util.rateLimit = 'x-ratelimit-limit'
util.rateUsage = 'x-ratelimit-usage'
util.endpointBase = 'https://www.strava.com/api/v3/'

//= ==== generic GET =====
util.getEndpoint = function (endpoint, args, done) {
  if (!args) {
    args = {}
  }

  var token = args.access_token || authenticator.getToken()
  if (!token) return done({ msg: 'you must include an access_token' })

  var url = this.endpointBase + endpoint
  var options = {
    url: url,
    json: true,
    headers: {
      Authorization: 'Bearer ' + token
    }
  }

  _requestHelper(options, done)
}

//= ==== generic PUT =====
util.putEndpoint = function (endpoint, args, done) {
  if (!args) {
    args = {}
  }

  var token = args.access_token || authenticator.getToken()
  if (!token) return done({ msg: 'you must include an access_token' })

  // stringify the body object for passage
  var qs = querystring.stringify(args.body)

  var url = this.endpointBase + endpoint
  var options = {
    url: url,
    method: 'PUT',
    json: true,
    body: qs,
    headers: {
      Authorization: 'Bearer ' + token
    }
  }

  // add form data if present
  if (args.form) { options.form = args.form }

  _requestHelper(options, done)
}

//= ==== generic POST =====
util.postEndpoint = function (endpoint, args, done) {
  if (!args) {
    args = {}
  }

  var token = args.access_token || authenticator.getToken()
  if (!token) return done({ msg: 'you must include an access_token' })

  // stringify the body object for passage
  // var qs = querystring.stringify(args.body);

  var url = this.endpointBase + endpoint
  var options = {
    url: url,
    method: 'POST',
    json: true,
    body: args.body,
    headers: {
      Authorization: 'Bearer ' + token
    }
  }

  // add form data if present
  if (args.form) { options.form = args.form }

  // add multipart data if present
  if (args.multipart) { options.multipart = args.multipart }

  _requestHelper(options, done)
}

//= ==== generic DELETE =====
util.deleteEndpoint = function (endpoint, args, done) {
  if (!args) {
    args = {}
  }

  var token = args.access_token || authenticator.getToken()
  if (!token) return done({ msg: 'you must include an access_token' })

  // stringify the body object for passage
  var qs = querystring.stringify(args.body)

  var url = this.endpointBase + endpoint
  var options = {
    url: url,
    method: 'DELETE',
    json: true,
    body: qs,
    headers: {
      Authorization: 'Bearer ' + token
    }
  }

  _requestHelper(options, done)
}

//= ==== postUpload =====
util.postUpload = function (args, done) {
  var token = args.access_token || authenticator.getToken()
  if (!token) return done({ msg: 'you must include an access_token' })

  var url = this.endpointBase + 'uploads'
  var options = {
    url: url,
    method: 'POST',
    json: true,
    headers: {
      Authorization: 'Bearer ' + token
    }
  }

  var req = request.post(options, function (err, httpResponse, payload) {
    done(err, payload)
  })

  var form = req.form()

  // append the rest of the formData values
  for (var key in args.formData) {
    form.append(key, args.formData[key])
  }
  form.append('file', fs.createReadStream(args.file))
}

//= ==== get pagination query string =====
util.getPaginationQS = function (args) {
  // setup pagination query args
  var page = typeof args.page !== 'undefined' ? args.page : null
  /* eslint-disable-next-line */
  var per_page = typeof args.per_page !== 'undefined' ? args.per_page : null
  var qa = {}
  var qs

  if (page) { qa.page = page }
  /* eslint-disable-next-line */
  if (per_page !== null) { qa.per_page = per_page }

  qs = querystring.stringify(qa)

  return qs
}
//= ==== generic get query string =====
util.getQS = function (allowedProps, args) {
  var qa = {}
  var qs

  for (var i = 0; i < allowedProps.length; i++) {
    if (args.hasOwnProperty(allowedProps[i])) { qa[allowedProps[i]] = args[allowedProps[i]] }
  }

  qs = querystring.stringify(qa)
  return qs
}

//= ==== get request body object =====
util.getRequestBodyObj = function (allowedProps, args) {
  var body = {}

  for (var i = 0; i < allowedProps.length; i++) {
    if (args.hasOwnProperty(allowedProps[i])) { body[allowedProps[i]] = args[allowedProps[i]] }
  }

  return body
}

//= ==== helpers =====
util._requestHelper = function (options, done) {
  request(options, function (err, response, payload) {
    if (err) {
      console.log('api call error')
      console.log(err)
    }

    done(err, payload, parseRateLimits(response.headers))
  })
}

function parseRateLimits (headers) {
  if (!headers[util.rateLimit] || !headers[util.rateUsage]) {
    return null
  }

  var limit = headers[util.rateLimit].split(',')
  var usage = headers[util.rateUsage].split(',')
  var radix = 10

  return {
    shortTermUsage: parseInt(usage[0], radix),
    shortTermLimit: parseInt(limit[0], radix),
    longTermUsage: parseInt(usage[1], radix),
    longTermLimit: parseInt(limit[1], radix)
  }
}
//= ==== helpers =====

module.exports = util
