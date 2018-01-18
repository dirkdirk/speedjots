import Ember from 'ember';

export default Ember.Service.extend({
  firebaseApp:   Ember.inject.service(),
  session:       Ember.inject.service(),
  store:         Ember.inject.service(),
  flashMessages: Ember.inject.service(),
  // logger:        Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.set('router', Ember.getOwner(this).lookup('router:main'));
  },

  defaultLogInRoute:       'jots',
  defaultLogOutRoute:      'application',
  deleteButtonTimeLimitSec: 60000,
  // deleteButtonTimeLimitSec:   60,
  isLogingIn:                 false,
  safeForSecureActions:       false,
  verificationEmailSent:      false,
  resetPwEmailSentFromUserCp: false,
  resetPwEmailSentFromMenu:   false,
  // resetPwEmailSent:           false,
  isEmailVerified: Ember.computed.alias('session.currentUser.emailVerified'),
  userId:          Ember.computed.alias('session.currentUser.uid'),
  userEmail:       Ember.computed.alias('session.currentUser.email'),

  genUserName(email) { return email.match(/^([^@]*)@/)[1]; },
  goTo(route) {
    let gotoRoute = '';
    if(route === 'logInRoute') {
      gotoRoute = this.get('defaultLogInRoute');
    } else
    if(route === 'logOutRoute') {
      gotoRoute = this.get('defaultLogOutRoute');
    }
    this.set('isLogingIn', false);
    this.get('router').transitionTo(gotoRoute);
  },

  signIn(provider, loginEmail, loginPw) {
    console.log('--> services/user-utilities.js signIn() firing');
    // If user tries to login via email but fails cuz email was not verified, then user tries to login via social,
    // it fails cuz session.isAuthenticated is true. Close session first, then call login again.
    this.set('isLogingIn', true);
    if(this.get('session.isAuthenticated')) {
      this.get('session')
      .close()
      .then(() => {
        this.get('store').unloadAll();
        this.signIn(provider, loginEmail, loginPw);
      });
    } else {
      this.set('verificationEmailSent', false);
      let that = this;
      if(provider === 'password') {
        // Email login
        console.log('email login');
        let info = {
          provider: provider,
          email: loginEmail,
          password: loginPw
        };
        return that.get('session')
        .open('firebase', info)
        // User found - check data exists and email verified, update and send to user route
        .then(() => {
          console.log('email user authenticated');
          let userId = this.get('userId');
          return that.get('store').findRecord('user', userId)
          .then(() => {
            let isEmailVerified = that.get('isEmailVerified');
            if(isEmailVerified) {
              that.updateEmailUser({'setTimeStamp': true, 'currentEmail': loginEmail})
              .then(() => {
                that.goTo('logInRoute');
              })
              .catch(error => {
                console.log('signIn() updateEmailUser() error: ' + error.message);
                let errorMessage = 'Please let us know you got a signIn() updateEmailUser() error: "' +
                                   error.message +
                                   '" Thanks! (Click to close.)';
                this.get('flashMessages').add({
                  message: errorMessage,
                  type: 'danger',
                  sticky: true,
                  destroyOnClick: true,
                });
              });
            } else {
              console.log('no login cuz isEmailVerified is: ' + isEmailVerified);
            }
          })
          // User exists but no data found - create user
          .catch(error => {
            console.log('signIn() findRecord() error: ' + error.message);
            if(error.message.includes('no record was found') ||
               error.message.includes('There is no user record')) {
              return that.createEmailUser(loginEmail, loginPw)
              .catch(error => {
                console.log('User exists in Firebase but no data - signIn() createEmailUser() error: ' + error.message);
              });
            } else {
              console.log('Neither "no record was found" nor "There is no user record". So no createEmailUser().');
              let errorMessage = 'Neither "no record was found" nor "There is no user record". So no createEmailUser(). ' +
                                 'Thanks! (Click to close.)';
              this.get('flashMessages').add({
                message: errorMessage,
                type: 'danger',
                sticky: true,
                destroyOnClick: true,
              });
            }
          });
        })
        // User not found - create user
        .catch(error => {
          if(error.message.includes('The password is invalid')) {
            console.log('User password invalid - email signIn() open(firebase) error: ' + error.message);
            let errorMessage = 'The password is incorrect. Try again.';
            this.get('flashMessages').add({
              message: errorMessage,
              type: 'danger',
              sticky: false,
              timeout: 10000,
              destroyOnClick: true,
            });
          }
          if(error.message.includes('There is no user record')) {
            console.log('User not found in Firebase - email signIn() open(firebase) error: ' + error.message);
            return that.createEmailUser(loginEmail, loginPw)
            .catch(error => {
              console.log('service/user-utilities.js signIn() createEmailUser() error: ' + error.message);
            });
          }
        });
      } else {
        // Social login
        console.log('social login');
        let info = { provider: provider };
        return this.get('session')
        .open('firebase', info)
        // Update or create user and send to user route
        .then(() => {
          this.updateCreateSocialUser(provider)
          .then(() => { this.goTo('logInRoute'); })
          .catch(error => {
            console.log('social signIn() updateCreateSocialUser() error: ' + error.message);
            let errorMessage = 'Please let us know you got a signIn() updateCreateSocialUser() error: "' +
                               error.message +
                               '" Thanks! (Click to close.)';
            this.get('flashMessages').add({
              message: errorMessage,
              type: 'danger',
              sticky: true,
              destroyOnClick: true,
            });
          });
        })
        .catch(error => {
          console.log('signIn() open.firebase error: ' + error.message);
          let errorMessage = `Try again login again. Try closing all browser windows and login again.
                              If the problem persist, let us know about this social login error: "${error.message}"
                              Thanks! (Click to close.)`;
          this.get('flashMessages').add({
            message: errorMessage,
            type: 'danger',
            sticky: true,
            destroyOnClick: true,
          });
          this.signOut();
        });
      }
    }
  },
  signOut() {
    console.log('--> services/user-utilities.js signOut() firing');
    let isAuthenticated = this.get('session.isAuthenticated');
    if(isAuthenticated) {
      let session = this.get('session');
      let logger  = this.get('logger');
      logger.submit({
        type:    logger.types.user,
        title:   logger.titles.logout,
        saveNow: true
      })
      .then(() => {
        session.close()
        .then(() => {
          console.log('Session closed, unloading store, and going to application route.');
          this.set('safeForSecureActions',       false);
          this.set('verificationEmailSent',      false);
          this.set('resetPwEmailSentFromUserCp', false);
          this.set('resetPwEmailSentFromMenu',  false);
          this.get('store').unloadAll();
          this.goTo('logOutRoute');
        });
      })
      .catch(error => {
        let details = `services/user-utilities.js signOut() error:<br>${error.message}`;
        console.log(details);
        logger.submit({
          type:    logger.types.error,
          title:   logger.titles.logout,
          details: details
        });
      });
    } else {
      this.goTo('logOutRoute');
    }
  },
  deleteUser() {
    console.log('--> services/user-utilities.js deleteUser() firing');
    let userId  = this.get('userId');
    let logger  = this.get('logger');
    let session = this.get('session');
    this.get('store').findRecord('user', userId)
    .then(user => {
      logger.submit({
        type:    logger.types.user,
        title:   logger.titles.deleteAccount,
        saveNow: true
      })
      .then(() => {
        user.destroyRecord()
        .then(() => {
          console.log('destroyRecord() done.');
          this.get('firebaseApp')
          .auth().currentUser
          .delete()
          .then(() => {
            console.log('user deleted');
            session.close()
            .then(() => {
              this.signOut();
            });
          });
        })
        .catch(error => {
          let details = `services/user-utilities.js deleteUser() destroyRecord() error:<br>${error.message}`;
          console.log(details);
          logger.submit({
            type:    logger.types.error,
            title:   logger.titles.deleteAccount,
            details: details,
            saveNow: true
          });
        });
      });
    })
    .catch(error => {
      let details = `services/user-utilities.js deleteUser() findRecord() error:<br>${error.message}`;
      console.log(details);
      this.signOut();
    });
  },

  updateCreateSocialUser(provider) {
    console.log('--> services/user-utilities.js updateCreateSocialUser() firing');
    if(this.get('session.isAuthenticated')) {
      let logger    = this.get('logger');
      let store     = this.get('store');
      let userId    = this.get('userId');
      let userEmail = this.get('userEmail');
      let timeStamp = Date.now();
      return store.findRecord('user', userId)
      .then(user => {
        console.log('updating lastLoginTime timestamp: ' + timeStamp);
        user.set('lastLoginTime', timeStamp);
        user.save()
        .then(() => {
          logger.submit({
            type:    logger.types.user,
            title:   logger.titles.socialLogin
          });
        })
        .catch(error => {
          let details = `services/user-utilities.js updateCreateSocialUser() store.findRecord error:<br>${error.message}`;
          console.log(details);
          logger.submit({
            type:    logger.types.error,
            title:   logger.titles.socialLogin,
            details: details
          });
        });
      })
      .catch(error => {
        console.log('updateCreateSocialUser error: ' + error.message);
        if(error.message.includes('no record was found at')) {
          console.log('creating new user with default values');
          let newUser = store.createRecord('user', {
            id: userId,
            // Enter new user defaults here:
            settings: { 0: { "lastLogin": timeStamp, "theme": "light" } },
            jots: { 0: { "title":       "Jot 1",
                         "content":     "",
                         "tags":        "tags",
                         "group":       "Not Grouped",
                         "inTrash":     false,
                         "dateCreated": timeStamp } }
          });
          newUser.save()
          .then(() => {
            logger.submit({
              type:    logger.types.user,
              title:   logger.titles.newSocialAccount
            });
          })
          .catch(error => {
            let details = `services/user-utilities.js updateCreateSocialUser() newUser.save() error:<br>${error.message}`;
            console.log(details);
            logger.submit({
              type:    logger.types.error,
              title:   logger.titles.newSocialAccount,
              details: details
            });
          });
        }
      });
    }
  },
  createEmailUser(loginEmail, loginPw) {
    console.log('--> services/user-utilities.js createEmailUser() firing');
    let logger    = this.get('logger');
    let store     = this.get('store');
    let timeStamp = Date.now();
    return this.get('firebaseApp').auth()
    .createUserWithEmailAndPassword(loginEmail, loginPw)
      .then(user => {
        let userId  = user.uid;
        let newUser = store.createRecord('user', {
          id: userId,
          // Enter new user defaults here:
          settings: { 0: { "lastLogin": timeStamp, "theme": "light" } },
          jots: { 0: { "title":       "Jot 1",
                       "content":     "",
                       "tags":        "tags",
                       "group":       "Not Grouped",
                       "inTrash":     false,
                       "dateCreated": timeStamp } }
        });
        return newUser.save()
          .then(() => {
            console.log('sending verify email');
            this.sendEmailVerificationFn();
            // logger.submit({
            //   type:    logger.types.user,
            //   title:   logger.titles.newEmailAccount,
            //   details: 'New email account created and verificationEmailSent().'
            // });
          });
    })
    .catch(error => {
      let details = `services/user-utilities.js createEmailUser() createUserWithEmailAndPassword() error:<br>${error.message}`;
      console.log(details);
      this.get('flashMessages').add({
        message: error.message,
        type: 'danger',
        sticky: true,
        destroyOnClick: true,
      });
      // logger.submit({
      //   type:    logger.types.error,
      //   title:   logger.titles.emailLogin,
      //   details: details
      // });
      if(error.message.includes('The email address is already in use')) {
        let userId = this.get('userId');
        let newUser = store.createRecord('user', {
          id: userId,
          // Enter new user defaults here:
          settings: { 0: { "lastLogin": timeStamp, "theme": "light" } },
          jots: { 0: { "title":       "Jot 1",
                       "content":     "",
                       "tags":        "tags",
                       "group":       "Not Grouped",
                       "inTrash":     false,
                       "dateCreated": timeStamp } }
        });
        return newUser.save()
        .then(() => {
          console.log('User data recreated.');
          // logger.submit({
          //   type:    logger.types.error,
          //   title:   logger.titles.emailLogin,
          //   details: 'Email account created because: "error.message.includes(`The email address is already in use`)".'
          // });
          this.goTo('logInRoute');
        });
      }
    });
  },

  updateEmailUser(params) {
    console.log('--> services/user-utilities.js updateEmailUser() firing');
    let logger       = this.get('logger');
    let setTimeStamp = params.setTimeStamp ? true : false;
    let newEmail     = params.newEmail ? params.newEmail : false;
    let currentEmail = params.currentEmail;
    let store        = this.get('store');
    let userId       = this.get('userId');
    return store.findRecord('user', userId)
    .then(user => {
      console.log('updating lastLoginTime');
      if(setTimeStamp) { user.set('lastLoginTime', Date.now()); }
      user.set('emailOld', currentEmail);
      if(newEmail) {
        user.set('email', newEmail);
        user.set('emailVerified', false);
      } else {
        user.set('emailVerified', true);
      }
      user.save()
      .then(() => {
        if(newEmail) {
          this.sendEmailVerificationFn();
          logger.submit({
            type:    logger.types.user,
            title:   logger.titles.emailAddressUpdate,
            details: `Email address updated from (${currentEmail}) to (${newEmail}) and verificationEmailSent().`
          });
        } else {
          logger.submit({
            type:    logger.types.user,
            title:   logger.titles.emailLogin
          });
        }
      })
      .catch(error => {
        let details = `services/user-utilities.js updateEmailUser() user.save error:<br>${error.message}`;
        console.log(details);
        logger.submit({
          type:    logger.types.error,
          title:   logger.titles.emailAddressUpdate,
          details: details
        });
      });
    })
    .catch(error => {
      let details = `services/user-utilities.js updateEmailUser() findRecord error:<br>${error.message}`;
      console.log(details);
      logger.submit({
        type:    logger.types.error,
        title:   logger.titles.emailAddressUpdate,
        details: details
      });
    });
  },
  updateEmailAddressTo(newEmail) {
    console.log('--> services/user-utilities.js updateEmailAddressTo() firing');
    let logger       = this.get('logger');
    let currentEmail = this.get('userEmail');
    return this.get('firebaseApp')
    .auth().currentUser
    .updateEmail(newEmail)
    .then(() => {
      console.log('email successfully updated');
      this.updateEmailUser({ 'setTimeStamp': false, 'newEmail': newEmail, 'currentEmail': currentEmail });
    })
    .catch(error => {
      let details = `services/user-utilities.js updateEmailAddressTo() get.firebaseApp error:<br>${error.message}`;
      console.log(details);
      logger.submit({
        type:    logger.types.error,
        title:   logger.titles.emailAddressUpdate,
        details: details
      });
      let emailAlreadyUsed = 'The email address is already in use by another account.';
      let errorMessage = '';
      if(error.message.includes(emailAlreadyUsed)) {
        errorMessage = emailAlreadyUsed + ' (Click to close.)';
      } else {
        errorMessage = `Please let us know that your got the following error in updateEmailAddressTo(): "${error.message}" Thanks! (Click to close.)`;
      }
      this.get('flashMessages').add({
        message: errorMessage,
        type: 'danger',
        sticky: true,
        destroyOnClick: true,
      });
      throw new Error(error.message);
    });
  },
  sendEmailVerificationFn() {
    console.log('--> services/user-utilities.js sendEmailVerificationFn() firing');
    let logger = this.get('logger');
    return this.get('firebaseApp').auth().currentUser
    .sendEmailVerification()
    .then(() => {
      console.log('verification email sent');
      this.set('verificationEmailSent', true);
    })
    .catch(error => {
      let details = `services/user-utilities.js sendEmailVerificationFn() error:<br>${error.message}`;
      console.log(details);
      logger.submit({
        type:    logger.types.error,
        title:   logger.titles.sendEmailVerification,
        details: details
      });
    });
  },
  sendPwResetEmail(email) {
    console.log('--> services/user-utilities.js sendPwResetEmail() firing');
    let logger = this.get('logger');
    let setResetPwEmailSentFromUserCp = true;
    let setResetPwEmailSentFromMenu   = true;
    if(email) {
      setResetPwEmailSentFromUserCp = false;  // If reset email from landing page, don't need notice in User CP.
    } else {
      email = this.get('userEmail');
      setResetPwEmailSentFromMenu = false;  // If reset email from User Cp, don't need notice on index page.
    }
    return this.get('firebaseApp').auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      console.log(` --> pw reset email sent to: ${email}`);
      if(setResetPwEmailSentFromUserCp) {
        this.set('resetPwEmailSentFromUserCp', true);
      }
      if(setResetPwEmailSentFromMenu) {
        this.set('resetPwEmailSentFromMenu', true);
      }
      // this.set('resetPwEmailSent', true);
      this.get('flashMessages').add({
        message: 'Check your email for a password reset link.',
        type: 'success',
        sticky: true,
        destroyOnClick: true,
      });
      // logger.submit({
      //   type:  logger.types.user,
      //   title: logger.titles.sendPwResetVerification
      // });
    })
    .catch(error => {
      let details = `services/user-utilities.js sendPwResetEmail() error:<br>${error.message}`;
      console.log(details);
      // logger.submit({
      //   type:    logger.types.error,
      //   title:   logger.titles.sendPwResetVerification,
      //   details: details
      // });
    });
  },

  safeForSecureActionsTimer: function() {
    let deleteButtonTimeLimit = this.get('deleteButtonTimeLimitSec') * 1000;
    Ember.run.later(this, function() {
      console.log('safeForSecureActionsTimer - time expired');
      this.set('safeForSecureActions', false);
    }, deleteButtonTimeLimit);
  },
  safeForSecureActionsLoginTimeOut(user) {
    let limitSec  = this.get('deleteButtonTimeLimitSec');
    let lastLoginTime = user.get('lastLoginTime');
    // console.log('lastLoginTime: ' + lastLoginTime);
    let timeStamp = Date.now();
    let logedinTimeSec = (timeStamp - lastLoginTime) / 1000;
    if(logedinTimeSec > limitSec) {
      console.log('safeForSecureActionsLoginTimeOut - logged in too long');
      this.set('safeForSecureActions', false);
    }
  },
});
