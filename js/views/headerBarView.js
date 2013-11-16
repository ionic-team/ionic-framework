(function(ionic) {
'use strict';

  ionic.views.HeaderBar = ionic.views.View.inherit({
    initialize: function(opts) {
      this.el = opts.el;

      ionic.extend(this, {
        alignTitle: 'center'
      }, opts);

      this.align();
    },

    /**
     * Align the title text given the buttons in the header
     * so that the header text size is maximized and aligned
     * correctly as long as possible.
     */
    align: function() {
      var _this = this;

      window.rAF(ionic.proxy(function() {
        var i, c, childSize, childStyle;
        var children = this.el.children;
        var childNodes = this.el.childNodes;
        var styles = window.getComputedStyle(this.el, null);

        // Get the padding of the header for calculations
        var paddingLeft = parseFloat(styles.paddingLeft);
        var paddingRight = parseFloat(styles.paddingRight);

        // Get the full width of the header
        var headerWidth = this.el.offsetWidth;

        // Find the title element
        var title = this.el.querySelector('.title');
        if(!title) {
          return;
        }
      
        var leftWidth = 0;
        var rightWidth = 0;
        var titlePos = Array.prototype.indexOf.call(this.el.childNodes, title);

        // Compute how wide the left children are
        for(i = 0; i < titlePos; i++) {
          childSize = null;
          c = childNodes[i];
          if(c.nodeType == 3) {
            childSize = ionic.DomUtil.getTextBounds(c);
          } else if(c.nodeType == 1) {
            childSize = c.getBoundingClientRect();
          }
          if(childSize) {
            leftWidth += childSize.width;
          }
        }

        // Compute how wide the right children are
        for(i = titlePos + 1; i < childNodes.length; i++) {
          childSize = null;
          c = childNodes[i];
          if(c.nodeType == 3) {
            childSize = ionic.DomUtil.getTextBounds(c);
          } else if(c.nodeType == 1) {
            childSize = c.getBoundingClientRect();
          }
          if(childSize) {
            rightWidth += childSize.width;
          }
        }

        var margin = Math.max(leftWidth, rightWidth) + 10;

        // Size and align the header title based on the sizes of the left and
        // right children, and the desired alignment mode
        if(this.alignTitle == 'center') {
          title.style.left = margin + 'px';
          title.style.right = margin + 'px';

          if(title.offsetWidth < title.scrollWidth) {
            title.style.textAlign = 'left';
            title.style.right = (rightWidth + 5) + 'px';
          } else {
            title.style.textAlign = 'center';
          }
        } else if(this.alignTitle == 'left') {
          title.style.textAlign = 'left';
          title.style.left = (leftWidth + 15) + 'px';
        } else if(this.alignTitle == 'right') {
          title.style.textAlign = 'right';
          title.style.right = (rightWidth + 15) + 'px';
        }
      }, this));
    }
  });

})(ionic);
