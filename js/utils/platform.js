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

    // Check if we are running in Cordova, which will have
    // window.device available.
    isCordova: function() {
      return (window.cordova || window.PhoneGap || window.phonegap);
    },
    isIPad: function() {
      return navigator.userAgent.toLowerCase().indexOf('ipad') >= 0;
    },
    isIOS7: function() {
      if(!window.device) {
        return navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i);
      }
      return window.device.platform == 'iOS' && parseFloat(window.device.version) >= 7.0;
    },
    isAndroid: function() {
      if(!window.device) {
        return navigator.userAgent.toLowerCase().indexOf('android') >= 0;
      }
      return window.device.platform === "Android";
    },

    // Check if the platform is the one detected by cordova
    is: function(type) {
      if(window.device && window.device.platform) {
        return window.device.platform === type || window.device.platform.toLowerCase() === type;
      }

      // A quick hack for 
      return navigator.userAgent.toLowerCase().indexOf(type.toLowerCase()) >= 0;
    },

    fullScreen: function(showFullScreen, showStatusBar) {
      // fullScreen( [showFullScreen[, showStatusBar] ] )
      // showFullScreen: default is true
      // showStatusBar: default is false
      this.isFullScreen = (showFullScreen !== false);
      this.showStatusBar = (showStatusBar === true);

      // add/remove the fullscreen classname to the body
      ionic.DomUtil.ready(function(){
        // run this when the DOM is ready
        if(ionic.Platform.isFullScreen) {
          document.body.classList.add('fullscreen');
        } else {
          document.body.classList.remove('fullscreen');
        }
      });

      // run this when the platform (cordova) is ready
      this.ready(function(){
      
        // do this only when runny in cordova
        if(ionic.Platform.showStatusBar) {
          // they do not want it to be full screen
          StatusBar.show();
        } else {
          // it should be full screen
          StatusBar.hide();
        }
      });

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
    ionic.trigger('platformready', document);
    document.removeEventListener("deviceready", onCordovaReady, false);
  }

})(window.ionic);
