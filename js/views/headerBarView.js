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

    align: function(align) {

      align || (align = this.alignTitle);

      // Find the titleEl element
      var titleEl = this.el.querySelector('.title');
      if(!titleEl) {
        return;
      }

      var self = this;
      //We have to rAF here so all of the elements have time to initialize
      ionic.requestAnimationFrame(function() {
        var i, c, childSize;
        var childNodes = self.el.childNodes;
        var leftWidth = 0;
        var rightWidth = 0;
        var isCountingRightWidth = false;

        // Compute how wide the left children are
        // Skip all titles (there may still be two titles, one leaving the dom)
        // Once we encounter a titleEl, realize we are now counting the right-buttons, not left
        for(i = 0; i < childNodes.length; i++) {
          c = childNodes[i];
          if (c.tagName && c.tagName.toLowerCase() == 'h1') {
            isCountingRightWidth = true;
            continue;
          }

          childSize = null;
          if(c.nodeType == 3) {
            childSize = ionic.DomUtil.getTextBounds(c).width;
          } else if(c.nodeType == 1) {
            childSize = c.offsetWidth;
          }
          if(childSize) {
            if (isCountingRightWidth) {
              rightWidth += childSize;
            } else {
              leftWidth += childSize;
            }
          }
        }

        var margin = Math.max(leftWidth, rightWidth) + 10;

        //Reset left and right before setting again
        titleEl.style.left = titleEl.style.right = '';

        // Size and align the header titleEl based on the sizes of the left and
        // right children, and the desired alignment mode
        if(align == 'center') {
          if(margin > 10) {
            titleEl.style.left = margin + 'px';
            titleEl.style.right = margin + 'px';
          }
          if(titleEl.offsetWidth < titleEl.scrollWidth) {
            if(rightWidth > 0) {
              titleEl.style.right = (rightWidth + 5) + 'px';
            }
          }
        } else if(align == 'left') {
          titleEl.classList.add('title-left');
          if(leftWidth > 0) {
            titleEl.style.left = (leftWidth + 15) + 'px';
          }
        } else if(align == 'right') {
          titleEl.classList.add('title-right');
          if(rightWidth > 0) {
            titleEl.style.right = (rightWidth + 15) + 'px';
          }
        }
      });
    }
  });

})(ionic);
