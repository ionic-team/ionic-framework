/**
 * @ngdoc directive
 * @name keyboardAttach
 * @module ionic
 * @restrict A
 *
 * @description
 * keyboard-attach is an attribute directive which will cause an element to float above
 * the keyboard when the keyboard shows. Currently only supports the [ion-footer-bar]({{ page.versionHref }}/api/directive/ionFooterBar/)
 * directive.
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
  return function(scope, element, attrs) {
    window.addEventListener('native.keyboardshow', onShow);
    window.addEventListener('native.keyboardhide', onHide);

    //deprecated
    window.addEventListener('native.showkeyboard', onShow);
    window.addEventListener('native.hidekeyboard', onHide);


    var scrollCtrl;

    function onShow(e) {
      //for testing
      var keyboardHeight = e.keyboardHeight || e.detail.keyboardHeight;
      element.css('bottom', keyboardHeight + "px");
      scrollCtrl = element.controller('$ionicScroll');
      if ( scrollCtrl ) {
        scrollCtrl.scrollView.__container.style.bottom = keyboardHeight + keyboardAttachGetClientHeight(element[0]) + "px";
      }
    }

    function onHide() {
      element.css('bottom', '');
      if ( scrollCtrl ) {
        scrollCtrl.scrollView.__container.style.bottom = '';
      }
    }

    scope.$on('$destroy', function() {
      window.removeEventListener('native.keyboardshow', onShow);
      window.removeEventListener('native.keyboardhide', onHide);
      
      window.removeEventListener('native.showkeyboard', onShow);
      window.removeEventListener('native.hidekeyboard', onHide);
    });
  };
});

function keyboardAttachGetClientHeight(element) {
  return element.clientHeight;
}
