var ITEM_TPL_CONTENT_ANCHOR =
  '<a class="item-content" ng-href="{{$href()}}" target="{{$target()}}"></a>';
var ITEM_TPL_CONTENT =
  '<div class="item-content"></div>';
/**
* @ngdoc directive
* @name ionItem
* @parent ionic.directive:ionList
* @module ionic
* @restrict E
* Creates a list-item that can easily be swiped,
* deleted, reordered, edited, and more.
*
* See {@link ionic.directive:ionList} for a complete example & explanation.
*
* Can be assigned any item class name. See the
* [list CSS documentation](/docs/components/#list).
*
* @usage
*
* ```html
* <ion-list>
*   <ion-item>Hello!</ion-item>
*   <ion-item href="#/detail">
*     Link to detail page
*   </ion-item>
* </ion-list>
* ```
*/
IonicModule
.directive('ionItem', ['$$rAF', function($$rAF) {
      var nextId = 0;
  return {
    restrict: 'E',
    controller: ['$scope', '$element', function($scope, $element) {
      this.$scope = $scope;
      this.$element = $element;
    }],
    scope: true,
    compile: function($element, $attrs) {
      var isAnchor = isDefined($attrs.href) ||
                     isDefined($attrs.ngHref) ||
                     isDefined($attrs.uiSref);
      var isComplexItem = isAnchor ||
        //Lame way of testing, but we have to know at compile what to do with the element
        /ion-(delete|option|reorder)-button/i.test($element.html());

      if (isComplexItem) {
        var innerElement = jqLite(isAnchor ? ITEM_TPL_CONTENT_ANCHOR : ITEM_TPL_CONTENT);
        innerElement.append($element.contents());

        $element.append(innerElement);
        $element.addClass('item item-complex');
      } else {
        $element.addClass('item');
      }

      return function link($scope, $element, $attrs) {
        var listCtrl;
        $scope.$href = function() {
          return $attrs.href || $attrs.ngHref;
        };
        $scope.$target = function() {
          return $attrs.target || '_self';
        };

        var content = $element[0].querySelector('.item-content');
        if (content) {
          $scope.$on('$collectionRepeatLeave', function() {
            if (content && content.$$ionicOptionsOpen) {
              content.style[ionic.CSS.TRANSFORM] = '';
              content.style[ionic.CSS.TRANSITION] = 'none';
              $$rAF(function() {
                content.style[ionic.CSS.TRANSITION] = '';
              });
              content.$$ionicOptionsOpen = false;
            }
          });
        }
      };

    }
  };
}]);
