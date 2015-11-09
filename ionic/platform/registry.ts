import {Platform} from './platform';
import {windowLoad} from '../util/dom';


Platform.register({
  name: 'core',
  settings: {
    mode: 'ios',
    keyboardHeight: 290,
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
    return (smallest > 390 && smallest < 520) &&
           (largest > 620 && largest < 800);
  }
});


Platform.register({
  name: 'tablet',
  isMatch(p) {
    let smallest = Math.min(p.width(), p.height());
    let largest = Math.max(p.width(), p.height());
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
    mode: 'md',
    keyboardHeight: 290,
    scrollAssist: true,
    hoverCSS: false,
  },
  isMatch(p) {
    return p.isPlatform('android', 'android|silk');
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
    mode: 'ios',
    scrollAssist: function(p) {
      return /iphone|ipad|ipod/i.test(p.navigatorPlatform());
    },
    tapPolyfill: function(p) {
      return /iphone|ipad|ipod/i.test(p.navigatorPlatform());
    },
    keyboardHeight: 290,
    hoverCSS: false,
    swipeBackEnabled: function(p) {
      return /iphone|ipad|ipod/i.test(p.navigatorPlatform());
    },
    swipeBackThreshold: 40,
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
  settings: {
    keyboardHeight: 500,
  },
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
    mode: 'md',
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
      function isReady() {
        document.removeEventListener('deviceready', isReady);
        resolve();
      }
      windowLoad(function() {
        document.addEventListener('deviceready', isReady);
      });
    }
  },
  isMatch() {
    return !!(window.cordova || window.PhoneGap || window.phonegap);
  }
});
