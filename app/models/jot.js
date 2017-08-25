import DS from 'ember-data';

export default DS.Model.extend({
  title:       DS.attr('string'),
  tags:        DS.attr('string'),
  content:     DS.attr('string'),
  group:       DS.attr('string'),
  dateCreated: DS.attr('number'),
  inTrash:     DS.attr('boolean'),
  dateTrashed: DS.attr('number')
});
