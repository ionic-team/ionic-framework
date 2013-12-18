(function(ionic) {

  ionic.Platform = {
    detect: function() {
      var platforms = [];

      this._checkPlatforms(platforms);

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
      return device.platform === "Android";
    }
  };

  ionic.Platform.detect();
})(window.ionic);
