/* eslint camelcase: 0 */
const https = require('https')
const querystring = require('querystring')
const fs = require('fs')

export class HttpClient {
  constructor (request) {
    this.request = request
  }

  //= ==== generic PUT =====
  putEndpoint (endpoint, args) {
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

    return this.requestHelper(options)
  }

  //= ==== generic POST =====
  postEndpoint (endpoint, args) {
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

    return this.requestHelper(options)
  }

  //= ==== generic DELETE =====
  deleteEndpoint (endpoint, args) {
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

    return this.requestHelper(options)
  }

  //= ==== postUpload =====
  postUpload (args = {}) {
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

    return this.requestHelper(options)
  }

  //= ==== get pagination query string =====
  getPaginationQS (args) {
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
  getQS (allowedProps, args) {
    var qa = {}
    var qs

    for (var i = 0; i < allowedProps.length; i++) {
      if (args.hasOwnProperty(allowedProps[i])) { qa[allowedProps[i]] = args[allowedProps[i]] }
    }

    qs = querystring.stringify(qa)
    return qs
  }

  //= ==== get request body object =====
  getRequestBodyObj (allowedProps, args) {
    var body = {}

    for (var i = 0; i < allowedProps.length; i++) {
      if (args.hasOwnProperty(allowedProps[i])) { body[allowedProps[i]] = args[allowedProps[i]] }
    }

    return body
  }
  //= ==== generic GET =====
  getEndpoint (endpoint, args) {
    if (!args) {
      args = {}
    }

    var options = { url: endpoint }

    if (args.access_token) {
      options.headers = { Authorization: 'Bearer ' + args.access_token }
    }

    return this.requestHelper(options)
  }

  //= ==== helpers =====
  requestHelper (options) {
    const optionsToMountRequest = {
      hostname: options.baseUrl,
      port: 443,
      path: `/api/v3/${options.url}`,
      method: options.method,
      headers: options.headers
    }
    return new Promise((resolve, reject) => {
      const request = https.request(optionsToMountRequest, (response) => {
        response.setEncoding('utf8')
        let responseBody = ''
        response.on('data', (chunk) => {
          responseBody += chunk
        })
        response.on('end', () => {
          resolve(JSON.parse(responseBody))
        })
      })
      request.on('error', (error) => {
        reject(error)
      })
      request.end()
    })
  }
}
