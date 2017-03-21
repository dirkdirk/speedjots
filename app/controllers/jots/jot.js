import Ember from 'ember';

export default Ember.Controller.extend({
  modelEditor: Ember.computed.alias('model.editor'),

  // modelText: Ember.computed.alias('model.text'),
  // text: function() {
  //   let x = this.get('modelText');
  //   return x;
  // }.observes('modelId'),

  modelId: Ember.computed.alias('model.id'),
  addSelectedClassToLink: function() {
    Ember.$('.menu-jot-link').removeClass('jot-link-selected');
    Ember.$('#jot-link-' + this.get('modelId')).addClass('jot-link-selected');
    // Ember.$('.simditor').parent().remove();
    // Ember.rerender();
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
      // this.saveDirtyModel();
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
  mediumOptions: {
    // https://github.com/yabwe/medium-editor
    // Changing themes doesn't seem to work.
    // theme: 'bootstrap',
    // theme: 'default',
    // theme: 'flat',
    // theme: 'mani',
    // theme: 'roman',
    toolbar: {
      buttons: ['h2', 'h4', 'bold', 'italic', 'underline', 'strikethrough',
                'pre', 'quote',
                'unorderedlist', 'orderedlist',
                'outdent', 'indent',
                'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
                'anchor', 'removeFormat'],
      static: true,
      sticky:  true,
      // stickyTopOffset: -60,
      updateOnEmptySelection: true,
      align: 'center',


    },
    // buttonLables: 'fontawesome',  // May have to edit bower_components/medium-editor/dist/js/medium-editor.js
    autoLink: true,
    imageDragging: false,
    extensions: {
      imageDragging: {},
    }
  },

});
