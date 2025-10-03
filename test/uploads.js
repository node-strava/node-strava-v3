require('es6-promise').polyfill()

var should = require('should')
const strava = require('../')

describe('uploads_test', function () {
  describe('#post()', function () {
    it('should upload a GPX file', async () => {
      // Update datetime in gpx file to now, so Strava doesn't reject it as a duplicate
      const sampleGpxFilename = 'test/assets/gpx_sample.gpx'
      const gpxFilename = 'data/gpx_temp.gpx'
      const now = new Date()
      let gpx = require('fs').readFileSync(sampleGpxFilename, 'utf8')
      gpx = gpx.replaceAll(/<time>PLACEHOLDER<\/time>/g, '<time>' + now.toISOString() + '</time>')
      require('fs').writeFileSync(gpxFilename, gpx, 'utf8')

      await new Promise(async (resolve, reject) => {
        await strava.uploads.post({
          activity_type: 'run',
          sport_type: 'Run',
          data_type: 'gpx',
          name: 'test activity',
          file: gpxFilename,
          statusCallback: function (err, payload) {
            if (err) {
              reject(err);
            }

            if (payload.activity_id != null && payload.status == 'Your activity is ready.') {
              payload.activity_id.should.be.a.Number()
              resolve(payload.activity_id)
            }
          }
        })
      });
    })
  })
})
