import Ember from 'ember';
import groupBy from 'ember-group-by';

export default Ember.Controller.extend({
  panelActions: Ember.inject.service(),

  leftSideBarOpen: false,

  sortModelBy: ['title'],
  sortedModel: Ember.computed.sort('model', 'sortModelBy'),
  jotsByGroup: groupBy('sortedModel', 'group'),
  sortGroupsBy: ['value'],
  sortedJotsByGroup: Ember.computed.sort('jotsByGroup', 'sortGroupsBy'),

  saveNewJot() {
    console.log('--> newJot() firing ...');
    this.store.createRecord('jot', {
      title: 'New jot Title',
      tags: 'new',
      content: 'Insert wisdom here ...',
      group: 'Not Grouped'
    }).save().then((result) => {
      console.log('  ... created a new jot with id: ' + result.id);
      this.transitionToRoute('jots.jot', result.id);
    });
  },

  actions: {
    newJot() {
      Ember.run.debounce(this, this.saveNewJot, 300);
      this.send('openPanel', 'Not Grouped');
    },
    addJotToGroup(jot, ops) {
      let tagetTitle = ops.target.groupTitle;
      let toGroup = tagetTitle ? tagetTitle : getNewGroupName(this.get('model'));
      jot.set('group', toGroup);
      jot.save();
      this.send('openPanel', toGroup);
    },
    editGroupTitle(e) {
      console.log('--> editGroupTitle() firing ...');
      let model = this.get('model');
      let newGroupTitle = e.target.value;
      let oldGroupTitle = e.target.placeholder;
      model.forEach(function(jot) {
        let group = jot.get('group');
        if( group === oldGroupTitle && newGroupTitle.length >0 ) {
          console.log(' ... editing group title of jot');
          jot.set('group', newGroupTitle);
        }
      });
      model.save();
    },
    openAllGroups()      { this.get('panelActions').openAll('allGroups'); },
    closeAllGroups()     { this.get('panelActions').closeAll('allGroups'); },
    openPanel(panelName) { this.get('panelActions').open(panelName); },
    // closePanel(panelName)  { this.get('panelActions').close(panelName); },
    // togglePanel(panelName) { this.get('panelActions').toggle(panelName); },
    // TODO dlAllJots()
    // dlAllJots() {
    //   console.log('--> dlAllJotsJot() firing ...');
    // },
  }

});

var getNewGroupName = function(model) {
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
};
