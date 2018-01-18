import Ember from 'ember';

export default Ember.Controller.extend({
  userUtilities: Ember.inject.service(),
  // logger:        Ember.inject.service(),

  loginEmail:      null,
  loginPw:         null,
  displayLoginDiv: false,
  isEmailVerified: Ember.computed.alias('userUtilities.isEmailVerified'),
  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),
  verificationEmailSent: Ember.computed.alias('userUtilities.verificationEmailSent'),
  verificationEmailSentObs: Ember.observer('verificationEmailSent', function() {
    let verificationEmailSent = this.get('verificationEmailSent');
    if(verificationEmailSent) {
      this.get('flashMessages').add({
        message: 'Check your email inbox for a verification link. Then come login.',
        type: 'success',
        sticky: true,
        destroyOnClick: true,
      });
    }
  }),
  displayLoginDivObs: Ember.observer('isAuthenticated', function() {
    console.log('--> displayLoginDivObs() firing');
    let isAuthenticated = this.get('isAuthenticated');
    let isEmailVerified = this.get('isEmailVerified');
    if(!isAuthenticated) {
      this.set('displayLoginDiv', true);
    } else
    if(isAuthenticated && isEmailVerified) {
      this.set('displayLoginDiv', false);
    } else
    if(isAuthenticated && !isEmailVerified) {
      this.set('displayLoginDiv', true);
    }
  }),
  emailValidation: [{
    message: 'Provide email in a valid format.',
    validate: (inputValue) => {
      let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailPattern.test(inputValue);
    }
  }],

  actions: {
    signIn: function(provider) {
      let loginEmail = this.get('loginEmail');
      let loginPw    = this.get('loginPw');
      this.get('userUtilities')
      .signIn(provider, loginEmail, loginPw)
      .catch(error => {
        console.log('signIn() on controllers/index.js error: ' + error.message);
        this.get('flashMessages').add({
          message: error.message,
          type: 'danger',
          sticky: true,
          destroyOnClick: true,
        });
        // let logger  = this.get('logger');
        // logger.submit({
        //   type:    logger.types.error,
        //   title:   logger.titles.loginError,
        //   details: error.message,
        //   saveNow: true
        // });
      });
    },
    resendEmailVerification() {
      console.log('--> controllers/index.js resendEmailVerification() firing');
      // let logger  = this.get('logger');
      // logger.submit({
      //   type:    logger.types.user,
      //   title:   logger.titles.resendEmailVerification,
      //   saveNow: true
      // });
      this.get('userUtilities').sendEmailVerificationFn();
    },
    // changePw() {
    //   console.log('--> controllers/index.js changePw() firing');
      // let userUtilities = this.get('userUtilities');
      // let userEmail = userUtilities.userEmail;
      // userUtilities.sendPwResetEmail();
    //   this.get('userUtilities').sendPwResetEmail();
    // },
    changePw() {
      console.log('--> controllers/index.js changePw() firing');
      let loginEmail = this.get('loginEmail');
      if(loginEmail) {
        this.get('userUtilities').sendPwResetEmail(loginEmail);
      } else {
        this.get('flashMessages').add({
          message: 'Enter an email address.',
          type: 'danger',
          sticky: true,
          destroyOnClick: true,
        });
      }
    }
  },
});
