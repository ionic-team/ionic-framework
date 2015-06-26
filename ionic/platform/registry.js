import {Platform} from './platform';


Platform.register({
  name: 'core',
  settings: {
    mode: 'core'
  }
});
Platform.setDefault('core');


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
    // "silk" is kindle fire
    let re = 'android| silk';
    return app.isPlatform('android', re);
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

    return app.isPlatform('ios', 'iphone|ipad|ipod');
  },
  versionParser(app) {
    let val = app.matchUserAgent('OS (\d+)_(\d+)?');
    console.log(val);
  }
});


Platform.register({
  name: 'ipad',
  superset: 'tablet',
  isMatch(app) {
    return app.isPlatform('ipad');
  }
});


Platform.register({
  name: 'iphone',
  subsets: [
    'phablet'
  ],
  isMatch(app) {
    return app.isPlatform('iphone');
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
    return app.isPlatform('windowsphone', 'windows phone');
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
