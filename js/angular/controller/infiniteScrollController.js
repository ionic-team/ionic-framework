IonicModule
.controller('$ionInfiniteScroll', [
  '$scope',
  '$attrs',
  '$element',
  '$timeout',
function($scope, $attrs, $element, $timeout) {
  var self = this;
  self.isLoading = false;

  $scope.icon = function() {
    return isDefined($attrs.icon) ? $attrs.icon : 'ion-load-d';
  };

  $scope.spinner = function() {
    return isDefined($attrs.spinner) ? $attrs.spinner : '';
  };

  $scope.$on('scroll.infiniteScrollComplete', function() {
    finishInfiniteScroll();
  });

  $scope.$on('$destroy', function() {
    if (self.scrollCtrl && self.scrollCtrl.$element) self.scrollCtrl.$element.off('scroll', self.checkBounds);
    if (self.scrollEl && self.scrollEl.removeEventListener) {
      self.scrollEl.removeEventListener('scroll', self.checkBounds);
    }
  });

  // debounce checking infinite scroll events
  self.checkBounds = ionic.Utils.throttle(checkInfiniteBounds, 300);

  function onInfinite() {
    ionic.requestAnimationFrame(function() {
      $element[0].classList.add('active');
    });
    self.isLoading = true;
    $scope.$parent && $scope.$parent.$apply($attrs.onInfinite || '');
  }

  function finishInfiniteScroll() {
    ionic.requestAnimationFrame(function() {
      $element[0].classList.remove('active');
    });
    $timeout(function() {
      if (self.jsScrolling) self.scrollView.resize();
      // only check bounds again immediately if the page isn't cached (scroll el has height)
      if (self.scrollView.__container && self.scrollView.__container.offsetHeight > 0) {
        self.checkBounds();
      }
    }, 30, false);
    self.isLoading = false;
  }

  // check if we've scrolled far enough to trigger an infinite scroll
  function checkInfiniteBounds() {
    if (self.isLoading) return;
    var maxScroll = {};

    if (self.jsScrolling) {
      maxScroll = self.getJSMaxScroll();
      var scrollValues = self.scrollView.getValues();
      if ((maxScroll.left !== -1 && scrollValues.left >= maxScroll.left) ||
        (maxScroll.top !== -1 && scrollValues.top >= maxScroll.top)) {
        onInfinite();
      }
    } else {
      maxScroll = self.getNativeMaxScroll();
      if ((
        maxScroll.left !== -1 &&
        self.scrollEl.scrollLeft >= maxScroll.left - self.scrollEl.clientWidth
        ) || (
        maxScroll.top !== -1 &&
        self.scrollEl.scrollTop >= maxScroll.top - self.scrollEl.clientHeight
        )) {
        onInfinite();
      }
    }
  }

  // determine the threshold at which we should fire an infinite scroll
  // note: this gets processed every scroll event, can it be cached?
  self.getJSMaxScroll = function() {
    var maxValues = self.scrollView.getScrollMax();
    return {
      left: self.scrollView.options.scrollingX ?
        calculateMaxValue(maxValues.left) :
        -1,
      top: self.scrollView.options.scrollingY ?
        calculateMaxValue(maxValues.top) :
        -1
    };
  };

  self.getNativeMaxScroll = function() {
    var maxValues = {
      left: self.scrollEl.scrollWidth,
      top: self.scrollEl.scrollHeight
    };
    var computedStyle = window.getComputedStyle(self.scrollEl) || {};
    return {
      left: computedStyle.overflowX === 'scroll' ||
      computedStyle.overflowX === 'auto' ||
      self.scrollEl.style['overflow-x'] === 'scroll' ?
        calculateMaxValue(maxValues.left) : -1,
      top: computedStyle.overflowY === 'scroll' ||
      computedStyle.overflowY === 'auto' ||
      self.scrollEl.style['overflow-y'] === 'scroll' ?
        calculateMaxValue(maxValues.top) : -1
    };
  };

  // determine pixel refresh distance based on % or value
  function calculateMaxValue(maximum) {
    var distance = ($attrs.distance || '2.5%').trim();
    var isPercent = distance.indexOf('%') !== -1;
    return isPercent ?
    maximum * (1 - parseFloat(distance) / 100) :
    maximum - parseFloat(distance);
  }

  //for testing
  self.__finishInfiniteScroll = finishInfiniteScroll;

}]);
