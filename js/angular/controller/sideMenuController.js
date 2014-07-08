IonicModule
.controller('$ionicSideMenus', [
  '$scope',
  '$attrs',
  '$ionicSideMenuDelegate',
  '$ionicPlatform',
function($scope, $attrs, $ionicSideMenuDelegate, $ionicPlatform) {
  var self = this;
  extend(this, ionic.controllers.SideMenuController.prototype);

  this.$scope = $scope;

  ionic.controllers.SideMenuController.call(this, {
    left: { width: 275 },
    right: { width: 275 }
  });

  this.canDragContent = function(canDrag) {
    if (arguments.length) {
      $scope.dragContent = !!canDrag;
    }
    return $scope.dragContent;
  };

  this.edgeThreshold = 25;
  this.edgeThresholdEnabled = false;
  this.edgeDragThreshold = function(value) {
    if (arguments.length) {
      if (angular.isNumber(value) && value > 0) {
        this.edgeThreshold = value;
        this.edgeThresholdEnabled = true;
      } else {
        this.edgeThresholdEnabled = !!value;
      }
    }
    return this.edgeThresholdEnabled;
  };

  this.isDraggableTarget = function(e) {
    //Only restrict edge when sidemenu is closed and restriction is enabled
    var shouldOnlyAllowEdgeDrag = self.edgeThresholdEnabled && !self.isOpen();
    var startX = e.gesture.startEvent && e.gesture.startEvent.center &&
      e.gesture.startEvent.center.pageX;

    var dragIsWithinBounds = !shouldOnlyAllowEdgeDrag ||
      startX <= self.edgeThreshold ||
      startX >= self.content.offsetWidth - self.edgeThreshold;

    return ($scope.dragContent || self.isOpen()) &&
           dragIsWithinBounds &&
           !e.gesture.srcEvent.defaultPrevented &&
           !e.target.tagName.match(/input|textarea|select|object|embed/i) &&
           !e.target.isContentEditable &&
           !(e.target.dataset ? e.target.dataset.preventScroll : e.target.getAttribute('data-prevent-default') == 'true');
  };

  $scope.sideMenuContentTranslateX = 0;


  var deregisterBackButtonAction = angular.noop;
  var closeSideMenu = angular.bind(this, this.close);
  $scope.$watch(function() {
    return self.getOpenAmount() !== 0;
  }, function(isOpen) {
    deregisterBackButtonAction();
    if (isOpen) {
      deregisterBackButtonAction = $ionicPlatform.registerBackButtonAction(
        closeSideMenu,
        PLATFORM_BACK_BUTTON_PRIORITY_SIDE_MENU
      );
    }
  });

  var deregisterInstance = $ionicSideMenuDelegate._registerInstance(
    this, $attrs.delegateHandle
  );
  $scope.$on('$destroy', function() {
    deregisterInstance();
    deregisterBackButtonAction();
  });
}]);
