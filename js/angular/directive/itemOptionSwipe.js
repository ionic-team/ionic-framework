var ITEM_TPL_OPTION_SWIPE =
  '<div class="item-options-swipe invisible">' +
  '</div>';
/**
* @ngdoc directive
* @name ionOptionSwipe
* @parent ionic.directive:ionItem
* @module ionic
* @restrict E
* Creates an option to swipe a list item, that is activated when the item is swiped
* to the left or right by the user.
*
* Can be assigned any button class.
*
* See {@link ionic.directive:ionList} for a complete example & explanation.
*
* @usage
*
* ```html
* <ion-list>
*   <ion-item>
*     <ion-option-swipe class="button-assertive" direction="right" on-swipe="done(item)">Done</ion-option-swipe>
*     Meet new kitten!
*     <ion-option-swipe class="button-calm" direction="left" on-swipe="done(item)">Skipped</ion-option-swipe>
*   </ion-item>
* </ion-list>
* ```
*/
IonicModule
.directive('ionOptionSwipe', ['$compile', '$parse', function($compile, $parse) {
  function stopPropagation(e) {
    e.stopPropagation();
  }
  return {
    restrict: 'E',
    require: '^ionItem',
    scope: true,
    priority: Number.MAX_VALUE,
    compile: function($element, $attr) {
      $attr.$set('class', ($attr['class'] || '') + ' button', true);
      return function($scope, $element, $attr, itemCtrl) {
        if ($attr.direction === 'left') {
          if (!itemCtrl.optionsContainerLeft) {
            itemCtrl.optionsContainerLeft = jqLite(ITEM_TPL_OPTION_SWIPE);
            itemCtrl.$element.append(itemCtrl.optionsContainerLeft);
          }
          itemCtrl.optionsContainerLeft.append($element);

          itemCtrl.optionsContainerLeft.addClass('left');
          itemCtrl.$element.addClass('item-left-editable');

        } else {
          if (!itemCtrl.optionsContainerRight) {
            itemCtrl.optionsContainerRight = jqLite(ITEM_TPL_OPTION_SWIPE);
            itemCtrl.$element.append(itemCtrl.optionsContainerRight);
          }
          itemCtrl.optionsContainerRight.append($element);

          itemCtrl.optionsContainerRight.addClass('right');

          itemCtrl.$element.addClass('item-right-editable');

        }

        $scope.$onSwipe = $parse($attr.onItemSwipe);

        //Don't bubble click up to main .item
        $element.on('click', stopPropagation);
      };
    }
  };
}]);
