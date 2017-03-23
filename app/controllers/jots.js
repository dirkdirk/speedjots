import Ember from 'ember';
import groupBy from 'ember-group-by';

export default Ember.Controller.extend({
  sortModelBy: ['title'],
  sortedModel: Ember.computed.sort('model', 'sortModelBy'),
  sortGroupsBy: ['value'],
  jotsByGroup: groupBy('model', 'group'),
  sortedJotsByGroup: Ember.computed.sort('jotsByGroup', 'sortGroupsBy'),

  saveNewJot() {
    console.log('--> newJot() firing ...');
    this.store.createRecord('jot', {
      title: 'New jot ...',
      tags: 'new',
      text: 'Insert wisdom here ...',
      group: 'Not Grouped'
    }).save().then((result) => {
      console.log('  ... created id: ' + result.id);
      this.transitionToRoute('jots.jot', result.id);
    });
  },

  actions: {
    newJot() {
      Ember.run.debounce(this, this.saveNewJot, 300);
    }
  }
});
