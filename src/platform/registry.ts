import {Platform} from './platform';
import {windowLoad} from '../util/dom';

const win: any = window;
const doc: any = document;


Platform.register({
  name: 'core',
  settings: {
    mode: 'md',
    keyboardHeight: 290
  }
});
Platform.setDefault('core');


Platform.register({
  name: 'mobile'
});


Platform.register({
  name: 'phablet',
  isMatch(p: Platform) {
    let smallest = Math.min(p.width(), p.height());
    let largest = Math.max(p.width(), p.height());
    return (smallest > 390 && smallest < 520) &&
           (largest > 620 && largest < 800);
  }
});


Platform.register({
  name: 'tablet',
  isMatch(p: Platform) {
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
    activator: function(p: Platform): string {
      // md mode defaults to use ripple activator
      // however, under-powered devices shouldn't use ripple
      // if this a linux device, and is using Android Chrome v36 (Android 5.0)
      // or above then use ripple, otherwise do not use a ripple effect
      if (p.testNavigatorPlatform('linux')) {
        let chromeVersion = p.matchUserAgentVersion(/Chrome\/(\d+).(\d+)?/);
        if (chromeVersion) {
          // linux android device using modern android chrome browser gets ripple
          return (parseInt(chromeVersion.major, 10) < 36 ? 'none' : 'ripple');
        }
        // linux android device not using chrome browser checks just android's version
        if (p.version().major < 5) {
          return 'none';
        }
      }

      // fallback to always use ripple
      return 'ripple';
    },
    autoFocusAssist: 'immediate',
    hoverCSS: false,
    keyboardHeight: 300,
    mode: 'md',
  },
  isMatch(p: Platform): boolean {
    return p.isPlatformMatch('android', ['android', 'silk'], ['windows phone']);
  },
  versionParser(p: Platform): any {
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
    autoFocusAssist: 'delay',
    hoverCSS: false,
    inputBlurring: isIOSDevice,
    inputCloning: isIOSDevice,
    keyboardHeight: 300,
    mode: 'ios',
    scrollAssist: isIOSDevice,
    statusbarPadding: !!(win.cordova),
    swipeBackEnabled: isIOSDevice,
    swipeBackThreshold: 40,
    tapPolyfill: isIOSDevice,
    virtualScrollEventAssist: !(win.indexedDB)
  },
  isMatch(p: Platform): boolean {
    return p.isPlatformMatch('ios', ['iphone', 'ipad', 'ipod'], ['windows phone']);
  },
  versionParser(p: Platform): any {
    return p.matchUserAgentVersion(/OS (\d+)_(\d+)?/);
  }
});


Platform.register({
  name: 'ipad',
  superset: 'tablet',
  settings: {
    keyboardHeight: 500,
  },
  isMatch(p: Platform): boolean {
    return p.isPlatformMatch('ipad');
  }
});


Platform.register({
  name: 'iphone',
  subsets: [
    'phablet'
  ],
  isMatch(p: Platform): boolean {
    return p.isPlatformMatch('iphone');
  }
});


Platform.register({
  name: 'windows',
  superset: 'mobile',
  subsets: [
    'phablet',
    'tablet'
  ],
  settings: {
    mode: 'wp',
    autoFocusAssist: 'immediate',
    hoverCSS: false
  },
  isMatch(p: Platform): boolean {
    return p.isPlatformMatch('windows', ['windows phone']);
  },
  versionParser(p: Platform): any {
    return p.matchUserAgentVersion(/Windows Phone (\d+).(\d+)?/);
  }
});


Platform.register({
  name: 'cordova',
  isEngine: true,
  initialize: function(p: Platform) {

    // prepare a custom "ready" for cordova "deviceready"
    p.prepareReady = function() {
      // 1) ionic bootstrapped
      windowLoad(function() {
        // 2) window onload triggered or completed
        doc.addEventListener('deviceready', function() {
          // 3) cordova deviceready event triggered

          // add cordova listeners to emit platform events
          doc.addEventListener('backbutton', function(ev: Event) {
            p.zone.run(() => {
              p.backButton.emit(ev);
            });
          });
          doc.addEventListener('pause', function(ev: Event) {
            p.zone.run(() => {
              p.pause.emit(ev);
            });
          });
          doc.addEventListener('resume', function(ev: Event) {
            p.zone.run(() => {
              p.resume.emit(ev);
            });
          });

          // cordova has its own exitApp method
          p.exitApp = function() {
            win.navigator.app.exitApp();
          };

          // cordova has fully loaded and we've added listeners
          p.triggerReady('cordova');
        });
      });
    };

  },
  isMatch(): boolean {
    return !!(win.cordova || win.PhoneGap || win.phonegap);
  }
});


function isIOSDevice(p: Platform) {
  // shortcut function to be reused internally
  // checks navigator.platform to see if it's an actual iOS device
  // this does not use the user-agent string because it is often spoofed
  // an actual iPad will return true, a chrome dev tools iPad will return false
  return p.testNavigatorPlatform('iphone|ipad|ipod');
}
