const axios = require('axios')

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
 * 
 * @param {Object} options - Request options similar to 'request-promise'
 * @returns {Promise} - A promise that resolves to the response of the HTTP request
 */
const httpRequest = async (options) => {
  try {
    // Configure headers, method, params, and data
    const response = await axiosInstance({
      method: options.method || 'GET',
      url: options.uri,
      params: options.qs, // For query string parameters
      headers: {
        ...axiosInstance.defaults.headers,
        ...options.headers
      },
      data: options.body, // For request body
      responseType: options.responseType || 'json', // Support different response types
      maxRedirects: options.maxRedirects || 5 // Set max redirects
    })
    return response.data
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(`Request failed with status ${error.response.status}: ${error.response.statusText} - ${JSON.stringify(error.response.data)}`)
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(`No response received: ${error.message}`)
    } else {
      // Something happened while setting up the request
      throw new Error(`Request setup error: ${error.message}`)
    }
  }
}

/**
 * Function to update default headers
 * 
 * @param {Object} headers - Headers to be updated
 */
const updateDefaultHeaders = (headers) => {
  Object.assign(axiosInstance.defaults.headers, headers)
}

/**
 * Function to set a new base URL for the Axios instance
 * 
 * @param {string} newBaseURL - New base URL
 */
const setBaseURL = (newBaseURL) => {
  axiosInstance.defaults.baseURL = newBaseURL
}

module.exports = {
  httpRequest,
  updateDefaultHeaders,
  setBaseURL
}
