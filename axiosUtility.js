const axios = require('axios')

// Custom Error Classes for compatibility with 'request-promise/errors'
class StatusCodeError extends Error {
  constructor (statusCode, statusText, data, options, response) {
    super(`Request failed with status ${statusCode}: ${statusText}`)
    this.name = 'StatusCodeError'
    this.statusCode = statusCode
    this.data = data
    this.options = options
    this.response = response
  }
}

class RequestError extends Error {
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
 * Wrapper function for making HTTP requests using Axios
 * @param {Object} options - Request options similar to 'request-promise'
 * @param {Function} [done] - Optional callback function for compatibility
 * @returns {Promise} - A promise that resolves to the response of the HTTP request
 */
const httpRequest = async (options, done) => {
  try {
    // Configure headers, method, params (qs), and data
    const response = await axiosInstance({
      method: options.method || 'GET',
      url: options.uri || options.url,
      params: options.qs, // Map 'qs' to 'params' for query string parameters
      headers: {
        ...axiosInstance.defaults.headers,
        ...options.headers
      },
      data: options.body, // For request body
      responseType: options.responseType || 'json', // Support different response types
      maxRedirects: options.maxRedirects || 5, // Set max redirects
      validateStatus: options.simple === false ? () => true : undefined // Handle 'simple' option
    })
    if (done) {
      return done(null, response.data)
    }
    return response.data
  } catch (error) {
    if (error.response) {
      // Map Axios errors to StatusCodeError for compatibility
      const statusCodeError = new StatusCodeError(
        error.response.status,
        error.response.statusText,
        error.response.data,
        options,
        error.response
      )
      if (done) {
        return done(statusCodeError)
      }
      throw statusCodeError
    } else if (error.request) {
      // Request was made but no response received
      const requestError = new RequestError(`No response received: ${error.message}`, options)
      if (done) {
        return done(requestError)
      }
      throw requestError
    } else {
      // Something happened while setting up the request
      const setupError = new RequestError(`Request setup error: ${error.message}`, options)
      if (done) {
        return done(setupError)
      }
      throw setupError
    }
  }
}

/**
 * Function to update default headers
 * @param {Object} headers - Headers to be updated
 */
const updateDefaultHeaders = (headers) => {
  Object.assign(axiosInstance.defaults.headers, headers)
}

/**
 * Function to set a new base URL for the Axios instance
 * @param {string} newBaseURL - New base URL
 */
const setBaseURL = (newBaseURL) => {
  axiosInstance.defaults.baseURL = newBaseURL
}

module.exports = {
  httpRequest,
  updateDefaultHeaders,
  setBaseURL,
  StatusCodeError, // Export custom error class for compatibility
  RequestError
}
