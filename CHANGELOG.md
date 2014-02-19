<a name="0.9.25"></a>
### 0.9.25 (2014-02-19)


#### Bug Fixes

* **anchorScroll:** find offset of nested elements correctly ([17cc0408](http://github.com/driftyco/ionic/commit/17cc04089600bda36e5d3010635967fd7d008f96), closes [#618](http://github.com/driftyco/ionic/issues/618))
* **click:** event.preventDefault() when setting focus() on an input, closes 583 ([fc8ab4b8](http://github.com/driftyco/ionic/commit/fc8ab4b8ea9b89bd3446b835476950bb70bba879))
* **ionicLoading:** make showDelay default to 0 (was 2000) ([0d3718cc](http://github.com/driftyco/ionic/commit/0d3718cc218037e32f902da6793a7df9071a0c5a))
* **ionicScrollDelegate:** tapScrollToTop won't fire for button tap ([70d95249](http://github.com/driftyco/ionic/commit/70d952499aedddb6516070d500769b800aec7b4f), closes [#557](http://github.com/driftyco/ionic/issues/557))
* **loading:** make showDelay option work correctly ([7281e2ab](http://github.com/driftyco/ionic/commit/7281e2abf0f6f624f296191b3f322227089e3658), closes [#562](http://github.com/driftyco/ionic/issues/562))
* **modal:** do not click buttons underneath modal ([9bc928f0](http://github.com/driftyco/ionic/commit/9bc928f031613879c42587cad5169b82d1621145))
* **navBar:** animations work properly ([749cd382](http://github.com/driftyco/ionic/commit/749cd3829ccedacd552abfd4a2c607066f12c0b2))
* **scrollView:**
  * allow contenteditable element to be pressed normally ([39ad3e0b](http://github.com/driftyco/ionic/commit/39ad3e0b2667eb036cbf146121aabf8383506a8c), closes [#421](http://github.com/driftyco/ionic/issues/421))
  * fix error from checking device before ready ([a5d96473](http://github.com/driftyco/ionic/commit/a5d964734f0f89ca506edbb38e0cdd7fc5469b90))
  * cancel scrollTop every time hash is set ([e1b6fd4f](http://github.com/driftyco/ionic/commit/e1b6fd4f8406257f1dd7eee4e114ab6fe119b4b5))
  * do not stop scrolling if stopped beyond boundaries ([1aef593f](http://github.com/driftyco/ionic/commit/1aef593f07d9651e1cdd00051584dfc76bf10076))
* **tabs:** broadcast tab.shown/tab.hidden to only child scopes ([69fda4e5](http://github.com/driftyco/ionic/commit/69fda4e5267e8c66e3f3f232a10d160cc0ced338))


#### Features

* **angular:** Update to Angular v1.2.13, closes #600 ([97f4f6ea](http://github.com/driftyco/ionic/commit/97f4f6eacea512c5ef3845e0ba89663ef0758915))
* **button:** Increase hit area size of a button ([c168b489](http://github.com/driftyco/ionic/commit/c168b489b5347f716e6463c7f9335dcc45fbc1b5))
* **event:** Created stopEvent directive to use for certain ng-click cases, closes #550 ([8b308a17](http://github.com/driftyco/ionic/commit/8b308a1737e29670b88c1c9fe10d137d912edbcc))
* **ionic:** prefix all directives with `ion-` ([2c39a214](http://github.com/driftyco/ionic/commit/2c39a214981b039602891c85028f7e87b9d67be1))
* **modal:**
  * add .isShown() method to modal instances ([e106457e](http://github.com/driftyco/ionic/commit/e106457e61b5510a4a2e2a62a7015e8a2fb83313), closes [#320](http://github.com/driftyco/ionic/issues/320))
  * $broadcast 'modal.shown/hidden/removed' from parent scope ([110ff9f4](http://github.com/driftyco/ionic/commit/110ff9f47583c7f04bcf5b1eebea6d7bd0b25e99), closes [#243](http://github.com/driftyco/ionic/issues/243))
* **navBar:** allow expression in `type`. `<nav-bar type="{{myType}}">` ([5470d77a](http://github.com/driftyco/ionic/commit/5470d77ac0b1812f13b162e3d7e38f8d16e5eaf1), closes [#599](http://github.com/driftyco/ionic/issues/599))
* **sideMenu:** allow and watch attrs `width` & `is-enabled` ([bfefc69f](http://github.com/driftyco/ionic/commit/bfefc69f3c87cb51c918953def3ec92277e73edc))


#### Breaking Changes

* All directives are now prefixed with `ion-`.

For any directive you use, add the ionic prefix.

For example, change this HTML:

```html
<tabs>
  <tab title="home" href="/tab/home">
    <content>Hello!</content>
  </tab>
</tabs>
```

To this HTML:

```
<ion-tabs>
  <ion-tab title="home" href="/tab/home">
    <ion-content>Hello!</ion-content>
  </ion-tab>
</ion-tabs>
```
 ([2c39a214](http://github.com/driftyco/ionic/commit/2c39a214981b039602891c85028f7e87b9d67be1))


<a name="0.9.24"></a>
### 0.9.24 "Peleguin" (2014-02-12)



#### Bug Fixes

* **android:** when keyboard comes up, ensure input is in view ([9327ac71](https://github.com/driftyco/ionic/commit/9327ac71c778fa7ad48eb5570687e9380f5ff0db), closes [#314](https://github.com/driftyco/ionic/issues/314))
* **backButton:**
  * able to hide back button if any back button attr set in navBar, closes #564 ([74a05a03](https://github.com/driftyco/ionic/commit/74a05a03388f1a9a77141f078623b018bf2829eb))
  * Do not show back button if no attributes set, closes #549 ([2d39418d](https://github.com/driftyco/ionic/commit/2d39418d0b322e6e2ab2b054035e4c3abeabfaff))
* **browser:** on first hash-set, dont set scrollTop ([1c4d4a8b](https://github.com/driftyco/ionic/commit/1c4d4a8b90e24a277187c7505538dbf461b95d11))
* **buttonIcon:**
  * fix vertical-align in safari, closes #554 ([6acba8da](https://github.com/driftyco/ionic/commit/6acba8da3e02dc29c115748196bee93faa9a43b3))
  * float left icon-left, closes #515 ([38420c81](https://github.com/driftyco/ionic/commit/38420c81278f915562a0d0c941c83daf949ed2e0))
* **click:** Clicks firing twice, closes #573 ([2132d292](https://github.com/driftyco/ionic/commit/2132d292e7bbf368e1c21be10b3ddf67a1b4e496))
* **header:** Header icon button css fix for Safari, closes #576 ([801d2d7b](https://github.com/driftyco/ionic/commit/801d2d7b77d75c0288d7a039b2dfc0f5dbc99955))
* **ionicScrollDelegate:** trigger resize before scrolling to top/bottom ([ea289b81](https://github.com/driftyco/ionic/commit/ea289b81c6a54d5adb3515b692d2dbec569d0498), closes [#522](https://github.com/driftyco/ionic/issues/522))
* **list:** css: don't make last .list on page have margin-bottom ([fb5a0d4c](https://github.com/driftyco/ionic/commit/fb5a0d4c81461ef3c770f73a043284c71d4ac87d))
* **listButtons:** Update list button sizes, closes #478 ([91652112](https://github.com/driftyco/ionic/commit/91652112a0eadf89fabdff852153e2ea88c340c5))
* **navBar:** Remove duplicate back button arrows, closes #547 ([4808e80d](https://github.com/driftyco/ionic/commit/4808e80ddf7ce03947cee606376af6453bb52e2b))
* **refresher:** make refresher css not create gap at end of list ([79387a4e](https://github.com/driftyco/ionic/commit/79387a4e4aa621e7d0e49b4062c94d63a503dfdb))
* **scroll:** `<scroll>` is now registered with $ionicScrollDelegate ([2c7ce763](https://github.com/driftyco/ionic/commit/2c7ce7638563f97a0931a2cd3aa13632cbaf88f7))
* **scroll-view:** css: make it take up only 100% height ([d2f9e94b](https://github.com/driftyco/ionic/commit/d2f9e94bcd7aec7292f2167c6bb20fca221b394a))
* **scrollView:**
  * start scroll again if it stops beyond boundaries ([eed6b19b](https://github.com/driftyco/ionic/commit/eed6b19b519864b7b6a4cc4ef194be5423dde710))
  * nested scrollViews now work independently ([4cc4a18c](https://github.com/driftyco/ionic/commit/4cc4a18c66e3fb636a2b253b1a6b13b02ebee696), closes [#278](https://github.com/driftyco/ionic/issues/278))
* **sideMenuContent:** make dragContent default to true ([61a280bd](https://github.com/driftyco/ionic/commit/61a280bda8b7604a5eda11e99a45f4b991a8e269))


#### Features

* **$ionicScrollDelegate:**
  * add scrollTo(left,top,animate) to delegate ([c119498d](https://github.com/driftyco/ionic/commit/c119498d1bdfe9c5ec0d7453fce8f9a18227977c))
  * allow anchorScroll to animate with param ([36691bba](https://github.com/driftyco/ionic/commit/36691bbaebf51ae5252e5673d3392e3e6c724eb9))
  * add .anchorScroll() function ([c2bbd9e9](https://github.com/driftyco/ionic/commit/c2bbd9e96e2a14200e86fac3fdaa2408e19ab7ed))
* **domUtil:** add getPositionInParent function ([a970f0bd](https://github.com/driftyco/ionic/commit/a970f0bdc3bf87cf26e984482e00d8e763fc326f))
* **grid:** Added classes, variables and mixins for responsive grid options ([1cdb999e](https://github.com/driftyco/ionic/commit/1cdb999e5672391fbe02719eef060e28ea72871d))
* **ionic:** remove angular-sanitize (ngSanitize) as dependency ([e7556233](https://github.com/driftyco/ionic/commit/e755623331c1ad2099b61cd07c93cb91ae992640))
* **list:** reordering scrolls page, reordering performance better ([7f4b28d9](https://github.com/driftyco/ionic/commit/7f4b28d9da9e77a055f840d3b44384138af48ca2), closes [#521](https://github.com/driftyco/ionic/issues/521))
* **sideMenuContent:** watch `drag-content` attribute ([7f9bfb5a](https://github.com/driftyco/ionic/commit/7f9bfb5a9499537f5aa18291b7c2043da2aced49))
* **tabs:** 
  * allow html in tab `title` attribute ([0facb120](https://github.com/driftyco/ionic/commit/0facb120c74f010a0a60e9e70c388b5b8264b890), closes [#528](https://github.com/driftyco/ionic/issues/528))
  * allow tab `badge-style` attribute to set badge class ([b11e0f51](https://github.com/driftyco/ionic/commit/b11e0f512bc332ed92aee1ce3fa4b8d331b6193e))
* **toggle:** 
  * Disable toggle w/ ng-disabled, closes #541 ([2eab747d](https://github.com/driftyco/ionic/commit/2eab747d47dbe3b299d7f3ed69fd790cad936e4e))
  * allow ngDisabled binding ([0fe44867](https://github.com/driftyco/ionic/commit/0fe4486737c9780b3c2d7c86d84eab57c961834c))



### 0.9.23 "Alpha Oxen" (2014-02-05)
 - Android back button correctly goes back a view or closes the app
 - CustomEvent polyfill improvements for Android
 - Fix tab icon alignments
 - Fix $ionicPlatform.ready()
 - Fire off ionic.Platform.ready() callbacks for both Cordova and non-cordova
 - Created ionic.Platform.exitApp();
 - Add major and minor platform version numbers in body css
 - Removed dist folder from git
 - Created release folder to hold the latest release
 - Automate bulding the nightly folder in the CDN
 - Clicking tab item takes user to root/home of the tab
 - Add tab badges with `badge` attribute 
 - Remember the previous scroll of a page when going back to it

 **Breaking Changes**
 
 - `bower install ionic`: release files are now located in the `release` folder, not `dist`.


### 0.9.22 "Alpha Narwhal" (2014-01-30)
 - Tap polyfill overhaul to remove 300ms delay when firing a click
 - Android click firing twice fixes
 - Fixes with the tap polyfill for directives using ng-click
 - Upgrade to Angular v1.2.10
 - Reduce default button height


### 0.9.21 "Alpha Maine Coon" (2014-01-24)
 - Toggle directive now includes .item.item-toggle wrapper
 - Toggle/Checkbox/Radio implements ng-model/ng-value/ng-change
 - Ionicons v1.4.2, icons now using :before pseudo
 - Button and header size updates
 - Android "click" event firing twice fixes
 - Refactor platform ready event listeners
 - Refactor navView directive
 - Created ionic.Platform.fullscreen() and .showStatusBar()
 - Update to Angular v1.2.8
 - Disable pointer-events during transitions
 - Remove ngTouch from angular.modules
 - Remove angular-touch.js and angular-route.js references


### 0.9.20 "Alpha Lynx" (2014-01-14)
 - Improved transitions between views
 - Fixed hide-nav-bar/hide-back-button view attributes
 - Removed title attributes from DOM
 - Remove nav title if the entering view doesn't have one
 - Fix padding being added to content directive
 - Rename ionic services to use $ionic prefix


### 0.9.19 "Alpha Koala" (2014-01-10)
 - Created ViewState Service to track navigation history
 - Created navView directive
 - Removed navPage and navRouter directives
 - Using AngularUI Router instead of $route
 - Update examples to use $stateProvider instead $routeProvider


### 0.9.18 "Alpha Jaguar" (2013-12-18)
 - Slide box bug fixes
 - Fixed issues with minification
 - Small tweaks


### 0.9.17 "Alpha Iguana" (2013-12-16)
 - Nav bar button fixes
 - New slide box overhaul
 - New list overhaul
 - Radio button and checkbox fixes


### 0.9.16 "Alpha Hippo" (2013-12-12)
 - Scrollbars
 - Scroll bug fixes


### 0.9.15 "Alpha Giraffe" (2013-12-08)
 - Scroll view fixes
 - Radio button and checkbox fixes
 - Slide box fixes


### 0.9.14 "Alpha Fox" (2013-12-04)
 - Massive scroll performance improvements
 - Android fixes and perf improvements
 - Header and nav bar button fixes
 - Animation performance improvements


### 0.9.13 "Alpha Elephant" (2013-11-26)
 - nav router back button fixes
 - Remove back button on first route
 - Fix forward/back transition on iOS devices which lack history.state


### 0.9.12 "Alpha Dog" (2013-11-24)
 - Fixed some overflow scrolling issues.


### 0.9.11 "Alpha Cat Dog" (2013-11-23)
 

### 0.9.10 "Alpha Cat" (2013-11-23)

