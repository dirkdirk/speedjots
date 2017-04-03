import Ember from 'ember';

export default Ember.Controller.extend({
  siteGreen: '#4CAF50',
  siteRed: '#F44336',

  updateStatusIconColorObserver: function() {
    Ember.run.debounce(this, this.updateStatusIconColor, 500);
  }.observes('model.content', 'model.title', 'model.tags'),

  updateStatusIconColor() {
    console.log('--> updateStatusIconColor() firing');
    let model = this.get('model');
    let iconColor = model.get('hasDirtyAttributes') ? this.get('siteRed') : this.get('siteGreen');
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
    let model = this.get('model');
    if(model.get('hasDirtyAttributes')) {
      model.save().then(() => {
        this.updateStatusIconColor();
        console.log('  ... dirty model successfully saved');
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
    trashJot(model) {
      console.log('--> trashJot() firing');
      let timeStamp = Date.now();
      this.set('model.inTrash', true);
      this.set('model.dateTrashed', timeStamp);
      model.save();
    },
    destroyJot(model) {
      console.log('--> destroyJot() firing');
      model.destroyRecord();
      this.transitionToRoute('jots');
    },
    // TODO dlJot()
    // dlJot() {
    //   console.log('--> dlJot() firing');
    //   this.attrs.download()
    //         .then((content) => this.saveFileAs('jot.txt', content, 'text/plain;charset=utf-8'));
    //         // .then((content) => this.saveFileAs(this.get('filename'), content, this.get('contentType')));
    // },
  },

  simditorOptions: {
    //  toolbar: [ 'title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'indent', 'outdent', 'alignment' ],
    toolbar: [ 'title', 'bold', 'italic', 'underline', 'strikethrough',
               'color', 'ol', 'ul', 'code', 'table',
               'indent', 'outdent', 'alignment' ],
  },

});
