import Ember from 'ember';

export default Ember.Service.extend({
  init(){
    this._super(...arguments);
    this.testIsMobile();
  },

  isMobile: null,
  testIsMobile(){
    // Resources: http://www.opentechguides.com/how-to/article/javascript/98/detect-mobile-device.html
    //            https://www.mattcromwell.com/detecting-mobile-devices-javascript/
    let testExp = new RegExp( 'Android|' +
                              'webOS|' +
                              'iPhone|' +
                              'iPad|' +
                              'BlackBerry|' +
                              'Windows Phone|' +
                              'Opera Mini|' +
                              'IEMobile|' +
                              'Mobile', 'i');
      console.log('--> testIsMobile() firing');
      let x = testExp.test(navigator.userAgent) ? true : false;
      // console.log(' ... isMobile: ' + x);
      this.set('isMobile', x);
  }
});
