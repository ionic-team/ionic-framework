(function(ionic) {

  ionic.Platform = {

    detect: function() {
      
      var domReady = function() {
        // run when the DOM is ready
        document.addEventListener("deviceready", deviceReady, false);
        document.removeEventListener("DOMContentLoaded", domReady, false);
      };
      document.addEventListener("DOMContentLoaded", domReady, false);

      var deviceReady = function() {
        // run when cordova is fully loaded
        var platforms = [];
        ionic.Platform._checkPlatforms(platforms);

        if(platforms.length) {
          // only change the body class if we got platform info
          var bodyClass = document.body.className;
          for(var i = 0; i < platforms.length; i++) {
            bodyClass += ' platform-' + platforms[i];
          }
          document.body.className = bodyClass;
        }
        document.removeEventListener("deviceready", deviceReady, false);
      };

    },

    _checkPlatforms: function(platforms) {
      if(this.isCordova()) {
        platforms.push('cordova');
      }
      if(this.isIOS7()) {
        platforms.push('ios7');
      }
      if(this.isIPad()) {
        platforms.push('ipad');
      }
      if(this.isAndroid()) {
        platforms.push('android');
      }

      // Return whether we detected anything
      return (platforms.length > 0);
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
    }
  };

  ionic.Platform.detect();
})(window.ionic);
