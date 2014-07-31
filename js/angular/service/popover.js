/**
 * @ngdoc service
 * @name $ionicPopover
 * @module ionic
 * @description
 *
 * The Popover is a view that floats above an app’s content. Popovers provide an
 * easy way to present or gather information from the user and are
 * commonly used in the following situations:
 *
 * - Show more info about the current view
 * - Select a commonly used tool or configuration
 * - Present a list of actions to perform inside one of your views
 *
 * Put the content of the popover inside of an `<ion-popover-view>` element.
 *
 * Note: a popover will broadcast 'popover.shown', 'popover.hidden', and 'popover.removed' events from its originating
 * scope, passing in itself as an event argument. Both the popover.removed and popover.hidden events are
 * called when the popover is removed.
 *
 * @usage
 * ```html
 * <script id="my-popover.html" type="text/ng-template">
 *   <ion-popover-view>
 *     <ion-header-bar>
 *       <h1 class="title">My Popover Title</h1>
 *     </ion-header-bar>
 *     <ion-content>
 *       Hello!
 *     </ion-content>
 *   </ion-popover-view>
 * </script>
 * ```
 * ```js
 * angular.module('testApp', ['ionic'])
 * .controller('MyController', function($scope, $ionicPopover) {
 *   $ionicPopover.fromTemplateUrl('my-popover.html', {
 *     scope: $scope,
 *   }).then(function(popover) {
 *     $scope.popover = popover;
 *   });
 *   $scope.openPopover = function() {
 *     $scope.popover.show();
 *   };
 *   $scope.closePopover = function() {
 *     $scope.popover.hide();
 *   };
 *   //Cleanup the popover when we're done with it!
 *   $scope.$on('$destroy', function() {
 *     $scope.popover.remove();
 *   });
 *   // Execute action on hide popover
 *   $scope.$on('popover.hidden', function() {
 *     // Execute action
 *   });
 *   // Execute action on remove popover
 *   $scope.$on('popover.removed', function() {
 *     // Execute action
 *   });
 * });
 * ```
 */
IonicModule
.factory('$ionicPopover', ['$ionicModal', '$ionicPosition', '$document',
function($ionicModal, $ionicPosition, $document) {

  var POPOVER_BODY_PADDING = 6;

  var POPOVER_OPTIONS = {
    viewType: 'popover',
    hideDelay: 1,
    animation: 'none',
    positionView: positionView
  };

  function positionView(target, popoverEle) {
    var targetEle = angular.element(target.target || target);
    var buttonOffset = $ionicPosition.offset( targetEle );
    var popoverWidth = popoverEle.prop('offsetWidth');
    var bodyWidth = $document[0].body.clientWidth;
    var bodyHeight = $document[0].body.clientHeight;

    var popoverCSS = {
      top: buttonOffset.top + buttonOffset.height,
      left: buttonOffset.left + buttonOffset.width / 2 - popoverWidth / 2
    };

    if(popoverCSS.left < POPOVER_BODY_PADDING) {
      popoverCSS.left = POPOVER_BODY_PADDING;
    } else if(popoverCSS.left + popoverWidth + POPOVER_BODY_PADDING > bodyWidth) {
      popoverCSS.left = bodyWidth - popoverWidth - POPOVER_BODY_PADDING;
    }

    var arrowEle = popoverEle[0].querySelector('.popover-arrow');
    angular.element(arrowEle).css({
      left: (buttonOffset.left - popoverCSS.left) + (buttonOffset.width / 2) - (arrowEle.offsetWidth / 2) + 'px'
    });

    popoverEle.css({
      top: popoverCSS.top + 'px',
      left: popoverCSS.left + 'px',
      marginLeft: '0',
      opacity: '1'
    });

  }

  return {
    /**
     * @ngdoc method
     * @name $ionicPopover#fromTemplate
     * @param {string} templateString The template string to use as the popovers's
     * content.
     * @param {object} options Options to be passed to the initialize method.
     * @returns {object} An instance of an {@link ionic.controller:ionicModal}
     * controller ($ionicPopover is built on top of $ionicModal).
     */
    fromTemplate: function(templateString, options) {
      return $ionicModal.fromTemplate(templateString, ionic.Utils.extend(options || {}, POPOVER_OPTIONS) );
    },
    /**
     * @ngdoc method
     * @name $ionicPopover#fromTemplateUrl
     * @param {string} templateUrl The url to load the template from.
     * @param {object} options Options to be passed to the initialize method.
     * @returns {promise} A promise that will be resolved with an instance of
     * an {@link ionic.controller:ionicModal} controller ($ionicPopover is built on top of $ionicModal).
     */
    fromTemplateUrl: function(url, options, _) {
      return $ionicModal.fromTemplateUrl(url, options, ionic.Utils.extend(options || {}, POPOVER_OPTIONS) );
    }
  };

}]);
