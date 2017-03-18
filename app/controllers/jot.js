import Ember from 'ember';

export default Ember.Controller.extend({
  options: {
             menubar: false,
             toolbar1: 'styleselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor backcolor emoticons | codesample',
           },

  modelId: Ember.computed.alias('model.id'),

  addSelectedClassToLink: function() {
    Ember.$('.menu-jot-link').removeClass('jot-link-selected');
    Ember.$('#jot-link-' + this.get('modelId')).addClass('jot-link-selected');
  }.observes('modelId'),

  doSave() {
    console.log('saving if dirty ...');
    let m = this.get('model');
    if(m.get('hasDirtyAttributes')) {
      console.log(' ... saved');
      m.save().then(() => {
        this.send('updateStatusIcon', m);
      });
    }
  },
  doUpdateStatusIcon(m = this.get('model')) {
    console.log('updating icon color');
    let iconColor = m.get('hasDirtyAttributes') ? '#e11' : '#1e1';
    Ember.$('#status-icon').css('color', iconColor);
  },

  actions: {
    save() {
      Ember.run.debounce(this, this.doSave, 200);
    },
    updateStatusIcon() {
      Ember.run.debounce(this, this.doUpdateStatusIcon, 400);
    },
    saveSlow(value) {
      this.set('model.text', value);
      Ember.run.debounce(this, this.doUpdateStatusIcon, 600);
      Ember.run.debounce(this, this.doSave, 3*60*100);
    },
    destroyJot(model) {
      console.log('destroying jot ...');
      model.destroyRecord();
      this.transitionToRoute('application');
    },
  }

});
