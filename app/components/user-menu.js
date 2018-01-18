import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  userUtilities: Ember.inject.service(),

  actions: {
    signOut: function() {
      console.log('--> components/user-menu.js signOut() firing');
      this.get('session').close().then(() => {
        console.log(' -- triggerAction transitTo()');
        // TODO advised to not use triggerAction() - see above for more info ...
        this.triggerAction({ action: 'transitTo', target: this.get('route') });
      });
    },
    changePw() {
      console.log('--> components/user-menu.js changePw() firing');
      // let userUtilities = this.get('userUtilities');
      // let userEmail = userUtilities.userEmail;
      // userUtilities.sendPwResetEmail();
      this.get('userUtilities').sendPwResetEmail();
    },
    toAbout: function() {
      console.log('--> components/user-menu.js toAbout() firing');
      this.triggerAction({ action: 'transitToAbout', target: this.get('route') });
    },
    toHowTo: function() {
      console.log('--> components/user-menu.js toHowTo() firing');
      this.triggerAction({ action: 'transitToHowTo', target: this.get('route') });
    },
    toGithub: function() {
      console.log('--> components/user-menu.js toGithub() firing');
      window.open('https://github.com/dirkdirk/speedjots');
    },
  }


});
