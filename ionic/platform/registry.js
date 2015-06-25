import {Platform} from './platform';
import {Tap} from '../util/tap';


Platform.register({
  name: 'core',
  subsets: [
    'android',
    'ios',
    'windowsphone'
  ],
  settings: {
    mode: 'core'
  }
});


Platform.register({
  name: 'mobile'
});


Platform.register({
  name: 'phablet',
  isMatch(app) {
    let smallest = Math.min(app.width(), app.height());
    let largest = Math.max(app.width(), app.height());
    // http://www.mydevice.io/devices/
    return (smallest > 390 && smallest < 520) &&
           (largest > 620 && largest < 800);
  }
});


Platform.register({
  name: 'tablet',
  isMatch(app) {
    let smallest = Math.min(app.width(), app.height());
    let largest = Math.max(app.width(), app.height());
    // http://www.mydevice.io/devices/
    return (smallest > 460 && smallest < 820) &&
           (largest > 780 && largest < 1400);
  }
});


Platform.register({
  name: 'android',
  superset: 'mobile',
  subsets: [
    'phablet',
    'tablet'
  ],
  settings: {
    mode: 'md'
  },
  isMatch(app) {
    return app.matchesPlatform('android');
  }
});



Platform.register({
  name: 'ios',
  superset: 'mobile',
  subsets: [
    'ipad',
    'iphone'
  ],
  settings: {
    mode: 'ios'
  },
  isMatch(app) {
    // SLEDGEHAMMER OVERRIDE FOR NOW
    return true;

    return app.matchesPlatform('ios', 'iphone|ipad|ipod');
  },
  run() {
    //Tap.run();
  }
});


Platform.register({
  name: 'ipad',
  superset: 'tablet',
  isMatch(app) {
    return app.matchesPlatform('ipad');
  }
});


Platform.register({
  name: 'iphone',
  subsets: [
    'phablet'
  ],
  isMatch(app) {
    return app.matchesPlatform('iphone');
  }
});


Platform.register({
  name: 'windowsphone',
  superset: 'mobile',
  subsets: [
    'phablet',
    'tablet'
  ],
  settings: {
    mode: 'wp'
  },
  isMatch(app) {
    return app.matchesPlatform('windowsphone', 'windows phone');
  }
});


Platform.register({
  name: 'cordova',
  isEngine: true,
  methods: {
    onReady: function() {
      return new Promise(resolve => {
        setTimeout(function() {
          resolve();
        }, 1000);
      });
    }
  },
  isMatch(app) {
    return true;
    return !!(window.cordova || window.PhoneGap || window.phonegap);
  }
});
