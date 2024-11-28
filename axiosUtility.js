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
 * @returns {Promise} - A promise that resolves to the response of the HTTP request
 */
const httpRequest = async (options) => {
  try {
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
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new StatusCodeError(
        error.response.status,
        error.response.statusText,
        error.response.data,
        options,
        error.response
      );
    } else if (error.request) {
      throw new RequestError(`No response received: ${error.message}`, options);
    } else {
      throw new RequestError(`Request setup error: ${error.message}`, options);
    }
  }
};

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
  axiosInstance,
  httpRequest,
  updateDefaultHeaders,
  setBaseURL,
  StatusCodeError, // Export custom error class for compatibility
  RequestError
}
