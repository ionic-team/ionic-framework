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
        var innerElement = jqLite(isAnchor ? '<a></a>' : '<div></div>');
        innerElement.addClass('item-content');

        if (isDefined($attrs.href) || isDefined($attrs.ngHref)) {
          innerElement.attr('ng-href', '{{$href()}}');
          if (isDefined($attrs.target)) {
            innerElement.attr('target', '{{$target()}}');
          }
        }

        innerElement.append($element.contents());

        $element.addClass('item item-complex')
                .append(innerElement);
      } else {
        $element.addClass('item');
      }

      return function link($scope, $element, $attrs) {
        $scope.$href = function() {
          return $attrs.href || $attrs.ngHref;
        };
        $scope.$target = function() {
          return $attrs.target;
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
