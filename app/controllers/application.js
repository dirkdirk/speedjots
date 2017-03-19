import Ember from 'ember';

export default Ember.Controller.extend({
  sortModelBy: ['title'],
  sortedModel: Ember.computed.sort('model', 'sortModelBy'),

  devUser() {
    return this.get('session.currentUser.displayName') === 'Dirk Bruins' ? true : false;
  },

  observeSession: function() {
    console.log('--> observeSession() firing');
    if(this.get('session.isAuthenticated')) {
      console.log('  -- session isAuthenticated');
      this.send('sessionChanged');
    }
  }.observes('session.isAuthenticated'),

  actions: {
    newJot() {
      console.log('--> newJot() firing ...');
      this.store.createRecord('jot', {
        title: 'New jot ...',
        tags: 'new',
        text: 'Insert wisdom here ...'
      }).save().then((result) => {
        console.log('  ... created id: ' + result.id);
        this.transitionToRoute('jot', result.id);
      });
    },
  }
});
