import DS from 'ember-data';

export default DS.Model.extend({
  tags: DS.attr('string'),
  title: DS.attr('string'),
  text: DS.attr('string'),
  editor: DS.attr('string'),
});
