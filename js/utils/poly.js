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
  

})(window.ionic);
