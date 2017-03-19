import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    return this.get('session').fetch().catch(function() {});
  },

  observeSession: function() {
    console.log('--> observeSession() firing');
    if(this.get('session.isAuthenticated')) {
      console.log('  -- session isAuthenticated in observeSession(), transitioning to route "jots" ...');
      this.transitionTo('jots');
    } else {
      this.transitionTo('application');
    }
  }.observes('session.isAuthenticated'),
});
