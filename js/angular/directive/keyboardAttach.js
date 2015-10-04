/**
 * @ngdoc directive
 * @name keyboardAttach
 * @module ionic
 * @restrict A
 *
 * @description
 * keyboard-attach is an attribute directive which will cause an element to float above
 * the keyboard when the keyboard shows. Currently only supports the
 * [ion-footer-bar]({{ page.versionHref }}/api/directive/ionFooterBar/) directive.
 *
 * ### Notes
 * - This directive requires the
 * [Ionic Keyboard Plugin](https://github.com/driftyco/ionic-plugins-keyboard).
 * - On Android not in fullscreen mode, i.e. you have
 *   `<preference name="Fullscreen" value="false" />` or no preference in your `config.xml` file,
 *   this directive is unnecessary since it is the default behavior.
 * - On iOS, if there is an input in your footer, you will need to set
 *   `cordova.plugins.Keyboard.disableScroll(true)`.
 * - To test this in the browser use these:
 *   - `window.dispatchEvent(new CustomEvent("native.keyboardshow", { "detail": { "keyboardHeight": 200 } }));`
 *   - `window.dispatchEvent(new CustomEvent("native.keyboardhide"));`
 *
 * @usage
 *
 * ```html
 *  <ion-footer-bar align-title="left" keyboard-attach class="bar-assertive">
 *    <h1 class="title">Title!</h1>
 *  </ion-footer-bar>
 * ```
 */

IonicModule
.directive('keyboardAttach', function() {
  return function(scope, element) {
    ionic.on('native.keyboardshow', onShow, window);
    ionic.on('native.keyboardhide', onHide, window);

    //deprecated
    ionic.on('native.showkeyboard', onShow, window);
    ionic.on('native.hidekeyboard', onHide, window);

    var keyboardHeight = 0,
        scrollCtrl, scrollView, ionView;

    function onShow(e) {
      // App running on Android (not fullscreen)? Don't bother as this is default behavior
      if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
        return;
      }

      // Get keyboardHeight from the event (or from the detail when testing)
      keyboardHeight = e.keyboardHeight || e.detail.keyboardHeight;

      // Get Scroll Controller
      scrollCtrl = element.controller('$ionicScroll');

      // Scroll Controller present? Shift the whole ionView up
      if (scrollCtrl) {

        // get the ionView
        scrollView = scrollCtrl.getScrollView();
        ionView = angular.element(scrollView.el).parent();

        // Adjust height and bottom position
        ionView.css('height', 'auto').css('bottom', keyboardHeight + 'px');

        // Adjust scroll position so that the content doesn't jump
        scrollView.scrollBy(0, keyboardHeight);

      }

      // No Scroll Controller present
      else {

        // Shift the element (and only the element) up
        element.css('bottom', keyboardHeight + 'px');

      }
    }

    function onHide() {
      // App running on Android (not fullscreen)? Don't bother as this is default behavior
      if (ionic.Platform.isAndroid() && !ionic.Platform.isFullScreen) {
        return;
      }

      // Scrollcontroller present? Shift the whole ionView back down
      // @note: Make sure to scroll in reverse first, and then adjust the height. Otherwise it won't work!
      if (scrollCtrl) {

        // Restore scroll position
        scrollView.scrollBy(0, (-1 * keyboardHeight));

        // Adjust height and bottom position to the defaults
        ionView.css('height', '100%').css('bottom', '0');

      }

      // No Scroll Controller present
      else {

        // Shift the element (and only the element) back down
        element.css('bottom', 'auto');

      }
    }

    scope.$on('$destroy', function() {
      ionic.off('native.keyboardshow', onShow, window);
      ionic.off('native.keyboardhide', onHide, window);

      //deprecated
      ionic.off('native.showkeyboard', onShow, window);
      ionic.off('native.hidekeyboard', onHide, window);
    });
  };
});
