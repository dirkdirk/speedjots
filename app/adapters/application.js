import Ember from 'ember';
import FirebaseAdapter from 'emberfire/adapters/firebase';

export default FirebaseAdapter.extend({
  pathForType(type) {
    if(type === 'user') {
      console.log('adapter fired for type: ' + type);
      return `users`;
    } else {
      let uid = this.get('session.currentUser.uid');
      let path = Ember.String.pluralize(type);
      console.log('adapter fired for type: ' + type);
      console.log('  with UID: ' + uid);
      console.log('  on path : ' + path);
      return  `users/${uid}/${path}`;
    }
   }
});
