/**
 * Created by austin on 9/23/14.
 */

module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json')
        , jshint: {
            all: ['gruntfile.js', 'lib/*.js'],
            options: {
                maxlen: 80
                , quotmark: 'single'
                , laxcomma: true
            }
        }
        , simplemocha: {
            options: {
                globals: ['should']
                , timeout: 20000
                , ignoreLeaks: false
                , ui: 'bdd'
                , reporter: 'spec'
            },
            all: { src: ['test/*.js'] }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');

    grunt.registerTask('default', ['jshint', 'simplemocha']);
};
