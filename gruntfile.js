/**
 * Created by austin on 9/23/14.
 */

module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json')
        , jshint: {
            files: ['gruntfile.js', 'lib/*.js'],
            options: {
                maxlen: 80
                , quotmark: 'single'
                , laxcomma: true
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
};
