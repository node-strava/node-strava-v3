const axios = require('axios')

/**
 * HTTP request headers. Keys are header names (e.g. `Authorization`, `Content-Type`);
 * values are header values. Use `null` or `undefined` to omit a header.
 * @typedef {{ [header: string]: string | null | undefined }} HttpRequestHeaders
 */

/**
 * URL query string parameters. Keys are query param names; values are serialized
 * into the query string. Omit a key or use `undefined` to exclude it.
 * @typedef {{ [key: string]: string | number | boolean | undefined }} QueryStringParams
 */

/**
 * Form body fields for application/x-www-form-urlencoded requests (e.g. POST/PUT).
 * Keys are form field names; values are serialized into the request body. Used when
 * sending form-style payloads instead of raw JSON in `body`.
 * @typedef {{ [field: string]: string | number | boolean | undefined }} FormBody
 */

/**
 * Request options for httpRequest (request-promise style). Compatible with
 * {@link import('./lib/httpClient').RequestOptions} from HttpClient.
 * @typedef {Object} HttpRequestOptions
 * @property {string} [url]
 * @property {string} [uri]
 * @property {string} [method]
 * @property {unknown} [body]
 * @property {HttpRequestHeaders} [headers]
 * @property {string} [baseUrl]
 * @property {string} [responseType]
 * @property {boolean} [resolveWithFullResponse]
 * @property {boolean} [simple]
 * @property {FormBody} [form]
 * @property {unknown} [multipart]
 * @property {QueryStringParams} [qs]
 * @property {number} [maxRedirects]
 */

/**
 * Response body: parsed JSON (default) or string when responseType is 'text'.
 * @typedef {object | object[] | string | number | boolean | null} HttpResponseBody
 */

// Custom Error Classes for compatibility with 'request-promise/errors'
class StatusCodeError extends Error {
  /**
   * Creates an error for failed HTTP responses.
   * @param {number} statusCode - HTTP status code.
   * @param {string} statusText - Status text.
   * @param {unknown} data - Response body/data.
   * @param {HttpRequestOptions} options - Original request options.
   * @param {import('axios').AxiosResponse} response - Axios response object.
   */
  constructor (statusCode, statusText, data, options, response) {
    super(`Request failed with status ${statusCode}: ${statusText}`)
    this.name = 'StatusCodeError'
    this.statusCode = statusCode
    this.data = data
    this.options = options
    this.response = response
  }
}

/** Error thrown when no response was received or request setup failed. */
class RequestError extends Error {
  /**
   * Creates an error when no response was received or request setup failed.
   * @param {string} message - Error message.
   * @param {HttpRequestOptions} options - Original request options.
   */
  constructor (message, options) {
    super(message)
    this.name = 'RequestError'
    this.options = options
  }
}

// Axios Wrapper Utility
const axiosInstance = axios.create({
  baseURL: 'https://www.strava.com/api/v3/',
  headers: {
    'User-Agent': `node-strava-v3 v${require('./package.json').version}`
  },
  timeout: 10000 // Set default timeout to 10 seconds
})

/**
 * Wrapper function for making HTTP requests using Axios.
 * @param {HttpRequestOptions} options - Request options (url/uri, method, body, headers, qs, etc.).
 * @returns {Promise<HttpResponseBody>} Resolves to response body; rejects with StatusCodeError or RequestError.
 */
const httpRequest = async (options) => {
  try {
    /** @type {(status: number) => boolean} */
    const defaultValidateStatus = (status) => status >= 200 && status < 300
    const config = {
      method: options.method || 'GET',
      url: options.uri || options.url,
      params: options.qs, // Map 'qs' to 'params' for query string parameters
      headers: {
        ...axiosInstance.defaults.headers,
        ...options.headers
      },
      data: options.body,
      responseType: options.responseType || 'json',
      maxRedirects: options.maxRedirects === 0 ? 0 : options.maxRedirects || 5,
      validateStatus: options.simple === false ? () => true : defaultValidateStatus
    }
    const response = await axiosInstance(/** @type {import('axios').AxiosRequestConfig} */ (config))
    return response.data
  } catch (error) {
    const err = /** @type {{ response?: { status: number, statusText: string, data: unknown, [key: string]: unknown }, request?: unknown, message?: string } } */ (error)
    if (err.response) {
      throw new StatusCodeError(
        err.response.status,
        err.response.statusText,
        err.response.data,
        options,
        /** @type {import('axios').AxiosResponse} */ (/** @type {unknown} */ (err.response))
      )
    } else if (err.request) {
      throw new RequestError(`No response received: ${err.message}`, options)
    } else {
      throw new RequestError(`Request setup error: ${err.message}`, options)
    }
  }
}

/**
 * Merges the given headers into the Axios instance default headers.
 * @param {HttpRequestHeaders} headers - Headers to add or override (e.g. Authorization, Content-Type).
 * @returns {void}
 */
const updateDefaultHeaders = (headers) => {
  Object.assign(axiosInstance.defaults.headers, headers)
}

/**
 * Sets the base URL for the Axios instance (e.g. Strava API base).
 * @param {string} newBaseURL - New base URL.
 * @returns {void}
 */
const setBaseURL = (newBaseURL) => {
  axiosInstance.defaults.baseURL = newBaseURL
}

module.exports = {
  axiosInstance,
  httpRequest,
  updateDefaultHeaders,
  setBaseURL,
  StatusCodeError, // Export custom error class for compatibility
  RequestError
}
