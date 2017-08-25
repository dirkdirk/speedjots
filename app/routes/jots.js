import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },

  model() {
    console.log('--> jots model() firing');
    if(this.get('session.isAuthenticated')) {
      return this.store.findAll('jot');
    } else {
      this.transitionTo('application');
    }
  },

});
