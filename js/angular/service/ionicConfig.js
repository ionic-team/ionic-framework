/**
 * @ngdoc provider
 * @name $ionicConfigProvider
 * @module ionic
 * @description $ionicConfigProvider can be used during the configuration phase of your app
 * to change how Ionic works.
 *
 * @usage
 * ```js
 * var myApp = angular.module('reallyCoolApp', ['ionic']);
 *
 * myApp.config(function($ionicConfigProvider) {
 *   $ionicConfigProvider.templates.maxPrefetch(10);
 * });
 * ```
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#views.transition
 * @description Animation style when transitioning between views. Default `platform`.
 *
 * @param {string} transition Which style of view transitioning to use.
 *
 * * `platform`: Dynamically choose the correct transition style depending on
 *               the platform the app is running from. If the platform is
 *               not `ios` or `android` then it will default to `ios-transition`.
 * * `ios`: iOS style transition.
 * * `android`: Android style transition.
 * * `none`: Do not preform animated transitions.
 *
 * @returns {string} View animation.
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#views.maxCache
 * @description Maximum number of view elements to cache in the DOM. When the max number is
 * exceeded, the view with the longest time period since it was accessed is removed. Views
 * which stay in the DOM essentially caches the view's scope, current state and scroll position.
 * However, the scope is disconnected from the cycle when it is cached, and reconnected when it enters again.
 * When the maximum cached is `0`, then after each view transition, the leaving view's element will
 * be removed from the DOM, and the next time the same view is shown it will have to
 * re-compile, attach to the DOM, and link the element again.
 * @param {number} maxNumber Maximum number of views to retain. Default `10`.
 * @returns {number} How many views Ionic will hold onto until the a view is removed.
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#views.forwardCache
 * @description When navigating between views, by default, views that were recently visited
 * are cached, and the same data and DOM elements are referenced when navigating back. However,
 * when navigating back in the history, the "forward" view is removed so its not cached. If
 * you navigate forward to the same view again it'll create a new DOM element, re-compiled and
 * link. Basically any forward views are reset each time. Set this config to `true` to have
 * forward views cached and not reset on each load.
 * @param {boolean} value `false`.
 * @returns {boolean}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#backButton.icon
 * @description Back button icon.
 * @param {string} classname
 * @returns {string}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#backButton.text
 * @description Back button text.
 * @param {string} text
 * @returns {string}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#backButton.previousTitleText
 * @description If the previous title text should become the back button text. This
 * is the default for iOS.
 * @param {boolean} previousTitleText
 * @returns {boolean}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#tabs.style
 * @description Tab style.
 * @param {string} style
 * @returns {string}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#tabs.position
 * @description Tab position.
 * @param {string} position
 * @returns {string}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#templates.prefetch
 * @description Set whether Ionic should prefetch all templateUrls defined in
 * $stateProvider.state. If set to false, the user will have to wait
 * for a template to be fetched the first time when navigating to a new page. Default `true`.
 * @param {boolean} shouldPrefetch Whether Ionic should prefetch templateUrls defined in
 * `$stateProvider.state()`.
 * @returns {boolean} Whether Ionic will prefetch templateUrls defined in $stateProvider.state.
 */

IonicModule
.provider('$ionicConfig', function() {

  var provider = this;
  provider.platform = {};
  var PLATFORM = 'platform';

  var configProperties = {
    views: {
      maxCache: PLATFORM,
      forwardCache: PLATFORM,
      transition: PLATFORM,
      transitionFn: PLATFORM
    },
    navBar: {
      alignTitle: PLATFORM,
      positionPrimaryButtons: PLATFORM,
      positionSecondaryButtons: PLATFORM,
      transition: PLATFORM,
      transitionFn: PLATFORM
    },
    backButton: {
      icon: PLATFORM,
      text: PLATFORM,
      previousTitleText: PLATFORM
    },
    tabs: {
      style: PLATFORM,
      position: PLATFORM
    },
    templates: {
      maxPrefetch: PLATFORM
    },
    platform: {}
  };
  createConfig(configProperties, provider, '');



  // Default
  // -------------------------
  setPlatformConfig('default', {

    views: {
      maxCache: 10,
      forwardCache: false,
      transition: 'ios',

      transitionFn: function(enteringEle, leavingEle, direction, shouldAnimate) {
        shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');

        function setStyles(ele, opacity, x) {
          var css = {};
          css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
          css.opacity = opacity;
          css[ionic.CSS.TRANSFORM] = 'translate3d(' + x + '%,0,0)';
          ionic.DomUtil.cachedStyles(ele, css);
        }

        return {
          run: function(step) {
            if (direction == 'forward') {
              setStyles(enteringEle, 1, (1-step) * 99); // starting at 98% prevents a flicker
              setStyles(leavingEle, (1 - 0.1 * step), step * -33);

            } else if (direction == 'back') {
              setStyles(enteringEle, (1 - 0.1 * (1-step)), (1-step) * -33);
              setStyles(leavingEle, 1, step * 100);

            } else {
              // swap, enter, exit
              setStyles(enteringEle, 1, 0);
              setStyles(leavingEle, 0, 0);
            }
          },
          shouldAnimate: shouldAnimate
        };
      }
    },

    navBar: {
      alignTitle: 'center',
      positionPrimaryButtons: 'left',
      positionSecondaryButtons: 'right',
      transition: 'ios',

      transitionFn: function(enteringHeaderBar, leavingHeaderBar, direction, shouldAnimate) {

        shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');

        function setStyles(ctrl, opacity, titleX, backTextX) {
          var css = {};
          css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
          css.opacity = opacity;

          ctrl.setCss('buttons-left', css);
          ctrl.setCss('buttons-right', css);
          ctrl.setCss('back-button', css);

          css[ionic.CSS.TRANSFORM] = 'translate3d(' + backTextX + 'px,0,0)';
          ctrl.setCss('back-text', css);

          css[ionic.CSS.TRANSFORM] = 'translate3d(' + titleX + 'px,0,0)';
          ctrl.setCss('title', css);
        }

        function enter(ctrlA, ctrlB, step) {
          if (!ctrlA) return;
          var titleX = (ctrlA.titleTextX() + ctrlA.titleWidth()) * (1 - step);
          var backTextX = (ctrlB && (ctrlB.titleTextX() - ctrlA.backButtonTextLeft()) * (1 - step)) || 0;
          setStyles(ctrlA, step, titleX, backTextX);
        }

        function leave(ctrlA, ctrlB, step) {
          if (!ctrlA) return;
          var titleX = (-(ctrlA.titleTextX() - ctrlB.backButtonTextLeft()) - (ctrlA.titleLeftRight())) * step;
          setStyles(ctrlA, 1 - step, titleX, 0);
        }

        return {
          run: function(step) {
            var enteringHeaderCtrl = enteringHeaderBar.controller();
            var leavingHeaderCtrl = leavingHeaderBar && leavingHeaderBar.controller();
            if (direction == 'back') {
              leave(enteringHeaderCtrl, leavingHeaderCtrl, 1-step);
              enter(leavingHeaderCtrl, enteringHeaderCtrl, 1-step);
            } else {
              enter(enteringHeaderCtrl, leavingHeaderCtrl, step);
              leave(leavingHeaderCtrl, enteringHeaderCtrl, step);
            }
          },
          shouldAnimate: shouldAnimate
        };
      }

    },

    backButton: {
      icon: 'ion-ios7-arrow-back',
      text: 'Back',
      previousTitleText: true
    },

    tabs: {
      style: 'standard',
      position: 'bottom'
    },

    templates: {
      maxPrefetch: 30
    }

  });



  // iOS (it is the default already)
  // -------------------------
  setPlatformConfig('ios', {});



  // Android
  // -------------------------
  setPlatformConfig('android', {

    views: {
      transition: 'android',

      transitionFn: function(enteringEle, leavingEle, direction, shouldAnimate) {
        shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');

        function setStyles(ele, opacity, y) {
          var css = {};
          css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
          css.opacity = opacity;
          css[ionic.CSS.TRANSFORM] = 'translate3d(0,' + y + 'px,0)';
          ionic.DomUtil.cachedStyles(ele, css);
        }

        var startX = Math.max(window.innerHeight, screen.height) * 0.15;

        return {
          run: function(step) {
            if (direction == 'forward') {
              setStyles(enteringEle, step, (1-step) * startX);
              setStyles(leavingEle, 1, 0);

            } else if (direction == 'back') {
              setStyles(enteringEle, 1, 0);
              setStyles(leavingEle, (1-step), step * startX);

            } else {
              // swap, enter, exit
              setStyles(enteringEle, 1, 0);
              setStyles(leavingEle, 0, 0);
            }
          },
          shouldAnimate: shouldAnimate
        };
      }
    },

    navBar: {
      alignTitle: 'left',
      positionPrimaryButtons: 'right',
      positionSecondaryButtons: 'right',
      transition: 'android',

      transitionFn: function(enteringHeaderBar, leavingHeaderBar, direction, shouldAnimate) {
        shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');

        function setStyles(ele, opacity, y) {
          var css = {};
          css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
          css.opacity = opacity;
          css[ionic.CSS.TRANSFORM] = 'translate3d(0,' + y + 'px,0)';
          ionic.DomUtil.cachedStyles(ele, css);
        }

        var startX = Math.max(window.innerHeight, screen.height) * 0.15;

        return {
          run: function(step) {
            var enteringEle = enteringHeaderBar.containerEle();
            var leavingEle = leavingHeaderBar && leavingHeaderBar.containerEle();

            if (direction == 'forward') {
              setStyles(enteringEle, step, (1-step) * startX, 10);
              setStyles(leavingEle, 1, 0, 9);

            } else if (direction == 'back') {
              setStyles(enteringEle, 1, 0, 9);
              setStyles(leavingEle, (1-step), step * startX, 10);

            } else {
              // swap, enter, exit
              setStyles(enteringEle, 1, 0, 9);
              setStyles(leavingEle, 0, 0, 10);
            }
          },
          shouldAnimate: shouldAnimate
        };
      }
    },

    backButton: {
      icon: 'ion-android-arrow-back',
      text: false,
      previousTitleText: false
    },

    tabs: {
      style: 'striped',
      position: 'top'
    }

  });


  // private: used to set platform configs
  function setPlatformConfig(platformName, platformConfigs) {
    configProperties.platform[platformName] = platformConfigs;
    provider.platform[platformName] = {};

    addConfig(configProperties, configProperties.platform[platformName]);

    createConfig(configProperties.platform[platformName], provider.platform[platformName], '');
  }


  // private: used to recursively add new platform configs
  function addConfig(configObj, platformObj) {
    for (var n in configObj) {
      if (n != PLATFORM && configObj.hasOwnProperty(n)) {
        if ( angular.isObject(configObj[n]) ) {
          if (!isDefined(platformObj[n])) {
            platformObj[n] = {};
          }
          addConfig(configObj[n], platformObj[n]);

        } else if( !isDefined(platformObj[n]) ) {
          platformObj[n] = null;
        }
      }
    }
  }


  // private: create methods for each config to get/set
  function createConfig(configObj, providerObj, platformPath) {
    forEach(configObj, function(value, namespace){

      if (angular.isObject(configObj[namespace])) {
        // recursively drill down the config object so we can create a method for each one
        providerObj[namespace] = {};
        createConfig(configObj[namespace], providerObj[namespace], platformPath + '.' + namespace);

      } else {
        // create a method for the provider/config methods that will be exposed
        providerObj[namespace] = function(newValue) {
          if (arguments.length) {
            configObj[namespace] = newValue;
          }
          if (configObj[namespace] == PLATFORM) {
            // if the config is set to 'platform', then get this config's platform value
            var platformConfig = stringObj(configProperties.platform, ionic.Platform.platform() + platformPath + '.' + namespace);
            if (platformConfig || platformConfig === false) {
              return platformConfig;
            }
            // didnt find a specific platform config, now try the default
            return stringObj(configProperties.platform, 'default' + platformPath + '.' + namespace);
          }
          return configObj[namespace];
        };
      }

    });
  }

  function stringObj(obj, str) {
    str = str.split(".");
    for (var i = 0; i < str.length; i++) {
      if ( obj && isDefined(obj[str[i]]) ) {
        obj = obj[str[i]];
      } else {
        return null;
      }
    }
    return obj;
  }

  provider.setPlatformConfig = setPlatformConfig;


  // private: Service definition for internal Ionic use
  /**
   * @ngdoc service
   * @name $ionicConfig
   * @module ionic
   * @private
   */
  provider.$get = function() {
    return provider;
  };
});
