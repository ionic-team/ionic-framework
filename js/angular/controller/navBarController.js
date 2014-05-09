IonicModule
.controller('$ionicNavBar', [
  '$scope',
  '$element',
  '$attrs',
  '$ionicViewService',
  '$animate',
  '$compile',
  '$ionicNavBarDelegate',
function($scope, $element, $attrs, $ionicViewService, $animate, $compile, $ionicNavBarDelegate) {
  //Let the parent know about our controller too so that children of
  //sibling content elements can know about us
  $element.parent().data('$ionNavBarController', this);

  var deregisterInstance = $ionicNavBarDelegate._registerInstance(this, $attrs.delegateHandle);

  $scope.$on('$destroy', deregisterInstance);

  var self = this;

  this.leftButtonsElement = jqLite(
    $element[0].querySelector('.buttons.left-buttons')
  );
  this.rightButtonsElement = jqLite(
    $element[0].querySelector('.buttons.right-buttons')
  );

  this.back = function(e) {
    var backView = $ionicViewService.getBackView();
    backView && backView.go();
    e && (e.alreadyHandled = true);
    return false;
  };

  this.align = function(direction) {
    this._headerBarView.align(direction);
  };

  this.showBackButton = function(show) {
    if (arguments.length) {
      $scope.backButtonShown = !!show;
    }
    return !!($scope.hasBackButton && $scope.backButtonShown);
  };

  this.showBar = function(show) {
    if (arguments.length) {
      $scope.isInvisible = !show;
      $scope.$parent.$hasHeader = !!show;
    }
    return !$scope.isInvisible;
  };

  this.setTitle = function(title) {
    if ($scope.title === title) {
      return;
    }
    $scope.oldTitle = $scope.title;
    $scope.title = title || '';
  };

  this.changeTitle = function(title, direction) {
    if ($scope.title === title) {
      return false;
    }
    this.setTitle(title);
    $scope.isReverse = direction == 'back';
    $scope.shouldAnimate = !!direction;

    if (!$scope.shouldAnimate) {
      //We're done!
      this._headerBarView.align();
    } else {
      this._animateTitles();
    }
    return true;
  };

  this.getTitle = function() {
    return $scope.title || '';
  };

  this.getPreviousTitle = function() {
    return $scope.oldTitle || '';
  };

  /**
   * Exposed for testing
   */
  this._animateTitles = function() {
    var oldTitleEl, newTitleEl, currentTitles;

    //If we have any title right now
    //(or more than one, they could be transitioning on switch),
    //replace the first one with an oldTitle element
    currentTitles = $element[0].querySelectorAll('.title');
    if (currentTitles.length) {
      oldTitleEl = $compile('<h1 class="title" ng-bind-html="oldTitle"></h1>')($scope);
      jqLite(currentTitles[0]).replaceWith(oldTitleEl);
    }
    //Compile new title
    newTitleEl = $compile('<h1 class="title invisible" ng-bind-html="title"></h1>')($scope);

    //Animate in on next frame
    ionic.requestAnimationFrame(function() {

      oldTitleEl && $animate.leave(jqLite(oldTitleEl));

      var insert = oldTitleEl && jqLite(oldTitleEl) || null;
      $animate.enter(newTitleEl, $element, insert, function() {
        self._headerBarView.align();
      });

      //Cleanup any old titles leftover (besides the one we already did replaceWith on)
      forEach(currentTitles, function(el) {
        if (el && el.parentNode) {
          //Use .remove() to cleanup things like .data()
          jqLite(el).remove();
        }
      });

      //$apply so bindings fire
      $scope.$digest();

      //Stop flicker of new title on ios7
      ionic.requestAnimationFrame(function() {
        newTitleEl[0].classList.remove('invisible');
      });
    });
  };
}]);

