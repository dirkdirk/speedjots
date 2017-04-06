import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    console.log('--> jot model() firing');
    // return this.store.findRecord('jot', params.jot_id);
    return Ember.RSVP.hash({
      jot: this.store.findRecord('jot', params.jot_id),
      jots: this.store.findAll('jot')
    });
  }
});
