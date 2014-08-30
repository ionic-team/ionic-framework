var ITEM_TPL_OPTION_BUTTONS =
  '<div class="invisible">' +
  '</div>';
var ITEM_OPTIONS_LEFT_CLASS = 'item-options-left';
var ITEM_OPTIONS_RIGHT_CLASS = 'item-options-right';
/**
* @ngdoc directive
* @name ionOptionButton
* @parent ionic.directive:ionItem
* @module ionic
* @restrict E
* Creates an option button inside a list item, that is visible when the item is swiped
* to the side by the user.  Swiped open option buttons can be hidden with
* {@link ionic.service:$ionicListDelegate#closeOptionButtons $ionicListDelegate#closeOptionButtons}.
*
* By default the option buttons will appear on the right-hand side, but can be shown on
* the left side by setting the "side" attribute to "left".
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
*     I love kittens!
*     <ion-option-button class="button-royal" side="left">Meow</ion-option-button>
*     <ion-option-button class="button-positive">Share</ion-option-button>
*     <ion-option-button class="button-assertive">Edit</ion-option-button>
*   </ion-item>
* </ion-list>
* ```
*/
IonicModule
.directive('ionOptionButton', ['$compile', function($compile) {
  function stopPropagation(e) {
    e.stopPropagation();
  }
  return {
    restrict: 'E',
    require: '^ionItem',
    priority: Number.MAX_VALUE,
    compile: function($element, $attr) {
      var side = $attr['side'] == 'left' ? 'left' : 'right';
      $attr.$set('class', ($attr['class'] || '') + ' button', true);
      return function($scope, $element, $attr, itemCtrl) {
        if (side == 'left') {
          if (!itemCtrl.optionsContainerLeft) {
            itemCtrl.optionsContainerLeft = jqLite(ITEM_TPL_OPTION_BUTTONS);
            itemCtrl.optionsContainerLeft.addClass(ITEM_OPTIONS_LEFT_CLASS);
            itemCtrl.$element.append(itemCtrl.optionsContainerLeft);
          }
          itemCtrl.optionsContainerLeft.append($element);
        } else {
          if (!itemCtrl.optionsContainerRight) {
            itemCtrl.optionsContainerRight = jqLite(ITEM_TPL_OPTION_BUTTONS);
            itemCtrl.optionsContainerRight.addClass(ITEM_OPTIONS_RIGHT_CLASS);
            itemCtrl.$element.append(itemCtrl.optionsContainerRight);
          }
          itemCtrl.optionsContainerRight.append($element);
        }

        //Don't bubble click up to main .item
        $element.on('click', stopPropagation);
      };
    }
  };
}]);
