(function(ionic) {

  ionic.Platform = {
    PLATFORM_CLASS_MAP: {
      'ios7': 'ios7'
    },
    annotate: function() {
      var platform = this._checkPlatforms();
      platform && document.body.classList.add('platform-' + platform);
    },
    _checkPlatforms: function() {
      if(this.isIOS7()) {
        return 'ios7';
      }
    },
    isIOS7: function() {
      if(!window.device) {
        return false;
      }
      return parseFloat(window.device.version) >= 7.0;
    }
  }

  ionic.Platform.annotate();

})(ionic = window.ionic || {});
