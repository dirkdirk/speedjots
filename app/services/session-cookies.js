// import Ember from 'ember';
// import firebase from 'firebase';
//
// var devConsole = true;
//
// export default Ember.Service.extend({
//   devConsole,
//   cookies: Ember.inject.service(),
//
//   auth: firebase.auth(),
//   currentUser: null,
//
//   googleLogin() {     // https://firebase.google.com/docs/auth/web/google-signin
//     if(devConsole) { console.log('googleLogin() fired'); }
//     let auth = this.get('auth');
//     let provider = new firebase.auth.GoogleAuthProvider();
//     return auth.signInWithPopup(provider).then((result) => {
//       let userId = result.user.uid;
//       let userPhotoURL = result.user.photoURL;
//       return this.setLogedInUser(userId, userPhotoURL);
//     }).catch((error) => {
//       console.log(error);
//     });
//   },
//
//   login(email, password) {
//     if(devConsole) { console.log('login() fired'); }
//     let auth = this.get('auth');
//     return auth.signInWithEmailAndPassword(email, password).then((firebaseUser) => {
//       let userId = firebaseUser.uid;
//       return this.setLogedInUser(userId, '');
//     }).catch((error) => {
//       console.log(error);
//     });
//   },
//
//   setLogedInUser(userId, userPhotoURL) {
//     if(devConsole) { console.log('setLogedInUser() fired'); }
//     let devMode = userId === 'JWTadm11oBhpFBiifyhIFJ14YHQ2' ? true : false;
//     this.set('currentUser', { 'id': userId, 'photoURL': userPhotoURL, 'devMode': devMode });
//     this.get('cookies').write('currentUser', JSON.stringify(this.get('currentUser')));
//   },
//
//   register(email, password) {
//     if(devConsole) { console.log('register() fired'); }
//     let auth = this.get('auth');
//     return auth.createUserWithEmailAndPassword(email, password).then((firebaseUser) => {
//       let userId = firebaseUser.uid;
//       this.setLogedInUser(userId, '');
//     }).catch((error) => {
//       console.log(error);
//     });
//   },
//
//   logout() {
//     if(devConsole) { console.log('logout() fired'); }
//     let auth = this.get('auth');
//     auth.signOut().then(() => {
//       if(devConsole) { console.log('Google logout successful'); }
//     }).catch((error) => {
//       console.log('Google logout error: ' + error);
//     });
//     this.set('currentUser', null);
//     this.get('cookies').clear('currentUser');
//   },
//
//   setUserIfCookie: function() {
//     if(devConsole) { console.log('setUserIfCookie() fired'); }
//     let currentUserObj = this.get('cookies').read('currentUser');
//     if(currentUserObj) {
//       if(devConsole) { console.log('user set from cookies'); console.log('currentUserObj'); console.log(currentUserObj); }
//       this.set('currentUser', JSON.parse(currentUserObj));
//     }
//   }.on('init'),
// });
