import Ember from 'ember';
import groupBy from 'ember-group-by';

export default Ember.Controller.extend({
  panelActions: Ember.inject.service(),

  sortModelBy: ['title'],
  sortedModel: Ember.computed.sort('model', 'sortModelBy'),
  jotsByGroup: groupBy('sortedModel', 'group'),
  sortGroupsBy: ['value'],
  sortedJotsByGroup: Ember.computed.sort('jotsByGroup', 'sortGroupsBy'),

  saveNewJot() {
    console.log('--> newJot() firing ...');
    this.store.createRecord('jot', {
      title: 'New jot ...',
      tags: 'new',
      text: 'Insert wisdom here ...',
      group: 'Not Grouped'
    }).save().then((result) => {
      console.log('  ... created id: ' + result.id);
      this.transitionToRoute('jots.jot', result.id);
    });
  },

  actions: {
    newJot() {
      Ember.run.debounce(this, this.saveNewJot, 300);
    },
    addJotToGroup(jot, ops) {
      let tagetTitle = ops.target.groupTitle;
      let toGroup = tagetTitle ? tagetTitle : getNewGroupName(this.get('model'));
      jot.set('group', toGroup);
      jot.save();
    },
    openAllGroups()  { this.get('panelActions').openAll('allGroups'); },
    closeAllGroups() { this.get('panelActions').closeAll('allGroups'); },
  }

});


var getNewGroupName = function(model) {
  let i = 1;
  let groups = model.mapBy('group').uniq();
  let toGroup = 'Speed Group';
  while(groups.includes(toGroup) && i < 99) {
    if(i === 1) {
      toGroup = toGroup + ' ' + i;
    } else {
      let lastSpace = toGroup.lastIndexOf(' ');
      toGroup = toGroup.slice(0, lastSpace + 1) + i;
    }
    if(groups.includes(toGroup)) {
      groups.push(toGroup);
    } else {
      return toGroup;
    }
    i += 1;
  }
};
