import Ember from 'ember';

export default Ember.Controller.extend({
  siteGreen: '#5a5',
  siteRed: '#c55',

  updateStatusIconColorObserver: function() {
    Ember.run.debounce(this, this.updateStatusIconColor, 500);
  }.observes('model.text', 'model.title', 'model.tags'),

  updateStatusIconColor() {
    console.log('--> updateStatusIconColor() firing');
    let model = this.get('model');
    let iconColor = model.get('hasDirtyAttributes') ? this.get('siteRed') : this.get('siteGreen');
    Ember.$('#status-icon').css('color', iconColor);
  },

  saveDirtyModel() {
    console.log('--> saveDirtyModel() firing ...');
    let model = this.get('model');
    if(model.get('hasDirtyAttributes')) {
      console.log('  ... saved');
      model.save().then(() => { this.updateStatusIconColor(); });
    }
  },

  actions: {
    saveJotNow() {
      console.log('--> save() firing');
      Ember.run.debounce(this, this.saveDirtyModel, 200);
    },
    saveJotSlow() {
      console.log('--> saveJotTextSlow() firing');
      Ember.run.debounce(this, this.saveDirtyModel, 10000);
    },
    destroyJot(model) {
      console.log('--> destroyJot() firing ...');
      model.destroyRecord();
      this.transitionToRoute('jots');
    },
    onDest() {
      console.log('--> onDest() firing ...');
    },
  },

  simditorOptions: {
    toolbar: [ 'title', 'bold', 'italic', 'underline', 'strikethrough',
               'fontScale', 'color',
               'ol', 'ul',
               'blockquote', 'code',
               'table', 'link', 'image',
               'hr', 'indent', 'outdent',
               'alignment' ],
  },

});
