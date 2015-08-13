import {Platform} from './platform';


Platform.register({
  name: 'core',
  settings: {
    actionMenuEnter: 'action-menu-slide-in',
    actionMenuLeave: 'action-menu-slide-out',
    backButtonText: 'Back',
    backButtonIcon: 'ion-ios-arrow-back',
    forwardIcon: 'ion-ios-arrow-forward',
    mode: 'ios',
    iconMode: 'ios',
    navTitleAlign: 'center',
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
    actionMenuEnter: 'action-menu-md-slide-in',
    actionMenuLeave: 'action-menu-md-slide-out',
    actionMenuCancelIcon: 'ion-close',
    actionMenuDestructiveIcon: 'ion-trash-a',
    backButtonText: '',
    backButtonIcon: 'ion-android-arrow-back',
    forwardIcon: '',
    mode: 'md',
    iconMode: 'md',
    type: 'overlay',
    keyboardScrollAssist: true,
    mdRipple: true,
    tabBarPlacement: 'top',
    navTitleAlign: 'left',
    viewTransition: 'md'
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
    actionMenuEnter: 'action-menu-slide-in',
    actionMenuLeave: 'action-menu-slide-out',
    actionMenuCancelIcon: 'ion-close',
    actionMenuDestructiveIcon: 'ion-trash-a',
    backButtonText: 'Back',
    backButtonIcon: 'ion-ios-arrow-back',
    forwardIcon: 'ion-ios-arrow-forward',
    mode: 'ios',
    iconMode: 'ios',
    tapPolyfill: function() {
      // this ensures it's actually a physical iOS device
      // and not just an a spoofed user-agent string
      return /iphone|ipad|ipod/i.test(Platform.navigatorPlatform());
    },
    keyboardScrollAssist: true,
    viewTransition: 'ios',
    navTitleAlign: 'center',
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
