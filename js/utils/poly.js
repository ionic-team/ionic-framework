(function(ionic) {
  'use strict';

  // From the man himself, Mr. Paul Irish.
  // The requestAnimationFrame polyfill
  window.rAF = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  // Ionic CSS polyfills
  ionic.CSS = {};
  
  (function() {
    var d = document.createElement('div');
    var keys = ['webkitTransform', 'transform', '-webkit-transform', 'webkit-transform',
                '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform'];

    for(var i = 0; i < keys.length; i++) {
      if(d.style[keys[i]] !== undefined) {
        ionic.CSS.TRANSFORM = keys[i];
        break;
      }
    }
  })();

})(window.ionic);
