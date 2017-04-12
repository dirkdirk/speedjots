import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    transitTo() {
      console.log('--> application route transitTo() firing');
      if(this.get('session.isAuthenticated')) {
        console.log('  -- session isAuthenticated, transitioning to "jots"');
        this.transitionTo('jots');
      } else {
        console.log('  -- session NOT isAuthenticated, transitioning to "application"');
        this.transitionTo('application');
      }
    },
    transitToAbout() {
      this.transitionTo('jots.about');
    },
    transitToHowTo() {
      this.transitionTo('jots.howTo');
    },
  }
});
