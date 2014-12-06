// an example karma.conf.js
module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: ['jasmine'],

        browsers: [
            // for CI
            // 'PhantomJS',
            'Firefox'
        ],
        reporters: ['progress', 'junit'],
        // set true for CI
        singleRun: false,
        // set false for CI
        autoWatch : true,

        junitReporter: {
            outputFile: 'target/reports/js/karma-test-results.xml',
            suite: 'unit'
        },

        files: [
            // Required libraries
            'grails-app/assets/bower_components/jquery/dist/jquery.js',
            'grails-app/assets/bower_components/angular/angular.js',

            // App under test
            'grails-app/assets/javascripts/**/*.js',

            // Tests
            'grails-app/assets/bower_components/angular-mocks/angular-mocks.js',

            // Fixtures from Backend
            'test/js-fixtures/**/*.js',

            // Tests
            'test/js/**/*.js'
        ],

        plugins: [
            'karma-jasmine',
            // 'karma-chrome-launcher',
            // for CI
            // 'karma-phantomjs-launcher',
            'karma-junit-reporter'
        ]

    });
};