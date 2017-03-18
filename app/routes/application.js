import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },

  model() {
    if(this.get('session.isAuthenticated')) {
      return this.store.findAll('jot');
    }
  },

  actions: {
    sessionChanged() {
      this.refresh();
    }
  }
});
