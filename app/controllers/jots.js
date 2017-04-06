import Ember from 'ember';
import groupBy from 'ember-group-by';

export default Ember.Controller.extend({
  panelActions: Ember.inject.service(),
  newGroupName: Ember.inject.service(),

  leftSideBarOpen: false,
  sortModelBy: ['title'],
  sortGroupsBy: ['value'],

  inTrash: Ember.computed.filterBy('model', 'inTrash', true),
  inTrashJots: Ember.computed.sort('inTrash', 'sortModelBy'),

  notInTrash: Ember.computed.filterBy('model', 'inTrash', false),
  sortedNotInTrash: Ember.computed.sort('notInTrash', 'sortModelBy'),
  byGroupSortedNotInTrash: groupBy('sortedNotInTrash', 'group'),
  notInTrashGroupedJots: Ember.computed.sort('byGroupSortedNotInTrash', 'sortGroupsBy'),

  saveNewJot() {
    console.log('--> saveNewJot() firing ...');
    let timeStamp = Date.now();
    this.store.createRecord('jot', {
      title: 'New Jot Title',
      tags: 'new',
      content: '<p>Insert wisdom here ...</p>',
      group: 'Not Grouped',
      dateCreated: timeStamp,
      inTrash: false
    }).save().then((result) => {
      console.log('  ... created a new jot with id: ' + result.id);
      this.transitionToRoute('jots.jot', result.id);
    });
  },

  actions: {
    newJot() {
      console.log('--> newJot() firing');
      Ember.run.debounce(this, this.saveNewJot, 300);
      this.send('openPanel', 'Not Grouped');
    },
    moveJotToGroup(jot, ops) {
      console.log('--> moveJotToGroup() firing');
      let tagetTitle = ops.target.groupTitle;
      let model = this.get('model');
      let newGroupName = this.get('newGroupName');
      let toGroup = tagetTitle ? tagetTitle : newGroupName.genName(model);
      jot.set('group', toGroup);
      jot.set('inTrash', false);
      jot.set('dateTrashed', null);
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
    moveJotToTrash(jot) {
      console.log('--> moveJotToTrash() firing');
      let timeStamp = Date.now();
      jot.set('inTrash', true);
      jot.set('dateTrashed', timeStamp);
      jot.save();
    },
    emptryTrash() {
      console.log('--> moveJotToTrash() firing');
      let model = this.get('model');
      let trashedJots = this.get('inTrash');
      trashedJots.forEach((jot) => jot.deleteRecord());
      model.save();
      this.transitionToRoute('jots');
    },
    // TODO dlAllJots()
    // dlAllJots() {
    //   console.log('--> dlAllJotsJot() firing ...');
    // },
  }

});

// var getNewGroupName = function(model) {
//   let i = 1;
//   let groups = model.mapBy('group').uniq();
//   let toGroup = 'New Group';
//   do {
//     if(!groups.includes(toGroup)) { return toGroup; }
//     if(i === 1) {
//       toGroup = toGroup + ' ' + i;
//     } else {
//       let lastSpace = toGroup.lastIndexOf(' ');
//       toGroup = toGroup.slice(0, lastSpace + 1) + i;
//     }
//     i++;
//   } while (i < 99);
// };
