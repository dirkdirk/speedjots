import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },

  model() {
    console.log('--> application model() firing');
    if(this.get('session.isAuthenticated')) {
      console.log('  -- session isAuthenticated, transitioning to "jots"');
      this.transitionTo('jots');
    }
  },

  actions: {
    transitTo() {
      console.log('--> application route transitTo() firing');
      if(this.get('session.isAuthenticated')) {
        console.log('  -- session isAuthenticated, transitioning to "jots"');
        this.transitionTo('jots');
      } else {
        console.log('  -- session NOT isAuthenticated, transitioning to "application"');
        this.transitionTo('application');
      }
    },
  }
});
