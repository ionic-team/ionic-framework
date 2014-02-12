<a name="0.9.24"></a>
### 0.9.24 (2014-02-12)


#### Bug Fixes

* **android:** when keyboard comes up, ensure input is in view ((9327ac71), closes (#314))
* **backButton:**
  * able to hide back button if any back button attr set in navBar, closes #564 ((74a05a03))
  * Do not show back button if no attributes set, closes #549 ((2d39418d))
* **browser:** on first hash-set, dont set scrollTop ((1c4d4a8b))
* **buttonIcon:**
  * fix vertical-align in safari, closes #554 ((6acba8da))
  * float left icon-left, closes #515 ((38420c81))
* **click:** Clicks firing twice, closes #573 ((2132d292))
* **header:** Header icon button css fix for Safari, closes #576 ((801d2d7b))
* **ionicScrollDelegate:** trigger resize before scrolling to top/bottom ((ea289b81), closes (#522))
* **list:** css: don't make last .list on page have margin-bottom ((fb5a0d4c))
* **listButtons:** Update list button sizes, closes #478 ((91652112))
* **navBar:** Remove duplicate back button arrows, closes #547 ((4808e80d))
* **navView:** if !$animate.enabled(), do not animate ((990d14e8), closes (#426))
* **range:** Update range for android 4.0-4.3 ((e7eefeef))
* **refresher:** make refresher css not create gap at end of list ((79387a4e))
* **scroll:** `<scroll>` is now registered with $ionicScrollDelegate ((2c7ce763))
* **scroll-view:** make it take up only 100% height ((d2f9e94b))
* **scrollView:**
  * start scroll again if it stops beyond boundaries ((eed6b19b))
  * nested scrollViews now work independently ((4cc4a18c), closes (#278))
* **sideMenuContent:** make dragContent default to true ((61a280bd))


#### Features

* **$ionicScrollDelegate:**
  * add scrollTo(left,top,animate) to delegate ((c119498d))
  * allow anchorScroll to animate with param ((36691bba))
  * add .anchorScroll() function ((c2bbd9e9))
* **domUtil:** add getPositionInParent function ((a970f0bd))
* **grid:** Added classes, variables and mixins for responsive grid options ((1cdb999e))
* **ionic:** remove angular-sanitize (ngSanitize) as dependency ((e7556233))
* **ionicToggle:** allow ngDisabled binding ((0fe44867))
* **list:** reordering scrolls page, reordering performance better ((7f4b28d9), closes (#521))
* **sideMenuContent:** watch `drag-content` attribute ((7f9bfb5a))
* **tab:** allow html in tab `title` attribute ((0facb120), closes (#528))
* **tabs:** allow tab `badge-style` attribute to set badge class ((b11e0f51))
* **toggle:** Disable toggle w/ ng-disabled, closes #541 ((2eab747d))


## 0.9.23 "Alpha Oxen" (2014-02-05)
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


## 0.9.22 "Alpha Narwhal" (2014-01-30)
 - Tap polyfill overhaul to remove 300ms delay when firing a click
 - Android click firing twice fixes
 - Fixes with the tap polyfill for directives using ng-click
 - Upgrade to Angular v1.2.10
 - Reduce default button height


## 0.9.21 "Alpha Maine Coon" (2014-01-24)
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


## 0.9.20 "Alpha Lynx" (2014-01-14)
 - Improved transitions between views
 - Fixed hide-nav-bar/hide-back-button view attributes
 - Removed title attributes from DOM
 - Remove nav title if the entering view doesn't have one
 - Fix padding being added to content directive
 - Rename ionic services to use $ionic prefix


## 0.9.19 "Alpha Koala" (2014-01-10)
 - Created ViewState Service to track navigation history
 - Created navView directive
 - Removed navPage and navRouter directives
 - Using AngularUI Router instead of $route
 - Update examples to use $stateProvider instead $routeProvider


## 0.9.18 "Alpha Jaguar" (2013-12-18)
 - Slide box bug fixes
 - Fixed issues with minification
 - Small tweaks


## 0.9.17 "Alpha Iguana" (2013-12-16)
 - Nav bar button fixes
 - New slide box overhaul
 - New list overhaul
 - Radio button and checkbox fixes


## 0.9.16 "Alpha Hippo" (2013-12-12)
 - Scrollbars
 - Scroll bug fixes


## 0.9.15 "Alpha Giraffe" (2013-12-08)
 - Scroll view fixes
 - Radio button and checkbox fixes
 - Slide box fixes


## 0.9.14 "Alpha Fox" (2013-12-04)
 - Massive scroll performance improvements
 - Android fixes and perf improvements
 - Header and nav bar button fixes
 - Animation performance improvements


## 0.9.13 "Alpha Elephant" (2013-11-26)
 - nav router back button fixes
 - Remove back button on first route
 - Fix forward/back transition on iOS devices which lack history.state


## 0.9.12 "Alpha Dog" (2013-11-24)
 - Fixed some overflow scrolling issues.


## 0.9.11 "Alpha Cat Dog" (2013-11-23)
 

## 0.9.10 "Alpha Cat" (2013-11-23)

