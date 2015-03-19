/**
* @ngdoc directive
* @name ionList
* @module ionic
* @delegate ionic.service:$ionicListDelegate
* @codepen JsHjf
* @restrict E
* @description
* The List is a widely used interface element in almost any mobile app, and can include
* content ranging from basic text all the way to buttons, toggles, icons, and thumbnails.
*
* Both the list, which contains items, and the list items themselves can be any HTML
* element. The containing element requires the `list` class and each list item requires
* the `item` class.
*
* However, using the ionList and ionItem directives make it easy to support various
* interaction modes such as swipe to edit, drag to reorder, and removing items.
*
* Related: {@link ionic.directive:ionItem}, {@link ionic.directive:ionOptionButton}
* {@link ionic.directive:ionReorderButton}, {@link ionic.directive:ionDeleteButton}, [`list CSS documentation`](/docs/components/#list).
*
* @usage
*
* Basic Usage:
*
* ```html
* <ion-list>
*   <ion-item ng-repeat="item in items">
*     {% raw %}Hello, {{item}}!{% endraw %}
*   </ion-item>
* </ion-list>
* ```
*
* Advanced Usage: Thumbnails, Delete buttons, Reordering, Swiping
*
* ```html
* <ion-list ng-controller="MyCtrl"
*           show-delete="shouldShowDelete"
*           show-reorder="shouldShowReorder"
*           can-swipe="listCanSwipe">
*   <ion-item ng-repeat="item in items"
*             class="item-thumbnail-left">
*
*     {% raw %}<img ng-src="{{item.img}}">
*     <h2>{{item.title}}</h2>
*     <p>{{item.description}}</p>{% endraw %}
*     <ion-option-button class="button-positive"
*                        ng-click="share(item)">
*       Share
*     </ion-option-button>
*     <ion-option-button class="button-info"
*                        ng-click="edit(item)">
*       Edit
*     </ion-option-button>
*     <ion-delete-button class="ion-minus-circled"
*                        ng-click="items.splice($index, 1)">
*     </ion-delete-button>
*     <ion-reorder-button class="ion-navicon"
*                         on-reorder="reorderItem(item, $fromIndex, $toIndex)">
*     </ion-reorder-button>
*
*   </ion-item>
* </ion-list>
* ```
*
*```javascript
* app.controller('MyCtrl', function($scope) {
*  $scope.shouldShowDelete = false;
*  $scope.shouldShowReorder = false;
*  $scope.listCanSwipe = true
* });
*```
*
* @param {string=} delegate-handle The handle used to identify this list with
* {@link ionic.service:$ionicListDelegate}.
* @param type {string=} The type of list to use (list-inset or card)
* @param show-delete {boolean=} Whether the delete buttons for the items in the list are
* currently shown or hidden.
* @param show-reorder {boolean=} Whether the reorder buttons for the items in the list are
* currently shown or hidden.
* @param can-swipe {boolean=} Whether the items in the list are allowed to be swiped to reveal
* option buttons. Default: true.
*/
IonicModule
.directive('ionList', [
  '$timeout',
function($timeout) {
  return {
    restrict: 'E',
    require: ['ionList', '^?$ionicScroll'],
    controller: '$ionicList',
    compile: function($element, $attr) {
      var listEl = jqLite('<div class="list">')
        .append($element.contents())
        .addClass($attr.type);

      $element.append(listEl);

      return function($scope, $element, $attrs, ctrls) {
        var listCtrl = ctrls[0];
        var scrollCtrl = ctrls[1];

        // Wait for child elements to render...
        $timeout(init);

        function init() {
          var listView = listCtrl.listView = new ionic.views.ListView({
            el: $element[0],
            listEl: $element.children()[0],
            scrollEl: scrollCtrl && scrollCtrl.element,
            scrollView: scrollCtrl && scrollCtrl.scrollView,
            onReorder: function(el, oldIndex, newIndex) {
              var itemScope = jqLite(el).scope();
              if (itemScope && itemScope.$onReorder) {
                // Make sure onReorder is called in apply cycle,
                // but also make sure it has no conflicts by doing
                // $evalAsync
                $timeout(function() {
                  itemScope.$onReorder(oldIndex, newIndex);
                });
              }
            },
            canSwipe: function() {
              return listCtrl.canSwipeItems();
            }
          });

          $scope.$on('$destroy', function() {
            if (listView) {
              listView.deregister && listView.deregister();
              listView = null;
            }
          });

          if (isDefined($attr.canSwipe)) {
            $scope.$watch('!!(' + $attr.canSwipe + ')', function(value) {
              listCtrl.canSwipeItems(value);
            });
          }
          if (isDefined($attr.showDelete)) {
            $scope.$watch('!!(' + $attr.showDelete + ')', function(value) {
              listCtrl.showDelete(value);
            });
          }
          if (isDefined($attr.showReorder)) {
            $scope.$watch('!!(' + $attr.showReorder + ')', function(value) {
              listCtrl.showReorder(value);
            });
          }

          $scope.$watch(function() {
            return listCtrl.showDelete();
          }, function(isShown, wasShown) {
            //Only use isShown=false if it was already shown
            if (!isShown && !wasShown) { return; }

            if (isShown) listCtrl.closeOptionButtons();
            listCtrl.canSwipeItems(!isShown);

            $element.children().toggleClass('list-left-editing', isShown);
            $element.toggleClass('disable-pointer-events', isShown);

            var deleteButton = jqLite($element[0].getElementsByClassName('item-delete'));
            setButtonShown(deleteButton, listCtrl.showDelete);
          });

          $scope.$watch(function() {
            return listCtrl.showReorder();
          }, function(isShown, wasShown) {
            //Only use isShown=false if it was already shown
            if (!isShown && !wasShown) { return; }

            if (isShown) listCtrl.closeOptionButtons();
            listCtrl.canSwipeItems(!isShown);

            $element.children().toggleClass('list-right-editing', isShown);
            $element.toggleClass('disable-pointer-events', isShown);

            var reorderButton = jqLite($element[0].getElementsByClassName('item-reorder'));
            setButtonShown(reorderButton, listCtrl.showReorder);
          });

          function setButtonShown(el, shown) {
            shown() && el.addClass('visible') || el.removeClass('active');
            ionic.requestAnimationFrame(function() {
              shown() && el.addClass('active') || el.removeClass('visible');
            });
          }
        }

      };
    }
  };
}]);
