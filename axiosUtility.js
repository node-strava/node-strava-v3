// @ts-check
const axios = require('axios')

// Custom Error Classes for compatibility with 'request-promise/errors'
class StatusCodeError extends Error {
  /**
   * @param {number} statusCode - HTTP status code.
   * @param {string} statusText - Status text.
   * @param {*} data - Response body/data.
   * @param {Object} options - Original request options.
   * @param {Object} response - Axios response object.
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
   * @param {string} message - Error message.
   * @param {Object} options - Original request options.
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
 * @param {Object} options - Request options (request-promise style).
 * @param {string} [options.method='GET'] - HTTP method.
 * @param {string} [options.uri] - Request URL path (use with baseURL).
 * @param {string} [options.url] - Alternative to uri for full or path URL.
 * @param {Object} [options.qs] - Query string parameters.
 * @param {Object} [options.headers] - Additional request headers.
 * @param {*} [options.body] - Request body.
 * @param {string} [options.responseType='json'] - Response type (e.g. 'json', 'text').
 * @param {number} [options.maxRedirects=5] - Max redirects.
 * @param {boolean} [options.simple=true] - If true, reject on non-2xx status; if false, return any status.
 * @returns {Promise<*>} Resolves to response data (e.g. parsed JSON); rejects with StatusCodeError or RequestError.
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
      maxRedirects: options.maxRedirects || 5,
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
        err.response
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
 * @param {Object} headers - Key-value headers to add or override.
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
