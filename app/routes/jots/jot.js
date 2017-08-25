import Ember from 'ember';

export default Ember.Route.extend({
  panelActions: Ember.inject.service(),

  model(params) {
    console.log('--> jot model() firing');
    return Ember.RSVP.hash({
      jot:  this.store.findRecord('jot', params.jot_id),
      jots: this.store.findAll('jot')
    });
  },

  afterModel(model) {
    console.log('--> jot afterModel() firing');
    let panelToOpen = model.jot.get('group');
    this.get('panelActions').open(panelToOpen);
  },

});
