/**
 * Created by austin on 9/23/14.
 */

var segments = function (client) {
  this.client = client;
}

var  _qsAllowedProps = [

        //pagination
        'page'
        , 'per_page'

        //listSegments
        , 'athlete_id'
        , 'gender'
        , 'age_group'
        , 'weight_class'
        , 'following'
        , 'club_id'
        , 'date_range'
        , 'start_date_local'
        , 'end_date_local'

        //explore
        , 'bounds'
        , 'activity_type'
        , 'min_cat'
        , 'max_cat'
    ]
    , _updateAllowedProps = [
        //star segment
        'starred'
    ];

//===== segments endpoint =====
segments.prototype.get = function(args,done) {

    var endpoint = 'segments/'
        , err = null
        , qs = this.client.getPaginationQS(args);

    //require segment id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an segment id'};
        return done(err);
    }

    endpoint += args.id;
    return this.client.getEndpoint(endpoint,args,done);
};

segments.prototype.listStarred = function(args,done) {

    var qs = this.client.getQS(_qsAllowedProps,args)
        , endpoint = 'segments/starred?' + qs;

    return this.client.getEndpoint(endpoint,args,done);
};

segments.prototype.starSegment = function(args,done) {

    var endpoint = 'segments/'
        , form = this.client.getRequestBodyObj(_updateAllowedProps,args)
        , err = null;

    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an segment id'};
        return done(err);
    }

    endpoint += args.id + '/starred';
    args.form = form;

    this.client.putEndpoint(endpoint,args,done);
};

segments.prototype.listEfforts = function(args,done) {

    return this._listHelper('all_efforts',args,done);
};

segments.prototype.listLeaderboard = function(args,done) {

    return this._listHelper('leaderboard',args,done);
};

segments.prototype.explore = function(args,done) {

    var qs = this.client.getQS(_qsAllowedProps,args)
        , endpoint = 'segments/explore?' + qs;

    return this.client.getEndpoint(endpoint,args,done);
};
//===== segments endpoint =====

//===== helpers =====
segments.prototype._listHelper = function(listType,args,done) {

    var endpoint = 'segments/'
        , err = null
        , qs = this.client.getQS(_qsAllowedProps,args);

    //require segment id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include a segment id'};
        return done(err);
    }

    endpoint += args.id + '/' + listType + '?' + qs;
    return this.client.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = segments;
