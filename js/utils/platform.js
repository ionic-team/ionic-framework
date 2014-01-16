(function(ionic) {

  ionic.Platform = {

    isReady: false,
    isFullScreen: false,
    platforms: null,

    ready: function(cb) {
      // run through tasks to complete now that the device is ready
      if(this.isReady) {
        cb();
      } else {
        ionic.on('platformready', cb, document);
      }
    },

    detect: function() {
      ionic.Platform._checkPlatforms();

      if(this.platforms.length) {
        // only change the body class if we got platform info
        var i, bodyClass = document.body.className;
        for(i = 0; i < this.platforms.length; i++) {
          bodyClass += ' platform-' + this.platforms[i];
        }
        document.body.className = bodyClass;
      }
    },

    device: function() {
      if(window.device) return window.device;
      console.error('device plugin required');
      return {};
    },

    _checkPlatforms: function(platforms) {
      this.platforms = [];

      if(this.isCordova()) {
        this.platforms.push('cordova');
      }
      if(this.isIOS7()) {
        this.platforms.push('ios7');
      }
      if(this.isIPad()) {
        this.platforms.push('ipad');
      }
      if(this.isAndroid()) {
        this.platforms.push('android');
      }
    },

    // Check if we are running in Cordova
    isCordova: function() {
      return (window.cordova || window.PhoneGap || window.phonegap);
    },
    isIPad: function() {
      return navigator.userAgent.toLowerCase().indexOf('ipad') >= 0;
    },
    isIOS7: function() {
      return this.device().platform == 'iOS' && parseFloat(window.device.version) >= 7.0;
    },
    isAndroid: function() {
      return this.device().platform === "Android";
    },

    // Check if the platform is the one detected by cordova
    is: function(type) {
      if(this.device.platform) {
        return window.device.platform.toLowerCase() === type.toLowerCase();
      }
      // A quick hack for 
      return navigator.userAgent.toLowerCase().indexOf(type.toLowerCase()) >= 0;
    },

    showStatusBar: function(val) {
      // Only useful when run within cordova
      this.showStatusBar = val;
      this.ready(function(){
        // run this only when or if the platform (cordova) is ready
        if(ionic.Platform.showStatusBar) {
          // they do not want it to be full screen
          StatusBar.show();
          document.body.classList.remove('status-bar-hide');
        } else {
          // it should be full screen
          StatusBar.hide();
          document.body.classList.add('status-bar-hide');
        }
      });
    },

    fullScreen: function(showFullScreen, showStatusBar) {
      // fullScreen( [showFullScreen[, showStatusBar] ] )
      // showFullScreen: default is true if no param provided
      this.isFullScreen = (showFullScreen !== false);

      // add/remove the fullscreen classname to the body
      ionic.DomUtil.ready(function(){
        // run this only when or if the DOM is ready
        if(ionic.Platform.isFullScreen) {
          document.body.classList.add('fullscreen');
        } else {
          document.body.classList.remove('fullscreen');
        }
      });

      // showStatusBar: default is false if no param provided
      this.showStatusBar( (showStatusBar === true) );
    }

  };


  // setup listeners to know when the device is ready to go
  function onWindowLoad() {
    // window is loaded, now lets listen for when the device is ready
    document.addEventListener("deviceready", onCordovaReady, false);
    window.removeEventListener("load", onWindowLoad, false);
  }
  window.addEventListener("load", onWindowLoad, false);

  function onCordovaReady() {
    // the device is all set to go, init our own stuff then fire off our event
    ionic.Platform.isReady = true;
    ionic.Platform.detect();
    ionic.trigger('platformready', { target: document });
    document.removeEventListener("deviceready", onCordovaReady, false);
  }

})(window.ionic);
