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

  this.isDraggableTarget = function(e) {
    return $scope.dragContent &&
           (!e.gesture.srcEvent.defaultPrevented &&
            !e.target.tagName.match(/input|textarea|select|object|embed/i) &&
            !e.target.isContentEditable &&
            !(e.target.dataset ? e.target.dataset.preventScroll : e.target.getAttribute('data-prevent-default') == 'true'));
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
