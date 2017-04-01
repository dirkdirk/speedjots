import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),

  updateCreateUser() {
    console.log('--> updateCreateUser() firing');
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
             console.log(' -- updateCreateUser error.message');
             console.log(error.message);
             if(error.message.includes('no record was found at')) {
               console.log(' -- creating new user with default values');
               let newUser = store.createRecord('user', {
                 id: uid,
                 // Enter new user defaults here:
                 settings: { 0: { "lastLogin": timeStamp, "theme": "light" } },
                 jots: { 0: { "title": "Jot 1",
                              "content": "Text 1",
                              "tags": "Tag 1",
                              "group": "Not Grouped" },
                         1: { "title": "Jot 2",
                                       "content": "Text 2",
                                       "tags": "Tag 2",
                                       "group": "Not Grouped" },
                         2: { "title": "Jot 3",
                                       "content": "Text 3",
                                       "tags": "Tag 3",
                                       "group": "Best of Group" },
                         3: { "title": "Jot 4",
                                       "content": "Text 4",
                                       "tags": "Tag 4",
                                       "group": "Best of Group" } }
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
        this.updateCreateUser();
        console.log(' -- triggerAction transitTo()');
        // TODO advised to not use triggerAction() - alexspeller [2:47 PM] - you can either use `sendAction` to send a classic style action to the route, or use ember-route-action-helper addon to use closure actions directly. sendAction and action bubbling is the old way of doing it (edited) [2:54] I’d advise just sticking to closure actions and using ember-route-action addon if you really need to send to routes
        this.triggerAction({ action: 'transitTo', target: this.get('route') });
        // this.triggerAction({ action: 'transitTo', target: this.get('parentView') });
      }).catch(function(error) {
        console.log(' -- signIn error.message:');
        console.log(error.message);
      });
    },
    signOut: function() {
      console.log('--> signOut() firing');
      this.get('session').close().then(() => {
        console.log(' -- triggerAction transitTo()');
        // TODO advised to not use triggerAction() - see above for more info ...
        this.triggerAction({ action: 'transitTo', target: this.get('route') });
      });
    },
  }
});
