/* eslint camelcase: 0 */
const JSONbig = require('json-bigint')
const querystring = require('querystring')
const path = require('path')
const fsPromises = require('fs').promises
const rateLimiting = require('./rateLimiting')

/**
 * Options passed to the underlying HTTP request (e.g. axios).
 * @typedef {Object} RequestOptions
 * @property {string} url
 * @property {string} [method]
 * @property {unknown} [body]
 * @property {Record<string, string|null|undefined>} [headers]
 * @property {string | undefined} [baseUrl]
 * @property {string} [responseType]
 * @property {boolean} [resolveWithFullResponse]
 * @property {boolean} [simple]
 * @property {Record<string, unknown>} [form]
 * @property {unknown} [multipart]
 */

/**
 * Full response when resolveWithFullResponse is true.
 * @typedef {Object} FullResponse
 * @property {Record<string, string|string[]|undefined>} headers
 * @property {unknown} [body]
 */

/**
 * Type for the underlying request function used by HttpClient.
 * @typedef {(options: RequestOptions) => Promise<FullResponse|string|object>} RequestFunction
 */

/**
 * Common args for GET endpoint calls.
 * @typedef {Object} GetEndpointArgs
 * @property {string | undefined} [access_token]
 * @property {string} [responseType]
 */

/**
 * Args for PUT endpoint calls (body is stringified as form).
 * @typedef {Object} PutEndpointArgs
 * @property {string} [access_token]
 * @property {string} [responseType]
 * @property {Record<string, string|number|boolean>} [body]
 * @property {Record<string, unknown>} [form]
 */

/**
 * Args for POST endpoint calls.
 * @typedef {Object} PostEndpointArgs
 * @property {string} [access_token]
 * @property {string} [responseType]
 * @property {unknown} [body]
 * @property {Record<string, unknown>} [form]
 * @property {unknown} [multipart]
 */

/**
 * Args for DELETE endpoint calls.
 * @typedef {Object} DeleteEndpointArgs
 * @property {string} [access_token]
 * @property {string} [responseType]
 * @property {Record<string, string|number|boolean>} [body]
 */

/**
 * Args for postUpload (file upload).
 * @typedef {Object} PostUploadArgs
 * @property {string} [access_token]
 * @property {Record<string, unknown>} [formData]
 * @property {string} [file] - File path to upload (e.g., 'data/your_file.gpx')
 */

/**
 * Pagination query args (deprecated for activity list endpoints; use CursorPaginationArgs).
 * @typedef {Object} PaginationArgs
 * @property {number} [page]
 * @property {number} [per_page]
 */

/**
 * Cursor-based pagination query args (page_size, after_cursor).
 * @typedef {Object} CursorPaginationArgs
 * @property {number} [page_size]
 * @property {string} [after_cursor]
 */

/**
 * Response shape returned by the uploads API.
 * @typedef {{ id: string, id_str?: string, external_id?: string, error?: string, status?: string, activity_id?: string }} UploadResponse
 */

/**
 * Client interface for route modules: the set of HttpClient methods they use.
 * @typedef {Object} StravaRouteClient
 * @property {(endpoint: string, args?: GetEndpointArgs) => Promise<object|string>} getEndpoint
 * @property {(endpoint: string, args?: PutEndpointArgs) => Promise<object|string>} putEndpoint
 * @property {(endpoint: string, args?: PostEndpointArgs) => Promise<object|string>} postEndpoint
 * @property {(endpoint: string, args?: DeleteEndpointArgs) => Promise<object|string>} deleteEndpoint
 * @property {(args?: PostUploadArgs) => Promise<UploadResponse>} postUpload
 * @property {(args?: object) => string} getPaginationQS
 * @property {(args?: CursorPaginationArgs) => string} getCursorPaginationQS
 * @property {(allowedProps: string[], args?: object) => string} getQS
 * @property {(allowedProps: string[], args?: object) => Record<string, string|number|boolean>} getRequestBodyObj
 * @property {(options: RequestOptions) => Promise<object|string>} _requestHelper
 */

/**
 * HTTP client that wraps a request function for Strava API calls.
 * @param {RequestFunction} request
 */
var HttpClient = function (request) {
  this.request = request
}

/**
 * Performs a GET request to the Strava API.
 * Only Promises are supported; callback-style usage is not supported.
 *
 * @param {string} endpoint
 * @param {GetEndpointArgs} [args]
 * @returns {Promise<object|string>}
 */
HttpClient.prototype.getEndpoint = async function (endpoint, args) {
  if (!args) {
    args = {}
  }

  /** @type {RequestOptions} */
  var options = {
    url: endpoint,
    responseType: args.responseType || 'json'
  }

  if (args.access_token) {
    options.headers = { Authorization: 'Bearer ' + args.access_token }
  }

  return this._requestHelper(options)
}

/**
 * Performs a PUT request to the Strava API.
 * Only Promises are supported; callback-style usage is not supported.
 *
 * @param {string} endpoint
 * @param {PutEndpointArgs} [args]
 * @returns {Promise<object|string>}
 */
HttpClient.prototype.putEndpoint = async function (endpoint, args) {
  if (!args) {
    args = {}
  }

  // stringify the body object for passage
  let qs = querystring.stringify(args.body || {})

  /** @type {RequestOptions} */
  const options = {
    url: endpoint,
    method: 'PUT',
    body: qs,
    responseType: args.responseType || 'json'
  }

  if (args.access_token) {
    options.headers = { Authorization: 'Bearer ' + args.access_token }
  }

  // add form data if present
  if (args.form) { options.form = args.form }

  return this._requestHelper(options)
}

/**
 * Performs a POST request to the Strava API.
 * Only Promises are supported; callback-style usage is not supported.
 *
 * @param {string} endpoint
 * @param {PostEndpointArgs} [args]
 * @returns {Promise<object|string>}
 */
HttpClient.prototype.postEndpoint = async function (endpoint, args) {
  if (!args) {
    args = {}
  }

  /** @type {RequestOptions} */
  var options = {
    url: endpoint,
    method: 'POST',
    body: args.body,
    responseType: args.responseType || 'json'
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

/**
 * Performs a DELETE request to the Strava API.
 * Only Promises are supported; callback-style usage is not supported.
 *
 * @param {string} endpoint
 * @param {DeleteEndpointArgs} [args]
 * @returns {Promise<object|string>}
 */
HttpClient.prototype.deleteEndpoint = async function (endpoint, args) {
  if (!args) {
    args = {}
  }

  // stringify the body object for passage
  const qs = querystring.stringify(args.body || {})

  /** @type {RequestOptions} */
  var options = {
    url: endpoint,
    method: 'DELETE',
    body: qs,
    responseType: args.responseType || 'json'
  }

  if (args.access_token) {
    options.headers = { Authorization: 'Bearer ' + args.access_token }
  }

  return this._requestHelper(options)
}

/**
 * Uploads a file (e.g. GPX/TCX) to create a new activity.
 * Uses global FormData and Blob (Node 18+) so multipart has a proper boundary.
 * @param {PostUploadArgs} [args]
 * @returns {Promise<UploadResponse>}
 */
HttpClient.prototype.postUpload = async function (args = {}) {
  if (!args.file) {
    throw new Error('postUpload requires args.file')
  }

  var form = new FormData()
  var formData = args.formData || {}
  for (var key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key)) {
      form.append(key, String(formData[key]))
    }
  }
  var buffer = await fsPromises.readFile(args.file)
  form.append('file', new Blob([buffer]), path.basename(args.file))

  /** @type {RequestOptions} */
  var options = {
    url: 'uploads',
    method: 'POST',
    body: form,
    responseType: 'formdata',
    headers: args.access_token ? { Authorization: 'Bearer ' + args.access_token } : {}
  }

  return /** @type {UploadResponse} */ (await this._requestHelper(options))
}

/**
 * Builds a query string for pagination (page, per_page).
 * @param {object} [args] - Object that may contain page, per_page (e.g. PaginationArgs or route args)
 * @returns {string}
 */
HttpClient.prototype.getPaginationQS = function (args) {
  var paginationArgs = /** @type {{ page?: number; per_page?: number }} */ (args || {})
  // setup pagination query args
  var page = typeof paginationArgs.page !== 'undefined' ? paginationArgs.page : null
  var per_page = typeof paginationArgs.per_page !== 'undefined' ? paginationArgs.per_page : null
  /** @type {Record<string, string|number|null>} */
  var qa = {}
  var qs

  if (page) { qa.page = page }
  if (per_page !== null) { qa.per_page = per_page }

  qs = querystring.stringify(/** @type {import('querystring').ParsedUrlQueryInput} */ (qa))

  return qs
}

/**
 * Builds a query string for cursor-based pagination (page_size, after_cursor).
 * @param {CursorPaginationArgs} [args]
 * @returns {string}
 */
HttpClient.prototype.getCursorPaginationQS = function (args) {
  args = args || {}
  var page_size = typeof args.page_size !== 'undefined' ? args.page_size : null
  var after_cursor = typeof args.after_cursor !== 'undefined' ? args.after_cursor : null
  /** @type {Record<string, string|number|null>} */
  var qa = {}
  var qs

  if (page_size !== null) { qa.page_size = page_size }
  if (after_cursor) { qa.after_cursor = after_cursor }

  qs = querystring.stringify(/** @type {import('querystring').ParsedUrlQueryInput} */ (qa))

  return qs
}

/**
 * Builds a query string from allowed property names and an args object.
 * @param {string[]} allowedProps
 * @param {Object} [args]
 * @returns {string}
 */
HttpClient.prototype.getQS = function (allowedProps, args) {
  const safeArgs = /** @type {Record<string, unknown>} */ (args || {})
  /** @type {Record<string, unknown>} */
  var qa = {}
  var qs

  for (var i = 0; i < allowedProps.length; i++) {
    if (Object.prototype.hasOwnProperty.call(safeArgs, allowedProps[i])) { qa[allowedProps[i]] = safeArgs[allowedProps[i]] }
  }

  qs = querystring.stringify(/** @type {import('querystring').ParsedUrlQueryInput} */ (qa))
  return qs
}

/**
 * Returns a request body object containing only allowed props from args.
 * @param {string[]} allowedProps
 * @param {Object} [args]
 * @returns {Record<string, string|number|boolean>}
 */
HttpClient.prototype.getRequestBodyObj = function (allowedProps, args) {
  const safeArgs = /** @type {Record<string, unknown>} */ (args || {})
  /** @type {Record<string, string|number|boolean>} */
  var body = {}

  for (var i = 0; i < allowedProps.length; i++) {
    if (Object.prototype.hasOwnProperty.call(safeArgs, allowedProps[i])) {
      body[allowedProps[i]] = /** @type {string|number|boolean} */ (safeArgs[allowedProps[i]])
    }
  }

  return body
}

/**
 * Internal: runs the request, parses the response, and updates rate limits.
 * @param {RequestOptions} options
 * @returns {Promise<object|string>}
 */
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
    if (typeof response === 'object' && response !== null && 'headers' in response) {
      rateLimiting.updateRateLimits(/** @type {FullResponse} */ (response).headers)
    }

    // FullResponse with body (handler returned { headers, body }): extract body so route modules get the payload
    if (typeof response === 'object' && response !== null && 'headers' in response && 'body' in response) {
      const fullRes = /** @type {FullResponse} */ (response)
      const body = fullRes.body
      if (typeof body === 'string') {
        if (options.responseType === 'text') {
          return body
        }
        if (options.responseType === 'json' || options.responseType === 'formdata') {
          return /** @type {object} */ (JSONbig.parse(body))
        }
        return body
      }
      return /** @type {string | object} */ (body)
    }

    // Handler returned the payload directly (object without headers wrapper)
    if (typeof response === 'object' && response !== null) {
      return response
    }

    if (typeof response === 'string') {
      // If responseType is 'text', return the raw string
      if (options.responseType === 'text') {
        return response
      }

      // For json or formdata, parse the raw JSON string with big-integer reviver for 16+ digit numbers
      if (options.responseType === 'json' || options.responseType === 'formdata') {
        return /** @type {object} */ (JSONbig.parse(response))
      }

      // Default: return as-is
      return response
    }

    return response
  } catch (e) {
    // If the error includes a response, update the rate limits using its headers
    const err = /** @type {{ response?: { headers?: Record<string, string|string[]|undefined> } }} */ (e)
    if (err.response && err.response.headers) {
      rateLimiting.updateRateLimits(err.response.headers)
    }

    // Re-throw the error to ensure it's handled elsewhere
    throw e
  }
}

module.exports = HttpClient
