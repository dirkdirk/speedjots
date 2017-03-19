import Ember from 'ember';

export default Ember.Controller.extend({
  sortModelBy: ['title'],
  sortedModel: Ember.computed.sort('model', 'sortModelBy'),

  devUser() {
    return this.get('session.currentUser.displayName') === 'Dirk Bruins' ? true : false;
  },

  actions: {
    newJot() {
      console.log('--> newJot() firing ...');
      this.store.createRecord('jot', {
        title: 'New jot ...',
        tags: 'new',
        text: 'Insert wisdom here ...'
      }).save().then((result) => {
        console.log('  ... created id: ' + result.id);
        this.transitionToRoute('jots.jot', result.id);
      });
    },
  }
});
