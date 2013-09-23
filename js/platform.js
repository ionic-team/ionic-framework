(function(ionic) {

  ionic.Platform = {
    detect: function() {
      var platforms = [];

      console.log('Checking platforms');
      var platform = this._checkPlatforms(platforms);
      console.log('Got platforms', platforms);

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
      return 'device' in window;
    },
    isIOS7: function() {
      if(!window.device) {
        return false;
      }
      return parseFloat(window.device.version) >= 7.0;
    }
  }

  ionic.Platform.detect();
})(ionic = window.ionic || {});
