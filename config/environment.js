/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'speed-jots',
    environment: environment,
    rootURL: '/',
    locationType: 'hash',
    torii: {
      sessionServiceName: 'session'
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    ENV['firebase'] = {
      apiKey: "AIzaSyD6vTFAtiL_3gZN9J5Wzu4phkuak05mCO0",
      authDomain: "speedjotsdev.firebaseapp.com",
      databaseURL: "https://speedjotsdev.firebaseio.com",
      projectId: "speedjotsdev",
      storageBucket: "speedjotsdev.appspot.com",
      messagingSenderId: "806645394657"
    };
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV['firebase'] = {
      apiKey: "AIzaSyBGFRaMp3XIbJxXq_f8WoAxkwYEttedctg",
      authDomain: "speed-jots.firebaseapp.com",
      databaseURL: "https://speed-jots.firebaseio.com",
      projectId: "speed-jots",
      storageBucket: "speed-jots.appspot.com",
      messagingSenderId: "931687315620"
    };
  }

  return ENV;
};
