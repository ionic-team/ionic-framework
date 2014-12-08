/**
 * @ngdoc directive
 * @name ionNavTitle
 * @module ionic
 * @restrict E
 * @parent ionNavView
 *
 * @description
 *
 * The nav title directive replaces an {@link ionic.directive:ionNavBar} title text with
 * custom HTML from within an {@link ionic.directive:ionView} template. This gives each
 * view the ability to specify its own custom title element, such as an image or any HTML,
 * rather than being text-only. Alternatively, text-only titles can be updated using the
 * `view-title` {@link ionic.directive:ionView} attribute.
 *
 * Note that `ion-nav-title` must be an immediate descendant of the `ion-view` or
 * `ion-nav-bar` element (basically don't wrap it in another div).
 *
 * @usage
 * ```html
 * <ion-nav-bar>
 * </ion-nav-bar>
 * <ion-nav-view>
 *   <ion-view>
 *     <ion-nav-title>
 *       <img src="logo.svg">
 *     </ion-nav-title>
 *     <ion-content>
 *       Some super content here!
 *     </ion-content>
 *   </ion-view>
 * </ion-nav-view>
 * ```
 *
 */
IonicModule
.directive('ionNavTitle', ['$document', function($document) {
  return {
    require: '^ionNavBar',
    restrict: 'E',
    compile: function(tElement, tAttrs) {
      var navElementType = 'title';
      var spanEle = $document[0].createElement('span');
      for (var n in tAttrs.$attr) {
        spanEle.setAttribute(tAttrs.$attr[n], tAttrs[n]);
      }
      spanEle.classList.add('nav-bar-title');
      spanEle.innerHTML = tElement.html();

      tElement.attr('class', 'hide');
      tElement.empty();

      return {
        pre: function($scope, $element, $attrs, navBarCtrl) {
          // only register the plain HTML, the navBarCtrl takes care of scope/compile/link

          var parentViewCtrl = $element.parent().data('$ionViewController');
          if (parentViewCtrl) {
            // if the parent is an ion-view, then these are ion-nav-buttons for JUST this ion-view
            parentViewCtrl.navElement(navElementType, spanEle.outerHTML);

          } else {
            // these are buttons for all views that do not have their own ion-nav-buttons
            navBarCtrl.navElement(navElementType, spanEle.outerHTML);
          }

          spanEle = null;
        }
      };
    }
  };
}]);
