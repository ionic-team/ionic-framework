/**
* @ngdoc directive
* @name ionSpinner
* @module ionic
* @restrict E
 *
 * @description
 * The `ionSpinner` directive provides a variety of animated spinners.
 * Spinners enables you to give your users feedback that the app is
 * processing/thinking/waiting/chillin' out, or whatever you'd like it to indicate.
 * By default, the {@link ionic.directive:ionRefresher} feature uses this spinner, rather
 * than rotating font icons (previously included in [ionicons](http://ionicons.com/)).
 * While font icons are great for simple or stationary graphics, they're not suited to
 * provide great animations, which is why Ionic uses SVG instead.
 *
 * Ionic offers ten spinners out of the box, and by default, it will use the appropriate spinner
 * for the platform on which it's running. Under the hood, the `ionSpinner` directive dynamically
 * builds the required SVG element, which allows Ionic to provide all ten of the animated SVGs
 * within 3KB.
 *
 * <table class="table" style="max-width: 240px;" ng-app="ionic">
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>android</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-spinner icon="android" style="stroke:#4b8bf4;"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>ios</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-spinner icon="ios" style="stroke:#69717d;"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>ios-small</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-spinner icon="ios-small" style="stroke:#69717d;"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>bubbles</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-spinner icon="bubbles" style="stroke:#333;"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>circles</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-spinner icon="circles" style="stroke:#333;"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>crescent</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-spinner icon="crescent" style="stroke:#333;"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>dots</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-spinner icon="dots" style="stroke:#333;"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>lines</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-spinner icon="lines" style="stroke:#333;"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>ripple</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-spinner icon="ripple" style="stroke:#333;"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>spiral</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-spinner icon="spiral" style="stroke:#333;"></ion-spinner>
 *    </td>
 *  </tr>
 * </table>
 * <script src="http://code.ionicframework.com/nightly/js/ionic.bundle.min.js"></script>
 *
 * Each spinner uses SVG with SMIL animations, however, the Android spinner also uses JavaScript
 * so it also works on Android 4.0-4.3. Additionally, each spinner can be styled with CSS,
 * and scaled to any size.
 *
 *
 * @usage
 * The following code would use the default spinner for the platform it's running from. If it's neither
 * iOS or Android, it'll default to use `ios`.
 *
 * ```html
 * <ion-spinner></ion-spinner>
 * ```
 *
 * By setting the `icon` attribute, you can specify which spinner to use, no matter what
 * the platform is.
 *
 * ```html
 * <ion-spinner icon="spiral"></ion-spinner>
 * ```
 *
 * ## Styling SVG with CSS
 * One cool thing about SVG is its ability to be styled with CSS! Some of the properties
 * have different names, for example, SVG uses the term `stroke` instead of `border`, and
 * `fill` instead of `background-color`.
 *
 * ```css
 * .spinner svg {
 *   width: 28px;
 *   height: 28px;
 *   stroke: #333;
 *   fill: #333;
 * }
 * ```
 *
 * By default, the spinners are designed to be above a light background color. If the spinner
 * is going to be sitting on a dark background color you can add the `.spinner-inverse` CSS
 * class to the directive.
 *
*/
IonicModule
.directive('ionSpinner', function() {
  return {
    restrict: 'E',
    controller: '$ionicSpinner',
    link: function($scope, $element, $attrs, ctrl) {
      var spinnerName = ctrl.init();
      $element.addClass('spinner spinner-' + spinnerName);
    }
  };
});
