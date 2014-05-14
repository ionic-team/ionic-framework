/**
 * @private
 */
IonicModule

.factory('$$scrollValueCache', function() {
  return {};
})

.controller('$ionicScroll', [
  '$scope',
  'scrollViewOptions',
  '$timeout',
  '$window',
  '$$scrollValueCache',
  '$location',
  '$rootScope',
  '$document',
  '$ionicScrollDelegate',
function($scope, scrollViewOptions, $timeout, $window, $$scrollValueCache, $location, $rootScope, $document, $ionicScrollDelegate) {

  var self = this;

  this._scrollViewOptions = scrollViewOptions; //for testing

  var element = this.element = scrollViewOptions.el;
  var $element = this.$element = jqLite(element);
  var scrollView = this.scrollView = new ionic.views.Scroll(scrollViewOptions);

  //Attach self to element as a controller so other directives can require this controller
  //through `require: '$ionicScroll'
  //Also attach to parent so that sibling elements can require this
  ($element.parent().length ? $element.parent() : $element)
    .data('$$ionicScrollController', this);

  var deregisterInstance = $ionicScrollDelegate._registerInstance(
    this, scrollViewOptions.delegateHandle
  );

  if (!angular.isDefined(scrollViewOptions.bouncing)) {
    ionic.Platform.ready(function() {
      scrollView.options.bouncing = !ionic.Platform.isAndroid();
    });
  }

  var resize = angular.bind(scrollView, scrollView.resize);
  ionic.on('resize', resize, $window);

  // set by rootScope listener if needed
  var backListenDone = angular.noop;

  $scope.$on('$destroy', function() {
    deregisterInstance();
    ionic.off('resize', resize, $window);
    $window.removeEventListener('resize', resize);
    backListenDone();
    if (self._rememberScrollId) {
      $$scrollValueCache[self._rememberScrollId] = scrollView.getValues();
    }
  });

  $element.on('scroll', function(e) {
    var detail = (e.originalEvent || e).detail || {};
    $scope.$onScroll && $scope.$onScroll({
      event: e,
      scrollTop: detail.scrollTop || 0,
      scrollLeft: detail.scrollLeft || 0
    });
  });

  $scope.$on('$viewContentLoaded', function(e, historyData) {
    //only the top-most scroll area under a view should remember that view's
    //scroll position
    if (e.defaultPrevented) { return; }
    e.preventDefault();

    var viewId = historyData && historyData.viewId;
    if (viewId) {
      $timeout(function() {
        self.rememberScrollPosition(viewId);
        self.scrollToRememberedPosition();

        backListenDone = $rootScope.$on('$viewHistory.viewBack', function(e, fromViewId, toViewId) {
          //When going back from this view, forget its saved scroll position
          if (viewId === fromViewId) {
            self.forgetScrollPosition();
          }
        });
      }, 1, false);
    }
  });

  $timeout(function() {
    scrollView.run();
  });

  this._rememberScrollId = null;

  this.getScrollView = function() {
    return this.scrollView;
  };

  this.getScrollPosition = function() {
    return this.scrollView.getValues();
  };

  this.resize = function() {
    return $timeout(resize);
  };

  this.scrollTop = function(shouldAnimate) {
    this.resize().then(function() {
      scrollView.scrollTo(0, 0, !!shouldAnimate);
    });
  };

  this.scrollBottom = function(shouldAnimate) {
    this.resize().then(function() {
      var max = scrollView.getScrollMax();
      scrollView.scrollTo(max.left, max.top, !!shouldAnimate);
    });
  };

  this.scrollTo = function(left, top, shouldAnimate) {
    this.resize().then(function() {
      scrollView.scrollTo(left, top, !!shouldAnimate);
    });
  };

  this.scrollBy = function(left, top, shouldAnimate) {
    this.resize().then(function() {
      scrollView.scrollBy(left, top, !!shouldAnimate);
    });
  };

  this.anchorScroll = function(shouldAnimate) {
    this.resize().then(function() {
      var hash = $location.hash();
      var elm = hash && $document[0].getElementById(hash);
      if (hash && elm) {
        var scroll = ionic.DomUtil.getPositionInParent(elm, self.$element);
        scrollView.scrollTo(scroll.left, scroll.top, !!shouldAnimate);
      } else {
        scrollView.scrollTo(0,0, !!shouldAnimate);
      }
    });
  };

  this.rememberScrollPosition = function(id) {
    if (!id) {
      throw new Error("Must supply an id to remember the scroll by!");
    }
    this._rememberScrollId = id;
  };
  this.forgetScrollPosition = function() {
    delete $$scrollValueCache[this._rememberScrollId];
    this._rememberScrollId = null;
  };
  this.scrollToRememberedPosition = function(shouldAnimate) {
    var values = $$scrollValueCache[this._rememberScrollId];
    if (values) {
      this.resize().then(function() {
        scrollView.scrollTo(+values.left, +values.top, shouldAnimate);
      });
    }
  };

  /**
   * @private
   */
  this._setRefresher = function(refresherScope, refresherElement) {
    var refresher = this.refresher = refresherElement;
    var refresherHeight = self.refresher.clientHeight || 0;
    scrollView.activatePullToRefresh(refresherHeight, function() {
      refresher.classList.add('active');
      refresherScope.$onPulling();
    }, function() {
      refresher.classList.remove('refreshing');
      refresher.classList.remove('active');
    }, function() {
      refresher.classList.add('refreshing');
      refresherScope.$onRefresh();
    });
  };
}]);

