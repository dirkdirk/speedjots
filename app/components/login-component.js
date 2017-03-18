import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  createUpdateUser() {
    console.log('createUpdateUser() firing');
    if(this.get('session.isAuthenticated')) {
      let store = this.get('store');
      let uid = this.get('session.currentUser.uid');
      let timeStamp = Date.now();
      let devUser = this.get('session.currentUser.displayName') === 'Dirk Bruins' ? true : false;
      store.findRecord('setting', 0)
           .then((result) => {
             console.log(' -- updating lastLogin timestamp');
             result.set('lastLogin', timeStamp);
             result.save();
           })
           .catch((error) => {
             console.log(' -- error.message');
             console.log(error.message);
             if(error.message.includes('no record was found at')) {
               console.log(' -- creating new user with default values');
               let newUser = store.createRecord('user', {
                 id: uid,
                 // Enter new user defaults here:
                 settings: { 0: { "lastLogin": timeStamp, "theme": "light" } },
                 jots: { 0: { "title": "Jot 1", "text": "Text 1", "tags": "Tag 1" } }
               });
               newUser.save().then(() => {
                 console.log(' -- reloading page');
                 location.reload();  // Only required if menu is dependent on db values.
               });
             }
           });
    }
  },

  actions: {
    signIn: function(provider) {
      console.log('signIn() firing');
      this.get('session').open('firebase', { provider: provider }).then((data) => {
        console.log(' -- data.currentUser returned from Firebase authentication');
        console.log(data.currentUser);
        this.createUpdateUser();
      }).catch(function(error) {
        console.log(' -- signIn error:');
        console.log(error);
      });
    },
    signOut: function() {
      console.log('signOut() firing');
      this.get('session').close();
    },
  }
});
