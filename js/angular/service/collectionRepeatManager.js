
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
    this.itemSizePrimary = options.itemSizePrimary;
    this.itemSizeSecondary = options.itemSizeSecondary;

    if (this.scrollView.options.scrollingX && this.scrollView.options.scrollingY) {
      throw new Error("TODO MOVE THIS ERROR TO THE DIRECTIVE. Cannot create a scrollCollectionRepeatManager on an element that scrolls both x and y. Choose one, yo!");
    }

    this.isVertical = !!this.scrollView.options.scrollingY;
    this.renderedItems = {};

    this.lastRenderScrollValue = this.bufferTransformOffset = this.hasBufferStartIndex =
      this.hasBufferEndIndex = this.bufferItemsLength = 0;

    this.scrollView.__$callback = this.scrollView.__callback;
    this.scrollView.__callback = angular.bind(this, this.renderScroll);

    function getItemHeight(item) { return item.height; }
    function getItemWidth(item) { return item.width; }
    function getItemTotalHeight(item) { return item.totalHeight; }
    function getItemTotalWidth(item) { return item.totalWidth; }
    function getViewportSize() { return self.viewportSize; }
    if (this.isVertical) {
      this.scrollView.options.getContentHeight = getViewportSize;
      this.itemSizePrimary = getItemHeight;
      this.itemSizeSecondary = getItemWidth;
      this.itemTotalSizePrimary = getItemTotalHeight;
      this.itemTotalSizeSecondary = getItemTotalWidth;

      this.getScrollValue = function() {
        return this.scrollView.__scrollTop;
      };
      this.getScrollMaxValue = function() {
        return this.scrollView.__maxScrollTop;
      };
      this.getScrollSize = function() {
        return this.scrollView.__clientHeight;
      };
      this.getScrollSizeSecondary = function() {
        return this.scrollView.__clientWidth;
      };
      this.transformString = function(y, x) {
        return 'translate3d('+x+'px,'+y+'px,0)';
      };
    } else {
      this.scrollView.options.getContentWidth = getViewportSize;
      this.itemSizePrimary = getItemWidth;
      this.itemSizeSecondary = getItemHeight;
      this.itemTotalSizePrimary = getItemTotalWidth;
      this.itemTotalSizeSecondary = getItemTotalHeight;

      this.getScrollValue = function() { return this.scrollView.__scrollLeft; };
      this.getScrollMaxValue = function() {
        return this.scrollView.__maxScrollLeft;
      };
      this.getScrollSize = function() {
        return this.scrollView.__clientWidth;
      };
      this.getScrollSizeSecondary = function() {
        return this.scrollView.__clientHeight;
      };
      this.transformString = function(x, y) {
        return 'translate3d('+x+'px,'+y+'px,0)';
      };
    }
  }

  CollectionRepeatManager.prototype = {
    destroy: function() {
      for (var i in this.renderedItems) {
        this.removeItem(i);
      }
    },
    resize: function() {
      this.viewportSize = this.isVertical ?
        this.dataSource.totalHeight :
        this.dataSource.totalWidth;
      this.scrollView.resize();
      this.setCurrentIndex(0);
      this.lastRenderScrollValue = 0;
      this.render(true);
    },
    setCurrentIndex: function(index, height) {
      var dimensions = this.dataSource.dimensions;
      this.currentIndex = index;

      this.hasPrevIndex = index > 0;
      if (this.hasPrevIndex) {
        this.prevTotalHeight = dimensions[index - 1].totalHeight;
      }
      this.hasNextIndex = index + 1 < this.dataSource.getLength();
      if (this.hasNextIndex) {
        this.nextTotalHeight = dimensions[index + 1].totalHeight;
        this.nextHeight = dimensions[index + 1].height;
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
      if ((this.hasNextIndex && transformPos >= this.nextTotalHeight) ||
          (this.hasPrevIndex && transformPos < this.prevTotalHeight) ||
           Math.abs(transformPos - this.lastRenderScrollValue) > 100) {
        this.render();
      }
      return transformPos - this.lastRenderScrollValue;
    },
    getIndexForScrollValue: function(i, scrollValue) {
      var dimensions = this.dataSource.dimensions;
      var rect;
      //Scrolling up
      if (scrollValue <= dimensions[i].totalHeight) {
        while ( (rect = dimensions[i - 1]) && rect.totalHeight > scrollValue) {
          i--;
        }
      //Scrolling down
      } else {
        while ( (rect = dimensions[i + 1]) && rect.totalHeight < scrollValue) {
          i++;
        }
      }
      return i;
    },
    render: function(shouldRedrawAll) {
      var i;
      if (shouldRedrawAll) {
        for (i in this.renderedItems) {
          this.removeItem(i);
        }
      }
      var scrollValue = this.getScrollValue();
      var scrollDelta = scrollValue - this.lastRenderScrollValue;
      var scrollSize = this.getScrollSize();
      var scrollSizeEnd = scrollSize + scrollValue;

      var dimensions = this.dataSource.dimensions;

      var startIndex = this.getIndexForScrollValue(this.currentIndex, scrollValue);
      var bufferStartIndex = Math.max(0, startIndex - 1);
      var startHeight = dimensions[bufferStartIndex].totalHeight;

      i = bufferStartIndex;
      var rect;
      while ( (rect = dimensions[i]) && (rect.totalHeight - rect.height) < scrollSizeEnd) {
        this.renderItem(i, rect.totalHeight - startHeight, 0);
        i++;
      }
      var endIndex = i - 1;
      var bufferEndIndex = Math.min(this.dataSource.getLength() - 1, endIndex + 1);
      if (bufferEndIndex !== endIndex) {
        this.renderItem(bufferEndIndex, dimensions[bufferEndIndex].totalHeight - startHeight, 0);
      }

      for (i in this.renderedItems) {
        if (i < bufferStartIndex || i > bufferEndIndex) {
          this.removeItem(i);
        }
      }

      this.setCurrentIndex(startIndex);
      this.lastRenderScrollValue = startHeight;

      if (!this.dataSource.scope.$$phase) {
        this.dataSource.scope.$digest();
      }
    },
    renderItem: function(dataIndex, primaryPos, secondaryPos) {
      var self = this;
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

