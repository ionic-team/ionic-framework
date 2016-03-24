var ITEM_TPL_OPTION_SWIPE =
  '<div class="item-swipe invisible assertive-bg">' +
  '</div>';
/**
* @ngdoc directive
* @name ionSwipeButton
* @parent ionic.directive:ionItem
* @module ionic
* @restrict E
* @description
* Creates an swipable event for a list item, that is visible when the item is swiped
* to the left or to the right by the user.  
*
* See {@link ionic.directive:ionList} for a complete example & explanation.
*
* @usage
*
* ```html
* <ion-list>
*   <ion-item>
*     I love kitten {{kitten.name}}!
*     <ion-swipe-button class="bg-assertive" on-swiped="unLove(kittenItem)></ion-swipe-button>
*   </ion-item>
* </ion-list>
* ```
*/
IonicModule.directive('ionSwipeButton', ['$parse', function ($parse) {
    function stopPropagation(e) {
        e.stopPropagation();
    }
    return {
        restrict: 'E',
        require: '^ionItem',
        priority: Number.MAX_VALUE,
        compile: function ($element, $attr) {
            return function ($scope, $element, $attr, itemCtrl) {
                var onSwipedFn = $parse($attr.onSwiped);

                $scope.$onSwiped = function () {
                    onSwipedFn($scope, {});
                };

                if (!itemCtrl.swipeContainer) {
                    itemCtrl.swipeContainer = jqLite(ITEM_TPL_OPTION_SWIPE);
                    itemCtrl.$element.append(itemCtrl.swipeContainer);
                }
                itemCtrl.swipeContainer.append($element);

                //Don't bubble click up to main .item
                $element.on('click', stopPropagation);
            };
        }
    };
}]);