import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },

  model(params) {
    console.log('--> print model() firing');
    return this.store.findRecord('jot', params.jot_id);
  }
});
