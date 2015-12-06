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
 * <style>
 * .spinner-table {
 *   max-width: 280px;
 * }
 * .spinner-table tbody > tr > th, .spinner-table tbody > tr > td {
 *   vertical-align: middle;
 *   width: 42px;
 *   height: 42px;
 * }
 * .spinner {
 *   stroke: #444;
 *   fill: #444; }
 *   .spinner svg {
 *     width: 28px;
 *     height: 28px; }
 *   .spinner.spinner-inverse {
 *     stroke: #fff;
 *     fill: #fff; }
 *
 * .spinner-android {
 *   stroke: #4b8bf4; }
 *
 * .spinner-ios, .spinner-ios-small {
 *   stroke: #69717d; }
 *
 * .spinner-spiral .stop1 {
 *   stop-color: #fff;
 *   stop-opacity: 0; }
 * .spinner-spiral.spinner-inverse .stop1 {
 *   stop-color: #000; }
 * .spinner-spiral.spinner-inverse .stop2 {
 *   stop-color: #fff; }
 * </style>
 *
 * <script src="http://code.ionicframework.com/nightly/js/ionic.bundle.min.js"></script>
 * <table class="table spinner-table" ng-app="ionic">
 *  <tr>
 *    <th>
 *      <code>android</code>
 *    </th>
 *    <td>
 *      <ion-spinner icon="android"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>ios</code>
 *    </th>
 *    <td>
 *      <ion-spinner icon="ios"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>ios-small</code>
 *    </th>
 *    <td>
 *      <ion-spinner icon="ios-small"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>bubbles</code>
 *    </th>
 *    <td>
 *      <ion-spinner icon="bubbles"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>circles</code>
 *    </th>
 *    <td>
 *      <ion-spinner icon="circles"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>crescent</code>
 *    </th>
 *    <td>
 *      <ion-spinner icon="crescent"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>dots</code>
 *    </th>
 *    <td>
 *      <ion-spinner icon="dots"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>lines</code>
 *    </th>
 *    <td>
 *      <ion-spinner icon="lines"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>ripple</code>
 *    </th>
 *    <td>
 *      <ion-spinner icon="ripple"></ion-spinner>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th>
 *      <code>spiral</code>
 *    </th>
 *    <td>
 *      <ion-spinner icon="spiral"></ion-spinner>
 *    </td>
 *  </tr>
 * </table>
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
 * ## Spinner Colors
 * Like with most of Ionic's other components, spinners can also be styled using
 * Ionic's standard color naming convention. For example:
 *
 * ```html
 * <ion-spinner class="spinner-energized"></ion-spinner>
 * ```
 *
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
 *   stroke: #444;
 *   fill: #444;
 * }
 * ```
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

      $element.on('$destroy', function onDestroy() {
        ctrl.stop();
      });
    }
  };
});
