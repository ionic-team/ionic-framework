(function(){
  "use strict";

  if (typeof Element.prototype.matches !== 'function') {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector || function matches(selector) {
      var element = this;
      var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
      var index = 0;
      while (elements[index] && elements[index] !== element) {
        ++index;
      }
      return Boolean(elements[index]);
    };
  }


  if (typeof Element.prototype.closest !== 'function') {
    Element.prototype.closest = function closest(selector) {
      var element = this;
      while (element && element.nodeType === 1) {
        if (element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
      }
      return null;
    };
  }


  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  // MIT license
  var win = window;
  if (!win.requestAnimationFrame) {
    win.requestAnimationFrame = win.webkitRequestAnimationFrame;
    win.cancelAnimationFrame = win.webkitCancelAnimationFrame || win.webkitCancelRequestAnimationFrame;

    if (!win.requestAnimationFrame) {
      win.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));

        var id = win.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);

        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!win.cancelAnimationFrame) {
      win.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
  }

})();
