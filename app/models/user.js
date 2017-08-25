import DS from 'ember-data';

export default DS.Model.extend({
  settings: DS.attr(),
  jots:     DS.attr()
});
