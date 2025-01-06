
# strava-v3: Simple Node wrapper for Strava's v3 API

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/strava-v3.svg?style=flat
[npm-url]: https://npmjs.org/package/strava-v3
[downloads-image]: https://img.shields.io/npm/dm/strava-v3.svg?style=flat
[downloads-url]: https://npmjs.org/package/strava-v3
[travis-image]: https://travis-ci.org/UnbounDev/node-strava-v3.svg?branch=master&style=flat
[travis-url]: https://travis-ci.org/UnbounDev/node-strava-v3

### Status

Supports many but not all Strava API endpoints:

* `oauth`
* `athlete`
* `athletes`
* `activities`
* `clubs`
* `gear`
* `running_races`
* `routes`
* `segments`
* `segment_efforts`
* `streams`
* `uploads`

## Installation

```bash
npm install strava-v3
```

## Import syntax
Importing only the library:
```
import strava from 'strava-v3';
```
Importing both the library as well as interfaces:
```
import { default as strava, Strava } from 'strava-v3';
```

## Quick start

* Create an application at [strava.com/settings/api](https://www.strava.com/settings/api) and make note of your `access_token`

```js
const strava = require('strava-v3')
strava.config({...})
const payload = await strava.athlete.get({})
console.log(payload)
```

## Migrating from Callbacks to Promises
Let's walk through a practical example of how to migrate your existing callback-based usage of the strava-v3 library to a Promise-based approach.

### Original Callback-Based Usage
**Before Migration:**

```javascript
const strava = require('strava-v3');

// Configuring Strava with necessary credentials
strava.config({
  access_token: 'your_access_token',
  client_id: 'your_client_id',
  client_secret: 'your_client_secret',
  redirect_uri: 'your_redirect_uri'
});

// Fetching athlete data using callbacks
strava.athlete.get({ id: 12345 }, function(err, athlete) {
  if (err) {
    return console.error('Error fetching athlete:', err);
  }
  
  console.log('Athlete Data:', athlete);
  
  // Fetching athlete's activities using callbacks
  strava.activities.list({ athlete_id: athlete.id }, function(err, activities) {
    if (err) {
      return console.error('Error fetching activities:', err);
    }
    
    console.log('Activities:', activities);
  });
});
```

### Migrated Promise-Based Usage
**After Migration:**

```javascript
const strava = require('strava-v3');

// Configuring Strava with necessary credentials
strava.config({
  access_token: 'your_access_token',
  client_id: 'your_client_id',
  client_secret: 'your_client_secret',
  redirect_uri: 'your_redirect_uri'
});

// Fetching athlete data using Promises with async/await
async function fetchAthleteData(athleteId) {
  try {
    const athlete = await strava.athlete.get({ id: athleteId });
    console.log('Athlete Data:', athlete);
    
    // Fetching athlete's activities using Promises with async/await
    const activities = await strava.activities.list({ athlete_id: athlete.id });
    console.log('Activities:', activities);
    
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}

// Invoke the async function
fetchAthleteData(12345);
```

### Key Changes Explained
1. **Removal of Callback Parameters:**

    * Before: Methods like `strava.athlete.get` and `strava.activities.list` accept a callback function as the last parameter.
    * After: These methods now return Promises, eliminating the need for callback functions.

2. **Using `async/await`:**

    * The `fetchAthleteData` function is declared as `async`, allowing the use of `await` to handle Promises in a synchronous-like manner.
    * `await` pauses the execution of the function until the Promise resolves, making the code easier to read and maintain.

3. **Centralized Error Handling:**

    * The `try-catch` block encapsulates both asynchronous operations, ensuring that any errors thrown by either `strava.athlete.get` or `strava.activities.list` are caught and handled in one place.

4. **Elimination of Nested Callbacks:**

    * The Promise-based approach avoids deeply nested functions, reducing complexity and improving readability.

### Alternative: Using `.then()` and `.catch()`
If you prefer not to use `async/await`, you can achieve similar results using `.then()` and `.catch()` chaining.

**Example:**

```javascript
const strava = require('strava-v3');

// Configuring Strava with necessary credentials
strava.config({
  access_token: 'your_access_token',
  client_id: 'your_client_id',
  client_secret: 'your_client_secret',
  redirect_uri: 'your_redirect_uri'
});

// Fetching athlete data using Promises with .then() and .catch()
strava.athlete.get({ id: 12345 })
  .then(athlete => {
    console.log('Athlete Data:', athlete);
    return strava.activities.list({ athlete_id: athlete.id });
  })
  .then(activities => {
    console.log('Activities:', activities);
  })
  .catch(err => {
    console.error('Error fetching data:', err);
  });
  ```
**Benefits:**

* **Chainable:** Promises allow you to chain multiple asynchronous operations in a linear and manageable fashion.
* **Error Propagation:** Errors thrown in any `.then()` block are propagated down the chain to the nearest `.catch()` block.


## Usage

### OAuth configuration

If you are writing an app that other Strava users will authorize against their
own account, you'll need to use the OAuth flow. This requires that you provide
a `client_id`, `client_secret` and `redirect_uri` that ultimately result in
getting back an `access_token` which can be used for calls on behalf of that
user.

You have three options to configure your OAuth calls:

#### Explicit configuration

Use explicit configuration, which will override both the config file and the environment variables:

```js
var strava = require('strava-v3')
strava.config({
  "access_token"  : "Your apps access token (Required for Quickstart)",
  "client_id"     : "Your apps Client ID (Required for oauth)",
  "client_secret" : "Your apps Client Secret (Required for oauth)",
  "redirect_uri"  : "Your apps Authorization Redirection URI (Required for oauth)",
});
```
##### Environment variables

You may alternatively supply the values via environment variables named following the convention `STRAVA_<keyName>`, so

- `STRAVA_ACCESS_TOKEN` = `access_token`
- `STRAVA_CLIENT_ID` = `client_id`
- `STRAVA_CLIENT_SECRET` = `client_secret`
- `STRAVA_REDIRECT_URI` = `redirect_uri`


#### Config File (Deprecated)

The template `strava_config` file can be found at the modules root directory and has the following structure

```json
{
  "access_token"  : "Your apps access token (Required for Quickstart)",
  "client_id"     : "Your apps Client ID (Required for oauth)",
  "client_secret" : "Your apps Client Secret (Required for oauth)",
  "redirect_uri"  : "Your apps Authorization Redirection URI (Required for oauth)",
}
```

### General

API access is designed to be as closely similar in layout as possible to Strava's own architecture, with the general call definition being

```js
var strava = require('strava-v3')

const payload = await strava.<api endpoint>.<api endpoint option>(args);
```

Example usage:

```js
const strava = require('strava-v3');
const payload = await strava.athletes.get({ id: 12345 });
// Do something with your payload, track rate limits
```

### Overriding the default `access_token`

You'll may want to use OAuth `access_token`s on behalf of specific users once
your app is in production. Using an `access_token` specific to a validated user
allows for detailed athlete information, as well as the option for additional
`PUT`/`POST`/`DELETE` privileges.

Use app-specific logic to retrieve the `access\_token` for a particular user, then create a Strava client for that user, with their token:

```js
const stravaApi = require('strava-v3');

// ... get access_token from somewhere
strava = new stravaApi.client(access_token);

const payload = await strava.athlete.get({})
```

Less conveniently, you can also explictly pass an `access_token` to API calls:

Example usage:

```js
const strava = require('strava-v3');
const payload = await strava.athlete.get({'access_token':'abcde'})
```

### Dealing with pagination

For those API calls that support pagination, you can control both the `page` being retrieved and the number of responses to return `per_page` by adding the corresponding properties to `args`.

Example usage:

```js
const strava = require('strava-v3');
const payload = await strava.athlete.listFollowers({
    page: 1,
    per_page: 2
});
```

### Uploading files
To upload a file you'll have to pass in the `data_type` as specified in Strava's API reference as well as a string `file` designating the `<filepath>/<filename>`. If you want to get updates on the status of your upload pass in `statusCallback` along with the rest of your `args` - the wrapper will check on the upload once a second until complete.

Example usage:

```js
const strava = require('strava-v3');
const payload = await strava.uploads.post({
    data_type: 'gpx',
    file: 'data/your_file.gpx',
    name: 'Epic times',
    statusCallback: (err,payload) => {
        //do something with your payload
    }
});
```

### Rate limits
According to Strava's API each response contains information about rate limits.
For more details see: [Rate Limits](https://developers.strava.com/docs/rate-limits/)

Returns `null` if `X-Ratelimit-Limit` or `X-RateLimit-Usage` headers are not provided

#### Global status

In our promise API, only the response body "payload" value is returned as a
promise. To track rate limiting we use a global counter accessible through `strava.rateLimiting`.
 The rate limiting status is updated with each request.


    // returns true if the most recent request exceeded the rate limit
    strava.rateLimiting.exceeded()

    // returns the current decimal fraction (from 0 to 1) of rate used. The greater of the short and long term limits.
    strava.rateLimiting.fractionReached();

### Supported API Endpoints

See Strava API docs for returned data structures.

#### OAuth

* `strava.oauth.getRequestAccessURL(args)`
* `strava.oauth.getToken(code)` (Used to token exchange)
* `strava.oauth.refreshToken(code)`
* `strava.oauth.deauthorize(args)`

#### Athlete

* `strava.athlete.get(args)`
* `strava.athlete.update(args)` // only 'weight' can be updated.
* `strava.athlete.listActivities(args)` *Get list of activity summaries*
* `strava.athlete.listRoutes(args)`
* `strava.athlete.listClubs(args)`
* `strava.athlete.listZones(args)`

#### Athletes

* `strava.athletes.get(args)` *Get a single activity. args.id is required*
* `strava.athletes.stats(args)`

#### Activities

* `strava.activities.get(args)`
* `strava.activities.create(args)`
* `strava.activities.update(args)`
* `strava.activities.listZones(args)`
* `strava.activities.listLaps(args)`
* `strava.activities.listComments(args)`
* `strava.activities.listKudos(args)`

#### Clubs

* `strava.clubs.get(args)`
* `strava.clubs.listMembers(args)`
* `strava.clubs.listActivities(args)`
* `strava.clubs.listAdmins(args)`

#### Gear

* `strava.gear.get(args)`

#### Push Subscriptions

These methods Authenticate with a Client ID and Client Secret. Since they don't
use OAuth, they are not available on the `client` object.

 * `strava.pushSubscriptions.list({})`
 * `strava.pushSubscriptions.create({callback_url:...})`
 *  We set 'object\_type to "activity" and "aspect\_type" to "create" for you.
 * `strava.pushSubscriptions.delete({id:...})`

#### Running Races

 * `strava.runningRaces.get(args)`
 * `strava.runningRaces.listRaces(args)`

#### Routes

 * `strava.routes.getFile({ id: routeId, file_type: 'gpx' })` *file_type may also be 'tcx'*
 * `strava.routes.get(args)`

#### Segments

 * `strava.segments.get(args)`
 * `strava.segments.listStarred(args)`
 * `strava.segments.listEfforts(args)`
 * `strava.segments.explore(args)` *Expects arg `bounds` as a comma separated string, for two points describing a rectangular boundary for the search: `"southwest corner latitutde, southwest corner longitude, northeast corner latitude, northeast corner longitude"`*.

#### Segment Efforts

 * `strava.segmentEfforts.get(args)`

#### Streams

 * `strava.streams.activity(args)`
 * `strava.streams.effort(args)`
 * `strava.streams.segment(args)`

#### Uploads

 * `strava.uploads.post(args)`

## Error Handling

Except for the OAuth calls, errors returned will be instances of `StatusCodeError` when the HTTP status code is not 2xx. In the Promise-based API, the promise will be rejected. An error of type `RequestError` will be returned if the request fails for technical reasons.

The updated version now uses Axios for HTTP requests and custom error classes for compatibility with the previous implementation.

In the Promise-based API, errors will reject the Promise.

The project no longer relies on Bluebird. Where applicable, callback handling has been removed.

Example error checking:

```javascript
    const { StatusCodeError, RequestError } = require('./axiosUtility');

    // Catch a non-2xx response with the Promise API
    try {
        const payload = await badClient.athlete.get({});
    } catch (e) {
        if (e instanceof StatusCodeError) {
            // Handle non-2xx responses
        } else if (e instanceof RequestError) {
            // Handle technical request failures
        } else {
            // Handle other unexpected errors
        }
    }
```

The `StatusCodeError` object includes extra properties to help with debugging:

 - `name` is always `StatusCodeError`
 - `statusCode` contains the HTTP status code
 - `message` contains the response's status message and additional error details
 - `data` contains the body of the response, which can be useful for debugging
 - `options` contains the options used in the request
 - `response` contains the response object

The `RequestError` object is used for errors that occur due to technical issues, such as no response being received or request setup issues, and includes the following properties:

- `name` is always `RequestError`
- `message` contains the error message
- `options` contains the options used in the request

This update maintains feature parity with the previous implementation of `request-promise` while using the Axios HTTP client under the hood.


## Development

This package includes a full test suite runnable via `yarn test`.
It will both lint and run shallow tests on API endpoints.

### Running the tests

You'll first need to supply `data/strava_config` with an `access_token` that
has both private read and write permissions. Look in `./scripts` for a tool
to help generate this token. Going forward we plan to more testing with a mocked
version of the Strava API so testing with real account credentials are not required.

* Make sure you've filled out all the fields in `data/strava_config`.
* Use `strava.oauth.getRequestAccessURL({scope:"view_private,write"})` to generate the request url and query it via your browser.
* Strava will prompt you (the user) to allow access, say yes and you'll be sent to your Authorization Redirection URI - the parameter `code` will be included in the redirection url.
* Exchange the `code` for a new `access_token`:

```js
// access_token is at payload.access_token
const payload = await strava.oauth.getToken(authorizationCode)
```
Finally, the test suite has some expectations about the Strava account that it
connects for the tests to pass. The following should be true about the Strava
data in the account:

 * Must have at least one activity posted on Strava
 * Must have joined at least one club
 * Must have added at least one piece of gear (bike or shoes)
 * Must have created at least one route
 * Most recent activity with an achievement should also contain a segment

(Contributions to make the test suite more self-contained and robust by converting more tests
to use `nock` are welcome!)

* You're done! Paste the new `access_token` to `data/strava_config` and go run some tests:

`yarn test`.

### How the tests work

Using the provided `access_token` tests will access each endpoint individually:

* (For all `GET` endpoints) checks to ensure the correct type has been returned from the Strava.
* (For `PUT` in `athlete.update`) changes some athlete properties, then changes them back.
* (For `POST/PUT/DELETE` in `activities.create/update/delete`) first creates an activity, runs some operations on it, then deletes it.

## Debugging

You can enable a debug mode for the underlying `request` module to see details
about the raw HTTP requests and responses being sent back and forth from the
Strava API.

To enable this, set this in the environment before this module is loaded:

  NODE\_DEBUG=request

You can also set `process.env.NODE_DEBUG='request' in your script before this module is loaded.

## Resources

* [Strava Developers Center](http://www.strava.com/developers)
* [Strava API Reference](https://developers.strava.com/docs/reference/)

## Author and Maintainer

Authored by Austin Brown <austin@unboundev.com> (http://austinjamesbrown.com/).

Currently Maintained by Mark Stosberg <mark@rideamigos.com>  

