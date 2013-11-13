(function(ionic) {
  ionic.DomUtil = {
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
      return null
    },

    getChildIndex: function(element) {
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
    }
  };
})(window.ionic);
