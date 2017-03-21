import Ember from 'ember';

export default Ember.Controller.extend({

  modelId: Ember.computed.alias('model.id'),
  addSelectedClassToLink: function() {
    Ember.$('.menu-jot-link').removeClass('jot-link-selected');
    Ember.$('#jot-link-' + this.get('modelId')).addClass('jot-link-selected');
  }.observes('modelId'),

  updateStatusIconColorObserver: function() {
    Ember.run.debounce(this, this.updateStatusIconColor, 500);
  }.observes('model.text', 'model.title', 'model.tags'),

  updateStatusIconColor() {
    console.log('--> updateStatusIconColor() firing');
    let model = this.get('model');
    let iconColor = model.get('hasDirtyAttributes') ? '#e11' : '#1e1';
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
