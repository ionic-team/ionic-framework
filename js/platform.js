(function(ionic) {

  ionic.Platform = {
    detect: function() {
      var platforms = [];

      var platform = this._checkPlatforms(platforms);

      for(var i = 0; i < platforms.length; i++) {
        document.body.classList.add('platform-' + platforms[i]);
      }

    },
    _checkPlatforms: function(platforms) {
      if(this.isCordova()) {
        platforms.push('cordova');
      }
      if(this.isIOS7()) {
        platforms.push('ios7');
      }
    },

    // Check if we are running in Cordova, which will have
    // window.device available.
    isCordova: function() {
      return (window.cordova || window.PhoneGap || window.phonegap);
      //&& /^file:\/{3}[^\/]/i.test(window.location.href) 
      //&& /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
    },
    isIOS7: function() {
      if(!window.device) {
        return false;
      }
      return parseFloat(window.device.version) >= 7.0;
    }
  }

  ionic.Platform.detect();
})(window.ionic);
