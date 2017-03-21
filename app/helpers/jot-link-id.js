import Ember from 'ember';

export function jotLinkId([id]) {
  return 'jot-link-' + id;
}

export default Ember.Helper.helper(jotLinkId);
