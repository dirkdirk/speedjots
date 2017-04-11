import Ember from 'ember';

export default Ember.Controller.extend({
  init(){
    this._super(...arguments);

    Ember.run.schedule('afterRender', this, function() {
      let model = this.get('model');
      document.getElementById('printDiv').innerHTML = model.data.content;
    });
  }
});
