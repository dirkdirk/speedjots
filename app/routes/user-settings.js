import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    if(this.get('session.isAuthenticated')) {
      return this.store.find('setting', 0);
    }
  },
});
