/**
 * @private
 */
IonicModule

.controller('$ionicScroll', [
  '$scope',
  'scrollViewOptions',
  '$timeout',
  '$window',
  '$location',
  '$document',
  '$ionicScrollDelegate',
  '$ionicHistory',
function($scope, scrollViewOptions, $timeout, $window, $location, $document, $ionicScrollDelegate, $ionicHistory) {

  var self = this;
  // for testing
  self.__timeout = $timeout;

  self._scrollViewOptions = scrollViewOptions; //for testing

  var element = self.element = scrollViewOptions.el;
  var $element = self.$element = jqLite(element);
  var scrollView = self.scrollView = new ionic.views.Scroll(scrollViewOptions);

  //Attach self to element as a controller so other directives can require this controller
  //through `require: '$ionicScroll'
  //Also attach to parent so that sibling elements can require this
  ($element.parent().length ? $element.parent() : $element)
    .data('$$ionicScrollController', self);

  var deregisterInstance = $ionicScrollDelegate._registerInstance(
    self, scrollViewOptions.delegateHandle, function() {
      return $ionicHistory.isActiveScope($scope);
    }
  );

  if (!angular.isDefined(scrollViewOptions.bouncing)) {
    ionic.Platform.ready(function() {
      if (scrollView.options) {
        scrollView.options.bouncing = true;
        if (ionic.Platform.isAndroid()) {
          // No bouncing by default on Android
          scrollView.options.bouncing = false;
          // Faster scroll decel
          scrollView.options.deceleration = 0.95;
        }
      }
    });
  }

  var resize = angular.bind(scrollView, scrollView.resize);
  ionic.on('resize', resize, $window);


  var scrollFunc = function(e) {
    var detail = (e.originalEvent || e).detail || {};
    $scope.$onScroll && $scope.$onScroll({
      event: e,
      scrollTop: detail.scrollTop || 0,
      scrollLeft: detail.scrollLeft || 0
    });
  };

  $element.on('scroll', scrollFunc);

  $scope.$on('$destroy', function() {
    deregisterInstance();
    scrollView.__cleanup();
    ionic.off('resize', resize, $window);
    $window.removeEventListener('resize', resize);
    scrollViewOptions = null;
    self._scrollViewOptions.el = null;
    self._scrollViewOptions = null;
    $element.off('scroll', scrollFunc);
    $element = null;
    self.$element = null;
    element = null;
    self.element = null;
    self.scrollView = null;
    scrollView = null;
  });

  $timeout(function() {
    scrollView && scrollView.run && scrollView.run();
  });

  self.getScrollView = function() {
    return self.scrollView;
  };

  self.getScrollPosition = function() {
    return self.scrollView.getValues();
  };

  self.resize = function() {
    return $timeout(resize).then(function() {
      $element && $element.triggerHandler('scroll.resize');
    });
  };

  self.scrollTop = function(shouldAnimate) {
    ionic.DomUtil.blurAll();
    self.resize().then(function() {
      scrollView.scrollTo(0, 0, !!shouldAnimate);
    });
  };

  self.scrollBottom = function(shouldAnimate) {
    ionic.DomUtil.blurAll();
    self.resize().then(function() {
      var max = scrollView.getScrollMax();
      scrollView.scrollTo(max.left, max.top, !!shouldAnimate);
    });
  };

  self.scrollTo = function(left, top, shouldAnimate) {
    ionic.DomUtil.blurAll();
    self.resize().then(function() {
      scrollView.scrollTo(left, top, !!shouldAnimate);
    });
  };

  self.zoomTo = function(zoom, shouldAnimate, originLeft, originTop) {
    ionic.DomUtil.blurAll();
    self.resize().then(function() {
      scrollView.zoomTo(zoom, !!shouldAnimate, originLeft, originTop);
    });
  };

  self.zoomBy = function(zoom, shouldAnimate, originLeft, originTop) {
    ionic.DomUtil.blurAll();
    self.resize().then(function() {
      scrollView.zoomBy(zoom, !!shouldAnimate, originLeft, originTop);
    });
  };

  self.scrollBy = function(left, top, shouldAnimate) {
    ionic.DomUtil.blurAll();
    self.resize().then(function() {
      scrollView.scrollBy(left, top, !!shouldAnimate);
    });
  };

  self.anchorScroll = function(shouldAnimate) {
    ionic.DomUtil.blurAll();
    self.resize().then(function() {
      var hash = $location.hash();
      var elm = hash && $document[0].getElementById(hash);
      if (!(hash && elm)) {
        scrollView.scrollTo(0,0, !!shouldAnimate);
        return;
      }
      var curElm = elm;
      var scrollLeft = 0, scrollTop = 0, levelsClimbed = 0;
      do {
        if (curElm !== null) scrollLeft += curElm.offsetLeft;
        if (curElm !== null) scrollTop += curElm.offsetTop;
        curElm = curElm.offsetParent;
        levelsClimbed++;
      } while (curElm.attributes != self.element.attributes && curElm.offsetParent);
      scrollView.scrollTo(scrollLeft, scrollTop, !!shouldAnimate);
    });
  };


  /**
   * @private
   */
  self._setRefresher = function(refresherScope, refresherElement) {
    var refresher = self.refresher = refresherElement;
    var refresherHeight = self.refresher.clientHeight || 60;
    scrollView.activatePullToRefresh(refresherHeight, function() {
      // activateCallback
      refresher.classList.add('active');
      refresherScope.$onPulling();
    }, function() {
        refresher.classList.remove('active');
        refresher.classList.remove('refreshing');
        refresher.classList.remove('refreshing-tail');
    }, function() {
      // startCallback
      refresher.classList.add('refreshing');
      refresherScope.$onRefresh();
    }, function() {
      // showCallback
      refresher.classList.remove('invisible');
    }, function() {
      // hideCallback
      refresher.classList.add('invisible');
    }, function() {
      // tailCallback
      refresher.classList.add('refreshing-tail');
    });
  };
}]);
