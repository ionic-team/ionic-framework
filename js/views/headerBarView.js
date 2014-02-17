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
    align: ionic.animationFrameThrottle(function(titleSelector) {

      // Find the titleEl element
      var titleEl = this.el.querySelector(titleSelector || '.title');
      if(!titleEl) {
        return;
      }

      var i, c, childSize;
      var childNodes = this.el.childNodes;
      var leftWidth = 0;
      var rightWidth = 0;
      var isCountingRightWidth = true;

      // Compute how wide the left children are
      // Skip all titles (there may still be two titles, one leaving the dom)
      // Once we encounter a titleEl, realize we are now counting the right-buttons, not left
      for(i = 0; i < childNodes.length; i++) {
        c = childNodes[i];
        if (c.tagName && c.tagName.toLowerCase() == 'h1') {
          isCountingRightWidth = false;
          continue;
        }

        childSize = null;
        if(c.nodeType == 3) {
          childSize = ionic.DomUtil.getTextBounds(c);
        } else if(c.nodeType == 1) {
          childSize = c.getBoundingClientRect();
        }
        if(childSize) {
          if (isCountingRightWidth) {
            rightWidth += childSize.width;
          } else {
            leftWidth += childSize.width;
          }
        }
      }

      var margin = Math.max(leftWidth, rightWidth) + 10;

      // Size and align the header titleEl based on the sizes of the left and
      // right children, and the desired alignment mode
      if(this.alignTitle == 'center') {
        if(margin > 10) {
          titleEl.style.left = margin + 'px';
          titleEl.style.right = margin + 'px';
        }
        if(titleEl.offsetWidth < titleEl.scrollWidth) {
          if(rightWidth > 0) {
            titleEl.style.right = (rightWidth + 5) + 'px';
          }
        }
      } else if(this.alignTitle == 'left') {
        titleEl.classList.add('titleEl-left');
        if(leftWidth > 0) {
          titleEl.style.left = (leftWidth + 15) + 'px';
        }
      } else if(this.alignTitle == 'right') {
        titleEl.classList.add('titleEl-right');
        if(rightWidth > 0) {
          titleEl.style.right = (rightWidth + 15) + 'px';
        }
      }
    })
  });

})(ionic);
