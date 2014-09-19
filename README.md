
# strava-v3: Node wrapper for Strava's v3 API

## Installation

```bash
		npm install strava-v3
```

##Quick start

* Create an application at [strava.com/developers](http://www.strava.com/developers) and make note of your `access_token`
* from the root of your node application: `$ npm install strava-v3`
* `$ mkdir data`
* `$ cp node_modules/strava/strava_config data/strava_config`
* Open `data/strava_config` in your favorite text editor and supply your applications `access_token` to the `access_token` field
* `$ npm test`

There you go! You are now ready to go play with Strava's API.

##Resources

* [Strava Developers Center](http://www.strava.com/developers)
* [Strava API Reference](http://strava.github.io/api/)

##Usage

###General

API access is designed to be as closely similar in layout as possible to Strava's own architecture, 
with the general call definition being

```js
		strava = require('strava')
		strava.<api endpoint>.<api endpoint option>(args,callback)
``` 

Example usage:

```js
		strava = require('strava');
		strava.athletes.get({id:12345},function(err,payload) {
			//do something with your payload
		});
```

###Overriding the default `access_token`

You'll probably want to do this with every call once your app is in production, using an `access_token` specific to a validated user allows for detailed athlete information, as well as the option for additional `POST` and `DEL` privileges. 

Just add the property `'access_token':'your access_token'` to the `args` parameter of your call, the wrapper will use the provided `access_token` instead of the default in `data/strava_config`.

Example usage:

```js
		strava = require('strava');
		strava.athlete.get({'access_token':'abcde'},function(err,payload) {
			//do something with your payload
		});
```

###Dealing with pagination

For those API calls that support pagination, you can control both the `page` being retrieved and the number of responses to return `per_page` by adding the corresponding properties to `args`.

Example usage:

```js
		strava = require('strava');
		strava.athlete.getFollowers({
			'page':1
			, 'per_page':2
		},function(err,payload) {
			//do something with your payload
		});
```

###Functions

* `strava.athlete.get(args,done)`
* `strava.athlete.listFriends(args,done)`
* `strava.athlete.listFollowers(args,done)`
* `strava.athletes.get(args,done)`
* `strava.athletes.listFriends(args,done)`
* `strava.athletes.listFollowers(args,done)`
* `strava.athletes.listKoms(args,done)`
