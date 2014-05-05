
IonicModule
.factory('$collectionRepeatManager', [
  '$rootScope',
  '$timeout',
function($rootScope, $timeout) {
  function CollectionRepeatManager(options) {
    var self = this;
    this.dataSource = options.dataSource;
    this.element = options.element;
    this.scrollView = options.scrollView;

    this.isVertical = !!this.scrollView.options.scrollingY;
    this.renderedItems = {};

    this.lastRenderScrollValue = this.bufferTransformOffset = this.hasBufferStartIndex =
      this.hasBufferEndIndex = this.bufferItemsLength = 0;
    this.setCurrentIndex(0);

    this.scrollView.__$callback = this.scrollView.__callback;
    this.scrollView.__callback = angular.bind(this, this.renderScroll);

    function getViewportSize() { return self.viewportSize; }
    if (this.isVertical) {
      this.scrollView.options.getContentHeight = getViewportSize;

      this.scrollValue = function() {
        return this.scrollView.__scrollTop;
      };
      this.scrollMaxValue = function() {
        return this.scrollView.__maxScrollTop;
      };
      this.scrollSize = function() {
        return this.scrollView.__clientHeight;
      };
      this.secondaryScrollSize = function() {
        return this.scrollView.__clientWidth;
      };
      this.transformString = function(y, x) {
        return 'translate3d('+x+'px,'+y+'px,0)';
      };
      this.primaryDimension = function(dim) {
        return dim.height;
      };
      this.secondaryDimension = function(dim) {
        return dim.width;
      };
    } else {
      this.scrollView.options.getContentWidth = getViewportSize;

      this.scrollValue = function() {
        return this.scrollView.__scrollLeft;
      };
      this.scrollMaxValue = function() {
        return this.scrollView.__maxScrollLeft;
      };
      this.scrollSize = function() {
        return this.scrollView.__clientWidth;
      };
      this.secondaryScrollSize = function() {
        return this.scrollView.__clientHeight;
      };
      this.transformString = function(x, y) {
        return 'translate3d('+x+'px,'+y+'px,0)';
      };
      this.primaryDimension = function(dim) {
        return dim.width;
      };
      this.secondaryDimension = function(dim) {
        return dim.height;
      };
    }
  }

  CollectionRepeatManager.prototype = {
    destroy: function() {
      for (var i in this.renderedItems) {
        this.removeItem(i);
      }
    },
    calculateDimensions: function() {
      var primaryPos = 0;
      var secondaryPos = 0;
      var len = this.dataSource.dimensions.length;
      var secondaryScrollSize = this.secondaryScrollSize();
      var previous;

      return this.dataSource.dimensions.map(function(dim) {
        var rect = {
          primarySize: this.primaryDimension(dim),
          secondarySize: Math.min(this.secondaryDimension(dim), secondaryScrollSize)
        };

        if (previous) {
          secondaryPos += previous.secondarySize;
          if (previous.primaryPos === primaryPos &&
              secondaryPos + rect.secondarySize > secondaryScrollSize) {
            secondaryPos = 0;
            primaryPos += previous.primarySize;
          } else {
          }
        }

        rect.primaryPos = primaryPos;
        rect.secondaryPos = secondaryPos;

        previous = rect;
        return rect;
      }, this);
    },
    resize: function() {
      this.dimensions = this.calculateDimensions();
      var last = this.dimensions[this.dimensions.length - 1];
      this.viewportSize = last ? last.primaryPos + last.primarySize : 0;
      this.setCurrentIndex(0);
      this.render(true);
    },
    setCurrentIndex: function(index, height) {
      this.currentIndex = index;

      this.hasPrevIndex = index > 0;
      if (this.hasPrevIndex) {
        this.previousPos = this.dimensions[index - 1].primaryPos;
      }
      this.hasNextIndex = index + 1 < this.dataSource.getLength();
      if (this.hasNextIndex) {
        this.nextPos = this.dimensions[index + 1].primaryPos;
      }
    },
    renderScroll: ionic.animationFrameThrottle(function(transformLeft, transformTop, zoom, wasResize) {
      if (this.isVertical) {
        transformTop = this.getTransformPosition(transformTop);
      } else {
        transformLeft = this.getTransformPosition(transformLeft);
      }
      return this.scrollView.__$callback(transformLeft, transformTop, zoom, wasResize);
    }),
    getTransformPosition: function(transformPos) {
      if ((this.hasNextIndex && transformPos >= this.nextPos) ||
          (this.hasPrevIndex && transformPos < this.previousPos) ||
           Math.abs(transformPos - this.lastRenderScrollValue) > 100) {
        this.render();
      }
      return transformPos - this.lastRenderScrollValue;
    },
    getIndexForScrollValue: function(i, scrollValue) {
      var rect;
      //Scrolling up
      if (scrollValue <= this.dimensions[i].primaryPos) {
        while ( (rect = this.dimensions[i - 1]) && rect.primaryPos > scrollValue) {
          i--;
        }
      //Scrolling down
      } else {
        while ( (rect = this.dimensions[i + 1]) && rect.primaryPos < scrollValue) {
          i++;
        }
      }
      return i;
    },
    render: function(shouldRedrawAll) {
      var i;
      if (this.currentIndex >= this.dataSource.getLength() || shouldRedrawAll) {
        for (i in this.renderedItems) {
          this.removeItem(i);
        }
        if (this.currentIndex >= this.dataSource.getLength()) return null;
      }

      var rect;
      var scrollValue = this.scrollValue();
      var scrollDelta = scrollValue - this.lastRenderScrollValue;
      var scrollSize = this.scrollSize();
      var scrollSizeEnd = scrollSize + scrollValue;
      var startIndex = this.getIndexForScrollValue(this.currentIndex, scrollValue);

      //Make buffer start on previous row
      var bufferStartIndex = Math.max(startIndex - 1, 0);
      while (bufferStartIndex > 0 &&
         (rect = this.dimensions[bufferStartIndex]) &&
         rect.primaryPos === this.dimensions[startIndex - 1].primaryPos) {
        bufferStartIndex--;
      }
      var startPos = this.dimensions[bufferStartIndex].primaryPos;

      i = bufferStartIndex;
      while ((rect = this.dimensions[i]) && (rect.primaryPos - rect.primarySize < scrollSizeEnd)) {
        this.renderItem(i, rect.primaryPos - startPos, rect.secondaryPos);
        i++;
      }
      var bufferEndIndex = i - 1;

      for (i in this.renderedItems) {
        if (i < bufferStartIndex || i > bufferEndIndex) {
          this.removeItem(i);
        }
      }

      this.setCurrentIndex(startIndex);
      this.lastRenderScrollValue = startPos;
    },
    renderItem: function(dataIndex, primaryPos, secondaryPos) {
      var item = this.dataSource.getItem(dataIndex);
      if (item) {
        this.dataSource.attachItem(item);
        item.element[0].style[ionic.CSS.TRANSFORM] = this.transformString(
          primaryPos, secondaryPos, secondaryPos
        );
        this.renderedItems[dataIndex] = item;
      } else {
        delete this.renderedItems[dataIndex];
      }
    },
    removeItem: function(dataIndex) {
      var item = this.renderedItems[dataIndex];
      if (item) {
        this.dataSource.detachItem(item);
        delete this.renderedItems[dataIndex];
      }
    }
  };

  return CollectionRepeatManager;
}]);

