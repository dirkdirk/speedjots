import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    console.log('--> beforeModel()');
    Ember.$('.simditor').parent().remove();
    // this.destroy();
  },
  model(params) {
    if(this.get('session.isAuthenticated')) {
      return this.store.findRecord('jot', params.jot_id);
    } else {
      this.transitionTo('application');
    }
  }
});
