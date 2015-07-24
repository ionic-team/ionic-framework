import {Platform} from './platform';


Platform.register({
  name: 'core',
  settings: {
    backButtonText: 'Back',
    backButtonIcon: 'ion-ios-arrow-back',
    mode: 'ios',
    iconMode: 'ios',
    viewTransition: 'ios'
  }
});
Platform.setDefault('core');


Platform.register({
  name: 'mobile'
});


Platform.register({
  name: 'phablet',
  isMatch(p) {
    let smallest = Math.min(p.width(), p.height());
    let largest = Math.max(p.width(), p.height());
    // http://www.mydevice.io/devices/
    return (smallest > 390 && smallest < 520) &&
           (largest > 620 && largest < 800);
  }
});


Platform.register({
  name: 'tablet',
  isMatch(p) {
    let smallest = Math.min(p.width(), p.height());
    let largest = Math.max(p.width(), p.height());
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
    backButtonText: '',
    backButtonIcon: 'ion-android-arrow-back',
    mode: 'md',
    iconMode: 'md',
    type: 'overlay',
    keyboardScrollAssist: true,
    viewTransition: 'md',
    mdRipple: true,
    tabBarPlacement: 'top'
  },
  isMatch(p) {
    // "silk" is kindle fire
    return p.isPlatform('android', 'android| silk');
  },
  versionParser(p) {
    return p.matchUserAgentVersion(/Android (\d+).(\d+)?/);
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
    backButtonText: 'Back',
    backButtonIcon: 'ion-ios-arrow-back',
    mode: 'ios',
    iconMode: 'ios',
    tapPolyfill: true,
    keyboardScrollAssist: true,
    viewTransition: 'ios',
    mdRipple: false
  },
  isMatch(p) {
    return p.isPlatform('ios', 'iphone|ipad|ipod');
  },
  versionParser(p) {
    return p.matchUserAgentVersion(/OS (\d+)_(\d+)?/);
  }
});


Platform.register({
  name: 'ipad',
  superset: 'tablet',
  isMatch(p) {
    return p.isPlatform('ipad');
  }
});


Platform.register({
  name: 'iphone',
  subsets: [
    'phablet'
  ],
  isMatch(p) {
    return p.isPlatform('iphone');
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
    mode: 'wp',
    iconMode: 'md',
    viewTransition: 'md',
  },
  isMatch(p) {
    return p.isPlatform('windowsphone', 'windows phone');
  },
  versionParser(p) {
    return p.matchUserAgentVersion(/Windows Phone (\d+).(\d+)?/);
  }
});


Platform.register({
  name: 'cordova',
  isEngine: true,
  methods: {
    ready: function(resolve) {
      Platform.windowLoad(() => {
        document.addEventListener("deviceready", resolve);
      });
    }
  },
  isMatch(p) {
    return !!(window.cordova || window.PhoneGap || window.phonegap);
  }
});
