import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },

  model() {
    console.log('--> index model() firing');
    if(this.get('session.isAuthenticated')) {
      console.log('  -- session isAuthenticated, transitioning to "jots"');
      this.transitionTo('jots');
    }
  }

});
