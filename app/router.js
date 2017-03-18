import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('jot', {path: ':jot_id'});
  this.route('user-settings');
});

export default Router;
