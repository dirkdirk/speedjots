/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  // app.import('vendor/ios-drag-drop.js');    // https://github.com/timruffles/ios-html5-drag-drop-shim
  // Mobile dnd
  // The above script is loading, but I'm not sure if it's working on mobile.
  // Need to test:
  //  - Add a dnd object to SJ that doesn't reply on the Ember add-on.
  //    This will prove that the script works or not and the problem is with the add-on.


  // app.import('public/assets/js/ios-drag-drop.js');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
