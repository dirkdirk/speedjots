import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  createUpdateUser() {
    console.log('--> createUpdateUser() firing');
    if(this.get('session.isAuthenticated')) {
      let store = this.get('store');
      let uid = this.get('session.currentUser.uid');
      let timeStamp = Date.now();
      store.findRecord('setting', 0)
           .then((result) => {
             console.log(' -- updating lastLogin timestamp');
             result.set('lastLogin', timeStamp);
             result.save();
           })
           .catch((error) => {
             console.log(' -- createUpdateUser error.message');
             console.log(error.message);
             if(error.message.includes('no record was found at')) {
               console.log(' -- creating new user with default values');
               let newUser = store.createRecord('user', {
                 id: uid,
                 // Enter new user defaults here:
                 settings: { 0: { "lastLogin": timeStamp, "theme": "light" } },
                 jots: { 0: { "title": "Jot 1",
                              "text": "Text 1",
                              "tags": "Tag 1",
                              "group": "Not Grouped" },
                         1: { "title": "Jot 2",
                                       "text": "Text 2",
                                       "tags": "Tag 2",
                                       "group": "Not Grouped" },
                         2: { "title": "Jot 3",
                                       "text": "Text 3",
                                       "tags": "Tag 3",
                                       "group": "Best of group" },
                         3: { "title": "Jot 4",
                                       "text": "Text 4",
                                       "tags": "Tag 4",
                                       "group": "Best of group" } }
               });
               newUser.save();
             }
           });
    }
  },

  actions: {
    signIn: function(provider) {
      console.log('--> signIn() firing');
      this.get('session').open('firebase', { provider: provider }).then(() => {
        // console.log(' -- data.currentUser returned from Firebase authentication');
        // console.log(data.currentUser);
        this.createUpdateUser();
        console.log(' -- triggerAction transitTo()');
        this.triggerAction({ action: 'transitTo', target: this.get('parentView') } );
      }).catch(function(error) {
        console.log(' -- signIn error.message:');
        console.log(error.message);
      });
    },
    signOut: function() {
      console.log('--> signOut() firing');
      this.get('session').close().then(() => {
        console.log(' -- triggerAction transitTo()');
        this.triggerAction({ action: 'transitTo', target: this.get('parentView') } );
      });
    },
  }
});
