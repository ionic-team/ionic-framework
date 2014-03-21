(function(ionic) {
'use strict';

angular.module('ionic.ui.header', ['ngAnimate', 'ngSanitize'])

.directive('ionHeaderBar', ['$document', function($document) {
  return {
    restrict: 'E',
    link: function($scope, $element, $attr, scrollCtrl) {
      ionic.requestAnimationFrame(function() {
        var scrollCtrl = $element.controller('$ionicScroll');
        if (!scrollCtrl) {
          return;
        }

        ionic.on('tap', onTap, $element[0]);
        $scope.$on('$destroy', function() {
          ionic.off('tap', onTap, $element[0]);
        });

        function onTap(e) {
          if (ionic.DomUtil.getParentOrSelfWithClass(e.target, 'button', 4)) {
            return;
          }
          var touch = e.gesture && e.gesture.touches[0] || e.detail.touches[0];
          var bounds = $element[0].getBoundingClientRect();
          if(ionic.DomUtil.rectContains(
            touch.pageX, touch.pageY,
            bounds.left, bounds.top - 20,
            bounds.left + bounds.width, bounds.top + bounds.height)
          ) {
            scrollCtrl.scrollTop(true);
          }
        }
      });
    }
  };
}])

/**
 * @ngdoc directive
 * @name ionHeaderBar
 * @module ionic
 * @restrict E
 * @controller ionicBar as $scope.$ionicHeaderBarController
 *
 * @description
 * Adds a fixed header bar above some content.
 *
 * Is able to have left or right buttons, and additionally its title can be
 * aligned through the {@link ionic.controller:ionicBar ionicBar controller}.
 *
 * @param {string=} controller-bind The scope variable to bind this header bar's
 * {@link ionic.controller:ionicBar ionicBar controller} to.
 * Default: $scope.$ionicHeaderBarController.
 * @param {string=} align-title Where to align the title at the start.
 * Avaialble: 'left', 'right', or 'center'.  Defaults to 'center'.
 *
 * @usage
 * ```html
 * <ion-header-bar align-title="left" class="bar-positive">
 *   <div class="buttons">
 *     <button class="button" ng-click="doSomething()">Left Button</button>
 *   </div>
 *   <h1 class="title">Title!</h1>
 *   <div class="buttons">
 *     <button class="button">Right Button</button>
 *   </div>
 * </ion-header-bar>
 * <ion-content>
 *   Some content!
 * </ion-content>
 * ```
 */
.directive('ionHeaderBar', barDirective(true))

/**
 * @ngdoc directive
 * @name ionFooterBar
 * @module ionic
 * @restrict E
 * @controller ionicBar as $scope.$ionicFooterBarController
 *
 * @description
 * Adds a fixed footer bar below some content.
 *
 * Is able to have left or right buttons, and additionally its title can be
 * aligned through the {@link ionic.controller:ionicBar ionicBar controller}.
 *
 * @param {string=} controller-bind The scope variable to bind this footer bar's
 * {@link ionic.controller:ionicBar ionicBar controller} to.
 * Default: $scope.$ionicFooterBarController.
 * @param {string=} align-title Where to align the title at the start.
 * Avaialble: 'left', 'right', or 'center'.  Defaults to 'center'.
 *
 * @usage
 * ```html
 * <ion-content>
 *   Some content!
 * </ion-content>
 * <ion-footer-bar align-title="left" class="bar-assertive">
 *   <div class="buttons">
 *     <button class="button">Left Button</button>
 *   </div>
 *   <h1 class="title">Title!</h1>
 *   <div class="buttons" ng-click="doSomething()">
 *     <button class="button">Right Button</button>
 *   </div>
 * </ion-footer-bar>
 * ```
 */
.directive('ionFooterBar', barDirective(false));

function barDirective(isHeader) {
  return ['$parse', function($parse) {
    return {
      restrict: 'E',
      compile: function($element, $attr) {
        $element.addClass(isHeader ? 'bar bar-header' : 'bar bar-footer');
        return { pre: prelink };
        function prelink($scope, $element, $attr) {
          var hb = new ionic.views.HeaderBar({
            el: $element[0],
            alignTitle: $attr.alignTitle || 'center'
          });

          $parse($attr.controllerBind ||
            (isHeader ? '$ionicHeaderBarController' : '$ionicFooterBarController')
          ).assign($scope, hb);

          var el = $element[0];
          //just incase header is on rootscope
          var parentScope = $scope.$parent || $scope;

          if (isHeader) {
            $scope.$watch(function() { return el.className; }, function(value) {
              var isSubheader = value.indexOf('bar-subheader') !== -1;
              parentScope.$hasHeader = !isSubheader;
              parentScope.$hasSubheader = isSubheader;
            });
            $scope.$on('$destroy', function() {
              parentScope.$hasHeader = parentScope.$hasSubheader = null;
            });
          } else {
            $scope.$watch(function() { return el.className; }, function(value) {
              var isSubfooter = value.indexOf('bar-subfooter') !== -1;
              parentScope.$hasFooter = !isSubfooter;
              parentScope.$hasSubfooter = isSubfooter;
            });
            $scope.$on('$destroy', function() {
              parentScope.$hasFooter = parentScope.$hasSubfooter = null;
            });
            $scope.$watch('$hasTabs', function(val) {
              $element.toggleClass('has-tabs', !!val);
            });
          }
        }
      }
    };
  }];
}

})(ionic);
