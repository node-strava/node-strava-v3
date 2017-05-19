/**
 * Created by austin on 9/18/14.
 */

var Promise = require('bluebird')
    , querystring = require('querystring')
    , fs = require('fs')
    , rateLimiting = require('./rateLimiting');

//request.debug = true

var HttpClient = function (request) {
  this.request = request;

};

//===== generic GET =====
HttpClient.prototype.getEndpoint = function(endpoint,args,done) {

    if (!args) {
        args = {};
    }

   var options = { url: endpoint };

    if (args.access_token) {
      options.headers = { Authorization: 'Bearer ' + args.access_token };
    }


    return this._requestHelper(options,done);
};

//===== generic PUT =====
HttpClient.prototype.putEndpoint = function(endpoint,args,done) {

    if (!args) {
        args = {};
    }

    var options = {
        url: endpoint
        , method: 'PUT'
        , body: qs
    };

    if (args.access_token) {
      options.headers = { Authorization: 'Bearer ' + args.access_token };
    }

    //stringify the body object for passage
    var qs = querystring.stringify(args.body);


    //add form data if present
    if(args.form)
        options.form = args.form;

    return this._requestHelper(options,done);
};

//===== generic POST =====
HttpClient.prototype.postEndpoint = function(endpoint,args,done) {

    if (!args) {
        args = {};
    }

    var options = {
        url: endpoint
        , method: 'POST'
        , body: args.body
    };

    if (args.access_token) {
      options.headers = { Authorization: 'Bearer ' + args.access_token };
    }


    //add form data if present
    if(args.form)
        options.form = args.form;

    //add multipart data if present
    if(args.multipart)
        options.multipart = args.multipart;

    return this._requestHelper(options,done);
};

//===== generic DELETE =====
HttpClient.prototype.deleteEndpoint = function(endpoint,args,done) {

    if (!args) {
        args = {};
    }

    var options = {
        url: endpoint
        , method: 'DELETE'
        , body: qs
    };

    if (args.access_token) {
      options.headers = { Authorization: 'Bearer ' + args.access_token };
    }

    //stringify the body object for passage
    var qs = querystring.stringify(args.body);


    return this._requestHelper(options,done);
};

//===== postUpload =====
HttpClient.prototype.postUpload = function(args,done) {

    if (!args) {
        args = {};
    }

    var options = {
        url: 'uploads'
        , method: 'POST'
    };

    if (args.access_token) {
      options.headers = { Authorization: 'Bearer ' + token };
    }

    var req = request.post(options, function(err, httpResponse, payload) {

            done(err, payload);
    });

    var form = req.form();

    //append the rest of the formData values
    for(var key in args.formData) {
        form.append(key, args.formData[key]);
    }
    form.append('file', fs.createReadStream(args.file));
};


//===== get pagination query string =====
HttpClient.prototype.getPaginationQS = function(args) {

    //setup pagination query args
    var page = typeof args.page !== 'undefined' ? args.page : null
        , per_page = typeof args.per_page !== 'undefined' ? args.per_page : null
        , qa = {}
        , qs;

    if(page)
        qa.page = page;
    if(per_page)
        qa.per_page = per_page;

    qs = querystring.stringify(qa);

    return qs;
};
//===== generic get query string =====
HttpClient.prototype.getQS = function(allowedProps,args) {

    var qa = {}
        , qs;

    for(var i = 0; i < allowedProps.length; i++) {
        if(args[allowedProps[i]])
            qa[allowedProps[i]] = args[allowedProps[i]];
    }

    qs = querystring.stringify(qa);
    return qs;
};


//===== get request body object =====
HttpClient.prototype.getRequestBodyObj = function(allowedProps,args) {

    var body = {};

    for(var i = 0; i < allowedProps.length; i++) {
        if(args[allowedProps[i]])
            body[allowedProps[i]] = args[allowedProps[i]];
    }

    return body;
};


//===== helpers =====
HttpClient.prototype._requestHelper = function(options,done) {
    // We need the full response so we can get at the headers
    options.resolveWithFullResponse = true;

    // reject promise with 'StatusCodeError' for non-2xx responses.
    // This would include 3xx redirects and 304 Request-Not-Modified,
    // Neither of which the Strava API is expected to return.
    options.simple = true;

    var limits;

    var callback;

    // For asCallback to work properly, a function should only be passed to it
    //  if the caller provided one
    if (done) {
        callback = function (err, payload) {
           done(err,payload,limits);
        };
    }

    // Promise.resolve is used to convert the promise returned
    //  to a Bluebird promise
    // tapCatch is used to log errors without stopping the promise flow.
    // asCallback is used to support both Promise and callback-based APIs
    return Promise.resolve(this.request(options)).
        tapCatch(function(err) {
          console.log('api call error');
          console.log(err);
        }).
        then(function (response) {
          // The old callback API returns returns the current limits
          //  as an extra arg in the callback
          // The newer promise-bsed API updates a global rateLimiting counter
          limits = rateLimiting.updateRateLimits(response.headers);
          return Promise.resolve(response.body);
        }).asCallback(callback);
};

//===== helpers =====

module.exports = HttpClient;
