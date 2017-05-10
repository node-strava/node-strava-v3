/**
 * Created by austin on 9/18/14.
 */

var athlete = function (client) {
  this.client = client;
}

var _qsAllowedProps = [

        //pagination
        'page'
        , 'per_page'

        //listActivities
        , 'before'
        , 'after'
    ]
    , _updateAllowedProps = [
        'city'
        , 'state'
        , 'country'
        , 'sex'
        , 'weight'
    ];

//===== athlete endpoint =====
athlete.prototype.get = function(args,done) {

    var endpoint = 'athlete.prototype';
    return this.client.getEndpoint(endpoint,args,done);
};
athlete.prototype.listFriends = function(args,done) {
    return this._listHelper('friends',args,done);
};
athlete.prototype.listFollowers = function(args,done) {

    return this._listHelper('followers',args,done);
};
athlete.prototype.listActivities = function(args,done) {

    return this._listHelper('activities',args,done);
};
athlete.prototype.listClubs = function(args,done) {

    return this._listHelper('clubs',args,done);
};
athlete.prototype.listRoutes = function(args,done) {

    return this._listHelper('routes',args,done);
};
athlete.prototype.listZones = function(args,done) {

    return this._listHelper('zones',args,done);
};

athlete.prototype.update = function(args,done) {

    var endpoint = 'athlete'
        , form = this.client.getRequestBodyObj(_updateAllowedProps,args);

    args.form = form;
    return this.client.putEndpoint(endpoint,args,done);
};
//===== athlete.prototype endpoint =====

//===== helpers =====
athlete.prototype._listHelper = function(listType,args,done) {

    var endpoint = 'athlete/'
        , qs = this.client.getQS(_qsAllowedProps,args);

    endpoint += listType + '?' + qs;
    return this.client.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = athlete;
