
# strava-v3: Simple Node wrapper for Strava's v3 API

[![NPM](https://nodei.co/npm/strava-v3.png?downloads=true)](https://nodei.co/npm/strava-v3/)

###Status
Currently supporting all API calls to endpoints: 

* `oauth`
* `athlete`
* `athletes`
* `activities`
* `clubs`
* `gear`

## Installation

```bash
		npm install strava-v3
```

##Quick start

* Create an application at [strava.com/developers](http://www.strava.com/developers) and make note of your `access_token`
* from the root of your node application: `$ npm install strava-v3`
* `$ mkdir data`
* `$ cp node_modules/strava-v3/strava_config data/strava_config`
* Open `data/strava_config` in your favorite text editor and supply your applications `access_token` to the `access_token` field
* Use it!

```js
		strava = require('strava-v3');
		strava.athlete.get({},function(err,payload) {
			if(!err) {			
				console.log(payload);
			}	
			else {
				console.log(err);
			}
		});
```


##Resources

* [Strava Developers Center](http://www.strava.com/developers)
* [Strava API Reference](http://strava.github.io/api/)

##Usage

###General

API access is designed to be as closely similar in layout as possible to Strava's own architecture, 
with the general call definition being

```js
		strava = require('strava-v3')
		strava.<api endpoint>.<api endpoint option>(args,callback)
``` 

Example usage:

```js
		strava = require('strava-v3');
		strava.athletes.get({id:12345},function(err,payload) {
			//do something with your payload
		});
```

###Overriding the default `access_token`

You'll probably want to do this with every call once your app is in production, using an `access_token` specific to a validated user allows for detailed athlete information, as well as the option for additional `POST` and `DEL` privileges. 

Just add the property `'access_token':'your access_token'` to the `args` parameter of your call, the wrapper will use the provided `access_token` instead of the default in `data/strava_config`.

Example usage:

```js
		strava = require('strava-v3');
		strava.athlete.get({'access_token':'abcde'},function(err,payload) {
			//do something with your payload
		});
```

###Dealing with pagination

For those API calls that support pagination, you can control both the `page` being retrieved and the number of responses to return `per_page` by adding the corresponding properties to `args`.

Example usage:

```js
		strava = require('strava-v3');
		strava.athlete.getFollowers({
			'page':1
			, 'per_page':2
		},function(err,payload) {
			//do something with your payload
		});
```

###Supported API Endpoints

Oauth:

* `strava.oauth.getRequestAccessURL(args)`
* `strava.oauth.getToken(code,done)`
* `strava.oauth.deauthorize(args,done)`

Athlete:

* `strava.athlete.get(args,done)`
* `strava.athlete.update(args,done)`
* `strava.athlete.listFriends(args,done)`
* `strava.athlete.listFollowers(args,done)`
* `strava.athlete.listActivities(args,done)`

Athletes:

* `strava.athletes.get(args,done)`
* `strava.athletes.listFriends(args,done)`
* `strava.athletes.listFollowers(args,done)`
* `strava.athletes.listKoms(args,done)`

Activities:

* `strava.activities.get(args,done)`
* `strava.activities.create(args,done)`
* `strava.activities.update(args,done)`
* `strava.activities.delete(args,done)`
* `strava.activities.listFriends(args,done)`
* `strava.activities.listZones(args,done)`
* `strava.activities.listLaps(args,done)`
* `strava.activities.listComments(args,done)`
* `strava.activities.listKudos(args,done)`
* `strava.activities.listPhotos(args,done)`

Clubs:
* `strava.clubs.get(args,done)`
* `strava.clubs.listMembers(args,done)`
* `strava.clubs.listActivities(args,done)`

Gear:
* `strava.gear.get(args,done)`

