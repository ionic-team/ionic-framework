(function(ionic) {

  var readyCallbacks = [],
  domReady = function() {
    for(var x=0; x<readyCallbacks.length; x++) {
      window.rAF(readyCallbacks[x]);
    }
    readyCallbacks = [];
    document.removeEventListener('DOMContentLoaded', domReady);
  };
  document.addEventListener('DOMContentLoaded', domReady);

  ionic.DomUtil = {

    /*
     * Find an element's offset, then add it to the offset of the parent
     * until we are at the direct child of parentEl
     * use-case: find scroll offset of any element within a scroll container
     */
    getPositionInParent: function(el, parentEl) {
      var left = 0, top = 0;
      while (el && el !== parentEl) {
        left += el.offsetLeft;
        top += el.offsetTop;
        el = el.parentNode;
      }
      return {
        left: left,
        top: top
      };
    },

    ready: function(cb) {
      if(document.readyState === "complete") {
        window.rAF(cb);
      } else {
        readyCallbacks.push(cb);
      }
    },

    getTextBounds: function(textNode) {
      if(document.createRange) {
        var range = document.createRange();
        range.selectNodeContents(textNode);
        if(range.getBoundingClientRect) {
          var rect = range.getBoundingClientRect();

          var sx = window.scrollX;
          var sy = window.scrollY;

          return {
            top: rect.top + sy,
            left: rect.left + sx,
            right: rect.left + sx + rect.width,
            bottom: rect.top + sy + rect.height,
            width: rect.width,
            height: rect.height
          };
        }
      }
      return null;
    },

    getChildIndex: function(element, type) {
      if(type) {
        var ch = element.parentNode.children;
        var c;
        for(var i = 0, k = 0, j = ch.length; i < j; i++) {
          c = ch[i];
          if(c.nodeName && c.nodeName.toLowerCase() == type) {
            if(c == element) {
              return k;
            }
            k++;
          }
        }
      }
      return Array.prototype.slice.call(element.parentNode.children).indexOf(element);
    },
    swapNodes: function(src, dest) {
      dest.parentNode.insertBefore(src, dest);
    },
    /**
     * {returns} the closest parent matching the className
     */
    getParentWithClass: function(e, className) {
      while(e.parentNode) {
        if(e.parentNode.classList && e.parentNode.classList.contains(className)) {
          return e.parentNode;
        }
        e = e.parentNode;
      }
      return null;
    },
    /**
     * {returns} the closest parent or self matching the className
     */
    getParentOrSelfWithClass: function(e, className) {
      while(e) {
        if(e.classList && e.classList.contains(className)) {
          return e;
        }
        e = e.parentNode;
      }
      return null;
    },

    rectContains: function(x, y, x1, y1, x2, y2) {
      if(x < x1 || x > x2) return false;
      if(y < y1 || y > y2) return false;
      return true;
    }
  };
})(window.ionic);
