(function(ionic) {

  ionic.Platform = {
    detect: function() {
      var platforms = [];

      var didDetect = this._checkPlatforms(platforms);

      var classify = function() {
        if(!document.body) { return; }

        for(var i = 0; i < platforms.length; i++) {
          document.body.classList.add('platform-' + platforms[i]);
        }
      };

      document.addEventListener( "DOMContentLoaded", function(){
        classify();
      });

      classify();

      return didDetect;
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
      if(platforms.length === 0) {
        return false;
      }
      return true;
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
        return false;
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
