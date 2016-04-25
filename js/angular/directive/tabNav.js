IonicModule
.directive('ionTabNav', [function() {
  return {
    restrict: 'E',
    replace: true,
    require: ['^ionTabs', '^ionTab'],
    template:
    '<a ng-class="{\'has-badge\':badge, \'tab-hidden\':isHidden(), \'tab-item-active\': isTabActive()}" ' +
      ' ng-disabled="disabled()" class="tab-item">' +
      '<span class="badge {{badgeStyle}}" ng-if="badge">{{badge}}</span>' +
      '<i class="icon {{getIcon()}}" ng-if="getIcon()"></i>' +
      '<span class="tab-title" ng-bind-html="title"></span>' +
    '</a>',
    scope: {
      title: '@',
      icon: '@',
      iconOn: '@',
      iconOff: '@',
      badge: '=',
      hidden: '@',
      disabled: '&',
      badgeStyle: '@',
      'class': '@'
    },
    link: function($scope, $element, $attrs, ctrls) {
      var tabsCtrl = ctrls[0],
        tabCtrl = ctrls[1];

      //Remove title attribute so browser-tooltip does not apear
      $element[0].removeAttribute('title');

      $scope.selectTab = function(e) {
        e.preventDefault();
        tabsCtrl.select(tabCtrl.$scope, true);
      };
      if (!$attrs.ngClick) {
        $element.on('click', function(event) {
          $scope.$apply(function() {
            $scope.selectTab(event);
          });
        });
      }

      $scope.isHidden = function() {
        if ($attrs.hidden === 'true' || $attrs.hidden === true) return true;
        return false;
      };

      $scope.getIconOn = function() {
        return $scope.iconOn || $scope.icon;
      };
      $scope.getIconOff = function() {
        return $scope.iconOff || $scope.icon;
      };

      $scope.isTabActive = function() {
        return tabsCtrl.selectedTab() === tabCtrl.$scope;
      };

      $scope.getIcon = function() {
        if ( tabsCtrl.selectedTab() === tabCtrl.$scope ) {
          // active
          return $scope.iconOn || $scope.icon;
        }
        else {
          // inactive
          return $scope.iconOff || $scope.icon;
        }
      };
    }
  };
}]);
