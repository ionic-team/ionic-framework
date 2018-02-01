import { InjectionToken } from '@angular/core';

import { Platform, PlatformConfig } from './platform';
import { isCordova, isElectron, isIos, isIosUIWebView } from './platform-utils';


export const PLATFORM_CONFIGS: { [key: string]: PlatformConfig } = {

  /**
   * core
   */
  'core': {
    settings: {
      mode: 'md',
      keyboardHeight: 290
    }
  },

  /**
   * mobile
   */
  'mobile': {},

  /**
   * phablet
   */
  'phablet': {
    isMatch(plt: Platform) {
      let smallest = Math.min(plt.width(), plt.height());
      let largest = Math.max(plt.width(), plt.height());
      return (smallest > 390 && smallest < 520) &&
        (largest > 620 && largest < 800);
    }
  },

  /**
   * tablet
   */
  'tablet': {
    isMatch(plt: Platform) {
      let smallest = Math.min(plt.width(), plt.height());
      let largest = Math.max(plt.width(), plt.height());
      return (smallest > 460 && smallest < 820) &&
        (largest > 780 && largest < 1400);
    }
  },

  /**
   * android
   */
  'android': {
    superset: 'mobile',
    subsets: [
      'phablet',
      'tablet'
    ],
    settings: {
      activator: function(plt: Platform): string {
        // md mode defaults to use ripple activator
        // however, under-powered devices shouldn't use ripple
        // if this a linux device, and is using Android Chrome v36 (Android 5.0)
        // or above then use ripple, otherwise do not use a ripple effect
        if (plt.testNavigatorPlatform('linux')) {
          let chromeVersion = plt.matchUserAgentVersion(/Chrome\/(\d+).(\d+)?/);
          if (chromeVersion) {
            // linux android device using modern android chrome browser gets ripple
            if (parseInt(chromeVersion.major, 10) < 36 || plt.version().major < 5) {
              return 'none';
            } else {
              return 'ripple';
            }
          }
          // linux android device not using chrome browser checks just android's version
          if (plt.version().major < 5) {
            return 'none';
          }
        }

        // fallback to always use ripple
        return 'ripple';
      },
      autoFocusAssist: 'immediate',
      inputCloning: true,
      scrollAssist: true,
      hoverCSS: false,
      keyboardHeight: 300,
      mode: 'md',
    },
    isMatch(plt: Platform) {
      return plt.isPlatformMatch('android', ['android', 'silk'], ['windows phone']);
    },
    versionParser(plt: Platform) {
      return plt.matchUserAgentVersion(/Android (\d+).(\d+)?/);
    }
  },

  /**
   * ios
   */
  'ios': {
    superset: 'mobile',
    subsets: [
      'ipad',
      'iphone'
    ],
    settings: {
      autoFocusAssist: 'delay',
      hideCaretOnScroll: true,
      hoverCSS: false,
      inputBlurring: isIos,
      inputCloning: isIos,
      keyboardHeight: 250,
      mode: 'ios',
      statusbarPadding: isCordova,
      swipeBackEnabled: isIos,
      tapPolyfill: isIosUIWebView,
      virtualScrollEventAssist: isIosUIWebView,
      disableScrollAssist: isIos,
      scrollAssist: isIos,
      keyboardResizes: keyboardResizes,
    },
    isMatch(plt: Platform) {
      return plt.isPlatformMatch('ios', ['iphone', 'ipad', 'ipod'], ['windows phone']);
    },
    versionParser(plt: Platform) {
      return plt.matchUserAgentVersion(/OS (\d+)_(\d+)?/);
    }
  },

  /**
   * ipad
   */
  'ipad': {
    superset: 'tablet',
    settings: {
      keyboardHeight: 500,
    },
    isMatch(plt: Platform) {
      return plt.isPlatformMatch('ipad');
    }
  },

  /**
   * iphone
   */
  'iphone': {
    subsets: [
      'phablet'
    ],
    isMatch(plt: Platform) {
      return plt.isPlatformMatch('iphone');
    }
  },

  /**
   * Windows
   */
  'windows': {
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
    isMatch(plt: Platform): boolean {
      return plt.isPlatformMatch('windows', ['windows phone']);
    },
    versionParser(plt: Platform): any {
      return plt.matchUserAgentVersion(/Windows Phone (\d+).(\d+)?/);
    }
  },

  /**
   * cordova
   */
  'cordova': {
    isEngine: true,
    initialize: function(plt: Platform) {

      // prepare a custom "ready" for cordova "deviceready"
      plt.prepareReady = function() {
        // 1) ionic bootstrapped
        plt.windowLoad(function(win: Window, doc: HTMLDocument) {
          // 2) window onload triggered or completed
          doc.addEventListener('deviceready', function() {
            // 3) cordova deviceready event triggered

            // add cordova listeners to emit platform events
            doc.addEventListener('backbutton', function(ev: Event) {
              plt.zone.run(() => {
                plt.backButton.emit(ev);
              });
            });
            doc.addEventListener('pause', function(ev: Event) {
              plt.zone.run(() => {
                plt.pause.emit(ev);
              });
            });
            doc.addEventListener('resume', function(ev: Event) {
              plt.zone.run(() => {
                plt.resume.emit(ev);
              });
            });

            // cordova has its own exitApp method
            plt.exitApp = function() {
              (<any>win)['navigator']['app'].exitApp();
            };

            // cordova has fully loaded and we've added listeners
            plt.triggerReady('cordova');
          });
        });
      };

    },
    isMatch(plt: Platform): boolean {
      return isCordova(plt);
    }
  },

  /**
   * electron
   */
  'electron': {
    superset: 'core',
    initialize: function(plt: Platform) {
      plt.prepareReady = function() {
        // 1) ionic bootstrapped
        plt.windowLoad(function() {
          plt.triggerReady('electron');
        });
      };
    },
    isMatch(plt: Platform): boolean {
      return isElectron(plt);
    }
  }
};

function keyboardResizes(plt: Platform): boolean {
  const win = <any>plt.win();
  if (win.Ionic && win.Ionic.keyboardResizes === true) {
    return true;
  }
  return false;
}

export const PlatformConfigToken = new InjectionToken<any>('PLTCONFIG');

export function providePlatformConfigs() {
  return PLATFORM_CONFIGS;
}

