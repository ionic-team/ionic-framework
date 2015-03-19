/**
 * @ngdoc provider
 * @name $ionicConfigProvider
 * @module ionic
 * @description
 * Ionic automatically takes platform configurations into account to adjust things like what
 * transition style to use and whether tab icons should show on the top or bottom. For example,
 * iOS will move forward by transitioning the entering view from right to center and the leaving
 * view from center to left. However, Android will transition with the entering view going from
 * bottom to center, covering the previous view, which remains stationary. It should be noted
 * that when a platform is not iOS or Android, then it'll default to iOS. So if you are
 * developing on a desktop browser, it's going to take on iOS default configs.
 *
 * These configs can be changed using the `$ionicConfigProvider` during the configuration phase
 * of your app. Additionally, `$ionicConfig` can also set and get config values during the run
 * phase and within the app itself.
 *
 * By default, all base config variables are set to `'platform'`, which means it'll take on the
 * default config of the platform on which it's running. Config variables can be set at this
 * level so all platforms follow the same setting, rather than its platform config.
 * The following code would set the same config variable for all platforms:
 *
 * ```js
 * $ionicConfigProvider.views.maxCache(10);
 * ```
 *
 * Additionally, each platform can have it's own config within the `$ionicConfigProvider.platform`
 * property. The config below would only apply to Android devices.
 *
 * ```js
 * $ionicConfigProvider.platform.android.views.maxCache(5);
 * ```
 *
 * @usage
 * ```js
 * var myApp = angular.module('reallyCoolApp', ['ionic']);
 *
 * myApp.config(function($ionicConfigProvider) {
 *   $ionicConfigProvider.views.maxCache(5);
 *
 *   // note that you can also chain configs
 *   $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
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
 * * `platform`: Dynamically choose the correct transition style depending on the platform
 * the app is running from. If the platform is not `ios` or `android` then it will default
 * to `ios`.
 * * `ios`: iOS style transition.
 * * `android`: Android style transition.
 * * `none`: Do not preform animated transitions.
 *
 * @returns {string} value
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#views.maxCache
 * @description  Maximum number of view elements to cache in the DOM. When the max number is
 * exceeded, the view with the longest time period since it was accessed is removed. Views that
 * stay in the DOM cache the view's scope, current state, and scroll position. The scope is
 * disconnected from the `$watch` cycle when it is cached and reconnected when it enters again.
 * When the maximum cache is `0`, the leaving view's element will be removed from the DOM after
 * each view transition, and the next time the same view is shown, it will have to re-compile,
 * attach to the DOM, and link the element again. This disables caching, in effect.
 * @param {number} maxNumber Maximum number of views to retain. Default `10`.
 * @returns {number} How many views Ionic will hold onto until the a view is removed.
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#views.forwardCache
 * @description  By default, when navigating, views that were recently visited are cached, and
 * the same instance data and DOM elements are referenced when navigating back. However, when
 * navigating back in the history, the "forward" views are removed from the cache. If you
 * navigate forward to the same view again, it'll create a new DOM element and controller
 * instance. Basically, any forward views are reset each time. Set this config to `true` to have
 * forward views cached and not reset on each load.
 * @param {boolean} value
 * @returns {boolean}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#backButton.icon
 * @description Back button icon.
 * @param {string} value
 * @returns {string}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#backButton.text
 * @description Back button text.
 * @param {string} value Defaults to `Back`.
 * @returns {string}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#backButton.previousTitleText
 * @description If the previous title text should become the back button text. This
 * is the default for iOS.
 * @param {boolean} value
 * @returns {boolean}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#tabs.style
 * @description Tab style. Android defaults to `striped` and iOS defaults to `standard`.
 * @param {string} value Available values include `striped` and `standard`.
 * @returns {string}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#tabs.position
 * @description Tab position. Android defaults to `top` and iOS defaults to `bottom`.
 * @param {string} value Available values include `top` and `bottom`.
 * @returns {string}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#templates.maxPrefetch
 * @description Sets the maximum number of templates to prefetch from the templateUrls defined in
 * $stateProvider.state. If set to `0`, the user will have to wait
 * for a template to be fetched the first time when navigating to a new page. Default `30`.
 * @param {integer} value Max number of template to prefetch from the templateUrls defined in
 * `$stateProvider.state()`.
 * @returns {integer}
 */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#navBar.alignTitle
 * @description Which side of the navBar to align the title. Default `center`.
 *
 * @param {string} value side of the navBar to align the title.
 *
 * * `platform`: Dynamically choose the correct title style depending on the platform
 * the app is running from. If the platform is `ios`, it will default to `center`.
 * If the platform is `android`, it will default to `left`. If the platform is not
 * `ios` or `android`, it will default to `center`.
 *
 * * `left`: Left align the title in the navBar
 * * `center`: Center align the title in the navBar
 * * `right`: Right align the title in the navBar.
 *
 * @returns {string} value
 */

/**
  * @ngdoc method
  * @name $ionicConfigProvider#navBar.positionPrimaryButtons
  * @description Which side of the navBar to align the primary navBar buttons. Default `left`.
  *
  * @param {string} value side of the navBar to align the primary navBar buttons.
  *
  * * `platform`: Dynamically choose the correct title style depending on the platform
  * the app is running from. If the platform is `ios`, it will default to `left`.
  * If the platform is `android`, it will default to `right`. If the platform is not
  * `ios` or `android`, it will default to `left`.
  *
  * * `left`: Left align the primary navBar buttons in the navBar
  * * `right`: Right align the primary navBar buttons in the navBar.
  *
  * @returns {string} value
  */

/**
 * @ngdoc method
 * @name $ionicConfigProvider#navBar.positionSecondaryButtons
 * @description Which side of the navBar to align the secondary navBar buttons. Default `right`.
 *
 * @param {string} value side of the navBar to align the secondary navBar buttons.
 *
 * * `platform`: Dynamically choose the correct title style depending on the platform
 * the app is running from. If the platform is `ios`, it will default to `right`.
 * If the platform is `android`, it will default to `right`. If the platform is not
 * `ios` or `android`, it will default to `right`.
 *
 * * `left`: Left align the secondary navBar buttons in the navBar
 * * `right`: Right align the secondary navBar buttons in the navBar.
 *
 * @returns {string} value
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
      transition: PLATFORM
    },
    navBar: {
      alignTitle: PLATFORM,
      positionPrimaryButtons: PLATFORM,
      positionSecondaryButtons: PLATFORM,
      transition: PLATFORM
    },
    backButton: {
      icon: PLATFORM,
      text: PLATFORM,
      previousTitleText: PLATFORM
    },
    form: {
      checkbox: PLATFORM
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
      transition: 'ios'
    },

    navBar: {
      alignTitle: 'center',
      positionPrimaryButtons: 'left',
      positionSecondaryButtons: 'right',
      transition: 'view'
    },

    backButton: {
      icon: 'ion-ios7-arrow-back',
      text: 'Back',
      previousTitleText: true
    },

    form: {
      checkbox: 'circle'
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
      transition: 'android'
    },

    navBar: {
      alignTitle: 'left',
      positionPrimaryButtons: 'right',
      positionSecondaryButtons: 'right'
    },

    backButton: {
      icon: 'ion-arrow-left-c',
      text: false,
      previousTitleText: false
    },

    form: {
      checkbox: 'square'
    },

    tabs: {
      style: 'striped',
      position: 'top'
    }

  });


  provider.transitions = {
    views: {},
    navBar: {}
  };


  // iOS Transitions
  // -----------------------
  provider.transitions.views.ios = function(enteringEle, leavingEle, direction, shouldAnimate) {
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
          setStyles(enteringEle, 1, (1 - step) * 99); // starting at 98% prevents a flicker
          setStyles(leavingEle, (1 - 0.1 * step), step * -33);

        } else if (direction == 'back') {
          setStyles(enteringEle, (1 - 0.1 * (1 - step)), (1 - step) * -33);
          setStyles(leavingEle, 1, step * 100);

        } else {
          // swap, enter, exit
          setStyles(enteringEle, 1, 0);
          setStyles(leavingEle, 0, 0);
        }
      },
      shouldAnimate: shouldAnimate
    };
  };

  provider.transitions.navBar.ios = function(enteringHeaderBar, leavingHeaderBar, direction, shouldAnimate) {
    shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');

    function setStyles(ctrl, opacity, titleX, backTextX) {
      var css = {};
      css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
      css.opacity = opacity === 1 ? '' : opacity;

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
          leave(enteringHeaderCtrl, leavingHeaderCtrl, 1 - step);
          enter(leavingHeaderCtrl, enteringHeaderCtrl, 1 - step);
        } else {
          enter(enteringHeaderCtrl, leavingHeaderCtrl, step);
          leave(leavingHeaderCtrl, enteringHeaderCtrl, step);
        }
      },
      shouldAnimate: shouldAnimate
    };
  };


  // Android Transitions
  // -----------------------

  provider.transitions.views.android = function(enteringEle, leavingEle, direction, shouldAnimate) {
    shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');

    function setStyles(ele, x) {
      var css = {};
      css[ionic.CSS.TRANSITION_DURATION] = shouldAnimate ? '' : 0;
      css[ionic.CSS.TRANSFORM] = 'translate3d(' + x + '%,0,0)';
      ionic.DomUtil.cachedStyles(ele, css);
    }

    return {
      run: function(step) {
        if (direction == 'forward') {
          setStyles(enteringEle, (1 - step) * 99); // starting at 98% prevents a flicker
          setStyles(leavingEle, step * -100);

        } else if (direction == 'back') {
          setStyles(enteringEle, (1 - step) * -100);
          setStyles(leavingEle, step * 100);

        } else {
          // swap, enter, exit
          setStyles(enteringEle, 0);
          setStyles(leavingEle, 0);
        }
      },
      shouldAnimate: shouldAnimate
    };
  };

  provider.transitions.navBar.android = function(enteringHeaderBar, leavingHeaderBar, direction, shouldAnimate) {
    shouldAnimate = shouldAnimate && (direction == 'forward' || direction == 'back');

    function setStyles(ctrl, opacity) {
      if (!ctrl) return;
      var css = {};
      css.opacity = opacity === 1 ? '' : opacity;

      ctrl.setCss('buttons-left', css);
      ctrl.setCss('buttons-right', css);
      ctrl.setCss('back-button', css);
      ctrl.setCss('back-text', css);
      ctrl.setCss('title', css);
    }

    return {
      run: function(step) {
        setStyles(enteringHeaderBar.controller(), step);
        setStyles(leavingHeaderBar && leavingHeaderBar.controller(), 1 - step);
      },
      shouldAnimate: true
    };
  };


  // No Transition
  // -----------------------

  provider.transitions.views.none = function(enteringEle, leavingEle) {
    return {
      run: function(step) {
        provider.transitions.views.android(enteringEle, leavingEle, false, false).run(step);
      }
    };
  };

  provider.transitions.navBar.none = function(enteringHeaderBar, leavingHeaderBar) {
    return {
      run: function(step) {
        provider.transitions.navBar.ios(enteringHeaderBar, leavingHeaderBar, false, false).run(step);
        provider.transitions.navBar.android(enteringHeaderBar, leavingHeaderBar, false, false).run(step);
      }
    };
  };


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
        if (angular.isObject(configObj[n])) {
          if (!isDefined(platformObj[n])) {
            platformObj[n] = {};
          }
          addConfig(configObj[n], platformObj[n]);

        } else if (!isDefined(platformObj[n])) {
          platformObj[n] = null;
        }
      }
    }
  }


  // private: create methods for each config to get/set
  function createConfig(configObj, providerObj, platformPath) {
    forEach(configObj, function(value, namespace) {

      if (angular.isObject(configObj[namespace])) {
        // recursively drill down the config object so we can create a method for each one
        providerObj[namespace] = {};
        createConfig(configObj[namespace], providerObj[namespace], platformPath + '.' + namespace);

      } else {
        // create a method for the provider/config methods that will be exposed
        providerObj[namespace] = function(newValue) {
          if (arguments.length) {
            configObj[namespace] = newValue;
            return providerObj;
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
      if (obj && isDefined(obj[str[i]])) {
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
