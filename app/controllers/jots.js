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
      this.send('openPanel', 'Not Grouped');
    },
    addJotToGroup(jot, ops) {
      let tagetTitle = ops.target.groupTitle;
      let toGroup = tagetTitle ? tagetTitle : getNewGroupName(this.get('model'));
      jot.set('group', toGroup);
      jot.save();
      this.send('openPanel', toGroup);
      // clearAllJotHighlighting();
    },
    openAllGroups()      { this.get('panelActions').openAll('allGroups'); },
    closeAllGroups()     { this.get('panelActions').closeAll('allGroups'); },
    openPanel(panelName) { this.get('panelActions').open(panelName); },
    // closePanel(panelName)  { this.get('panelActions').close(panelName); },
    // togglePanel(panelName) { this.get('panelActions').toggle(panelName); },
  }

});

// TODO clearAllJotHighlighting() not working
// Fn called above.
// var clearAllJotHighlighting = function() {
  // Ember.$('.cp-Panel-toggle').blur(function() { console.log('moooot');});
  // Ember.$('.menu-jot-link').blur(function() { console.log('moooot');});
  // Ember.$('.menu-jot-link').first('div').blur(function() { console.log('blurrrr');});
};


var getNewGroupName = function(model) {
  let i = 1;
  let groups = model.mapBy('group').uniq();
  let toGroup = 'Speed Group';
  do {
    if(groups.includes(toGroup)) {
      groups.push(toGroup);
    } else {
      return toGroup;
    }
    if(i === 1) {
      toGroup = toGroup + ' ' + i;
    } else {
      let lastSpace = toGroup.lastIndexOf(' ');
      toGroup = toGroup.slice(0, lastSpace + 1) + i;
    }
    i++;
  } while (!groups.includes(toGroup) && i < 99);
};
