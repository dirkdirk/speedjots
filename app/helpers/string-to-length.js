import Ember from 'ember';

export function stringToLength([str, len, appendWith='..']) {
  let shorty = str.length < len ? str : str.substring(0, len) + appendWith;
  return shorty;
}

export default Ember.Helper.helper(stringToLength);
