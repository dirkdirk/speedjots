import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  // this.route('user-settings');
  this.route('jots', function() {
    this.route('jot', {path: ':jot_id'});
  });
});

export default Router;
