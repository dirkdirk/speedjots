import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },

  model() {
    console.log('--> routes/index model() firing');
    if(this.get('session.isAuthenticated')) {
      console.log('  -- session isAuthenticated, transitioning to "jots"');
      this.transitionTo('jots');
    }
  },

  setupController(controller) {
    this._super(...arguments);
    console.log('--> routes/index setupController() firing');
    controller.set('loginEmail',      null);
    controller.set('loginPw',         null);
    controller.set('displayLoginDiv', false);
    controller.displayLoginDivObs();
  },

});
