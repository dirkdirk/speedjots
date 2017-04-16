import Ember from 'ember';

export default Ember.Controller.extend({
  newGroupName: Ember.inject.service(),
  device: Ember.inject.service(),
  siteGreen: '#4CAF50',
  siteRed: '#F44336',

  sortModelBy: ['group'],
  jotsSorted: Ember.computed.sort('model.jots', 'sortModelBy'),
  jotsUniq: Ember.computed.uniqBy('jotsSorted', 'group'),

  updateStatusIconColorObserver: function() {
    Ember.run.debounce(this, this.updateStatusIconColor, 500);
  }.observes('model.jot.content', 'model.jot.title', 'model.jot.tags'),

  updateStatusIconColor() {
    console.log('--> updateStatusIconColor() firing');
    let jot = this.get('model.jot');
    let iconColor = jot.get('hasDirtyAttributes') ? this.get('siteRed') : this.get('siteGreen');
    Ember.$('#status-icon').css('color', iconColor);
  },

  // TODO See if there's a better way to updateStatusIconColor()
  // isDirty() {
  //   let model = this.get('model');
  //   return model.get('hasDirtyAttributes');
  // },
  //
  // statusIcon() {
  //   let isDirty = this.get('isDirty');
  //   return isDirty ? 'check-circle' : 'delete-forever';
  // },

  saveDirtyModel() {
    console.log('--> saveDirtyModel() firing ...');
    let jot = this.get('model.jot');
    if(jot.get('title') === '') { jot.set('title', 'Required'); }
    if(jot.get('hasDirtyAttributes')) {
      jot.save().then(() => {
        this.updateStatusIconColor();
        console.log('  ... dirty jot successfully saved');
      });
    }
    // Persist entire model if dirty. If Jot1's content is edited and a user selects
    //   Jot2 (from the navbar), Jot1's content is not persisted to firebase, but
    //   the model remains dirty.
    let jots = this.get('model.jots');
    if(jots.isAny('hasDirtyAttributes')) {
      console.log('  ... found dirty attrs');
      jots.save().then(() => {
        this.updateStatusIconColor();
        console.log('  ... all dirty jots successfully saved');
      });
    }
  },

  actions: {
    saveJotNow() {
      console.log('--> save() firing');
      Ember.run.debounce(this, this.saveDirtyModel, 200);
    },
    saveJotSlow() {
      console.log('--> saveJotSlow() firing');
      Ember.run.debounce(this, this.saveDirtyModel, 5000);
    },
    trashJot(jot) {
      console.log('--> trashJot() firing');
      let timeStamp = Date.now();
      this.set('model.jot.inTrash', true);
      this.set('model.jot.dateTrashed', timeStamp);
      jot.save();
    },
    destroyJot(jot) {
      console.log('--> destroyJot() firing');
      jot.destroyRecord();
      this.transitionToRoute('jots');
    },
    mobileSelectGroup(value) {
      console.log('--> mobileSelectGroup() firing');
      let jot  = this.get('model.jot');
      let jots = this.get('model.jots');
      if(value === 'newGroup_exckbvu45') {
        value = this.get('newGroupName').genName(jots);
      }
      jot.set('group', value);
      jot.save();
    },
    // TODO Add feature: download Jot: dlJot()
    // dlJot() {
    //   console.log('--> dlJot() firing');
    //   this.attrs.download()
    //         .then((content) => this.saveFileAs('jot.txt', content, 'text/plain;charset=utf-8'));
    //         // .then((content) => this.saveFileAs(this.get('filename'), content, this.get('contentType')));
    // },
  },

  simditorOptions: {
    // placeholder: 'Wisdom goes here ...',
    //  toolbar: [ 'title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'indent', 'outdent', 'alignment' ],
    toolbar: [ 'title', 'fontScale', 'bold', 'italic', 'underline', 'strikethrough',
               'color', 'ol', 'ul', 'code', 'table',
               'outdent', 'indent', 'alignment' ],
  },

});
