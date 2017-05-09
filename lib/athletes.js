/**
 * Created by austin on 9/19/14.
 */

var athletes = function (client) {
  this.client = client;
};

//===== athletes endpoint =====
athletes.prototype.get = function(args,done) {

    return this._listHelper('',args,done);
};
athletes.prototype.listFriends = function(args,done) {

    return this._listHelper('friends',args,done);
};
athletes.prototype.listFollowers = function(args,done) {

    return this._listHelper('followers',args,done);
};
athletes.prototype.stats = function(args, done) {

    return this._listHelper('stats',args,done);
};
athletes.prototype.listKoms = function(args,done) {

    return this._listHelper('koms',args,done);
};
//===== athletes endpoint =====

//===== helpers =====
athletes.prototype._listHelper = function(listType,args,done) {

    var endpoint = 'athletes/'
        , err = null
        , qs = this.client.getPaginationQS(args);

    //require athlete id
    if(typeof args.id === 'undefined') {
        err = {'msg':'args must include an athlete id'};
        return done(err);
    }

    endpoint += args.id + '/' + listType + '?' + qs;
    return this.client.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = athletes;
