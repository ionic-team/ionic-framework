/**
* @ngdoc directive
* @name ionLoader
* @module ionic
* @restrict E
 *
 * @description
 * The `ionLoader` directive provides a variety of animated loaders, or spinners, if you
 * will. The loader enables you to give your users feedback that the app is
 * processing/thinking/waiting/chillin' out, or whatever you'd like it to indicate.
 * By default, the {@link ionic.directive:ionRefresher} feature uses this loader, rather
 * than rotating font icons (previously included in [ionicons](http://ionicons.com/)).
 * While font icons are great for simple or stationary graphics, they're not suited to
 * provide great animations, which is why Ionic uses SVG instead.
 *
 * Ionic offers ten loaders out of the box, and by default, it will use the appropriate loader
 * for the platform on which it's running. Under the hood, the `ionLoader` directive dynamically
 * builds the required SVG element, which allows Ionic to provide all ten of the animated SVGs
 * within 3KB.
 *
 * <table class="table" style="max-width: 240px;" ng-app="ionic">
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>android</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-loader icon="android" style="stroke:#4b8bf4;"></ion-loader>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>ios</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-loader icon="ios" style="stroke:#69717d;"></ion-loader>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>ios-small</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-loader icon="ios-small" style="stroke:#69717d;"></ion-loader>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>blip</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-loader icon="blip" style="stroke:#333;"></ion-loader>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>bubbles</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-loader icon="bubbles" style="stroke:#333;"></ion-loader>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>circles</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-loader icon="circles" style="stroke:#333;"></ion-loader>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>crescent</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-loader icon="crescent" style="stroke:#333;"></ion-loader>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>dots</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-loader icon="dots" style="stroke:#333;"></ion-loader>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>lines</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-loader icon="lines" style="stroke:#333;"></ion-loader>
 *    </td>
 *  </tr>
 *  <tr>
 *    <th style="vertical-align:middle">
 *      <code>spiral</code>
 *    </th>
 *    <td style="width:42px;height:42px;">
 *      <ion-loader icon="spiral" style="stroke:#333;"></ion-loader>
 *    </td>
 *  </tr>
 * </table>
 * <script src="http://code.ionicframework.com/nightly/js/ionic.bundle.min.js"></script>
 *
 * Each loader uses SVG with SMIL animations, however, the Android loader also uses JavaScript
 * so it also works on Android 4.0-4.3. Additionally, each loader can be styled with CSS,
 * and scaled to any size.
 *
 *
 * @usage
 * The following code would use the default loader for the platform it's running from. If it's neither
 * iOS or Android, it'll default to use `ios`.
 *
 * ```html
 * <ion-loader></ion-loader>
 * ```
 *
 * By setting the `icon` attribute, you can specify which loader to use, no matter what
 * the platform is.
 *
 * ```html
 * <ion-loader icon="spiral"></ion-loader>
 * ```
 *
 * ## Styling SVG with CSS
 * One cool thing about SVG is its ability to be styled with CSS! Some of the properties
 * have different names, for example, SVG uses the term `stroke` instead of `border`, and
 * `fill` instead of `background-color`.
 *
 * ```css
 * svg.loader {
 *   width: 28px;
 *   height: 28px;
 *   stroke: #333;
 *   fill: #333;
 * }
 * ```
*/
IonicModule
.directive('ionLoader', function() {
  return {
    restrict: 'E',
    controller: '$ionicLoader',
    link: function($scope, $element, $attrs, ctrl) {
      ctrl.init();
    }
  };
});
