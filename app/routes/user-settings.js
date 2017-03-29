import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },

  model() {
    console.log('--> user-settings model() firing');
    if(this.get('session.isAuthenticated')) {
      return this.store.find('setting', 0);
    }
  },
});
