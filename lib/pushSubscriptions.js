/**
 * Created by Yousef on 6/14/16.
 * Refactored by markstos on 06/07/2017
 */

var authenticator = require('./authenticator');

var pushSubscriptions = function (client) {
  this.client = client;

  // Per Strava, this part of the API uses use the "api." subdomain,
  // not "www." like most of the API.
  // Ref: https://strava.github.io/api/v3/events/
  this.baseUrl = 'https://api.strava.com/api/v3/';
};

var _allowedPostProps = [
        'object_type'
        , 'aspect_type'
        , 'callback_url'
        , 'verify_token'
    ];

pushSubscriptions.prototype.create = function(args,done) {
    if(typeof args.callback_url == 'undefined') {
        return done({'msg':'required args missing'});
    }

    // The Strava API currently only has one valid value for these,
    // so set them as the default.
    if (args.object_type === undefined) {
        args.object_type = 'activity';
    }

    if (args.aspect_type === undefined) {
        args.aspect_type = 'create';
    }

    args.body = this.client.getRequestBodyObj(_allowedPostProps,args);

    args.body.client_secret = authenticator.getClientSecret();
    args.body.client_id = authenticator.getClientId();

    return this.client._requestHelper({
        baseUrl: this.baseUrl,
        url: 'push_subscriptions',
        method: 'POST',
        form: args.body,
    },done);
};

pushSubscriptions.prototype.list = function(done) {
    var qs = this.client.getQS(['client_secret', 'client_id'],{
      client_secret : authenticator.getClientSecret(),
      client_id : authenticator.getClientId()
    });
    return this.client._requestHelper({
      baseUrl: this.baseUrl,
      url: 'push_subscriptions?' + qs
     },done);
};

pushSubscriptions.prototype.delete = function(args,done) {
    //require subscription id
    if(typeof args.id === 'undefined') {
        return done({msg:'args must include a push subscription id'});
    }

    var qs = this.client.getQS(['client_secret', 'client_id'],{
      client_secret : authenticator.getClientSecret(),
      client_id : authenticator.getClientId(),
    });

    return this.client._requestHelper({
      baseUrl: this.baseUrl,
      url: 'push_subscriptions/'+args.id+'?'+qs,
      method: 'DELETE'
    },done);
};



module.exports = pushSubscriptions;
