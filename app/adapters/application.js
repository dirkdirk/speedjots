import Ember from 'ember';
import FirebaseAdapter from 'emberfire/adapters/firebase';

export default FirebaseAdapter.extend({
  session: Ember.service.inject(),
  pathForType(type) {
    let uid = this.get('session.currentUser.uid');
    uid = uid ? uid : 1;
    console.log('UID');
    console.log(uid);
    let path = Ember.String.pluralize(type);
    return  `users/${uid}/${path}`;
   }
});
