import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  sortModelBy: ['title'],
  sortedModel: Ember.computed.sort('model', 'sortModelBy'),

  actions: {
    newJot() {
      console.log('adding new jot ...');
      this.store.createRecord('jot', {
        title: 'New jot ...',
        tags: 'new',
        text: 'Insert wisdom here ...'
      }).save().then((result) => {
        console.log('created id: ' + result.id);
        this.transitionToRoute('jot', result.id);
      });
    },
    googleLogin() {
      this.get('session').googleLogin();
    },
    login(email, password) {
      this.get('session').login(email, password);
    },
    register(email, displayName, password) {
      this.get('session').register(email, displayName, password);
    },
    logout() {
      this.get('session').logout();
    },
  }
});
