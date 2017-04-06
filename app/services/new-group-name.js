import Ember from 'ember';

export default Ember.Service.extend({
  genName(model) {
    let i = 1;
    let groups = model.mapBy('group').uniq();
    let toGroup = 'New Group';
    do {
      if(!groups.includes(toGroup)) { return toGroup; }
      if(i === 1) {
        toGroup = toGroup + ' ' + i;
      } else {
        let lastSpace = toGroup.lastIndexOf(' ');
        toGroup = toGroup.slice(0, lastSpace + 1) + i;
      }
      i++;
    } while (i < 99);
  }
});
