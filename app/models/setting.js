import DS from 'ember-data';

export default DS.Model.extend({
  lastLogin: DS.attr('number'),
  theme:     DS.attr('string')
});
