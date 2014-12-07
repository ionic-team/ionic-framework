(function(window, document, ionic) {

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  var IOS = 'ios';
  var ANDROID = 'android';
  var WINDOWS_PHONE = 'windowsphone';

  /**
   * @ngdoc utility
   * @name ionic.Platform
   * @module ionic
   */
  ionic.Platform = {

    // Put navigator on platform so it can be mocked and set
    // the browser does not allow window.navigator to be set
    navigator: window.navigator,

    /**
     * @ngdoc property
     * @name ionic.Platform#isReady
     * @returns {boolean} Whether the device is ready.
     */
    isReady: false,
    /**
     * @ngdoc property
     * @name ionic.Platform#isFullScreen
     * @returns {boolean} Whether the device is fullscreen.
     */
    isFullScreen: false,
    /**
     * @ngdoc property
     * @name ionic.Platform#platforms
     * @returns {Array(string)} An array of all platforms found.
     */
    platforms: null,
    /**
     * @ngdoc property
     * @name ionic.Platform#grade
     * @returns {string} What grade the current platform is.
     */
    grade: null,
    ua: navigator.userAgent,

    /**
     * @ngdoc method
     * @name ionic.Platform#ready
     * @description
     * Trigger a callback once the device is ready, or immediately
     * if the device is already ready. This method can be run from
     * anywhere and does not need to be wrapped by any additonal methods.
     * When the app is within a WebView (Cordova), it'll fire
     * the callback once the device is ready. If the app is within
     * a web browser, it'll fire the callback after `window.load`.
     * Please remember that Cordova features (Camera, FileSystem, etc) still
     * will not work in a web browser.
     * @param {function} callback The function to call.
     */
    ready: function(cb) {
      // run through tasks to complete now that the device is ready
      if (this.isReady) {
        cb();
      } else {
        // the platform isn't ready yet, add it to this array
        // which will be called once the platform is ready
        readyCallbacks.push(cb);
      }
    },

    /**
     * @private
     */
    detect: function() {
      ionic.Platform._checkPlatforms();

      ionic.requestAnimationFrame(function() {
        // only add to the body class if we got platform info
        for (var i = 0; i < ionic.Platform.platforms.length; i++) {
          document.body.classList.add('platform-' + ionic.Platform.platforms[i]);
        }
      });
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#setGrade
     * @description Set the grade of the device: 'a', 'b', or 'c'. 'a' is the best
     * (most css features enabled), 'c' is the worst.  By default, sets the grade
     * depending on the current device.
     * @param {string} grade The new grade to set.
     */
    setGrade: function(grade) {
      var oldGrade = this.grade;
      this.grade = grade;
      ionic.requestAnimationFrame(function() {
        if (oldGrade) {
          document.body.classList.remove('grade-' + oldGrade);
        }
        document.body.classList.add('grade-' + grade);
      });
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#device
     * @description Return the current device (given by cordova).
     * @returns {object} The device object.
     */
    device: function() {
      return window.device || {};
    },

    _checkPlatforms: function(platforms) {
      this.platforms = [];
      var grade = 'a';

      if (this.isWebView()) {
        this.platforms.push('webview');
        this.platforms.push('cordova');
      } else {
        this.platforms.push('browser');
      }
      if (this.isIPad()) this.platforms.push('ipad');

      var platform = this.platform();
      if (platform) {
        this.platforms.push(platform);

        var version = this.version();
        if (version) {
          var v = version.toString();
          if (v.indexOf('.') > 0) {
            v = v.replace('.', '_');
          } else {
            v += '_0';
          }
          this.platforms.push(platform + v.split('_')[0]);
          this.platforms.push(platform + v);

          if (this.isAndroid() && version < 4.4) {
            grade = (version < 4 ? 'c' : 'b');
          } else if (this.isWindowsPhone()) {
            grade = 'b';
          }
        }
      }

      this.setGrade(grade);
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#isWebView
     * @returns {boolean} Check if we are running within a WebView (such as Cordova).
     */
    isWebView: function() {
      return !(!window.cordova && !window.PhoneGap && !window.phonegap);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isIPad
     * @returns {boolean} Whether we are running on iPad.
     */
    isIPad: function() {
      if (/iPad/i.test(ionic.Platform.navigator.platform)) {
        return true;
      }
      return /iPad/i.test(this.ua);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isIOS
     * @returns {boolean} Whether we are running on iOS.
     */
    isIOS: function() {
      return this.is(IOS);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isAndroid
     * @returns {boolean} Whether we are running on Android.
     */
    isAndroid: function() {
      return this.is(ANDROID);
    },
    /**
     * @ngdoc method
     * @name ionic.Platform#isWindowsPhone
     * @returns {boolean} Whether we are running on Windows Phone.
     */
    isWindowsPhone: function() {
      return this.is(WINDOWS_PHONE);
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#platform
     * @returns {string} The name of the current platform.
     */
    platform: function() {
      // singleton to get the platform name
      if (platformName === null) this.setPlatform(this.device().platform);
      return platformName;
    },

    /**
     * @private
     */
    setPlatform: function(n) {
      if (typeof n != 'undefined' && n !== null && n.length) {
        platformName = n.toLowerCase();
      } else if(getParameterByName('ionicplatform')) {
        platformName = getParameterByName('ionicplatform');
      } else if (this.ua.indexOf('Android') > 0) {
        platformName = ANDROID;
      } else if (this.ua.indexOf('iPhone') > -1 || this.ua.indexOf('iPad') > -1 || this.ua.indexOf('iPod') > -1) {
        platformName = IOS;
      } else if (this.ua.indexOf('Windows Phone') > -1) {
        platformName = WINDOWS_PHONE;
      } else {
        platformName = ionic.Platform.navigator.platform && navigator.platform.toLowerCase().split(' ')[0] || '';
      }
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#version
     * @returns {number} The version of the current device platform.
     */
    version: function() {
      // singleton to get the platform version
      if (platformVersion === null) this.setVersion(this.device().version);
      return platformVersion;
    },

    /**
     * @private
     */
    setVersion: function(v) {
      if (typeof v != 'undefined' && v !== null) {
        v = v.split('.');
        v = parseFloat(v[0] + '.' + (v.length > 1 ? v[1] : 0));
        if (!isNaN(v)) {
          platformVersion = v;
          return;
        }
      }

      platformVersion = 0;

      // fallback to user-agent checking
      var pName = this.platform();
      var versionMatch = {
        'android': /Android (\d+).(\d+)?/,
        'ios': /OS (\d+)_(\d+)?/,
        'windowsphone': /Windows Phone (\d+).(\d+)?/
      };
      if (versionMatch[pName]) {
        v = this.ua.match(versionMatch[pName]);
        if (v &&  v.length > 2) {
          platformVersion = parseFloat(v[1] + '.' + v[2]);
        }
      }
    },

    // Check if the platform is the one detected by cordova
    is: function(type) {
      type = type.toLowerCase();
      // check if it has an array of platforms
      if (this.platforms) {
        for (var x = 0; x < this.platforms.length; x++) {
          if (this.platforms[x] === type) return true;
        }
      }
      // exact match
      var pName = this.platform();
      if (pName) {
        return pName === type.toLowerCase();
      }

      // A quick hack for to check userAgent
      return this.ua.toLowerCase().indexOf(type) >= 0;
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#exitApp
     * @description Exit the app.
     */
    exitApp: function() {
      this.ready(function() {
        navigator.app && navigator.app.exitApp && navigator.app.exitApp();
      });
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#showStatusBar
     * @description Shows or hides the device status bar (in Cordova).
     * @param {boolean} shouldShow Whether or not to show the status bar.
     */
    showStatusBar: function(val) {
      // Only useful when run within cordova
      this._showStatusBar = val;
      this.ready(function() {
        // run this only when or if the platform (cordova) is ready
        ionic.requestAnimationFrame(function() {
          if (ionic.Platform._showStatusBar) {
            // they do not want it to be full screen
            window.StatusBar && window.StatusBar.show();
            document.body.classList.remove('status-bar-hide');
          } else {
            // it should be full screen
            window.StatusBar && window.StatusBar.hide();
            document.body.classList.add('status-bar-hide');
          }
        });
      });
    },

    /**
     * @ngdoc method
     * @name ionic.Platform#fullScreen
     * @description
     * Sets whether the app is fullscreen or not (in Cordova).
     * @param {boolean=} showFullScreen Whether or not to set the app to fullscreen. Defaults to true.
     * @param {boolean=} showStatusBar Whether or not to show the device's status bar. Defaults to false.
     */
    fullScreen: function(showFullScreen, showStatusBar) {
      // showFullScreen: default is true if no param provided
      this.isFullScreen = (showFullScreen !== false);

      // add/remove the fullscreen classname to the body
      ionic.DomUtil.ready(function() {
        // run this only when or if the DOM is ready
        ionic.requestAnimationFrame(function() {
          // fixing pane height before we adjust this
          panes = document.getElementsByClassName('pane');
          for (var i = 0; i < panes.length; i++) {
            panes[i].style.height = panes[i].offsetHeight + "px";
          }
          if (ionic.Platform.isFullScreen) {
            document.body.classList.add('fullscreen');
          } else {
            document.body.classList.remove('fullscreen');
          }
        });
        // showStatusBar: default is false if no param provided
        ionic.Platform.showStatusBar((showStatusBar === true));
      });
    }

  };

  var platformName = null, // just the name, like iOS or Android
  platformVersion = null, // a float of the major and minor, like 7.1
  readyCallbacks = [],
  windowLoadListenderAttached;

  // setup listeners to know when the device is ready to go
  function onWindowLoad() {
    if (ionic.Platform.isWebView()) {
      // the window and scripts are fully loaded, and a cordova/phonegap
      // object exists then let's listen for the deviceready
      document.addEventListener("deviceready", onPlatformReady, false);
    } else {
      // the window and scripts are fully loaded, but the window object doesn't have the
      // cordova/phonegap object, so its just a browser, not a webview wrapped w/ cordova
      onPlatformReady();
    }
    if (windowLoadListenderAttached) {
      window.removeEventListener("load", onWindowLoad, false);
    }
  }
  if (document.readyState === 'complete') {
    onWindowLoad();
  } else {
    windowLoadListenderAttached = true;
    window.addEventListener("load", onWindowLoad, false);
  }

  window.addEventListener("load", onWindowLoad, false);

  function onPlatformReady() {
    // the device is all set to go, init our own stuff then fire off our event
    ionic.Platform.isReady = true;
    ionic.Platform.detect();
    for (var x = 0; x < readyCallbacks.length; x++) {
      // fire off all the callbacks that were added before the platform was ready
      readyCallbacks[x]();
    }
    readyCallbacks = [];
    ionic.trigger('platformready', { target: document });

    ionic.requestAnimationFrame(function() {
      document.body.classList.add('platform-ready');
    });
  }

})(this, document, ionic);
