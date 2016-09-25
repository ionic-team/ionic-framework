import { OpaqueToken } from '@angular/core';

import { Platform, PlatformConfig } from './platform';
import { windowLoad } from '../util/dom';


export const PLATFORM_CONFIGS: {[key: string]: PlatformConfig} = {

  /**
   * core
   */
  core: {
    settings: {
      mode: 'md',
      keyboardHeight: 290
    }
  },

  /**
   * mobile
   */
  mobile: {},

  /**
   * phablet
   */
  phablet: {
    isMatch(p: Platform) {
      let smallest = Math.min(p.width(), p.height());
      let largest = Math.max(p.width(), p.height());
      return (smallest > 390 && smallest < 520) &&
            (largest > 620 && largest < 800);
    }
  },

  /**
   * tablet
   */
  tablet: {
    isMatch(p: Platform) {
      let smallest = Math.min(p.width(), p.height());
      let largest = Math.max(p.width(), p.height());
      return (smallest > 460 && smallest < 820) &&
            (largest > 780 && largest < 1400);
    }
  },

  /**
   * android
   */
  android: {
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
    isMatch(p: Platform) {
      return p.isPlatformMatch('android', ['android', 'silk'], ['windows phone']);
    },
    versionParser(p: Platform) {
      return p.matchUserAgentVersion(/Android (\d+).(\d+)?/);
    }
  },

  /**
   * ios
   */
  ios: {
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
      statusbarPadding: !!((<any>window).cordova),
      swipeBackEnabled: isIOSDevice,
      swipeBackThreshold: 40,
      tapPolyfill: isIOSDevice,
      virtualScrollEventAssist: !(window.indexedDB),
      canDisableScroll: !!(window.indexedDB),
    },
    isMatch(p: Platform) {
      return p.isPlatformMatch('ios', ['iphone', 'ipad', 'ipod'], ['windows phone']);
    },
    versionParser(p: Platform) {
      return p.matchUserAgentVersion(/OS (\d+)_(\d+)?/);
    }
  },

  /**
   * ipad
   */
  ipad: {
    superset: 'tablet',
    settings: {
      keyboardHeight: 500,
    },
    isMatch(p: Platform) {
      return p.isPlatformMatch('ipad');
    }
  },

  /**
   * iphone
   */
  iphone: {
    subsets: [
      'phablet'
    ],
    isMatch(p: Platform) {
      return p.isPlatformMatch('iphone');
    }
  },

  /**
   * Windows
   */
  windows: {
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
  },

  /**
   * cordova
   */
  cordova: {
    isEngine: true,
    initialize: function(p: Platform) {

      // prepare a custom "ready" for cordova "deviceready"
      p.prepareReady = function() {
        // 1) ionic bootstrapped
        windowLoad(function() {
          // 2) window onload triggered or completed
          document.addEventListener('deviceready', function() {
            // 3) cordova deviceready event triggered

            // add cordova listeners to emit platform events
            document.addEventListener('backbutton', function(ev: Event) {
              p.zone.run(() => {
                p.backButton.emit(ev);
              });
            });
            document.addEventListener('pause', function(ev: Event) {
              p.zone.run(() => {
                p.pause.emit(ev);
              });
            });
            document.addEventListener('resume', function(ev: Event) {
              p.zone.run(() => {
                p.resume.emit(ev);
              });
            });

            // cordova has its own exitApp method
            p.exitApp = function() {
              (<any>window.navigator).app.exitApp();
            };

            // cordova has fully loaded and we've added listeners
            p.triggerReady('cordova');
          });
        });
      };

    },
    isMatch(): boolean {
      return !!((<any>window).cordova || (<any>window).PhoneGap || (<any>window).phonegap);
    }
  }
};


function isIOSDevice(p: Platform) {
  // shortcut function to be reused internally
  // checks navigator.platform to see if it's an actual iOS device
  // this does not use the user-agent string because it is often spoofed
  // an actual iPad will return true, a chrome dev tools iPad will return false
  return p.testNavigatorPlatform('iphone|ipad|ipod');
}


export const PlatformConfigToken = new OpaqueToken('PLTCONFIG');

export function providePlatformConfigs() {
  return PLATFORM_CONFIGS;
}
