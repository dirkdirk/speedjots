import Ember from 'ember';
import groupBy from 'ember-group-by';

export default Ember.Controller.extend({
  panelActions: Ember.inject.service(),
  newGroupName: Ember.inject.service(),

  showSearchInput: false,
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
      title: 'Title',
      tags: '',
      content: '',
      group: 'Not Grouped',
      dateCreated: timeStamp,
      inTrash: false
    }).save()
      .then((result) => {
        console.log('  ... created a new jot with id: ' + result.id);
        this.transitionToRoute('jots.jot', result.id);
      })
      .catch(e => { console.log(e.errors); });
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
      jot.save().catch(e => { console.log(e.errors); });
      this.send('openPanel', toGroup);
    },
    editGroupTitle(e) {
      console.log('--> editGroupTitle() firing ...');
      let model = this.get('model');
      let newGroupTitle = e.target.value;
      let oldGroupTitle = e.target.placeholder;
      model.forEach(function(jot) {
        let group = jot.get('group');
        if( group === oldGroupTitle && newGroupTitle.length > 0 ) {
          console.log(' ... editing group title of jot');
          jot.set('group', newGroupTitle);
        }
      });
      model.save().catch(e => { console.log(e.errors); });
    },
    openAllGroups()      { this.get('panelActions').openAll('allGroups');  },
    closeAllGroups()     { this.get('panelActions').closeAll('allGroups'); },
    openPanel(panelName) { this.get('panelActions').open(panelName);       },
    // Following options also available:
    // closePanel(panelName)  { this.get('panelActions').close(panelName); },
    // togglePanel(panelName) { this.get('panelActions').toggle(panelName); },
    moveJotToTrash(jot) {
      console.log('--> moveJotToTrash() firing');
      let timeStamp = Date.now();
      jot.set('inTrash', true);
      jot.set('dateTrashed', timeStamp);
      jot.save().catch(e => { console.log(e.errors); });
    },
    emptryTrash() {
      console.log('--> emptryTrash() firing');
      let model = this.get('model');
      let trashedJots = this.get('inTrash');
      trashedJots.forEach((jot) => jot.deleteRecord());
      model.save().catch(e => { console.log(e.errors); });
      this.transitionToRoute('jots');
    },
    toggleShowSearchInput() {
      this.toggleProperty('showSearchInput');
    },
    // TODO Add feature: download all jots action: dlAllJots()
    // dlAllJots() {
    //   console.log('--> dlAllJotsJot() firing ...');
    // },
  }

});
