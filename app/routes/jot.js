import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    if(this.get('session.isAuthenticated')) {
      return this.store.findRecord('jot', params.jot_id);
    } else {
      this.transitionTo('application');
    }
  }
});
