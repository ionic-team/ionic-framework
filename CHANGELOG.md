<a name="2.0.0-rc.3"></a>
# [2.0.0-rc.3](https://github.com/driftyco/ionic/compare/v2.0.0-rc.2...v2.0.0-rc.3) (2016-11-17)


### Updating to 2.0.0-rc.3

Update the following dependencies in your `package.json` file:

```
"dependencies": {
  "@angular/common": "2.1.1",
  "@angular/compiler": "2.1.1",
  "@angular/compiler-cli": "2.1.1",
  "@angular/core": "2.1.1",
  "@angular/forms": "2.1.1",
  "@angular/http": "2.1.1",
  "@angular/platform-browser": "2.1.1",
  "@angular/platform-browser-dynamic": "2.1.1",
  "@angular/platform-server": "2.1.1",
  "@ionic/storage": "1.1.6",
  "ionic-angular": "2.0.0-rc.3",
  "ionic-native": "2.2.3",
  "ionicons": "3.0.0",
  "rxjs": "5.0.0-beta.12",
  "zone.js": "0.6.26"
},
"devDependencies": {
  "@ionic/app-scripts": "0.0.45",
}
```

### Bug Fixes

* **animation:** always run before classes and functions ([d9e9ece](https://github.com/driftyco/ionic/commit/d9e9ece)), closes [#8842](https://github.com/driftyco/ionic/issues/8842) [#8769](https://github.com/driftyco/ionic/issues/8769)
* **animation:** fix regression in _willChg() ([91f5087](https://github.com/driftyco/ionic/commit/91f5087))
* **button:** fix ios buttons in colored toolbar so they don't use the default color ([0e53ec3](https://github.com/driftyco/ionic/commit/0e53ec3)), closes [#8566](https://github.com/driftyco/ionic/issues/8566)
* **colors:** override element styling and tweak colors for card and item ([ee3decc](https://github.com/driftyco/ionic/commit/ee3decc)), closes [#9081](https://github.com/driftyco/ionic/issues/9081)
* **components:** add a mode agnostic css class ([#9133](https://github.com/driftyco/ionic/issues/9133)) ([025c5cc](https://github.com/driftyco/ionic/commit/025c5cc)), closes [#8545](https://github.com/driftyco/ionic/issues/8545)
* **datetime:** fix min/max displayFormat and pickerFormat ([c72b67d](https://github.com/driftyco/ionic/commit/c72b67d)), closes [#8729](https://github.com/driftyco/ionic/issues/8729)
* **gestures:** gesture controller handled by components ([32ab817](https://github.com/driftyco/ionic/commit/32ab817)), closes [#9046](https://github.com/driftyco/ionic/issues/9046) [#9130](https://github.com/driftyco/ionic/issues/9130) [#9052](https://github.com/driftyco/ionic/issues/9052) [#7444](https://github.com/driftyco/ionic/issues/7444)
* **item:** fix color input for item divider and list header ([5e5c33a](https://github.com/driftyco/ionic/commit/5e5c33a)), closes [#8376](https://github.com/driftyco/ionic/issues/8376)
* **nav:** controller is initialized ([beab06f](https://github.com/driftyco/ionic/commit/beab06f))
* **nav:** fixes empty stack condition ([909293a](https://github.com/driftyco/ionic/commit/909293a))
* **nav:** it is not allowed to pop all the views ([0ab990c](https://github.com/driftyco/ionic/commit/0ab990c))
* **nav:** returning Promise<false> in canLeave / canEnter works as expected ([5f1a862](https://github.com/driftyco/ionic/commit/5f1a862))
* **nav:** transitioning state is a boolean not a timer ([63d495a](https://github.com/driftyco/ionic/commit/63d495a))
* **nav:** willLeave is called before willEnter ([b77b2ae](https://github.com/driftyco/ionic/commit/b77b2ae)), closes [#9163](https://github.com/driftyco/ionic/issues/9163)
* **nav:** zIndex in overlays ([70f8a8e](https://github.com/driftyco/ionic/commit/70f8a8e))
* **picker:** prevents scrolling under the picker ([2348d22](https://github.com/driftyco/ionic/commit/2348d22))
* **sass:** change default font path ([#8811](https://github.com/driftyco/ionic/issues/8811)) ([0940d5a](https://github.com/driftyco/ionic/commit/0940d5a))
* **sass:** remove usage of colors other than primary, improve error ([#8907](https://github.com/driftyco/ionic/issues/8907)) ([eb0b05d](https://github.com/driftyco/ionic/commit/eb0b05d)), closes [#8266](https://github.com/driftyco/ionic/issues/8266)
* **styles:** update ios and md styles closer to native ([9f7972b](https://github.com/driftyco/ionic/commit/9f7972b))
* **typography:** Exclude ion-item on a tags selector ([#8340](https://github.com/driftyco/ionic/issues/8340)) ([b00860b](https://github.com/driftyco/ionic/commit/b00860b))


### Features

* **input:** clearOnEdit feature. Closes [#9187](https://github.com/driftyco/ionic/issues/9187) ([9469b4f](https://github.com/driftyco/ionic/commit/9469b4f))
* **nav:** export NavControllerBase for building of components similar to ion-tab ([24b087c](https://github.com/driftyco/ionic/commit/24b087c))
* **tappable:** auto add tappable attribute for ion-item clicks ([5c4838b](https://github.com/driftyco/ionic/commit/5c4838b))
* **util:** custom ionic error handler provider ([6b77772](https://github.com/driftyco/ionic/commit/6b77772))


### Performance Improvements

* **animation:** improves _progress() hot function ([c44f6b6](https://github.com/driftyco/ionic/commit/c44f6b6))
* **animation:** optimizing hot loops ([c78dc19](https://github.com/driftyco/ionic/commit/c78dc19))
* **animation:** set after styles should not be recursive ([3a2ff85](https://github.com/driftyco/ionic/commit/3a2ff85))
* **click:** increase number to find activatable elements ([c8aad56](https://github.com/driftyco/ionic/commit/c8aad56)), closes [#9190](https://github.com/driftyco/ionic/issues/9190)
* **item:** improve performance of sliding item ([#9005](https://github.com/driftyco/ionic/issues/9005)) ([759e3ea](https://github.com/driftyco/ionic/commit/759e3ea))
* **item:** reorder is only added to the DOM if needed ([dec5a0b](https://github.com/driftyco/ionic/commit/dec5a0b)), closes [#9065](https://github.com/driftyco/ionic/issues/9065)
* **menu:** avoid change detection when it isn't needed ([#8986](https://github.com/driftyco/ionic/issues/8986)) ([d531ec2](https://github.com/driftyco/ionic/commit/d531ec2))
* **nav:** avoid running zone when it is not needed ([be72d39](https://github.com/driftyco/ionic/commit/be72d39))
* **picker:** improves performance of picker and datepicker ([fc2ee64](https://github.com/driftyco/ionic/commit/fc2ee64))
* **picker:** improves picker UX feedback ([cfbc5ea](https://github.com/driftyco/ionic/commit/cfbc5ea))


<a name="2.0.0-rc.2"></a>
# [2.0.0-rc.2](https://github.com/driftyco/ionic/compare/v2.0.0-rc.1...v2.0.0-rc.2) (2016-11-03)

### Updating to 2.0.0-rc.2

Update the following dependencies in your `package.json` file:

```
"dependencies": {
  "@angular/common": "2.1.1",
  "@angular/compiler": "2.1.1",
  "@angular/compiler-cli": "2.1.1",
  "@angular/core": "2.1.1",
  "@angular/forms": "2.1.1",
  "@angular/http": "2.1.1",
  "@angular/platform-browser": "2.1.1",
  "@angular/platform-browser-dynamic": "2.1.1",
  "@angular/platform-server": "2.1.1",
  "@ionic/storage": "1.1.6",
  "ionic-angular": "2.0.0-rc.2"
},
"devDependencies": {
  "@ionic/app-scripts": "0.0.39"
}
```

_Note: you should have other dependencies in this file that are not listed above, these are only the dependencies that need to be updated._

Remove the `node_modules` directory from your project, and then run `npm install` inside of your project. Then, you should be on the latest version!

### Bug Fixes

* **action-sheet:** Improve Action Sheet styles across all the platforms ([#8736](https://github.com/driftyco/ionic/issues/8736)) ([8d2c8b6](https://github.com/driftyco/ionic/commit/8d2c8b6)), closes [#8663](https://github.com/driftyco/ionic/issues/8663)
* **config:** Cannot read property 'canDisableScroll' of undefined in unit tests ([90f9b5c](https://github.com/driftyco/ionic/commit/90f9b5c))
* **content:** _scrollPadding is not undefined ([6484c50](https://github.com/driftyco/ionic/commit/6484c50)), closes [#8844](https://github.com/driftyco/ionic/issues/8844)
* **cordova:** add Sass variables for md and wp statusbar padding ([#8788](https://github.com/driftyco/ionic/issues/8788)) ([8921cb1](https://github.com/driftyco/ionic/commit/8921cb1)), closes [#8712](https://github.com/driftyco/ionic/issues/8712)
* **directives:** add missing export ([#8999](https://github.com/driftyco/ionic/issues/8999)) ([98d474b](https://github.com/driftyco/ionic/commit/98d474b))
* **fab:** only animate transform and opacity ([f69e981](https://github.com/driftyco/ionic/commit/f69e981))
* **input:** wrong width of text-input for iOS ([941e2d2](https://github.com/driftyco/ionic/commit/941e2d2)), closes [#7388](https://github.com/driftyco/ionic/issues/7388)
* **navigation:** adds public willLoad lifecycle event ([033e1ea](https://github.com/driftyco/ionic/commit/033e1ea))
* **navigation:** clickblock is disabled longer ([eb317d4](https://github.com/driftyco/ionic/commit/eb317d4)), closes [#8713](https://github.com/driftyco/ionic/issues/8713)
* **navigation:** ion-nav inside ion-content work properly ([ba557ac](https://github.com/driftyco/ionic/commit/ba557ac))
* **navigation:** ionViewDidLoad fires before children components have been loaded ([e89f3b0](https://github.com/driftyco/ionic/commit/e89f3b0)), closes [#8449](https://github.com/driftyco/ionic/issues/8449)
* **navigation:** swipe to go back gesture ([04d61ee](https://github.com/driftyco/ionic/commit/04d61ee)), closes [#8919](https://github.com/driftyco/ionic/issues/8919) [#8958](https://github.com/driftyco/ionic/issues/8958) [#7934](https://github.com/driftyco/ionic/issues/7934)
* **navigation:** view.id is not overridden ([8b65398](https://github.com/driftyco/ionic/commit/8b65398)), closes [#8794](https://github.com/driftyco/ionic/issues/8794)
* **navigation:** willLoad() does not have to be zone wrapped ([17dbf69](https://github.com/driftyco/ionic/commit/17dbf69))
* **navigation:** change detector exception ([8b07e6c](https://github.com/driftyco/ionic/commit/8b07e6c))
* **picker:** fixes regression in picker but introduces new bug. ([c1ba120](https://github.com/driftyco/ionic/commit/c1ba120))
* **range:** fixes when step size is bigger than range ([9895b86](https://github.com/driftyco/ionic/commit/9895b86)), closes [#8830](https://github.com/driftyco/ionic/issues/8830) [#8802](https://github.com/driftyco/ionic/issues/8802)
* **range:** range with long label renders correctly ([f1f44eb](https://github.com/driftyco/ionic/commit/f1f44eb))
* **refresher:** only animate transform property ([658c4d6](https://github.com/driftyco/ionic/commit/658c4d6))
* **sass:** rename $background-color variable in our loops ([2003ae4](https://github.com/driftyco/ionic/commit/2003ae4)), closes [#8475](https://github.com/driftyco/ionic/issues/8475)
* **scroll:** fix scroll to top on iOS ([2d165e1](https://github.com/driftyco/ionic/commit/2d165e1))
* **searchbar:** looks good when mode is different ([0c0f32d](https://github.com/driftyco/ionic/commit/0c0f32d))
* **searchbar:** positionElements to assign input mode fixes [#8855](https://github.com/driftyco/ionic/issues/8855) ([cd0e19a](https://github.com/driftyco/ionic/commit/cd0e19a))
* **searchbar:** fix always hide button ([316c4f3](https://github.com/driftyco/ionic/commit/316c4f3))
* **segment:** update broken link https://github.com/driftyco/ionic-site/issues/777 ([c66a440](https://github.com/driftyco/ionic/commit/c66a440))
* **select:** emit the ionSelect option when selecting an option ([2eed5e2](https://github.com/driftyco/ionic/commit/2eed5e2))
* **spinner:** working in firefox and edge ([ab93f3f](https://github.com/driftyco/ionic/commit/ab93f3f)), closes [#8714](https://github.com/driftyco/ionic/issues/8714)
* **tabs:** $tabs-md-tab-font-size is taken into account ([4be5d83](https://github.com/driftyco/ionic/commit/4be5d83)), closes [#8820](https://github.com/driftyco/ionic/issues/8820)
* **tabs:** regression in nav-controller-base ([d84d8a6](https://github.com/driftyco/ionic/commit/d84d8a6))
* **tap-click:** several improvements ([35d12ef](https://github.com/driftyco/ionic/commit/35d12ef))
* **templates:** suffix templates page [#8320](https://github.com/driftyco/ionic/issues/8320) ([#8368](https://github.com/driftyco/ionic/issues/8368)) ([61620f8](https://github.com/driftyco/ionic/commit/61620f8))
* **transition:** syntax of cubic-bezier easing ([813d945](https://github.com/driftyco/ionic/commit/813d945))
* **transition:** wrong easing ([09c08e9](https://github.com/driftyco/ionic/commit/09c08e9))


### Features

* **debug:** add IonicErrorHandler ([9397d6b](https://github.com/driftyco/ionic/commit/9397d6b))
* **tabs:** tabsHideOnSubPages can be modified per tab ([4f6a9b1](https://github.com/driftyco/ionic/commit/4f6a9b1))



<a name="2.0.0-rc.1"></a>
# [2.0.0-rc.1](https://github.com/driftyco/ionic/compare/v2.0.0-rc.0...v2.0.0-rc.1) (2016-10-13)

### Package.json Updates

`package.json` has been upated to include Angular dependencies and the latest version of app-scripts. Please update your package.json to reflect these changes and then run `npm install`.

```
  "dependencies": {
    "@angular/common": "2.0.0",
    "@angular/compiler": "2.0.0",
    "@angular/compiler-cli": "0.6.2",
    "@angular/core": "2.0.0",
    "@angular/forms": "2.0.0",
    "@angular/http": "2.0.0",
    "@angular/platform-browser": "2.0.0",
    "@angular/platform-browser-dynamic": "2.0.0",
    "@angular/platform-server": "2.0.0",
    "@ionic/storage": "1.0.3",
    "ionic-angular": "2.0.0-rc.1",
    "ionic-native": "2.2.3",
    "ionicons": "3.0.0",
    "rxjs": "5.0.0-beta.12",
    "zone.js": "0.6.21"
  },
  "devDependencies": {
    "@ionic/app-scripts": "^0.0.36",
    "typescript": "^2.0.3"
  },
```


### Bug Fixes

* **content:** move $text-ios-color to content ([#8421](https://github.com/driftyco/ionic/issues/8421)) ([91168af](https://github.com/driftyco/ionic/commit/91168af))
* **datetime-util:** add missing date property conditions ([2aea1cb](https://github.com/driftyco/ionic/commit/2aea1cb))
* **demos:** double quote in script tag ([424b9e0](https://github.com/driftyco/ionic/commit/424b9e0))
* **fab:** center fab list for larger buttons ([267a77b](https://github.com/driftyco/ionic/commit/267a77b))
* **fab:** not using change detection ([47e1e17](https://github.com/driftyco/ionic/commit/47e1e17)), closes [#8424](https://github.com/driftyco/ionic/issues/8424)
* **icon:** isActive="false" with ios mode ([bcbe03c](https://github.com/driftyco/ionic/commit/bcbe03c)), closes [#8435](https://github.com/driftyco/ionic/issues/8435)
* **input:** detect value when it is zero ([d02e14c](https://github.com/driftyco/ionic/commit/d02e14c)), closes [#8019](https://github.com/driftyco/ionic/issues/8019)
* **input:** text input width calculation ([#8063](https://github.com/driftyco/ionic/issues/8063)) ([21fa5cd](https://github.com/driftyco/ionic/commit/21fa5cd))
* **item:** regression in expandable sliding option button ([695d25c](https://github.com/driftyco/ionic/commit/695d25c)), closes [#8460](https://github.com/driftyco/ionic/issues/8460)
* **item:** sliding item should not close when clicking an option button ([ec6615d](https://github.com/driftyco/ionic/commit/ec6615d)), closes [#8481](https://github.com/driftyco/ionic/issues/8481)
* **item-divider:** fabs have higher z-index than item-dividers ([14e668c](https://github.com/driftyco/ionic/commit/14e668c)), closes [#8489](https://github.com/driftyco/ionic/issues/8489)
* **list:** consecutive inset lists with headers ([93616c4](https://github.com/driftyco/ionic/commit/93616c4)), closes [#8412](https://github.com/driftyco/ionic/issues/8412) [#6164](https://github.com/driftyco/ionic/issues/6164)
* **menu:** backdrop click without 300ms delay ([9bbe485](https://github.com/driftyco/ionic/commit/9bbe485)), closes [#6405](https://github.com/driftyco/ionic/issues/6405)
* **menu:** console.debug statements are one line ([a06bd69](https://github.com/driftyco/ionic/commit/a06bd69))
* **menu:** menu's content is resized properly ([db72a7d](https://github.com/driftyco/ionic/commit/db72a7d)), closes [#8504](https://github.com/driftyco/ionic/issues/8504)
* **modal:** alerts do not trigger modal lifecycle events ([e2704a4](https://github.com/driftyco/ionic/commit/e2704a4)), closes [#8616](https://github.com/driftyco/ionic/issues/8616)
* **modal:** canEnter is called in modals ([a40b42c](https://github.com/driftyco/ionic/commit/a40b42c))
* **nav:** ionViewCanLeave does not break navigation ([c8954d8](https://github.com/driftyco/ionic/commit/c8954d8)), closes [#8408](https://github.com/driftyco/ionic/issues/8408)
* **nav:** ionViewDidLoad is called in modals ([451ffe1](https://github.com/driftyco/ionic/commit/451ffe1)), closes [#8449](https://github.com/driftyco/ionic/issues/8449)
* **nav:** push-pop pages too quickly ([9b65022](https://github.com/driftyco/ionic/commit/9b65022)), closes [#8319](https://github.com/driftyco/ionic/issues/8319)
* **nav:** remove incorrectly used removeStart as a starting index in for loop. Fixes [#8442](https://github.com/driftyco/ionic/issues/8442) ([6496c7a](https://github.com/driftyco/ionic/commit/6496c7a))
* **navbar:** Don't fade out navbars. Fixes [#8060](https://github.com/driftyco/ionic/issues/8060) ([eab5726](https://github.com/driftyco/ionic/commit/eab5726))
* **popover:** flipped arrow on iOS ([#8462](https://github.com/driftyco/ionic/issues/8462)) ([c996d85](https://github.com/driftyco/ionic/commit/c996d85))
* **reorder:** not trigger click event when reordering ([9b2ae8a](https://github.com/driftyco/ionic/commit/9b2ae8a)), closes [#8362](https://github.com/driftyco/ionic/issues/8362)
* **reorder:** several reorder lists in the same view ([e75d9be](https://github.com/driftyco/ionic/commit/e75d9be))
* **ripple:** always remove the activated class ([d893441](https://github.com/driftyco/ionic/commit/d893441))
* **searchbar:** autocomplete, autocorrect and type works again ([7e63650](https://github.com/driftyco/ionic/commit/7e63650)), closes [#7744](https://github.com/driftyco/ionic/issues/7744)
* **searchbar:** clear button makes keyboard dismissal fail on iOS ([6aaa601](https://github.com/driftyco/ionic/commit/6aaa601)), closes [#7527](https://github.com/driftyco/ionic/issues/7527)
* **searchbar:** ENTER does not clear when it is inside a form ([2e1bb4b](https://github.com/driftyco/ionic/commit/2e1bb4b)), closes [#7010](https://github.com/driftyco/ionic/issues/7010)
* **segment:** add missing input ([0052480](https://github.com/driftyco/ionic/commit/0052480)), closes [#8371](https://github.com/driftyco/ionic/issues/8371)
* **spinner:** add input mode fix [#8598](https://github.com/driftyco/ionic/issues/8598) ([8ee895f](https://github.com/driftyco/ionic/commit/8ee895f))
* **spinner:** works in iOS8 ([a2ffa63](https://github.com/driftyco/ionic/commit/a2ffa63)), closes [#8145](https://github.com/driftyco/ionic/issues/8145)
* **tabs:** add TabHighlight to IONIC_DIRECTIVES ([ac88547](https://github.com/driftyco/ionic/commit/ac88547)), closes [#8294](https://github.com/driftyco/ionic/issues/8294)
* **tabs:** remove from parent nav when destroyed ([5156917](https://github.com/driftyco/ionic/commit/5156917))
* **tap-click:** null is not an object when scrolling after focusing an input on iOS ([21eae2e](https://github.com/driftyco/ionic/commit/21eae2e)), closes [#7964](https://github.com/driftyco/ionic/issues/7964)
* **transition:** ios-transition can be used in MD/WP ([fcc515f](https://github.com/driftyco/ionic/commit/fcc515f)), closes [#7171](https://github.com/driftyco/ionic/issues/7171)
* **view-controller:** dismiss does not crash when called more than once ([d5f71a4](https://github.com/driftyco/ionic/commit/d5f71a4)), closes [#8395](https://github.com/driftyco/ionic/issues/8395)
* **view-controller:** avoid deep copy in dismiss() that can turn into an infinite loop ([9227310](https://github.com/driftyco/ionic/commit/9227310))
* **virtual-scroll:** set this.approxItemHeight before update(true) is called first ([#8350](https://github.com/driftyco/ionic/issues/8350)) ([b16228b](https://github.com/driftyco/ionic/commit/b16228b))


### Features

* **events:** handler argument is optional in unsubscribe() ([8878e70](https://github.com/driftyco/ionic/commit/8878e70)), closes [#8235](https://github.com/driftyco/ionic/issues/8235)
* **haptic:** add haptic/taptic support to toggle/range/picker ([713e2a1](https://github.com/driftyco/ionic/commit/713e2a1))
* **infinite-scroll:** it can be enabled/disabled from a ng input ([#8385](https://github.com/driftyco/ionic/issues/8385)) ([fd5cdf0](https://github.com/driftyco/ionic/commit/fd5cdf0)), closes [#8380](https://github.com/driftyco/ionic/issues/8380)


### Performance Improvements

* **searchbar:** searchbar animation is disabled by default ([d03182e](https://github.com/driftyco/ionic/commit/d03182e)), closes [#6023](https://github.com/driftyco/ionic/issues/6023)



<a name="2.0.0-rc.0"></a>
# [2.0.0-rc.0](https://github.com/driftyco/ionic/compare/v2.0.0-beta.11...v2.0.0-rc.0) (2016-09-28)

RC0 requires changes to the structure of your app. To get started updating your app see the [Steps to Upgrade](#steps-to-upgrade-to-rc0) below.

* Ionic 2 API finalized for `2.0.0` release
* Angular `2.0.0` final!
* `ionViewCanEnter` / `ionViewCanLeave` lifecycle events
* Floating Action Button (FAB) lists
* Ahead of Time (AoT) compiler ready
* Components can now individually set a mode, which means an app can mix and match iOS / Material Design / Windows Platform modes if that’s desired
* Typescript 2.0
* `@types` support for third-party libraries
* Move away from `gulp` ([ionic-gulp-tasks](https://github.com/driftyco/ionic-gulp-tasks)) to `npm scripts` ([ionic-app-scripts](https://github.com/driftyco/ionic-app-scripts))
* Use [Rollup](http://rollupjs.org) for bundling instead of `browserify` or `webpack`


### BREAKING CHANGES

* Angular upgrade to [2.0.0](https://angular.io/docs/ts/latest/cookbook/rc4-to-rc5.html)
* [Renamed Lifecycle events](#lifecycle-events-renamed).
* Storage has been removed from `ionic-angular` and placed into a separate module, `@ionic/storage`. Starters have been updated to add this, make sure to add it to your `package.json` if you’re using the storage system. See more [details here](#storage).
* Nav transitions are queued. For more info on what this means for you see [this section](#nav-transitions).
* Removed Tabs `preloadTabs` ability. This is no longer needed with the Ahead of Time (AoT) compiler.
* Icons in buttons require an attribute on the parent button in order to style them.
* Platform and mode CSS classes have been moved from the `<body>` element to the `<ion-app>` element.
* Select’s `alertOptions` input has been renamed to `selectOptions`. See more [details here](#select-changes).
* Colors should be passed in the `color` input on components, not added individually as an attribute on the component. See more [details here](#component-colors).
* buttons: `<button>` becomes `<button ion-button>`. See more [details here](#new-behavior-of-button) and [here](#new-behavior-of-icons-in-buttons).
* Head link tags for CSS files are no longer dynamically updated, but one CSS file is imported.
(Future build processes will narrow down the CSS file further to only include what’s used). See more [details here](#update-css-link-tags).
* The `<scroll-content>` element, which is internal to `<ion-content>`, has been renamed to `<div class="scroll-content">` since it was neither a directive nor a web component.
* `<ion-fixed>` has been removed, use `<div ion-fixed>` instead.
* Sass: Changes to how Sass is imported. See more [details here](#sass-import).
* Typings: We have stopped using the `typings` tool and have migrated to `npm @types`. See more [details here](#typings).
* Components no longer get a CSS class added based on the component class name. This should be added using the Component selector. See the [Steps to Upgrade](#steps-to-upgrade-to-rc0) for more information on this change.


#### Lifecycle Events Renamed

* Renamed `ionViewLoaded` to `ionViewDidLoad`
* Removed `ionViewDidUnload`
* Removed `fireOtherLifecycles` from `ViewController`


#### Nav Transitions

Nav transitions are now queued. Meaning if you run:

```
navCtrl.push(Page1);
navCtrl.push(Page2);
```

`Page1` will transition in, then immediately `Page2` will transition in. There can never be two transitions happening at the same time.

Page transition promises can now possibly reject the returned promises. Used mainly for `ionViewCanEnter` and `ionViewCanLeave`.


#### Component Colors

Colors are no longer added directly to a component, they should instead be passed in the `color` attribute.

For example:

```
<ion-tabs primary>
```

Becomes

```
<ion-tabs color="primary">
```

Or to bind an expression to color:

```
<ion-navbar [color]="barColor">
   ...
</ion-navbar>
```

```ts
@Component({
  templateUrl: 'build/pages/about/about.html'
})
export class AboutPage {
  barColor: string;

  constructor(private nav: NavController, platform: Platform) {
    this.barColor = platform.is('android') ? 'primary' : 'light';
  }
}
```

Components with this property:
- Badge
- Button
- Checkbox
- Chip
- FAB
- Icon
- Item (Item, Item Divider, List Header)
- Label
- Navbar
- Radio
- Searchbar
- Segment
- Spinner
- Tabs
- Toggle
- Toolbar
- Typography (headers, paragraphs, spans, etc.)

**Reason for this change:**
- It was difficult to dynamically add colors to components, especially if the name of the color attribute was unknown in the template.
- This change keeps the css flat since we aren’t chaining color attributes on components and instead we assign a class to the component which includes the color’s name.
- This allows you to easily toggle a component between multiple colors.
- Speeds up performance because we are no longer reading through all of the attributes to grab the color ones.


#### Select Changes

Select’s `alertOptions` input has been renamed to `selectOptions`. It now allows you to pass options for either the alert or action-sheet interface. Refer to their documentation for the options each of them accept.

- [ActionSheet](http://ionicframework.com/docs/v2/api/components/action-sheet/ActionSheetController/#create)
- [Alert](http://ionicframework.com/docs/v2/api/components/alert/AlertController/#create)


#### New Behavior of Button

- `<button>` becomes `<button ion-button>`
- `<a button>` becomes `<a ion-button>`
- `<button ion-item>` does not get the `ion-button` attribute
- Buttons inside of `<ion-item-options>` do get the `ion-button` attribute
- Removed the `category` attribute, this should be passed in
`ion-button` instead.

**Reason for this change:**
- It was difficult to have custom buttons since buttons automatically received the Ionic styles. The user can now take advantage of adding their own styling to a button if they want it to behave differently than the Ionic button.
Keeping the `<a>` and `<button>` element and adding `ion-button` as an attribute gives us the ability to take advantage of the native functionality and built-in accessibility of native elements. If Ionic provided an `<ion-button>` we’d have to copy over all the possible attributes and events to the real nested button/link (`type=submit`, `formnovalidate`, `value`, `autofocus`, `href`, `target`, `focus`/`blur`, `download`, `nofollow`, `ping`, etc). Additionally, Angular 2 does not have the "replace" directive where `<ion-button>` could be turned into `<a ion-button>`.
- Since `button` was already being used as an attribute to the `<a>` element, this is more consistent between the two.
- If a navPush or navPop directive is on an `<a ion-button>`, Ionic can automatically add the `href` attribute.
- [A few reasons why we didn’t create `<ion-button>`](https://www.youtube.com/watch?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&v=CZGqnp06DnI)


#### New Behavior of Icons in Buttons

1. Icon only buttons

  ```
  <button>
    <ion-icon name="rainy"></ion-icon>
  </button>
  ```

  becomes

  ```
  <button ion-button icon-only>
    <ion-icon name="rainy"></ion-icon>
  </button>
  ```

2. Icon left of text in a button

  ```
  <button>
    <ion-icon name="rainy"></ion-icon>
    Rainy
  </button>
  ```

  becomes

  ```
  <button ion-button icon-left>
    <ion-icon name="rainy"></ion-icon>
    Rainy
  </button>
  ```

3. Icon right of text in a button

  ```
  <button>
    Rainy
    <ion-icon name="rainy"></ion-icon>
  </button>
  ```

  becomes

  ```
  <button ion-button icon-right>
    Rainy
    <ion-icon name="rainy"></ion-icon>
  </button>
  ```

4. Item option buttons - the `icon-left` attribute should still be added to the `<ion-item-options>` container and not the button itself.
5. `menuToggle` buttons should not get the `icon-only` attribute

**Reason for this change:**
There was a noticeable performance decrease from us reading in each button to determine where icons were placed and how to style them. This change improves performance. This adds styling so that the buttons and icons will be padded a certain amount, but the user is free to leave these attributes off and style the components themselves.


#### Update CSS Link Tags

Ionic stylesheets are no longer dynamically loaded per platform. Instead there will be one CSS file to import. Note that future build processes will slim down the CSS file even further to only include component CSS actually used.

In the head of your `index.html` file, replace:

```
<!-- ionic dynamically decides which stylesheet to load -->
<link ios-href="build/css/app.ios.css" rel="stylesheet">
<link md-href="build/css/app.md.css" rel="stylesheet">
<link wp-href="build/css/app.wp.css" rel="stylesheet">
```

With:

```
<link href="build/main.css" rel="stylesheet">
```


#### Sass Import

The default configuration will be updated, but if your existing app is using Sass and importing Ionic Sass files directly you’ll need to update the `includePaths` of Node Sass.

```
node_modules/ionic-angular/themes
```

Next, to include Ionic into your custom Sass file you’ll need to update the Ionic import to this:

```
@import "ionic.theme.default";
```


#### Typings

Any type definitions for third party libraries that are included via the `typings` tool and are included in the the `typings.json` file should be updated to use `npm @types`. An example of how this looks is:

```
npm install @types/lodash --save-dev --save-exact
```

Delete the `typings.json` file, and the `typings` directory.


#### Storage

The storage utilities have been moved outside of the framework to a separate library called `@ionic/storage`.

This library can be installed by executing the following command:

```
npm install @ionic/storage --save --save-exact
```

It must be included in the app's `NgModule` list of `providers`:

```
import { Storage } from '@ionic/storage';

...

@NgModule({
  ...
  providers: [Storage]
})

```

It can then be injected into any class that needs access to it:

```
import { Storage } from '@ionic/storage';

...

export class MyAwesomePage {
  constructor(public storage: Storage) {
  }

  ionViewDidEnter() {

    this.storage.get('myKey').then( (value:any) => {
      console.log('My value is:', value);
    });
  }
}
```


#### Deployment Changes

`ionic-angular` package includes es5 code with es2015 module import/exports, `umd` modules, and pure `es2015` code. The `package.json` is set up using the `main` and `module` options to make this work seamlessly.


### Steps to Upgrade to RC0

We are providing 2 ways to update your app with this release: [Copying your Project to a New Project](#copying-your-project-to-a-new-project) and [Modifying your Existing Project](#modifying-your-existing-project). The first way will guide you through creating a new Ionic 2 project and copying your project files to it. This is the easiest way to update your app in our opinion. The second way will step through how to update your existing project. There are a lot of steps involved with this way, and we recommend viewing our conference app for any clarification if you choose this way. This is it! We don’t plan on making any more major API changes after this version.

Note: For details on NgModules you can read the Angular docs on them [here](https://angular.io/docs/ts/latest/guide/ngmodule.html)

#### Copying your Project to a New Project

1. Ensure that you're using npm version 3.x by running:

  ```
  npm --version
  ```

  If you are not running 3.x, the easiest way to update is to install the [latest version of Node.js](https://nodejs.org/en/).

  You can also update `npm` by following [these instructions](https://docs.npmjs.com/getting-started/installing-node#updating-npm).

2. Install the latest Ionic CLI:

  **Important:** if you have installed the `beta` cli you should run `npm uninstall -g ionic` first. You need version `2.1.0` for this release. Check your `cli` version by running `ionic -v` in the command line.

  ```
  npm install -g ionic
  ```

3. Create a new Ionic 2 RC0 app:

  ```
  ionic start --v2 myApp
  ```

4. Copy/paste all of your pages from `app/pages/` of your `beta.11` app to `src/pages/`, providers from `app/providers` to `src/providers`, pipes from `app/pipes` to `src/pipes` and any custom components to `src/components` in the new RC0 app.

5. Modify all `templateUrl`'s to be relative to the `.ts` file. For example in `app.component.ts` the url should change from `build/app.html` to `app.html` and in a page referencing `about.html` from `build/pages/about/about.html` to `about.html`.

6. Import and add each of your pages to the `declarations` array and the `entryComponents` array in `src/app/app.module.ts`.

7. Import and add each of your custom components and pipes to the `declarations` array in `src/app/app.module.ts`.

8. Import and add each of your providers to the `providers` array in `src/app/app.module.ts`.

9. Remove any use of the `providers`, `pipes` and `directives` arrays in `@Component`.

10. Change any uses of the `private` TypeScript keyword to `public` ONLY for component variables that are needed in the associated template.

  Note: For details as to why this change has to be made, there is a discussion about it [here](https://forum.ionicframework.com/t/rc0-typescript-private-vs-public-keyword/64863/4?u=mhartington).

11. Change `<button>` to `<button ion-button>` according to [these instructions](#new-behavior-of-button).

12. Pass colors to the `color` attribute : `<button primary>` changes to `<button color="primary">`. See [component colors](#component-colors) above.

13. Move any Ionic config to the `IonicModule.forRoot` in `app.module.ts`. For example, the config should go where it says `configObject` here: `IonicModule.forRoot(MyApp, {configObject})`.

14. Move any variables from the mode specific sass files in your `beta.11` app into the `theme/variables.scss` file under each comment section for the specific mode in the new RC0 app: [ios section](https://github.com/driftyco/ionic2-app-base/blob/master/src/theme/variables.scss#L35-L37), [md section](https://github.com/driftyco/ionic2-app-base/blob/master/src/theme/variables.scss#L42-L44), [wp section](https://github.com/driftyco/ionic2-app-base/blob/master/src/theme/variables.scss#L49-L51).

15. Add selectors to each of your components that you would like to add custom styling for. These element selectors will be used for scoped sass. Previously a CSS class was dynamically added with the component class name, this is now the proper way to scope your sass for an individual page. For example, adding the `page-about` selector:

  In your component's stylesheet:

  ```
  page-about {
    #title {
      color: blue;
    }
  }
  ```

  In your component:

  ```
  @Component({
    selector: 'page-about',
    templateUrl: 'about.html'
  })
  ```


#### Modifying your Existing Project

1. Ensure that you're using npm version 3.x by running:

  ```
  npm --version
  ```

  If you are not running 3.x, the easiest way to update is to install the [latest version of Node.js](https://nodejs.org/en/).

  You can also update `npm` by following [these instructions](https://docs.npmjs.com/getting-started/installing-node#updating-npm).

2. Install the latest Ionic CLI:

  **Important:** if you have installed the `beta` cli you should run `npm uninstall -g ionic` first. You need version `2.1.0` for this release. Check your `cli` version by running `ionic -v` in the command line.

  ```
  npm install -g ionic
  ```

3. Update `package.json` dependencies and devDependencies to match the [ionic2-app-base package.json](https://github.com/driftyco/ionic2-app-base/blob/master/package.json#L15-L24), and then run `npm install` in your project folder.

4. Copy the `npm scripts` from the [ionic2-app-base package.json](https://github.com/driftyco/ionic2-app-base/blob/master/package.json#L6-L14) to your `package.json`.

5. Delete the `gulpfile.js`.

6. Rename the `app` folder to `src`.

7. Create a new directory called `app` inside of `src`.

8. Move the `app.html` and `app.ts` files inside of `src/app`.

9. Rename `app.ts` to `app.component.ts`.

10. Add an `app.module.ts` file and copy content from [ionic2-starter-blank](https://github.com/driftyco/ionic2-starter-blank/blob/master/src/app/app.module.ts).

11. Move any providers from `ionicBootstrap` in your `app.component.ts` file to the providers in `app.module.ts`. Make sure to copy imports, too.

12. Import and add any of your custom components to the `declarations` array in `src/app/app.module.ts`.

13. Move any Ionic config to the `IonicModule.forRoot` in `app.module.ts`. For example, the config should go where it says `configObject` here: `IonicModule.forRoot(MyApp, {configObject})`.

14. Remove the `ionicBootstrap` code from `app.component.ts`.

15. Export the main app class in `app.component.ts` and then rename all uses of `MyApp` in `app.module.ts` to your main app class (or rename the export to `MyApp` in `app.component.ts`).

16. Fix any imports in `app.component.ts` to use the correct path. For example, `./pages` becomes `../pages`.

17. Modify `app.module.ts` to import your page specific classes. See `HomePage`, for example. All pages should be included here.

18. Fix any import paths in `app.module.ts`. For example, `./providers` becomes `../providers`.

19. Add `main.dev.ts` and `main.prod.ts` files from [ionic2-app-base](https://github.com/driftyco/ionic2-app-base/tree/master/src/app) to `app/`.

20. Move `www/index.html` to `src/index.html` and modify it to look like [ionic2-app-base](https://github.com/driftyco/ionic2-app-base/blob/master/src/index.html), make sure to keep any external scripts you have added.

21. Move `www/assets` to `src/assets`.

22. Move `www/img` to `src/assets/img`.

23. Move any other resources you have in `www/` to `src/assets/`.

24. Modify all `templateUrl`'s to be relative to the `.ts` file. For example in `app.component.ts` the url should change from `build/app.html` to `app.html` and in a page referencing `about.html` from `build/pages/about/about.html` to `about.html`.

25. Update .gitignore to match [ionic2-app-base](https://github.com/driftyco/ionic2-app-base/blob/master/.gitignore).

26. Delete the `typings/` folder and `typings.json` file.

27. Update `tsconfig.json` to match [ionic2-app-base](https://github.com/driftyco/ionic2-app-base/blob/master/tsconfig.json).

28. Rename and relocate `app/theme/app.variables.scss` to `src/theme/variables.scss`.

29. Move app Sass rule files from `app/theme` to `src/app`. This includes `app.core.scss`, `app.ios.scss`, etc.

30. Move any variables from the mode specific sass files in your `beta.11` app into the `theme/variables.scss` file under each comment section for the specific mode in the new RC0 app: [ios section](https://github.com/driftyco/ionic2-app-base/blob/master/src/theme/variables.scss#L35-L37), [md section](https://github.com/driftyco/ionic2-app-base/blob/master/src/theme/variables.scss#L42-L44), [wp section](https://github.com/driftyco/ionic2-app-base/blob/master/src/theme/variables.scss#L49-L51).

31. Fix any paths to images in your app. For example, before the path may look like `<img src="img/myImg.png">` and now it should be `<img src="assets/img/myImg.png">`.

32. Change any uses of the `private` TypeScript keyword to `public` ONLY for component variables that are needed in the associated template.

  Note: For details as to why this change has to be made, there is a discussion about it [here](https://forum.ionicframework.com/t/rc0-typescript-private-vs-public-keyword/64863/4?u=mhartington).

33. Change any Ionic buttons from `<button>` to `<button ion-button>`. [See New Behavior of Button](#new-behavior-of-button).

34. Pass colors to the `color` attribute: `<button primary>` changes to `<button color="primary">`.

35. Add appropriate icon attributes, if the icon is on the left of the text in a button it should get `icon-left`, if the icon is on the right add `icon-right`, and if the button only has an icon in it, add the `icon-only` attribute to the button. [See New Behavior of Icons in Buttons](#new-behavior-of-icons-in-buttons).

36. Add selectors to each of your components that you would like to add custom styling for. These element selectors will be used for scoped sass. Previously a CSS class was dynamically added with the component class name, this is now the proper way to scope your sass for an individual page. For example, adding the `page-about` selector:

  In your component's stylesheet:

  ```
  page-about {
    #title {
      color: blue;
    }
  }
  ```

  In your component:

  ```
  @Component({
    selector: 'page-about',
    templateUrl: 'about.html'
  })
  ```

37. Remove any use of the `providers`, `pipes` and `directives` arrays in `@Component`.

### Bug Fixes

* **action-sheet:** add icon-left to the button if an icon exists ([a731528](https://github.com/driftyco/ionic/commit/a731528))
* **animation:** prevent possible raf null errors ([0e8ebe5](https://github.com/driftyco/ionic/commit/0e8ebe5))
* **app:** corrected paths to theme from app.scss ([001c1c9](https://github.com/driftyco/ionic/commit/001c1c9))
* **checkbox:** disabled toggle should not fire events or animate ([3324e32](https://github.com/driftyco/ionic/commit/3324e32))
* **di:** update dependency injection and default configs ([7c05d0c](https://github.com/driftyco/ionic/commit/7c05d0c))
* **exports:** update module exports ([6784f5e](https://github.com/driftyco/ionic/commit/6784f5e))
* **fab:** colors in speed dial buttons ([b70614b](https://github.com/driftyco/ionic/commit/b70614b))
* **gestures:** fixes scroll issue with hammer config ([174efc1](https://github.com/driftyco/ionic/commit/174efc1)), closes [#6897](https://github.com/driftyco/ionic/issues/6897)
* **ion-fixed:** ion-fixed directive is not longer needed ([75d5526](https://github.com/driftyco/ionic/commit/75d5526))
* **item:** regression in sliding item introduced by 52ada1c ([e0c2129](https://github.com/driftyco/ionic/commit/e0c2129))
* **item:** sliding item events are zone wrapped ([47491fb](https://github.com/driftyco/ionic/commit/47491fb)), closes [#7630](https://github.com/driftyco/ionic/issues/7630)
* **item:** sliding item with icon-only buttons ([1d3d5a1](https://github.com/driftyco/ionic/commit/1d3d5a1))
* **menu:** open/close race condition ([8585427](https://github.com/driftyco/ionic/commit/8585427)), closes [#7629](https://github.com/driftyco/ionic/issues/7629) [#8001](https://github.com/driftyco/ionic/issues/8001)
* **nav:** move null assignment of `_onWillDismiss` ([35193c4](https://github.com/driftyco/ionic/commit/35193c4))
* **nav:** setRoot() and setPages() should not animate ([7012734](https://github.com/driftyco/ionic/commit/7012734))
* **nav:** move onWillDismiss and onDidDismiss, add unit tests ([e26c425](https://github.com/driftyco/ionic/commit/e26c425))
* **platform:** fire platform ready on app init ([963e835](https://github.com/driftyco/ionic/commit/963e835))
* **reorder:** adjust reorder icon style for iOS and MD ([f3bb2dc](https://github.com/driftyco/ionic/commit/f3bb2dc))
* **templates:** add template tabs [#8207](https://github.com/driftyco/ionic/issues/8207) ([#8208](https://github.com/driftyco/ionic/issues/8208)) ([0f6ce28](https://github.com/driftyco/ionic/commit/0f6ce28))
* **urlSerializer:** improve findLinkByComponentData ([9d563f5](https://github.com/driftyco/ionic/commit/9d563f5))


### Code Refactoring

* **button:** add ion-button attribute and icon attributes to style buttons ([938864e](https://github.com/driftyco/ionic/commit/938864e)), closes [#7466](https://github.com/driftyco/ionic/issues/7466)
* **colors:** color should be added as an input instead of directly adding the color to the component ([55a0257](https://github.com/driftyco/ionic/commit/55a0257)), closes [#7087](https://github.com/driftyco/ionic/issues/7087) [#7401](https://github.com/driftyco/ionic/issues/7401) [#7523](https://github.com/driftyco/ionic/issues/7523)
* **select:** rename alertOptions to selectOptions, add ability to pass them for action-sheet ([b8285b7](https://github.com/driftyco/ionic/commit/b8285b7)), closes [#7764](https://github.com/driftyco/ionic/issues/7764)


### Features

* **action-sheet:** add ability to pass multiple classes to cssClass ([68ab261](https://github.com/driftyco/ionic/commit/68ab261))
* **chips:** added Chip component ([421f637](https://github.com/driftyco/ionic/commit/421f637))
* **chips:** finished Component ([0dece72](https://github.com/driftyco/ionic/commit/0dece72))
* **fab:** update floating action buttons ([490a06d](https://github.com/driftyco/ionic/commit/490a06d))
* **reorder:** animate reorder button ([1f78487](https://github.com/driftyco/ionic/commit/1f78487))
* **loading:** add ability to pass multiple classes to cssClass ([466dea3](https://github.com/driftyco/ionic/commit/466dea3))
* **loading:** add setContent function ([c750847](https://github.com/driftyco/ionic/commit/c750847))
* add polyfill task ([ce78194](https://github.com/driftyco/ionic/commit/ce78194))
* **nav:** component url navigation ([f477aa2](https://github.com/driftyco/ionic/commit/f477aa2))
* **nav:** set default stack history on app init ([ca8cc0a](https://github.com/driftyco/ionic/commit/ca8cc0a))
* **polyfills:** split up code and source polyfill task ([#8130](https://github.com/driftyco/ionic/issues/8130)) ([bcec66c](https://github.com/driftyco/ionic/commit/bcec66c))
* **popover:** add ability to pass multiple classes to cssClass ([a685cdc](https://github.com/driftyco/ionic/commit/a685cdc))
* **toast:** add ability to pass multiple classes to cssClass ([79e25a3](https://github.com/driftyco/ionic/commit/79e25a3))


### Performance Improvements

* **item:** apply will-change only when list is active ([4bcd815](https://github.com/driftyco/ionic/commit/4bcd815))
* **reorder:** reorder icon is display: none by default ([26441ec](https://github.com/driftyco/ionic/commit/26441ec))
* **ripple:** md ripple effect update to not affect layout ([14a3ea2](https://github.com/driftyco/ionic/commit/14a3ea2))

<a name="2.0.0-beta.11"></a>
# [2.0.0-beta.11](https://github.com/driftyco/ionic/compare/v2.0.0-beta.10...v2.0.0-beta.11) (2016-08-05)

### BREAKING CHANGES

- Angular2 has been updated to [RC4](https://github.com/angular/angular/blob/master/CHANGELOG.md#200-rc4-2016-06-30).
- ViewController’s `onDismiss` has been renamed to `onDidDismiss`
- Forms have been upgraded to `@angular/forms` - [Angular2 Forms Changes](https://docs.google.com/document/u/1/d/1RIezQqE4aEhBRmArIAS1mRIZtWFf6JxN_7B4meyWK0Y/pub).
- [Overlay components](#overlays) should now be created with their injected provider.
- The [Select Options](#select--option-7334) `checked` attribute has been renamed to `selected`.
- [Tab’s input and config variables](#tab-inputconfig-7143) have been renamed.
- [Material Design tabs](#material-design-tabs-7455) have been updated to resemble Material Design’s bottom navigation spec: https://material.google.com/components/bottom-navigation.html
- [Input highlight](#input-highlight-6449) was added as an option for `ios` and `wp` mode, but defaults to false.
- Please review the [Steps to Upgrade](#steps-to-upgrade-to-beta-11) below.

#### Overlays

- Overlay components, such as Alert or Modals, should now be created using its injected provider.
- Overlays now have the `present()` method on the overlay’s instance, rather than using `nav.present(overlayInstance)`.
- All overlays now present on top of all app content, to include menus.
- Below is an example of the change to `Alert`, but the pattern is the same for all overlays: ActionSheet, Loading, Modal, Picker, Popover, Toast

  WAS:

  ```
  import { NavController, Alert } from ‘ionic-angular’;

  constructor(public nav: NavController) {
  }

  doAlert() {
    let alert = Alert.create({
       title: 'Alert',
    });
    this.nav.present(alert);
  }
  ```

  NOW:

  ```
  import { AlertController } from ‘ionic-angular’;

  constructor(public alertCtrl: AlertController) {
  }

  doAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert'
    });
    alert.present();
  }
  ```


#### Select / Option [#7334](https://github.com/driftyco/ionic/issues/7334)

The Option component’s `checked` attribute has been renamed to `selected` in order to make an option selected. This follows the MDN spec for a select option: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option

If a `ngModel` is added to the Select component the value of the `ngModel` will take precedence over the `selected` attribute.

See the [Select](http://ionicframework.com/docs/v2/api/components/select/Select/) and [Option](http://ionicframework.com/docs/v2/api/components/option/Option/) documentation for usage examples.

#### Tab Input/Config [#7143](https://github.com/driftyco/ionic/issues/7143)

Tab input/config options have been renamed. The following options were
renamed:

- `tabbarHighlight` -> `tabsHighlight`
- `tabbarLayout` -> `tabsLayout`
- `tabSubPages` -> `tabsHideOnSubPages`
- `tabbarPlacement` -> `tabsPlacement`

The previous names have been deprecated. They will still work in the
current release but will be removed in the future so please update to
the new names.

#### Material Design Tabs [#7455](https://github.com/driftyco/ionic/issues/7455)

Material Design mode defaults have changed to the following:

```
tabsHighlight: false,
tabsPlacement: 'bottom',
tabsHideOnSubPages: false
```

`tabsHighlight` can now be passed as an attribute on the `ion-tabs` element, this allows for tabs to be added in multiple places inside of an app and enable the highlight on some of them.

Styling of the Material Design tabs reflects the spec for bottom navigation: https://material.google.com/components/bottom-navigation.html

To get the old style of tabs, override the config in your bootstrap, for example:

```
ionicBootstrap(ConferenceApp, [ConferenceData, UserData], {
  platforms: {
    android: {
      tabsPlacement: 'top',
      tabsHideOnSubPages: true,
      tabsHighlight: true
    }
  }
});
```

And optionally override any of the Sass variables for `md` mode in `theme/app.md.scss`:

```
$tabs-md-tab-text-capitalization: uppercase;
$tabs-md-tab-font-weight: 500;
$tabs-md-tab-text-transform: scale(1);
```

For a searchable list of all of the Sass variables, see the theming documentation: http://ionicframework.com/docs/v2/theming/overriding-ionic-variables/


#### Input Highlight [#6449](https://github.com/driftyco/ionic/issues/6449)

Fixed typos in the input highlight variables:
- `$text-input-md-hightlight-color-valid` -> `$text-input-md-highlight-color-valid`
- `$text-input-wp-hightlight-color-valid` -> `$text-input-wp-highlight-color-valid`

Modified variables to turn on/off the highlight:

ios (defaults to false for all):

```
$text-input-ios-show-focus-highlight: false !default;
$text-input-ios-show-valid-highlight: $text-input-ios-show-focus-highlight !default;
$text-input-ios-show-invalid-highlight: $text-input-ios-show-focus-highlight !default;
```

md (defaults to true for all):

```
$text-input-md-show-focus-highlight: true !default;
$text-input-md-show-valid-highlight: $text-input-md-show-focus-highlight !default;
$text-input-md-show-invalid-highlight: $text-input-md-show-focus-highlight !default;
```

wp (defaults to true for all):

```
$text-input-wp-show-focus-highlight: true !default;
$text-input-wp-show-valid-highlight: $text-input-wp-show-focus-highlight !default;
$text-input-wp-show-invalid-highlight: $text-input-wp-show-focus-highlight !default;
```

#### Steps to Upgrade to Beta 11

1. Run the following command in a terminal to update the npm dependencies:

  ```
  npm install --save --save-exact ionic-angular@2.0.0-beta.11 @angular/common@2.0.0-rc.4 @angular/compiler@2.0.0-rc.4 @angular/core@2.0.0-rc.4 @angular/http@2.0.0-rc.4 @angular/platform-browser@2.0.0-rc.4 @angular/platform-browser-dynamic@2.0.0-rc.4 @angular/forms@0.2.0 rxjs@5.0.0-beta.6 zone.js@0.6.12
  ```

2. Update all Overlay components to be presented by their controller instead of `NavController`. For example, to update the popover component, the following code:

  ```
  constructor(private nav: NavController) {}

  presentPopover(event) {
    let popover = Popover.create(PopoverPage);
    this.nav.present(popover, { ev: event });
  }
  ```

  becomes:

  ```
  constructor(private popoverCtrl: PopoverController) {}

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ ev: event });
  }
  ```

3. Update any uses of `ViewController.onDismiss` to `ViewController.onDidDismiss`. The following code on dismiss of a modal:

  ```
  modal.onDismiss(() => {

  });
  ```

  becomes:

  ```
  modal.onDidDismiss(() => {

  });
  ```

4. Update any uses of `checked` on an `<ion-option>` to use `selected`.

5. If you are using any of the tab config variables, update them to reflect the new names [above](#tab-inputconfig-7143).

6. If you are using any of the Sass Variables to override [tabs](#material-design-tabs-7455) or [input highlights](#input-highlight-6449), update them to reflect the new names above.

7. Please see the [Ionic Conference App](https://github.com/driftyco/ionic-conference-app) for an example of upgrading to Beta 11.


### Bug Fixes

* **activator:** do not activate elements while scrolling ([845a516](https://github.com/driftyco/ionic/commit/845a516)), closes [#7141](https://github.com/driftyco/ionic/issues/7141)
* **animation:** ele as string selector ([9fa31a1](https://github.com/driftyco/ionic/commit/9fa31a1))
* **animation:** fix easing timing function ([0cb093e](https://github.com/driftyco/ionic/commit/0cb093e)), closes [#7130](https://github.com/driftyco/ionic/issues/7130)
* **app:** add status bar padding when tab subpages are hidden ([d01ee4b](https://github.com/driftyco/ionic/commit/d01ee4b)), closes [#7203](https://github.com/driftyco/ionic/issues/7203)
* **backdrop:** flicker in UIWebView ([44ab527](https://github.com/driftyco/ionic/commit/44ab527))
* **backdrop:** use raf when adding/removing disable-scroll css ([941cb1d](https://github.com/driftyco/ionic/commit/941cb1d))
* **bootstrap:** return promise and resolve ionicBootstrap ([aebdf2f](https://github.com/driftyco/ionic/commit/aebdf2f)), closes [#7145](https://github.com/driftyco/ionic/issues/7145)
* **bootstrap:** tapclick is injected, probably ([7358072](https://github.com/driftyco/ionic/commit/7358072))
* **button:** apply css for buttons w/ ngIf ([816a648](https://github.com/driftyco/ionic/commit/816a648)), closes [#5927](https://github.com/driftyco/ionic/issues/5927)
* **button:** outline buttons do not have hairline borders in iOS ([4e88f89](https://github.com/driftyco/ionic/commit/4e88f89))
* **datetime:** format seconds token ([4fff262](https://github.com/driftyco/ionic/commit/4fff262)), closes [#6951](https://github.com/driftyco/ionic/issues/6951)
* **datetime-util:** fix convertDataToISO to handle negative timezone offsets ([ba53a23](https://github.com/driftyco/ionic/commit/ba53a23))
* **generator:** change nav to navCtrl ([b19547c](https://github.com/driftyco/ionic/commit/b19547c))
* **gestures:** detecting swipe angle correctly + sliding item logic fix ([d230cb4](https://github.com/driftyco/ionic/commit/d230cb4))
* **input:** add input highlight for ios, fix the highlight size ([11a24b9](https://github.com/driftyco/ionic/commit/11a24b9)), closes [#6449](https://github.com/driftyco/ionic/issues/6449)
* **item:** sliding item is closed when tapped ([7aa559a](https://github.com/driftyco/ionic/commit/7aa559a)), closes [#7094](https://github.com/driftyco/ionic/issues/7094)
* **loading:** clear timeout if dismissed before timeout fires ([5bbe31a](https://github.com/driftyco/ionic/commit/5bbe31a))
* **loading:** fix loading overlay during app init ([b615c60](https://github.com/driftyco/ionic/commit/b615c60)), closes [#6209](https://github.com/driftyco/ionic/issues/6209)
* **menu:** add statusbarPadding to the header and content in a menu ([a468fde](https://github.com/driftyco/ionic/commit/a468fde)), closes [#7385](https://github.com/driftyco/ionic/issues/7385)
* **menu:** fix content going under header ([3cd31c3](https://github.com/driftyco/ionic/commit/3cd31c3)), closes [#7084](https://github.com/driftyco/ionic/issues/7084)
* **menu:** getBackdropElement ([cac1d4f](https://github.com/driftyco/ionic/commit/cac1d4f))
* **menu:** only one menu can be opened at a time ([cac378f](https://github.com/driftyco/ionic/commit/cac378f)), closes [#6826](https://github.com/driftyco/ionic/issues/6826)
* **menu:** swipe menu is triggered when the swipe |angle| < 40º ([32a70a6](https://github.com/driftyco/ionic/commit/32a70a6))
* **nav:** fire lifecycle events from app root portal ([a4e393b](https://github.com/driftyco/ionic/commit/a4e393b))
* **nav:** fix menuCtrl reference in swipe back ([55a5e83](https://github.com/driftyco/ionic/commit/55a5e83))
* **nav:** register child nav when created from modal ([61a8625](https://github.com/driftyco/ionic/commit/61a8625))
* **picker:** fix iOS 8 picker display ([86fd8a4](https://github.com/driftyco/ionic/commit/86fd8a4)), closes [#7319](https://github.com/driftyco/ionic/issues/7319)
* **popover:** remove min-height from ios, add sass variables ([55bc32d](https://github.com/driftyco/ionic/commit/55bc32d)), closes [#7215](https://github.com/driftyco/ionic/issues/7215)
* **range:** add mouse listeners to document ([267ced6](https://github.com/driftyco/ionic/commit/267ced6))
* **range:** align the label in an item range to the center ([d675d39](https://github.com/driftyco/ionic/commit/d675d39)), closes [#7046](https://github.com/driftyco/ionic/issues/7046)
* **range:** ion-label stacked with ion-range ([5a8fe82](https://github.com/driftyco/ionic/commit/5a8fe82)), closes [#7046](https://github.com/driftyco/ionic/issues/7046)
* **range:** set ticks to an empty array to prevent errors ([7a2ad99](https://github.com/driftyco/ionic/commit/7a2ad99))
* **reorder:** better style ([f289ac6](https://github.com/driftyco/ionic/commit/f289ac6))
* **reorder:** canceled reorder is animated smoothly back ([8483a43](https://github.com/driftyco/ionic/commit/8483a43))
* **reorder:** non ion-item elements can be reordered ([ea9dd02](https://github.com/driftyco/ionic/commit/ea9dd02)), closes [#7339](https://github.com/driftyco/ionic/issues/7339)
* **reorder:** reorder can be used with any element ([d993a1b](https://github.com/driftyco/ionic/commit/d993a1b))
* **scroll:** fix scrolling after switching tabs ([e4bbcc6](https://github.com/driftyco/ionic/commit/e4bbcc6)), closes [#7154](https://github.com/driftyco/ionic/issues/7154)
* **select:** add the cssClass passed by the user to the alert for a select ([81ddd7f](https://github.com/driftyco/ionic/commit/81ddd7f)), closes [#6835](https://github.com/driftyco/ionic/issues/6835)
* **slides:** delay loading slides until view ready ([580b8d5](https://github.com/driftyco/ionic/commit/580b8d5)), closes [#7089](https://github.com/driftyco/ionic/issues/7089)
* **sliding:** much better UX + performance ([d6f62bc](https://github.com/driftyco/ionic/commit/d6f62bc)), closes [#6913](https://github.com/driftyco/ionic/issues/6913) [#6958](https://github.com/driftyco/ionic/issues/6958)
* **tabs:** add sass variable for inactive opacity and pass it to the colors loop ([99efa36](https://github.com/driftyco/ionic/commit/99efa36))
* **tabs:** center tabbar content ([997d54e](https://github.com/driftyco/ionic/commit/997d54e))
* **tabs:** fix preloadTabs null element reference ([2d19308](https://github.com/driftyco/ionic/commit/2d19308)), closes [#7109](https://github.com/driftyco/ionic/issues/7109)
* **tabs:** make the text color opaque instead of the entire button ([dd969a2](https://github.com/driftyco/ionic/commit/dd969a2)), closes [#6638](https://github.com/driftyco/ionic/issues/6638)
* **util:** UIEventManager should handle touchcancel event ([b805602](https://github.com/driftyco/ionic/commit/b805602))

### Features

* **alert:** allow smooth overflow scrolling ([5542a93](https://github.com/driftyco/ionic/commit/5542a93))
* **content:** add a resize function to recalculate the content size ([1fe1c1e](https://github.com/driftyco/ionic/commit/1fe1c1e))
* **footer:** apply shadow on MD footer and tabbar bottom ([686c262](https://github.com/driftyco/ionic/commit/686c262))
* **gesture:** Introducing new gesture controller ([9f19023](https://github.com/driftyco/ionic/commit/9f19023))
* **gesture-controller:** disable/enable scrolling ([72c24bc](https://github.com/driftyco/ionic/commit/72c24bc))
* **header:** apply shadow on MD headers ([6fa2faf](https://github.com/driftyco/ionic/commit/6fa2faf))
* **ion-content:** iOS only scroll bounce ([5c80445](https://github.com/driftyco/ionic/commit/5c80445))
* **select:** add disabled status in select options ([76619cf](https://github.com/driftyco/ionic/commit/76619cf))
* **tabs:** apply shadow on MD tabbar top ([1f4b3e2](https://github.com/driftyco/ionic/commit/1f4b3e2))
* **tabs:** add the transition for material design tabs ([eea7e6b](https://github.com/driftyco/ionic/commit/eea7e6b))
* **toolbar:** add attributes to hide all borders and box shadows ([88b637b](https://github.com/driftyco/ionic/commit/88b637b)), closes [#7237](https://github.com/driftyco/ionic/issues/7237)
* **viewcontroller:** add onWillDismiss callback ([ec99bfd](https://github.com/driftyco/ionic/commit/ec99bfd)), closes [#6702](https://github.com/driftyco/ionic/issues/6702)

### Performance Improvements

* **animation:** using will-change when using progressStep() ([267aa32](https://github.com/driftyco/ionic/commit/267aa32))
* **menu:** several improvements ([86c5aaf](https://github.com/driftyco/ionic/commit/86c5aaf))


<a name="2.0.0-beta.10"></a>
# [2.0.0-beta.10](https://github.com/driftyco/ionic/compare/v2.0.0-beta.9...v2.0.0-beta.10) (2016-06-27)

### BREAKING CHANGES

- `ion-content` now takes up 100% of the viewport height, but it has margin added to the top and bottom to adjust for headers, footers, and tabs.
- `ion-content` now accepts `fullscreen` as an attribute to to tell the content to scroll behind the header. This allows for transparent toolbars and tab pages without navbars!
- `ion-navbar` no longer has the `*navbar` attribute.
- `ion-navbar` should now be wrapped in an `ion-header`

  ```
  <ion-header>
    <ion-navbar></ion-navbar>
  </ion-header>
  ```

- `ios` only: `ion-toolbar`/`ion-navbar` will always have borders to both the top and bottom of the element. Use the attributes `no-border-top` and `no-border-bottom` to remove the respective borders.
- An `ion-nav` or `ion-tabs` is required in the root component. If one of these does not exist your content may be pushed up behind your header.
- The `position` attribute has been removed from the `ion-toolbar`, it should now be placed in an `ion-header` or an `ion-footer`. It can also be placed inside of an `ion-content`.
- The only elements that should be children of a page are `ion-header`, `ion-content`, and `ion-footer`.


#### Steps to Upgrade to Beta 10

1. Run the following command from your command prompt/terminal to update to the latest version of the Ionic framework 2:

  ```
  npm install --save ionic-angular@2.0.0-beta.10 @angular/common@2.0.0-rc.3 @angular/compiler@2.0.0-rc.3 @angular/platform-browser@2.0.0-rc.3 @angular/platform-browser-dynamic@2.0.0-rc.3 @angular/http@2.0.0-rc.3 @angular/core@2.0.0-rc.3  @angular/router@2.0.0-rc.2
  ```

2. Remove the `*navbar` attribute so this:

  ```
  <ion-navbar *navbar>
  ```

  becomes this:

  ```
  <ion-navbar>
  ```

3. Wrap any toolbars/navbars above the `ion-content` in an `ion-header`. The following:

  ```
  <ion-navbar>
    <ion-title>
      Navbar Title
    </ion-title>
  </ion-navbar>

  <ion-toolbar>
    <ion-title>
      Toolbar Title
    </ion-title>
  </ion-toolbar>

  <ion-content>

  </ion-content>
  ```

  becomes:

  ```
  <ion-header>
    <ion-navbar>
      <ion-title>
        Navbar Title
      </ion-title>
    </ion-navbar>

    <ion-toolbar>
      <ion-title>
        Toolbar Title
      </ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>

  </ion-content>
  ```

4. Wrap any toolbars/navbars after the `ion-content` in an `ion-footer`. The following:

  ```
  <ion-content>

  </ion-content>

  <ion-toolbar position="bottom">
    <ion-title>Footer Toolbar</ion-title>
  </ion-toolbar>
  ```

  becomes:

  ```
  <ion-content>

  </ion-content>

  <ion-footer>
    <ion-toolbar>
      <ion-title>Footer Toolbar</ion-title>
    </ion-toolbar>
  </ion-footer>
  ```


### Bug Fixes

* **animation:** correctly apply will-change: transform ([a1223da](https://github.com/driftyco/ionic/commit/a1223da))
* **bootstrap:** only add customProviders when present ([0e9e85c](https://github.com/driftyco/ionic/commit/0e9e85c))
* **content:** adjust footer bottom based on the tabbar without padding ([4567de2](https://github.com/driftyco/ionic/commit/4567de2))
* **content:** set footer height to 0 so it won't be undefined ([3db67f9](https://github.com/driftyco/ionic/commit/3db67f9))
* **cordova:** fix the status bar padding with the new structure ([15642e4](https://github.com/driftyco/ionic/commit/15642e4))
* **demos:** updates @angular paths ([b7826ba](https://github.com/driftyco/ionic/commit/b7826ba))
* **footer:** show footer toolbar w/ tabbar bottom ([99c50a1](https://github.com/driftyco/ionic/commit/99c50a1))
* **generator:** fix closing tag for header ([47e09a1](https://github.com/driftyco/ionic/commit/47e09a1))
* **header:** optional ViewController injection ([5a85d82](https://github.com/driftyco/ionic/commit/5a85d82))
* **input:** allow button click when input has focus ([ae86ab8](https://github.com/driftyco/ionic/commit/ae86ab8)), closes [#6514](https://github.com/driftyco/ionic/issues/6514) [#6944](https://github.com/driftyco/ionic/issues/6944)
* **input:** check if there is a value when setting value ([d0b1930](https://github.com/driftyco/ionic/commit/d0b1930))
* **input:** fix the clear input button to always be vertically aligned ([e4cc672](https://github.com/driftyco/ionic/commit/e4cc672))
* **item:** inherit overflow and text-overflow from the parent item in a paragraph ([4009575](https://github.com/driftyco/ionic/commit/4009575))
* **item:** listEle does not longer exist ([22fad4c](https://github.com/driftyco/ionic/commit/22fad4c))
* **item:** sliding item works with and without borders ([2303c16](https://github.com/driftyco/ionic/commit/2303c16)), closes [#7081](https://github.com/driftyco/ionic/issues/7081)
* **item:** sliding items don't fire (click) when swiped ([38ab17b](https://github.com/driftyco/ionic/commit/38ab17b))
* **modal:** add class name to modal ([6e34739](https://github.com/driftyco/ionic/commit/6e34739)), closes [#7000](https://github.com/driftyco/ionic/issues/7000)
* **nav:** auto set iOS black transition bg via css ([7842991](https://github.com/driftyco/ionic/commit/7842991))
* **picker:** adds align to the PickerColumn interface ([b8551de](https://github.com/driftyco/ionic/commit/b8551de))
* **refresher:** adjust location after layout updates ([603000f](https://github.com/driftyco/ionic/commit/603000f))
* **refresher:** only listen for mousemove/touchmove when needed ([1a58a41](https://github.com/driftyco/ionic/commit/1a58a41))
* **tabs:** don't add outline to the class name if it is a logo icon ([af22287](https://github.com/driftyco/ionic/commit/af22287)), closes [#6899](https://github.com/driftyco/ionic/issues/6899)
* **tabs:** fix tabs rootNav ([ae40edf](https://github.com/driftyco/ionic/commit/ae40edf))
* **tabs:** hide tab's navbar when a page comes without a navbar ([2d68089](https://github.com/driftyco/ionic/commit/2d68089)), closes [#5556](https://github.com/driftyco/ionic/issues/5556)
* **tabs:** reference parent instead of parentTabs ([ed6d0fa](https://github.com/driftyco/ionic/commit/ed6d0fa))
* **tabs:** swipeBackEnabled works with tabs as expected ([2bff535](https://github.com/driftyco/ionic/commit/2bff535))
* **toggle:** host listeners are not longer needed ([4aa322d](https://github.com/driftyco/ionic/commit/4aa322d))
* **toolbar:** place iOS border on ion-header/footer ([48c1ffd](https://github.com/driftyco/ionic/commit/48c1ffd))
* **toolbar:** position toolbar relative and add z-index ([1d8ba4a](https://github.com/driftyco/ionic/commit/1d8ba4a))
* **virtualScroll:** first node should use clientTop/clientLeft ([2197d49](https://github.com/driftyco/ionic/commit/2197d49))

### Features

* **feature-detect:** detect if backdrop-filter is supported ([89564f1](https://github.com/driftyco/ionic/commit/89564f1))
* **fullscreen:** add fullscreen property to ion-content ([f20c7e4](https://github.com/driftyco/ionic/commit/f20c7e4))
* **item:** sliding items work with list reorder ([bfdc898](https://github.com/driftyco/ionic/commit/bfdc898))
* **list:** add list headers and item dividers as items ([712ff81](https://github.com/driftyco/ionic/commit/712ff81)), closes [#5561](https://github.com/driftyco/ionic/issues/5561)
* **list:** reorder list items ([5c38921](https://github.com/driftyco/ionic/commit/5c38921))
* **range:** add debounce input for ionChange event ([55eccb3](https://github.com/driftyco/ionic/commit/55eccb3)), closes [#6894](https://github.com/driftyco/ionic/issues/6894)
* **toolbar:** control toolbar borders on top/bottom ([3a7addf](https://github.com/driftyco/ionic/commit/3a7addf))

### Performance Improvements

* **reorder:** hit test refactored ([6a52a4a](https://github.com/driftyco/ionic/commit/6a52a4a))



<a name="2.0.0-beta.9"></a>
# [2.0.0-beta.9](https://github.com/driftyco/ionic/compare/v2.0.0-beta.8...v2.0.0-beta.9) (2016-06-16)

### BREAKING CHANGES

#### Searchbar Refactored

- Searchbar's events no longer emit the Searchbar itself, they now emit the input's `$event` for each native input event. Instead of grabbing the value from the searchbar, you should grab it from the event target. For example:

  Previously when an event was called the function called would look similar to this:

  ```
  getItems(searchbar) {
    // set q to the value of the searchbar input
    var q = searchbar.value;
  }
  ```

  Now it should be similar to this:

  ```
  getItems(ev) {
    // set q to the value of the searchbar input
    var q = ev.target.value;
  }
  ```

- `ngModel` is no longer required on Searchbar, but it can still be used. You can get the value of the input through Searchbar's [Output Events](http://ionicframework.com/docs/v2/api/components/searchbar/Searchbar/#output-events).
- Added the ability to pass `autocomplete`, `autocorrect`, `spellcheck`, and `type` to the searchbar which is passed to the input.
- The `hideCancelButton` attribute was removed in favor of `showCancelButton` which is set to `false` by default.


### Features

* **backButton:** register back button actions ([84f37cf](https://github.com/driftyco/ionic/commit/84f37cf))
* **item:** add the ability to show a forward arrow on md and wp modes ([c41f24d](https://github.com/driftyco/ionic/commit/c41f24d))
* **item:** two-way sliding of items ([c28aa53](https://github.com/driftyco/ionic/commit/c28aa53)), closes [#5073](https://github.com/driftyco/ionic/issues/5073)
* **item-sliding:** two-way item sliding gestures ([5d873ff](https://github.com/driftyco/ionic/commit/5d873ff))
* **modal:** background click and escape key dismiss (#6831) ([e5473b6](https://github.com/driftyco/ionic/commit/e5473b6)), closes [#6738](https://github.com/driftyco/ionic/issues/6738)
* **navPop:** add nav pop method on the app instance ([9f293e8](https://github.com/driftyco/ionic/commit/9f293e8))
* **popover:** background dismiss, escape dismiss ([1d78f78](https://github.com/driftyco/ionic/commit/1d78f78)), closes [#6817](https://github.com/driftyco/ionic/issues/6817)
* **range:** range can be disabled ([ccd926b](https://github.com/driftyco/ionic/commit/ccd926b))
* **select:** add placeholder as an input for select ([461ba11](https://github.com/driftyco/ionic/commit/461ba11)), closes [#6862](https://github.com/driftyco/ionic/issues/6862)
* **tabs:** track tab selecting history, create previousTab() method ([d98f3c9](https://github.com/driftyco/ionic/commit/d98f3c9))

### Bug Fixes

* **button:** check for icon and add css after content checked ([f7b2ea2](https://github.com/driftyco/ionic/commit/f7b2ea2)), closes [#6662](https://github.com/driftyco/ionic/issues/6662)
* **click-block:** click block is now showing on all screns. ([761a1f6](https://github.com/driftyco/ionic/commit/761a1f6))
* **click-block:** fix for the click block logic ([9b78aeb](https://github.com/driftyco/ionic/commit/9b78aeb))
* **datetime:** add styling for datetime with different labels ([adcd2fc](https://github.com/driftyco/ionic/commit/adcd2fc)), closes [#6764](https://github.com/driftyco/ionic/issues/6764)
* **decorators:** change to match angular style guide ([9315c68](https://github.com/driftyco/ionic/commit/9315c68))
* **item:** change ion-item-swiping to use .item-wrapper css instead ([31f62e7](https://github.com/driftyco/ionic/commit/31f62e7))
* **item:** encode hex value in the detail arrow so it works on firefox ([03986d4](https://github.com/driftyco/ionic/commit/03986d4)), closes [#6830](https://github.com/driftyco/ionic/issues/6830)
* **item:** improve open/close logic, update demos ([db9fa7e](https://github.com/driftyco/ionic/commit/db9fa7e))
* **item:** item-options width calculated correctly ([64af0c8](https://github.com/driftyco/ionic/commit/64af0c8))
* **item:** sliding item supports dynamic options + tests ([14d29e6](https://github.com/driftyco/ionic/commit/14d29e6)), closes [#5192](https://github.com/driftyco/ionic/issues/5192)
* **item:** sliding item's width must be 100% ([efcdd20](https://github.com/driftyco/ionic/commit/efcdd20))
* **menu:** push/overlay working correctly in landscape ([0c88589](https://github.com/driftyco/ionic/commit/0c88589))
* **menu:** swiping menu distinguishes between opening and closing direction ([29791f8](https://github.com/driftyco/ionic/commit/29791f8)), closes [#5511](https://github.com/driftyco/ionic/issues/5511)
* **Menu:** fix right overlay menu when rotating device ([07d55c5](https://github.com/driftyco/ionic/commit/07d55c5))
* **modal:** add status bar padding to modal ([181129b](https://github.com/driftyco/ionic/commit/181129b))
* **modal:** change modal display so you can scroll the entire height ([01bbc94](https://github.com/driftyco/ionic/commit/01bbc94)), closes [#6839](https://github.com/driftyco/ionic/issues/6839)
* **navigation:** keep the click block up longer if the keyboard is open (#6884) ([d6b7d5d](https://github.com/driftyco/ionic/commit/d6b7d5d))
* **popover:** allow target element to be positioned at left:0 ([ea450d4](https://github.com/driftyco/ionic/commit/ea450d4)), closes [#6896](https://github.com/driftyco/ionic/issues/6896)
* **popover:** hide arrow if no event was passed ([8350df0](https://github.com/driftyco/ionic/commit/8350df0)), closes [#6796](https://github.com/driftyco/ionic/issues/6796)
* **range:** bar height for ios should be 1px, add disabled for wp ([f2a9f2d](https://github.com/driftyco/ionic/commit/f2a9f2d))
* **range:** stop sliding after releasing mouse outside the window ([9b2e934](https://github.com/driftyco/ionic/commit/9b2e934)), closes [#6802](https://github.com/driftyco/ionic/issues/6802)
* **scrollView:** ensure scroll element exists for event listeners ([1188730](https://github.com/driftyco/ionic/commit/1188730))
* **searchbar:** add opacity so the searchbar doesn't show when it's moved over ([b5f93f9](https://github.com/driftyco/ionic/commit/b5f93f9))
* **searchbar:** only trigger the input event on clear if there is a value ([99fdcc0](https://github.com/driftyco/ionic/commit/99fdcc0)), closes [#6382](https://github.com/driftyco/ionic/issues/6382)
* **searchbar:** position elements when the value changes not after content checked ([31c7e59](https://github.com/driftyco/ionic/commit/31c7e59))
* **searchbar:** set a negative tabindex for the cancel button ([614ace4](https://github.com/driftyco/ionic/commit/614ace4))
* **searchbar:** use the contrast color for the background in a toolbar ([b4028c6](https://github.com/driftyco/ionic/commit/b4028c6)), closes [#6379](https://github.com/driftyco/ionic/issues/6379)
* **tabs:** reduce padding on tabs for ios ([fd9cdc7](https://github.com/driftyco/ionic/commit/fd9cdc7)), closes [#6679](https://github.com/driftyco/ionic/issues/6679)
* **tap:** export isActivatable as a const so its transpiled correctly ([ce3da97](https://github.com/driftyco/ionic/commit/ce3da97))
* **toast:** close toasts when two or more are open (#6814) ([8ff2476](https://github.com/driftyco/ionic/commit/8ff2476)), closes [(#6814](https://github.com/(/issues/6814)
* **toast:** toast will now be enabled (#6904) ([c068828](https://github.com/driftyco/ionic/commit/c068828))
* **virtualScroll:** detect changes in individual nodes ([f049521](https://github.com/driftyco/ionic/commit/f049521)), closes [#6137](https://github.com/driftyco/ionic/issues/6137)

### Performance Improvements

* **virtualScroll:** improve UIWebView virtual scroll ([ff1daa6](https://github.com/driftyco/ionic/commit/ff1daa6))



<a name="2.0.0-beta.8"></a>
# [2.0.0-beta.8](https://github.com/driftyco/ionic/compare/v2.0.0-beta.7...v2.0.0-beta.8) (2016-06-06)


### BREAKING CHANGES

#### Ionic Decorators Removed

We’ve started the process of optimizing Ionic 2 to improve our support for Progressive Web Apps and upcoming Angular tooling. Because of this, we have removed the Ionic decorators in favor of using Angular's `Component` decorator. The following changes need to be made. For a step by step guide, see the [Steps to Upgrade to Beta 8 section](https://github.com/driftyco/ionic/blob/2.0/CHANGELOG.md#steps-to-upgrade-to-beta-8).

- `@App` and `@Page` should be replaced with `@Component`.
- `IonicApp` has been renamed to `App`.
- `ionicBootstrap` is required to bootstrap the app.
- Config is now the 3rd parameter in `ionicBootstrap(rootComponent, providers, config)`.
- Property `prodMode` is now a config option, enabling or disabling production mode.


#### Ionic Lifecycle Events Renamed

All Ionic lifecycle events have been renamed from starting with `onPage` to starting with `ionView`. These changes were made to make it more clear that the events belong to Ionic on each view.

- `onPageLoaded` renamed to `ionViewLoaded`
- `onPageWillEnter` renamed to `ionViewWillEnter`
- `onPageDidEnter` renamed to `ionViewDidEnter`
- `onPageWillLeave` renamed to `ionViewWillLeave`
- `onPageDidLeave` renamed to `ionViewDidLeave`
- `onPageWillUnload` renamed to `ionViewWillUnload`
- `onPageDidUnload` renamed to `ionViewDidUnload`


#### Ionic Component Events Renamed

All Ionic component events have been renamed to start with `ion`. This is to prevent the Ionic events from clashing with native HTML events.

- **Checkbox**
  - `change` -> `ionChange`
- **DateTime**
  - `change` -> `ionChange`
  - `cancel` -> `ionCancel`
- **InfiniteScroll**
  - `infinite` -> `ionInfinite`
- **Menu**
  - `opening` -> `ionDrag`
  - `opened` -> `ionOpen`
  - `closed` -> `ionClose`
- **Option**
  - `select` -> `ionSelect`
- **Picker**
  - `change` -> `ionChange`
- **RadioButton**
  - `select` -> `ionSelect`
- **RadioGroup**
  - `change` -> `ionChange`
- **Refresher**
  - `refresh` -> `ionRefresh`
  - `pulling` -> `ionPull`
  - `start` -> `ionStart`
- **Searchbar**
  - `input` -> `ionInput`
  - `blur` -> `ionBlur`
  - `focus` -> `ionFocus`
  - `cancel` -> `ionCancel`
  - `clear` -> `ionClear`
- **Segment**
  - `change` -> `ionChange`
  - `select` -> `ionSelect`
- **Select**
  - `change` -> `ionChange`
  - `cancel` -> `ionCancel`
- **Slides**
  - `willChange` -> `ionWillChange`
  - `didChange` -> `ionDidChange`
  - `move` -> `ionDrag`
- **TabButton**
  - `select` -> `ionSelect`
- **Tab**
  - `select` -> `ionSelect`
- **Tabs**
  - `change` -> `ionChange`
- **Toggle**
  - `change` -> `ionChange`


#### Steps to Upgrade to Beta 8

1. Upgrade to `Beta 8` by running the following command:

  ```
  npm install --save ionic-angular@2.0.0-beta.8
  ```

  _or_ modify the following line to use `beta.8` in your `package.json` and then run `npm install`:

  ```
  "ionic-angular": "^2.0.0-beta.8",
  ```

  **This is the way to update Ionic to any version, more information can be found in the [docs](http://ionicframework.com/docs/v2/resources/using-npm/).**

2. Replace all instances of `@Page` with `@Component`:

  ```
  import {Page} from 'ionic-angular';

  @Page({

  })
  ```

  becomes

  ```
  import {Component} from '@angular/core';

  @Component({

  })
  ```

3. Replace `@App` with `@Component` and then bootstrap it. Move any `config` properties into the bootstrap:

  ```
  import {App, Platform} from 'ionic-angular';

  @App({
    templateUrl: 'build/app.html',
    providers: [ConferenceData, UserData],
    config: {
      tabbarPlacement: 'bottom'
  }
  export class MyApp {

  }
  ```

  becomes

  ```
  import {Component} from '@angular/core';
  import {ionicBootstrap, Platform} from 'ionic-angular';

  @Component({
    templateUrl: 'build/app.html',
  })
  export class MyApp {

  }

  // Pass the main app component as the first argument
  // Pass any providers for your app in the second argument
  // Set any config for your app as the third argument:
  // http://ionicframework.com/docs/v2/api/config/Config/

  ionicBootstrap(MyApp, [ConferenceData, UserData], {
    tabbarPlacement: 'bottom'
  });
  ```

4. Rename any uses of `IonicApp` to `App`:

  ```
  import {IonicApp} from 'ionic-angular';

  constructor(
    private app: IonicApp
  ) {
  ```

  becomes

  ```
  import {App} from 'ionic-angular';

  constructor(
    private app: App
  ) {
  ```

5. Rename any uses of the lifecycle events, for example:

  ```
  onPageDidEnter() {
    console.log("Entered page!");
  }
  ```

  becomes

  ```
  ionViewDidEnter() {
    console.log("Entered page!");
  }
  ```

  The full list of lifecycle name changes is in the [section above](https://github.com/driftyco/ionic/blob/2.0/CHANGELOG.md#ionic-lifecycle-events-renamed).

6. Rename any Ionic events, for example:

  ```
  <ion-slides (slideChangeStart)="onSlideChangeStart($event)">
  ```

  becomes

  ```
  <ion-slides (ionWillChange)="onSlideChangeStart($event)">
  ```

  The full list of event name changes is in the [section above](https://github.com/driftyco/ionic/blob/2.0/CHANGELOG.md#ionic-component-events-renamed).

### Bug Fixes

* **build:** correct link in output.wp.scss file to old ionic directory. ([6113daf](https://github.com/driftyco/ionic/commit/6113daf))
* **button:** style disabled anchor/button elements ([d0abbaf](https://github.com/driftyco/ionic/commit/d0abbaf)), closes [#6108](https://github.com/driftyco/ionic/issues/6108)
* **config:** pass custom providers in the bootstrap of the app ([c74b3f7](https://github.com/driftyco/ionic/commit/c74b3f7))
* **config:** set the properties for each mode and add defaults ([7def98c](https://github.com/driftyco/ionic/commit/7def98c)), closes [#6132](https://github.com/driftyco/ionic/issues/6132)
* **datetime:** clear out existing datetime data ([c1ad804](https://github.com/driftyco/ionic/commit/c1ad804)), closes [#6614](https://github.com/driftyco/ionic/issues/6614)
* **datetime:** fix ISO format when w/out timezone data ([272daf2](https://github.com/driftyco/ionic/commit/272daf2)), closes [#6608](https://github.com/driftyco/ionic/issues/6608)
* **infiniteScroll:** ensure infinite doesn't fire when already loading ([f7b1f37](https://github.com/driftyco/ionic/commit/f7b1f37))
* **input:** add form validation classes to the item ([5498a36](https://github.com/driftyco/ionic/commit/5498a36))
* **input:** fix material design success/error highlighting on inputs ([702a882](https://github.com/driftyco/ionic/commit/702a882))
* **input:** fix the clear input placement on wp mode ([4ba999e](https://github.com/driftyco/ionic/commit/4ba999e))
* **input:** pass the control classes down to the native input ([6180cb8](https://github.com/driftyco/ionic/commit/6180cb8))
* **ion-backdrop:** new ion-backdrop can prevent background scrolling ([a1a582b](https://github.com/driftyco/ionic/commit/a1a582b)), closes [#6656](https://github.com/driftyco/ionic/issues/6656)
* **item:** remove border for the last item in an item-group ([6b3e7ac](https://github.com/driftyco/ionic/commit/6b3e7ac)), closes [#6518](https://github.com/driftyco/ionic/issues/6518)
* **label:** make all ion-labels stacked or floating stretch ([b742e1f](https://github.com/driftyco/ionic/commit/b742e1f)), closes [#6134](https://github.com/driftyco/ionic/issues/6134)
* **menu:** fix swipe to go back and left menu conflict ([f18a624](https://github.com/driftyco/ionic/commit/f18a624)), closes [#5575](https://github.com/driftyco/ionic/issues/5575)
* **menu:** pass platform to menu type ([7f597a0](https://github.com/driftyco/ionic/commit/7f597a0))
* **modal:** fix onPageWillEnter ([01110af](https://github.com/driftyco/ionic/commit/01110af)), closes [#6597](https://github.com/driftyco/ionic/issues/6597)
* **picker:** safari fired pointerEnd() twice (#6708) ([170cf8c](https://github.com/driftyco/ionic/commit/170cf8c)), closes [#6704](https://github.com/driftyco/ionic/issues/6704)
* **picker:** use sanitizer on translate3d css prop ([8598a2e](https://github.com/driftyco/ionic/commit/8598a2e))
* **platform:** pass original event in EventEmitter ([cc93366](https://github.com/driftyco/ionic/commit/cc93366))
* **popover:** allow popover to have an ion-content wrapping it ([c801d18](https://github.com/driftyco/ionic/commit/c801d18))
* **popover:** position MD popover on top of element clicked ([6bd91f0](https://github.com/driftyco/ionic/commit/6bd91f0)), closes [#6683](https://github.com/driftyco/ionic/issues/6683)
* **popover:** style the ion-content background in a popover to match popover bg ([9ea89ea](https://github.com/driftyco/ionic/commit/9ea89ea))
* **range:** fix styling on range, add demo ([d24b080](https://github.com/driftyco/ionic/commit/d24b080))
* **range:** prevent change detection exception ([7e4b13d](https://github.com/driftyco/ionic/commit/7e4b13d))
* **range:** update range left/right margin on ios ([27fa22f](https://github.com/driftyco/ionic/commit/27fa22f))
* **range:** update the styling for all modes ([061af93](https://github.com/driftyco/ionic/commit/061af93))
* **ripple:** do not activate ripple if pointer moved ([d57833c](https://github.com/driftyco/ionic/commit/d57833c))
* **slides:** Removing a slide via *ngIf now properly removes the slide and the bullet from th ([dbe54b5](https://github.com/driftyco/ionic/commit/dbe54b5)), closes [#6651](https://github.com/driftyco/ionic/issues/6651)
* **toast:** remove backdrop, allow user interaction when up ([d4d1f70](https://github.com/driftyco/ionic/commit/d4d1f70)), closes [#6291](https://github.com/driftyco/ionic/issues/6291)
* **toast:** remove the enableBackdropDismiss option on toast ([aeeae3f](https://github.com/driftyco/ionic/commit/aeeae3f))
* **toggle:** do not fire change when initializing ([cd2afb3](https://github.com/driftyco/ionic/commit/cd2afb3)), closes [#6144](https://github.com/driftyco/ionic/issues/6144)
* **transition:** reduce transition delay on MD ([908fa03](https://github.com/driftyco/ionic/commit/908fa03))

### Features

* **alert:** add Sass variables for the radio/checkbox labels when checked ([9cc0dc7](https://github.com/driftyco/ionic/commit/9cc0dc7)), closes [#6289](https://github.com/driftyco/ionic/issues/6289)
* **item:** add item-content attr selector ([839adf8](https://github.com/driftyco/ionic/commit/839adf8)), closes [#6643](https://github.com/driftyco/ionic/issues/6643)
* **menu:** add opened/closed events ([51ee8b7](https://github.com/driftyco/ionic/commit/51ee8b7))
* **popover:** add height auto for safari and remove ability to scroll on backdrop ([620b7c8](https://github.com/driftyco/ionic/commit/620b7c8))
* **popover:** add MD animation ([1d0d755](https://github.com/driftyco/ionic/commit/1d0d755))
* **popover:** add popover component ([53fd3c3](https://github.com/driftyco/ionic/commit/53fd3c3))
* **popover:** add styling for the md pin ([a25a552](https://github.com/driftyco/ionic/commit/a25a552))
* **popover:** adjust popover to position in the center with no event ([1e7b572](https://github.com/driftyco/ionic/commit/1e7b572))
* **popover:** change MD animation and use for WP also ([44a7da8](https://github.com/driftyco/ionic/commit/44a7da8))
* **popover:** change popover item background color to match wrapper ([b0d71da](https://github.com/driftyco/ionic/commit/b0d71da))
* **popover:** change template in popover to a page similar to modal ([a96e36a](https://github.com/driftyco/ionic/commit/a96e36a))
* **popover:** fix long popovers that go off the page ([4db72cf](https://github.com/driftyco/ionic/commit/4db72cf))
* **popover:** fix MD animations and start from the right side ([e419ec6](https://github.com/driftyco/ionic/commit/e419ec6))
* **popover:** modify the animation for each mode ([57a1274](https://github.com/driftyco/ionic/commit/57a1274))
* **popover:** position popover in the top middle if no event ([438a389](https://github.com/driftyco/ionic/commit/438a389))
* **popover:** position the popover on transition instead of create ([2cd1b51](https://github.com/driftyco/ionic/commit/2cd1b51))
* **range:** add ability to add labels to the left/right of range ([fc819dd](https://github.com/driftyco/ionic/commit/fc819dd))
* **range:** add md and wp styling, tweak ios styling ([af6d5e4](https://github.com/driftyco/ionic/commit/af6d5e4))
* **range:** add styling for range-left/range-right md and wp ([21753a8](https://github.com/driftyco/ionic/commit/21753a8))
* **range:** add styling for the range when knob is minimum md ([c59c656](https://github.com/driftyco/ionic/commit/c59c656))
* **range:** create ion-range input ([2c6e11b](https://github.com/driftyco/ionic/commit/2c6e11b))
* **range:** fix the knob on md so the transform isn't blurry ([cffa84c](https://github.com/driftyco/ionic/commit/cffa84c))
* **range:** only increase knob size when pin doesn't exist ([47174df](https://github.com/driftyco/ionic/commit/47174df))


<a name="2.0.0-beta.7"></a>
# [2.0.0-beta.7](https://github.com/driftyco/ionic/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2016-05-19)


### Features

* **datetime:** add ion-datetime ([1e331c9](https://github.com/driftyco/ionic/commit/1e331c9))
* **input:** added functionality for clear input option on ion-input ([d8e2849](https://github.com/driftyco/ionic/commit/d8e2849))
* **modal:** add inset modal feature ([a658524](https://github.com/driftyco/ionic/commit/a658524)), closes [#5423](https://github.com/driftyco/ionic/issues/5423)
* **modal:** start of inset modals ([a1a594d](https://github.com/driftyco/ionic/commit/a1a594d))
* **picker:** add ios/md/wp picker styles ([aa9a667](https://github.com/driftyco/ionic/commit/aa9a667))
* **picker:** init picker ([d5068f8](https://github.com/driftyco/ionic/commit/d5068f8))
* **platform:** add a readySource as ready resolved value ([f68ac8a](https://github.com/driftyco/ionic/commit/f68ac8a))
* **platform:** cordova pause/resume events ([532096b](https://github.com/driftyco/ionic/commit/532096b))


### Bug Fixes

* **app:** add status bar padding to navbar when a tab subpage ([62b97ce](https://github.com/driftyco/ionic/commit/62b97ce)), closes [#6368](https://github.com/driftyco/ionic/issues/6368)
* **app:** fix status bar padding for inset modals ([4d27680](https://github.com/driftyco/ionic/commit/4d27680))
* **build:** fix e2e, demos, and karma tests to use new angular module setup. ([4c19d15](https://github.com/driftyco/ionic/commit/4c19d15))
* **button:** add the solid class to bar buttons ([658b29b](https://github.com/driftyco/ionic/commit/658b29b))
* **button:** add transparent background for clear/outline windows buttons ([da5c065](https://github.com/driftyco/ionic/commit/da5c065))
* **button:** exclude solid from getting added to the button in the class ([4252448](https://github.com/driftyco/ionic/commit/4252448))
* **button:** remove unnecessary ion-button-effect elements ([369d78b](https://github.com/driftyco/ionic/commit/369d78b))
* **checkbox:** add ability to align checkboxes to the right ([e075ccd](https://github.com/driftyco/ionic/commit/e075ccd)), closes [#5925](https://github.com/driftyco/ionic/issues/5925)
* **datetime:** fix property dayNames (it was using dayShort) ([0bd736d](https://github.com/driftyco/ionic/commit/0bd736d))
* **datetime:** improve parseTemplate ([55ec80a](https://github.com/driftyco/ionic/commit/55ec80a))
* **grid:** add ion-grid element which wraps the rows/cols and adds padding ([a0c0228](https://github.com/driftyco/ionic/commit/a0c0228))
* **input:** clear text input ([bde103d](https://github.com/driftyco/ionic/commit/bde103d))
* **input:** remove old clearInput code and clean up UI, added onChange calls ([71cd297](https://github.com/driftyco/ionic/commit/71cd297))
* **loading:** include cssClass in the Loading options ([4c8ee95](https://github.com/driftyco/ionic/commit/4c8ee95)), closes [#6365](https://github.com/driftyco/ionic/issues/6365)
* **nav:** transition toolbars on iOS ([daa4ccc](https://github.com/driftyco/ionic/commit/daa4ccc)), closes [#5692](https://github.com/driftyco/ionic/issues/5692)
* **picker:** number of dom children != number of options (#6551) ([28cf16a](https://github.com/driftyco/ionic/commit/28cf16a))
* **radio:** add styling for radio when item-left/item-right is added ([4c5dd0b](https://github.com/driftyco/ionic/commit/4c5dd0b))
* **raf:** test for undefined raf ([1c16008](https://github.com/driftyco/ionic/commit/1c16008))
* **segment:** add disabled property to segment and segment button ([4fca31e](https://github.com/driftyco/ionic/commit/4fca31e))
* **select:** add min height to select text for windows since it shows border ([e9c1442](https://github.com/driftyco/ionic/commit/e9c1442))
* **show-hide-when:** add !important to display as this should always take precedence ([617b7ac](https://github.com/driftyco/ionic/commit/617b7ac)), closes [#6270](https://github.com/driftyco/ionic/issues/6270)
* **slides:** make slide method parameters optional ([f355087](https://github.com/driftyco/ionic/commit/f355087))
* **slides:** set class using renderer instead of host ([132d8e9](https://github.com/driftyco/ionic/commit/132d8e9)), closes [#6275](https://github.com/driftyco/ionic/issues/6275)
* **tabs:** move border to top for windows positioned bottom tabs ([af2085e](https://github.com/driftyco/ionic/commit/af2085e)), closes [#6526](https://github.com/driftyco/ionic/issues/6526)
* **tabs:** remove min-width from tab so 5 tabs will fit ([b4647cd](https://github.com/driftyco/ionic/commit/b4647cd)), closes [#6056](https://github.com/driftyco/ionic/issues/6056)
* **toast:** add toast back to the components export ([d7d4742](https://github.com/driftyco/ionic/commit/d7d4742))
* **toggle:** add styling for toggle when placed left ([ab82d53](https://github.com/driftyco/ionic/commit/ab82d53))
* **toolbar:** add the mode to the inverse function for a toolbar ([3ca3027](https://github.com/driftyco/ionic/commit/3ca3027)), closes [#6364](https://github.com/driftyco/ionic/issues/6364)
* **toolbar:** md mode use the color contrast for toolbar button/title ([9f54f16](https://github.com/driftyco/ionic/commit/9f54f16))
* **toolbar:** remove color change from outline buttons in toolbar ([6759074](https://github.com/driftyco/ionic/commit/6759074))
* **toolbar:** set the text color of the toolbar based on the contrast of the background ([74afc18](https://github.com/driftyco/ionic/commit/74afc18))
* **toolbar:** wp get title/button color from the contrast of toolbar background ([62bd13b](https://github.com/driftyco/ionic/commit/62bd13b))
* **virtual-scroll:** fixes from rc1 breaking changes ([158f717](https://github.com/driftyco/ionic/commit/158f717))


### BREAKING CHANGES

#### Angular Update to 2.0.0-rc.1

Angular has been updated to 2.0.0-rc.1, follow these steps to update Angular.

1. Edit your `package.json` and **remove** the `angular2` entry:

  ```
  "angular2": "2.0.0-beta.15"
  ```

2. Then, run the following command from a terminal to update Ionic and Angular, or take a look at the starter's [package.json](https://github.com/driftyco/ionic2-app-base/commit/4861c099e2cc509eeb0eff4548554b34116c22a5) changes and update each version:

  ```
  npm install --save ionic-angular@2.0.0-beta.7 @angular/core @angular/compiler @angular/common @angular/platform-browser @angular/platform-browser-dynamic @angular/router @angular/http rxjs@5.0.0-beta.6 zone.js@0.6.12 reflect-metadata
  ```

3. Run the following command from a terminal to update the gulp task for `ionic-gulp-scripts-copy`:

  ```
  npm install --save-dev ionic-gulp-scripts-copy@2.0.0
  ```

4. Then, change any imports in your application from `angular2` to `@angular`. For example, the following:

  ```javascript
  import {ViewChild} from 'angular2/core';
  import {Http} from 'angular2/http';
  ```

  becomes

  ```javascript
  import {ViewChild} from '@angular/core';
  import {Http} from '@angular/http';
  ```

5. Remove the import for `angular2-polyfills` in `index.html`:

  ```html
   <script src="build/js/angular2-polyfills.js"></script>
  ```

  and replace it with the following scripts:

  ```html
  <script src="build/js/zone.js"></script>
  <script src="build/js/Reflect.js"></script>
  ```

6. Replace all template variables in `ngFor` with `let`. For example:

  ```
  *ngFor="#session of group.sessions"
  ```

  becomes

  ```
  *ngFor="let session of group.sessions"
  ```

7. Replace all template variables in `virtualScroll`. For example:

  ```
  *virtualItem="#item"
  ```

  becomes

  ```
  *virtualItem="let item"
  ```

8. View the [Angular Changelog](https://github.com/angular/angular/blob/master/CHANGELOG.md) for more in depth changes.


#### IonicApp ([df32836](https://github.com/driftyco/ionic/commit/df32836)) references [#6199](https://github.com/driftyco/ionic/issues/6199)

The `getComponent` method of `IonicApp` has been removed. Please use Angular's [ViewChild](https://angular.io/docs/ts/latest/api/core/ViewChild-var.html) instead.

For example, the following:

```html
<ion-nav id="nav" [root]="rootPage" #content></ion-nav>
```

```javascript
import {IonicApp} from 'ionic-angular';

@App({
  templateUrl: 'build/app.html'
})
class MyApp {
  constructor(private app: IonicApp) {}

  setPage() {
    let nav = this.app.getComponent('nav');
    nav.push(MyPage);
  }
}
```

Should be changed (in TypeScript) to use the `Nav` ViewChild:

```html
<ion-nav [root]="rootPage" #content></ion-nav>
```

```javascript
import {ViewChild} from '@angular/core';
import {Nav} from 'ionic-angular';

@App({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  constructor() {}

  setPage() {
    this.nav.push(MyPage);
  }
}
```

and the same example (in JavaScript):

```javascript
import {ViewChild} from '@angular/core';

@App({
  templateUrl: 'build/app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
class MyApp {
  constructor() {}

  setPage() {
    this.nav.push(MyPage);
  }
}
```

Please see the [Ionic Conference App](https://github.com/driftyco/ionic-conference-app) for more usage examples.


#### Router

The Angular router is currently under heavy development and refactoring. As a result of this, Angular’s router is currently disabled within Ionic. If your app requires use of the router we recommend waiting until a future release of Ionic when Angular has completed work on the new router. However, this does not affect Ionic’s navigation system and it continues to work with the same API from previous versions.


#### Sass Changes

##### Toolbar [#6364](https://github.com/driftyco/ionic/issues/6364)

**iOS Mode**

- `$toolbar-ios-button-color` now has a
default value of `color-contrast($colors-ios, $toolbar-ios-background,
ios)` which will evaluate to the primary color for light background
toolbars and white for dark background toolbars.
- `$bar-button-ios-color` has been renamed to `$toolbar-ios-button-color`
- `$bar-button-ios-border-radius` has been renamed to
`$toolbar-ios-button-border-radius`

- added variables for the toolbar ios title for easier styling:

  ```
  $toolbar-ios-title-font-weight
  $toolbar-ios-title-text-align
  $toolbar-ios-title-text-color
  ```

**Windows Mode**

- `$bar-button-wp-color` was renamed to `$toolbar-wp-button-color`
- `$bar-button-wp-border-radius` was renamed to
`$toolbar-wp-button-border-radius`
- Added `$toolbar-wp-title-text-color` for better control of the title
color
- Removed `$toolbar-wp-button-color` from the default themes

**Material Design Mode**

- `$toolbar-md-button-color` no longer gets passed to the function that
sets the contrast color for toolbar buttons, but it can still be used
to set the default button color.
- `$bar-button-md-color` was renamed to `$toolbar-md-button-color`
- `$bar-button-md-border-radius` was renamed to
`$toolbar-md-button-border-radius`

##### Toggle, Checkbox, Radio ([4c5dd0b](https://github.com/driftyco/ionic/commit/4c5dd0b)), ([e075ccd](https://github.com/driftyco/ionic/commit/e075ccd)), ([ab82d53](https://github.com/driftyco/ionic/commit/ab82d53)) references [#5925](https://github.com/driftyco/ionic/issues/5925)

Renamed Sass variables in toggle, checkbox, and
radio. Changed the word `media` in `component-mode-media-padding` (for example)
to `item-left`.
