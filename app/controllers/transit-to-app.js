import Ember from 'ember';

export default Ember.Controller.extend({
  // Default catch-all for bad urls - see router.js
  init(){
    this._super(...arguments);
    this.transitionToRoute('application');
  }
});
