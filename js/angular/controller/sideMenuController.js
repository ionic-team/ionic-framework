IonicModule
.controller('$ionicSideMenus', [
  '$scope',
  '$attrs',
  '$ionicSideMenuDelegate',
function($scope, $attrs, $ionicSideMenuDelegate) {
  angular.extend(this, ionic.controllers.SideMenuController.prototype);

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

  var deregisterInstance = $ionicSideMenuDelegate._registerInstance(
    this, $attrs.delegateHandle
  );
  $scope.$on('$destroy', deregisterInstance);
}]);
