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
    save() {
      console.log('--> save() firing');
      Ember.run.debounce(this, this.saveDirtyModel, 200);
    },
    saveJotText() {
      console.log('--> saveJotText() firing');
      Ember.run.debounce(this, this.saveDirtyModel, 10000);
      // this.saveDirtyModel();
    },
    destroyJot(model) {
      console.log('--> destroyJot() firing ...');
      model.destroyRecord();
      this.transitionToRoute('application');
    },
  },

  mediumEditorOptions: {
    // https://github.com/yabwe/medium-editor
    // Changing themes doesn't seem to work.
    // theme: 'bootstrap',
    // theme: 'default',
    // theme: 'flat',
    // theme: 'mani',
    // theme: 'roman',
    toolbar: {
      buttons: ['bold', 'italic', 'underline', 'strikethrough',
                'header1', 'header2',
                'unorderedlist', 'orderedlist',
                'indent', 'outdent',
                'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
                'anchor'],
    },
    // buttonLables: 'fontawesome',  // May have to edit bower_components/medium-editor/dist/js/medium-editor.js
    autoLink: true,
    imageDragging: false,
    extensions: {
      imageDragging: {},
    }
  },

});
