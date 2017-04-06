import Ember from 'ember';

export function isMobile() {
  // Resources: http://www.opentechguides.com/how-to/article/javascript/98/detect-mobile-device.html
  //            https://www.mattcromwell.com/detecting-mobile-devices-javascript/
  let testExp = new RegExp('Android|' +
                           'webOS|' +
                           'iPhone|' +
                           'iPad|' +
    		                   'BlackBerry|' +
                           'Windows Phone|' +
    		                   'Opera Mini|' +
                           'IEMobile|' +
                           'Mobile', 'i');

  return testExp.test(navigator.userAgent) ? 1 : 0;
}

export default Ember.Helper.helper(isMobile);
