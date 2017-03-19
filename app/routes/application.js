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
      console.log('--> sessionChanged() firing before debounce');
      let refreshRoute = function() {
        console.log('--> sessionChanged() firing after debounce');
        return this.refresh();
      };
      Ember.run.debounce(this, refreshRoute, 2000);
    }
  }
});
