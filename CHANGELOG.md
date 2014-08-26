### 1.0.0-beta.11 "indium-iguana" (2014-08-06)


#### Bug Fixes

* **actionSheet:** run $apply when closing actionSheet with back button ([d3ed66e0](https://github.com/driftyco/ionic/commit/d3ed66e0cd4b81f273c1bb8554786dcf973e0887))
* **backdrop:** disable tap longer after backdrop close ([7faeeda0](https://github.com/driftyco/ionic/commit/7faeeda099053f1d43d48407a0d89a9a09cb56a4), closes [#1536](https://github.com/driftyco/ionic/issues/1536))
* **cards:** No more double margin if inside padding container ([03903239](https://github.com/driftyco/ionic/commit/0390323944b0e437c1b9716b6d897e2f94325f8c))
* **demos:** fix HTML validation issue ([c47fcccc](https://github.com/driftyco/ionic/commit/c47fcccc723a69c0fcf74ccdfc5ebec265c09ea5))
* **forms:** Normalized form styles ([89999cad](https://github.com/driftyco/ionic/commit/89999cadb17a9a20d65f3699722e390f982a27ce))
* **header:** buttons do not align in Android 4.4 ([06086ee9](https://github.com/driftyco/ionic/commit/06086ee9ae2e0bfd02e5ed88ce086ae94ceadd70), closes [#1614](https://github.com/driftyco/ionic/issues/1614))
* **ionRadio:** fix ng-change being reported before model changes ([53c437e2](https://github.com/driftyco/ionic/commit/53c437e2054e1f95d548e42b386f7a82aba56a14), closes [#1741](https://github.com/driftyco/ionic/issues/1741))
* **nav:** Removed border on animation ([a9a52f64](https://github.com/driftyco/ionic/commit/a9a52f64f427889c15a94b2645ddcef6bb59340f))
* **popup:** backdrop release fires with every close ([ae87c66b](https://github.com/driftyco/ionic/commit/ae87c66b12821b122eeb8acb778138b55776b873))
* **sideMenu:** remove .menu-open on destroy ([f246c5aa](https://github.com/driftyco/ionic/commit/f246c5aa2094ec74865ce149b3f1a1183dc4950a))
* **tabs:**
  * vertically center text and icons on tabs-icon-left/right ([93d586de](https://github.com/driftyco/ionic/commit/93d586dea4e9c6253fbdfd01a166456e0a1fd4da), closes [#1827](https://github.com/driftyco/ionic/issues/1827))
  * remove important flag from `.tabs{border-bottom:none;} Fixes: 1652 ([bf1c1bc9](https://github.com/driftyco/ionic/commit/bf1c1bc97151e3c25345b5ba9024015ef9865879))
* **toggle:** fix toggle-class attribute ([6fbd1a43](https://github.com/driftyco/ionic/commit/6fbd1a43067fbaf9a2d9c2f4098220e6dd1d7605), closes [#1851](https://github.com/driftyco/ionic/issues/1851))
* **viewService:** No error on clearHistory for empty history ([64641b1b](https://github.com/driftyco/ionic/commit/64641b1be0aa93281223f6c2baae3941835c49e9))


#### Features

* **collectionRepeat:** other children of ion-content element fit in ([7ddb57e6](https://github.com/driftyco/ionic/commit/7ddb57e60b27072b69a0da66b9b22acdd44e6f10), closes [#1920](https://github.com/driftyco/ionic/issues/1920), [#1866](https://github.com/driftyco/ionic/issues/1866), [#1380](https://github.com/driftyco/ionic/issues/1380))
* **popover:** created popovers ([c1215aa3](https://github.com/driftyco/ionic/commit/c1215aa300e8506d30fbeaf2c608b07058c46e3b))
* **tabs:** Expand striped android style tab functionality. Closes 1694 ([ddda809b](https://github.com/driftyco/ionic/commit/ddda809b57ef334dc35ac2f33133f061d4856073))


#### Breaking Changes

* 
ion-radio no longer has an isolate scope.
This will break your radio only if you were relying upon the radio having an isolate scope: if you were referencing `$parent.value` as
the ng-disabled attribute, for example.

Change your code from this:

```
<ion-radio ng-disabled="{{$parent.isDisabled}}"></ion-radio>
```

To this:

```
<ion-radio ng-disabled="{{isDisabled}}"></ion-radio>
```

 ([53c437e2](https://github.com/driftyco/ionic/commit/53c437e2054e1f95d548e42b386f7a82aba56a14))



### 1.0.0-beta.10 "hafnium-heron" (2014-07-25)


#### Bug Fixes

* **button:** fix button overflow causing whole screen to overflow left/right ([114dad8c](https://github.com/driftyco/ionic/commit/114dad8cea5ee42bc21100ed48f2aed94900e69e), closes [#1780](https://github.com/driftyco/ionic/issues/1780))
* **collectionRepeat:**
  * properly display collection repeat inside a modal ([1fbd3c56](https://github.com/driftyco/ionic/commit/1fbd3c56325de3eea9e85c500f926431abd87f74))
  * patch ngSrc/ngHref to fix a bug with falsy values ([208ef13d](https://github.com/driftyco/ionic/commit/208ef13d549b4d6dba5d2e5ced5f524415d16e93), closes [#1674](https://github.com/driftyco/ionic/issues/1674))
* **gesture:** fix onSwipeDown ([2dce7a74](https://github.com/driftyco/ionic/commit/2dce7a74f7fc4d31a4aa677da518e678cbfc2f5e), closes [#1810](https://github.com/driftyco/ionic/issues/1810))
* **ionList:** allow scrolling while reorder or delete is active ([2e9d0965](https://github.com/driftyco/ionic/commit/2e9d0965a52c0e51fbc2a950b098fec00a98f2fc), closes [#1703](https://github.com/driftyco/ionic/issues/1703))
* **ionReorderButton:** stop `ngRepeat:dupes` error when reordering ([ba1859b3](https://github.com/driftyco/ionic/commit/ba1859b308b0769e4af2e72cb229cb7a87ade0e3), closes [#1601](https://github.com/driftyco/ionic/issues/1601))
* **list:**
  * make reorder/delete button animation work well on all devices ([4f10a723](https://github.com/driftyco/ionic/commit/4f10a72306e2b3b1f70097edf0f7872946198660))
  * add extra margin-bottom to the last list if the list is also a card. ([306fe047](https://github.com/driftyco/ionic/commit/306fe04702ff6dcc79de1b49ed568f8e7fb2b11a), closes [#1708](https://github.com/driftyco/ionic/issues/1708))
* **loading:**
  * stop resize flicker when showing & changing text ([cb368698](https://github.com/driftyco/ionic/commit/cb36869889aa1a3e4ba98a16f0af023888e5d74b))
  * Prevent clicks on modal views when loading is active. ([7630bd41](https://github.com/driftyco/ionic/commit/7630bd419f26662803990c7502df171a155b3555), closes [#1720](https://github.com/driftyco/ionic/issues/1720))
* **nav:** remove disabled-pointer-events ([5b50e120](https://github.com/driftyco/ionic/commit/5b50e120a116c182dcac2957800452e520450897), closes [#1383](https://github.com/driftyco/ionic/issues/1383))
* **navBar:** only add default animation if there is no custom animation ([cdba48f1](https://github.com/driftyco/ionic/commit/cdba48f19675f2f07fa2f0540b00c9996e3e0585), closes [#1671](https://github.com/driftyco/ionic/issues/1671))
* **scroll:**
  * prevent native webkit scrollbars from showing ([951a9d35](https://github.com/driftyco/ionic/commit/951a9d352350d885d1255557713c03beccf16ab7))
  * anchor scroll should scroll to IDs that are multiple levels beneath the scroll v ([3d0a46ef](https://github.com/driftyco/ionic/commit/3d0a46efe8dac556c0ba56f0532b39716cf37373), closes [#1804](https://github.com/driftyco/ionic/issues/1804))
* **scrollView:**
  * cloned input for keyboard-scroll now matches original ([5da1ecd0](https://github.com/driftyco/ionic/commit/5da1ecd0e237a82a044551cbf3c9bd28d2b422bb), closes [#1721](https://github.com/driftyco/ionic/issues/1721))
  * always stay exactly within boundaries after bounce ([1c789f8a](https://github.com/driftyco/ionic/commit/1c789f8a88fbcc71fafdcf1ee20a58f625e6093a), closes [#1736](https://github.com/driftyco/ionic/issues/1736))
* **select:** prevent ion-item text from overlapping select input. ([a56e647b](https://github.com/driftyco/ionic/commit/a56e647ba2ffc2bca95e0c316a726e79d7ce5c31), closes [#1735](https://github.com/driftyco/ionic/issues/1735))
* **sideMenu:**
  * when a drag on content is disallowed, do not prevent default ([ab500f2e](https://github.com/driftyco/ionic/commit/ab500f2e0cef8a3b11ab44cdcb20105987b870f9), closes [#1725](https://github.com/driftyco/ionic/issues/1725))
  * when drag-content=false, allow drag-to-close ([e3db0856](https://github.com/driftyco/ionic/commit/e3db08563b445e92854b9e2d57e3b76671b1e731), closes [#1419](https://github.com/driftyco/ionic/issues/1419))
* **sidemen:** scroll false causes sidemenu content to disappear. ([6b218042](https://github.com/driftyco/ionic/commit/6b218042c85d7001e65aa21a759ef65c527196c2), closes [#1485](https://github.com/driftyco/ionic/issues/1485))
* **slidebox:** default to not autoplay ([81a7342f](https://github.com/driftyco/ionic/commit/81a7342fc74eb701e8d63926108daf3593889e42))
* **sliderView:** "getBoundClientRect" typo ([0dad2ed6](https://github.com/driftyco/ionic/commit/0dad2ed6e8f97fe940815ac2d3d7d36ebe48bc88))
* **tap:**
  * only check classList on tap target if it has classList ([5bf75321](https://github.com/driftyco/ionic/commit/5bf75321fc3be2bd6b6d3d7acf11bce916dbe9bc), closes [#1677](https://github.com/driftyco/ionic/issues/1677))
  * fire input behavior when tap/clicking file input label. ([889482e0](https://github.com/driftyco/ionic/commit/889482e048eb2b014d28f95c2abcecdb094b6a7e), closes [#1699](https://github.com/driftyco/ionic/issues/1699))
* **toggle:** fix ngChange being reported before model changes ([537b29d0](https://github.com/driftyco/ionic/commit/537b29d0bbf000fc0639965029983a0f79c03c8f), closes [#1349](https://github.com/driftyco/ionic/issues/1349), [#1741](https://github.com/driftyco/ionic/issues/1741))
* **view:** don't affect history when inside a modal ([b7f45e7c](https://github.com/driftyco/ionic/commit/b7f45e7ca5e8f23397be3e977166820a4a3346ad), closes [#1667](https://github.com/driftyco/ionic/issues/1667))


#### Features

* **$ionicLoading:** add $ionicLoadingConfig constant for default options ([26ca840d](https://github.com/driftyco/ionic/commit/26ca840dfc58621d09fdf207e41f73332aee541e), closes [#1800](https://github.com/driftyco/ionic/issues/1800))
* **checkbox:** add disabled and emotion styles to ion-checkbox. and #1509 ([79fb1e49](https://github.com/driftyco/ionic/commit/79fb1e494151360d5925de036ae20464aa2a09b3), closes [#1683](https://github.com/driftyco/ionic/issues/1683))
* **ionModalView:** ion-modal-view to wrap template instead of `<div class="modal">` ([ed4f2288](https://github.com/driftyco/ionic/commit/ed4f22889e6b8e28758f3ac637f1cba1e241cbc9), closes [#1668](https://github.com/driftyco/ionic/issues/1668))
* **ionSideMenu:** add `edge-drag-threshold`, delegate `edgeDragThreshold()` ([ba56bb98](https://github.com/driftyco/ionic/commit/ba56bb983fc727c42dfbd02d98b9aeadd10ea5c8), closes [#1570](https://github.com/driftyco/ionic/issues/1570))
* **ionSlideBox:** add 'auto-play' attr to optionally disable auto-play ([8f808609](https://github.com/driftyco/ionic/commit/8f8086092f2fc4cb69149acd1b06d348717d1e60), closes [#1552](https://github.com/driftyco/ionic/issues/1552))
* **tab:** options 'hidden' attribute for tabs., #1673 ([bb6976ad](https://github.com/driftyco/ionic/commit/bb6976ad54736103d78be3bddd9faf7719dc0153), closes [#1666](https://github.com/driftyco/ionic/issues/1666))


#### Breaking Changes

*
ion-toggle no longer has an isolate scope.
This will break your toggle only if you were relying upon the toggle
having an isolate scope: if you were referencing `$parent.value` as
the ng-disabled attribute, for example.

Change your code from this:

<ion-toggle ng-disabled="{{$parent.isDisabled}}"></ion-toggle>

To this:

<ion-toggle ng-disabled="{{isDisabled}}"></ion-toggle>

 ([537b29d0](https://github.com/driftyco/ionic/commit/537b29d0bbf000fc0639965029983a0f79c03c8f))
* Reordering with ion-reorder-button no longer changes the order of the items in the DOM.

This change will only break your list if you were not using the
onReorder callback as described in the documentation.

Before, while reordering an element in a list Ionic would swap the
elements underneath as the reordering happened.  This sometimes caused
errors with angular's ngRepeat directive.

Now, reordering an element in a list does not change the order of
elements in the DOM.  It is expected that the end developer will use the
index changes given in the `onReorder` callback to reorder the items
in the list. This is simple to do, see the [examples in the
ionReorderButton
documentation](http://ionicframework.com/docs/api/directive/ionReorderButton/).

 ([ba1859b3](https://github.com/driftyco/ionic/commit/ba1859b308b0769e4af2e72cb229cb7a87ade0e3))


### 1.0.0-beta.9 "gadolinium-gator" (2014-07-02)


#### Bug Fixes

* **collectionRepeat:** fix scroll when item bigger than viewport ([b2585f19](https://github.com/driftyco/ionic/commit/b2585f19cac58d0393b8339cb2efddf213e57660), closes [#1621](https://github.com/driftyco/ionic/issues/1621))
* **footerBar:** fixed top border position on retina displays. ([f4043e67](https://github.com/driftyco/ionic/commit/f4043e673c6e94b7e7fe2236ec78024243ff38c6), closes [#1661](https://github.com/driftyco/ionic/issues/1661))
* **gestureDirectives:** fix problem with event being passed in ([b4b94073](https://github.com/driftyco/ionic/commit/b4b94073d5b26698be4a45b9fa4dbeb5a2cdcad4))
* **header:** add iOS 8 support to iOS header fix. assumes all iOS will have 7 style headers. ([4a2296dc](https://github.com/driftyco/ionic/commit/4a2296dcae4079b114dd2ddb13f1a3492039b80d), closes [#1625](https://github.com/driftyco/ionic/issues/1625))
* **headerBar:** scroll to top ([6eefee3d](https://github.com/driftyco/ionic/commit/6eefee3d7ed4b4ade4e7093158e83f4ac99d6fc1))
* **listItem:** apply color styles to complex list items ([9ff1b965](https://github.com/driftyco/ionic/commit/9ff1b965bf8f5aac7d922a8cff5ec7dcd5e99312))
* **menu:** safari z-index fix for `.menu .scroll-content` ([754ef461](https://github.com/driftyco/ionic/commit/754ef461e8fafcd3c00be103e655e44e4bb4292a), closes [#1408](https://github.com/driftyco/ionic/issues/1408))
* **modal:** remove iOS style header padding from inset headers in modal popups on iPad in po ([e6dda6a5](https://github.com/driftyco/ionic/commit/e6dda6a5170fac4e8b14a4f3e2fc1d574058a797), closes [#1605](https://github.com/driftyco/ionic/issues/1605))
* **popup:** if popup is taller than the window, shrink the popup body and make it scrollable ([3e6ce183](https://github.com/driftyco/ionic/commit/3e6ce1831b8eeeaab53e010c9603474cf9ddbbcd), closes [#1679](https://github.com/driftyco/ionic/issues/1679))
* **radio:** suport ng-disabled. ([704fe402](https://github.com/driftyco/ionic/commit/704fe402e79b457150428856aa0b273986431779), closes [#1684](https://github.com/driftyco/ionic/issues/1684))
* **scroll:** safari scroll content height ([96b2243f](https://github.com/driftyco/ionic/commit/96b2243f15628d4cfed84aba4649a6f2e28b6314))
* **scrollController:** allow tab $historyId to remember scroll ([9b601b55](https://github.com/driftyco/ionic/commit/9b601b5523537f496b4a41bb8e57c1b1e916e949), closes [#1654](https://github.com/driftyco/ionic/issues/1654))
* **scrollView:** clonedInputs get placeholder text if any ([f2f55199](https://github.com/driftyco/ionic/commit/f2f55199b9df4b007ac4b8b66ef9e8a9dfc50c57))
* **sliderView:** find width properly when element is transformed ([86ce4806](https://github.com/driftyco/ionic/commit/86ce480696597882552665cbb1204d7e2af4fd6c), closes [#1313](https://github.com/driftyco/ionic/issues/1313))
* **tap:** get containing label of deeply nested element ([2e3b8546](https://github.com/driftyco/ionic/commit/2e3b854658a5adf19321c433b28bdca95428d02d), closes [#1643](https://github.com/driftyco/ionic/issues/1643))


### 1.0.0-beta.8 "fermium-flamingo" (2014-06-16)


#### Bug Fixes

* **cancelAnimationFrame:** polyfill in ionic.DomUtil ([a0577346](https://github.com/driftyco/ionic/commit/a057734631ccdb2d81ec3e67c3172a87445102c5))
* **content:** scroll=false in sidemenu hides content ([53c17104](https://github.com/driftyco/ionic/commit/53c171043eca5ca360a0db6c2ec9f8de118c061a), closes [#1485](https://github.com/driftyco/ionic/issues/1485))
* **css:** reset FirefoxOS default gradients ([5f1ea5f6](https://github.com/driftyco/ionic/commit/5f1ea5f6326d9851dbddbee7fde164fe6c456427), closes [#1426](https://github.com/driftyco/ionic/issues/1426))
* **headerBarView:** check for null in getTextBounds ([be351ce1](https://github.com/driftyco/ionic/commit/be351ce1face2c69c68a4eda2418e57998b3e3fa), closes [#1377](https://github.com/driftyco/ionic/issues/1377))
* **tap:** error when releasing outside of browser ([8da9f34b](https://github.com/driftyco/ionic/commit/8da9f34ba27a16c629e9373e8d4120adb52a09de), closes [#1612](https://github.com/driftyco/ionic/issues/1612))


#### Features

* **ionicons:**
  * upgrade to v1.5.2 ([17ee672f](https://github.com/driftyco/ionic/commit/17ee672fa3d967bdbd449157951d5fe0441ee66e))


<a name="1.0.0-beta.7"></a>
### 1.0.0-beta.7 "einsteinium-emu" (2014-06-12)

#### Bug Fixes

* **$ionNavView:** prevent read property 'name' of null ([4831f489](https://github.com/driftyco/ionic/commit/4831f48954fa1bf32d1e279639658d52a0e02350), closes [#1587](https://github.com/driftyco/ionic/issues/1587))
* **$ionicActionSheet:**
  * stop memory leak due to hidden element staying in dom ([b7646a56](https://github.com/driftyco/ionic/commit/b7646a56309273f37fc73903114de5e363bbf060))
  * fix problems with cancel() not being called ([323e2ce2](https://github.com/driftyco/ionic/commit/323e2ce22dc98cdf32fcb4125f4bc34ae8a6c6c5), closes [#1013](https://github.com/driftyco/ionic/issues/1013), [#1576](https://github.com/driftyco/ionic/issues/1576))
* **.slide-in-right:** fix leave animation being same as enter ([024f51d3](https://github.com/driftyco/ionic/commit/024f51d38ed9fd1399ca409ea3f1fbd7537decbd), closes [#1610](https://github.com/driftyco/ionic/issues/1610))
* **backdrop:** Changed z-index for loading backdrop only. ([4c700e9c](https://github.com/driftyco/ionic/commit/4c700e9c0f0e6cf2583314dcffa7ef844355ef3b), closes [#1428](https://github.com/driftyco/ionic/issues/1428))
* **collectionRepeat:**
  * remove elements at correct time when leaving page ([30a3c8e0](https://github.com/driftyco/ionic/commit/30a3c8e0c8aa3a4ce98fa05aff910d14f009efa5))
  * use $rootScope when checking if digest is needed ([74a46122](https://github.com/driftyco/ionic/commit/74a4612210e6da9f5ebdf964d5256c4896eff185), closes [#1518](https://github.com/driftyco/ionic/issues/1518))
* **firefox:** Add FF 19+ style vendor prefixing (bit.ly/1tLz8Qp) ([5286a0c4](https://github.com/driftyco/ionic/commit/5286a0c4dbe04dfd812512ccdc6a6c1b477624bf), closes [#1574](https://github.com/driftyco/ionic/issues/1574))
* **headerBar:** More accurate scroll-to-top detection ([1a7c1f1d](https://github.com/driftyco/ionic/commit/1a7c1f1dc67c3ed09d71eb42430bd2d17fdd579d))
* **ionItem:**
  * make target attribute work properly ([f5f5851b](https://github.com/driftyco/ionic/commit/f5f5851b2e493a944656c1af7491c0ba03d3e75e), closes [#1521](https://github.com/driftyco/ionic/issues/1521))
  * Pass target attributes on <ion-item> tags on to the actual <a> tag. ([4136db00](https://github.com/driftyco/ionic/commit/4136db00a12ddef6d0538040767b145bf7294b0e), closes [#1492](https://github.com/driftyco/ionic/issues/1492))
* **ionNavBackButton:** stop flicker when pressing back on ios ([cec3a422](https://github.com/driftyco/ionic/commit/cec3a422368e9cfd10a88691acd6406f158932ee))
* **ionRadio:**
  * make `value` attribute work ([5fd5e009](https://github.com/driftyco/ionic/commit/5fd5e009a64b65546fafb94a3d0e5f830c0e911e))
  * correctly interpolate ngValue instead of compiling ([948cffeb](https://github.com/driftyco/ionic/commit/948cffeb4c0814e92dde25d1085ea599ebd95264), closes [#1464](https://github.com/driftyco/ionic/issues/1464))
* **ionRefresher:** be sure to run on-refresh with an angular digest ([979f7b52](https://github.com/driftyco/ionic/commit/979f7b52759812112179237be407714e98735448), closes [#1465](https://github.com/driftyco/ionic/issues/1465))
* **ionScroll:** let zoom work on android devices ([e88659c6](https://github.com/driftyco/ionic/commit/e88659c6f8a4d39058fdbbb34004166b16a8a73f), closes [#1440](https://github.com/driftyco/ionic/issues/1440))
* **listView:**
  * avoiding potential memory leak from assigning properties directly to an element ([d7793463](https://github.com/driftyco/ionic/commit/d7793463931c70793d6670e9e13d96a4c414e4b0))
  * position dragged list item properly when list view's parent is offset. ([afdf0ad7](https://github.com/driftyco/ionic/commit/afdf0ad764e29a2f8f0301e0d4e81f50afa2e16b), closes [#1583](https://github.com/driftyco/ionic/issues/1583))
* **loading:** backdrop higher z-index ([bfce8e27](https://github.com/driftyco/ionic/commit/bfce8e276939f334dfda0195c2bac557271b03ad))
* **modal:** error message for modal show after remove ([003659b6](https://github.com/driftyco/ionic/commit/003659b65e1f24ea4ef2dc43479fc9717921cf84))
* **nav:** make fewer z-index assumptions while animating in ios7 animation ([02f5fcb7](https://github.com/driftyco/ionic/commit/02f5fcb7aa3f64cd7506146c3773aa61ea32ab27))
* **popup:** focus on first input ([71efd51b](https://github.com/driftyco/ionic/commit/71efd51bffda3010e5a155b74f904b4eb2879146), closes [#822](https://github.com/driftyco/ionic/issues/822))
* **radioButtons:** Correcting a bug introduced by 521164db786a0b836b5b8149816f50da55c6a82a. ([ead5e026](https://github.com/driftyco/ionic/commit/ead5e026b964905cf96a0035c7f2bbaabaa46e5d), closes [#1599](https://github.com/driftyco/ionic/issues/1599))
* **scroll:** input text selecting w/ mouse events ([86e1fe9a](https://github.com/driftyco/ionic/commit/86e1fe9a541da3bea2d4441177ebcbf17839f16b), closes [#1475](https://github.com/driftyco/ionic/issues/1475))
* **tap:**
  * ignoreScrollStart w/ data-tap-disabled ([772459df](https://github.com/driftyco/ionic/commit/772459df1e600cda63a59dc0dd79fe5c28982e56), closes [#1505](https://github.com/driftyco/ionic/issues/1505))
  * cancel simulated click w/ hold events ([f5bb023e](https://github.com/driftyco/ionic/commit/f5bb023ef7ced843b7efc0e44d44dfa573d007be))
* **test:** Use HTML5 doctype on all tests., #1524 ([18391589](https://github.com/driftyco/ionic/commit/18391589790984963f922ba9951300c536b871b5), closes [#1539](https://github.com/driftyco/ionic/issues/1539))


#### Features

* **$ionicActionSheet:** add cancelOnStateChange option, default true ([087e55f3](https://github.com/driftyco/ionic/commit/087e55f320b25828c45f1e57b1f8fe718ebdcd19), closes [#1318](https://github.com/driftyco/ionic/issues/1318))
* **$ionicModal:** add `hardwareBackButtonClose` as option, default true ([9ffca1e4](https://github.com/driftyco/ionic/commit/9ffca1e4eb642d15b896b22666e6e8822cdca115), closes [#1397](https://github.com/driftyco/ionic/issues/1397))
* **$ionicSlideBoxDelegate:** add `start()` to resume after stop ([e4ab045e](https://github.com/driftyco/ionic/commit/e4ab045e30acbb559c8d9d502b701cc865c285cc), closes [#1584](https://github.com/driftyco/ionic/issues/1584))
* **angular:** update to AngularJS v1.2.17 ([89d5553d](https://github.com/driftyco/ionic/commit/89d5553d7f91c49990057a85d39a97be30377c94))
* **collectionRepeat:** huge optimization upgrades ([6af5d68d](https://github.com/driftyco/ionic/commit/6af5d68da42e0f876ae3b7875b2222a3e4ea430b), closes [#1597](https://github.com/driftyco/ionic/issues/1597))
* **gestures:** added gesture directives ([a2dcaf13](https://github.com/driftyco/ionic/commit/a2dcaf13cc4f0680de4fbb1e1fc8e37107c2c595), closes [#829](https://github.com/driftyco/ionic/issues/829))
* **ionScroll:** add has-bouncing=true/false attribute ([00c80e85](https://github.com/driftyco/ionic/commit/00c80e85575ad37af634431583e1e3357b350f62), closes [#1573](https://github.com/driftyco/ionic/issues/1573), [#1367](https://github.com/driftyco/ionic/issues/1367))
* **ionTab:** add class attribute to tab items ([e6f79cc0](https://github.com/driftyco/ionic/commit/e6f79cc0ffdf138f0fc26c834d5f3dfd5d8ed04b))
* **ionic.Platform:** add ionic.Platform.setGrade() function ([05dd7b18](https://github.com/driftyco/ionic/commit/05dd7b18646a532f2f688642439f744e8db2369e), closes [#1104](https://github.com/driftyco/ionic/issues/1104))
* **itemFloatingLabel:** add floating labels: 'item-floating-label' class ([050b4f25](https://github.com/driftyco/ionic/commit/050b4f25dffc8c78a654c85345dd687f99084141), closes [#1611](https://github.com/driftyco/ionic/issues/1611))
* **platforms:** Android and iOS Specific Styles and Transitions ([c30be67f](https://github.com/driftyco/ionic/commit/c30be67f65320a0d8bc32d60ac4f9aecc12f905d))
* **scrollView:** better deceleration for scroll view on iOS ([9c77089a](https://github.com/driftyco/ionic/commit/9c77089a5e41970d1f940abff4d9600db62019f3))


#### Breaking Changes

* $ionicActionSheet's default behavior is now to cancel
when the app's state changes.  To disable this behavior, pass
`cancelOnStateChange: false` into $ionicActionSheet.show().

 ([087e55f3](https://github.com/driftyco/ionic/commit/087e55f320b25828c45f1e57b1f8fe718ebdcd19))
* $ionicActionSheet now returns a method to hide the
action sheet.

Previously, it returned an object that had a `show` and `hide` method.
This was undocumented, but if you used it, here is how to migrate your
code:

Change your code from this:

```js
var sheet = $ionicActionSheet.show({...});
sheet.hide();
```

To this:

```js
var hideSheet = $ionicActionSheet.show({...});
hideSheet();
```

 ([b7646a56](https://github.com/driftyco/ionic/commit/b7646a56309273f37fc73903114de5e363bbf060))

<a name="1.0.0-beta.6"></a>
### 1.0.0-beta.6 "darmstadtium-dingo" (2014-05-21)

#### Bug Fixes

* **click:** fix mouseup click for ion-option-button ([29ee6407](https://github.com/driftyco/ionic/commit/29ee640701195b0eef1cb7a52f1b7112b08259f6))
* **collectionRepeat:** fix rare NPE error on android 4.1 ([94f0b5b7](https://github.com/driftyco/ionic/commit/94f0b5b705d09fc17f2e34977c35e52747767bb1), closes [#1292](https://github.com/driftyco/ionic/issues/1292))
* **input:** fix long input text adjusting left on focus ([e6b5ff22](https://github.com/driftyco/ionic/commit/e6b5ff223b005e933f2503e6122e26010019fb90), closes [#1390](https://github.com/driftyco/ionic/issues/1390))
* **ionContent:** make content scrollable if it is a child of a non-scrollable content ([488bd5c0](https://github.com/driftyco/ionic/commit/488bd5c08cefda6acc91e5c4cc9ec837ae5d31f0), closes [#1421](https://github.com/driftyco/ionic/issues/1421))
* **ionFooterBar:** properly offset content for bar-subfooter ([46e33664](https://github.com/driftyco/ionic/commit/46e3366498f2bb894b6c6a7564bf9f7ccdcd0fee))
* **ionReorderButton:** fix onReorder not triggering an angular digest ([cc46735c](https://github.com/driftyco/ionic/commit/cc46735c82b7fe2e9ddcdec9a2aa09c6b9bb9dee))
* **ionSlideBox:** fix regression allowing slide past boundaries ([ec5a2763](https://github.com/driftyco/ionic/commit/ec5a2763379fc5ee14261a086d80458e13488278), closes [#1414](https://github.com/driftyco/ionic/issues/1414), [#1405](https://github.com/driftyco/ionic/issues/1405), [#1409](https://github.com/driftyco/ionic/issues/1409), [#1321](https://github.com/driftyco/ionic/issues/1321))
* **requirejs:** fix bug with requirejs & loading order of angular taps ([36181091](https://github.com/driftyco/ionic/commit/3618109187a07c03d5d192579366f14a3f2c239c))
* **scrollView:**
  * make xy scrolling work on ionScroll and ionContent ([49f06f9c](https://github.com/driftyco/ionic/commit/49f06f9c3dc9c8ee68bdf91090df497dc5cbbc02), closes [#1462](https://github.com/driftyco/ionic/issues/1462))
  * fix clonedInputs not being removed for large textareas on keyboardshow ([88e41e1a](https://github.com/driftyco/ionic/commit/88e41e1aa55d0633513dd3f1ebdd61aa9e25ad52), closes [#1420](https://github.com/driftyco/ionic/issues/1420))
  * on desktop, make mousewheel only scroll the scrollView under the mouse ([3250d10d](https://github.com/driftyco/ionic/commit/3250d10da754a6e70535a79d9be5fa1b6570d69c), closes [#1376](https://github.com/driftyco/ionic/issues/1376))
  * stop memory-leak when destroying scrollView ([4a210130](https://github.com/driftyco/ionic/commit/4a210130b4babf759f1aab9ba45411ba306a2a9f), closes [#1096](https://github.com/driftyco/ionic/issues/1096))
* **tap:** select tag not working in IE ([7059b818](https://github.com/driftyco/ionic/commit/7059b818ce1866a647b124440758fce601cf1cbe), closes [#1435](https://github.com/driftyco/ionic/issues/1435))


#### Features

* **footer:** keyboard-attach attribute directive to position footer above keyboard ([09d1197a](https://github.com/driftyco/ionic/commit/09d1197acd97e7c9424969757d5c1bd1f60783ae))


<a name="1.0.0-beta.5b"></a>
### 1.0.0-beta.5b "cadmium-camel" (2014-05-14)


#### Bug Fixes

* **sideMenu:**
  * do not let the user scroll the whole body by dragging the menu horizontally ([6e149eef](https://github.com/driftyco/ionic/commit/6e149eef9bf5fbee454448f6cfa6f0ea9cce60d3))
  * fix disabled menu links ([fa8aa6a8](https://github.com/driftyco/ionic/commit/fa8aa6a835eaa4608984e5a37b4c2a5b8fa19498), closes [#1388](https://github.com/driftyco/ionic/issues/1388))


#### Features

* **checkbox:** right align w/ .item-checkbox-right ([610e2328](https://github.com/driftyco/ionic/commit/610e2328403388453854984ae4534f0686358d48), closes [#1290](https://github.com/driftyco/ionic/issues/1290))


<a name="1.0.0-beta.5"></a>
### 1.0.0-beta.5 "barium-bobcat" (2014-05-14)


#### Bug Fixes

* **$ionicLoading:** do not flicker when showing long loading messages ([90e7395e](https://github.com/driftyco/ionic/commit/90e7395e62f524adba658622ebe0efef2be1f45c), closes [#1252](https://github.com/driftyco/ionic/issues/1252))
* **.slide-left-right-ios7:** do not give borders to header/footer bars ([30a9da19](https://github.com/driftyco/ionic/commit/30a9da191a742f49962e4447e31c28ad2b5f907a), closes [#1232](https://github.com/driftyco/ionic/issues/1232))
* **.tab-item:** make it work with activator ([1b1c234f](https://github.com/driftyco/ionic/commit/1b1c234fff09c5669607aeacbad8611edc2f901e), closes [#1317](https://github.com/driftyco/ionic/issues/1317))
* **CustomEvent:** fix IE CustomEvent polyfill ([191464c9](https://github.com/driftyco/ionic/commit/191464c98c5fc8787a0ba8b847d802cffafee9ab))
* **activator:** properly activate elements nested inside an item ([3c15b118](https://github.com/driftyco/ionic/commit/3c15b118ca741bdbfe5314e222f069cbdeb15bf2))
* **button:** fix icon vertical alignments for IE 10 ([930794cd](https://github.com/driftyco/ionic/commit/930794cd9a94afaf0366b152da14a5eabea64e6c))
* **e2e-tests:** disable ionic-tap during e2e tests ([636ca943](https://github.com/driftyco/ionic/commit/636ca9432527d4cb32b6256578423c27ca066bc2), closes [#1310](https://github.com/driftyco/ionic/issues/1310))
* **footer:** Fix placement of .bar-footer.item-input-inset ([eaee564d](https://github.com/driftyco/ionic/commit/eaee564de189536998d9cb4472cccc1146fd3303), closes [#1325](https://github.com/driftyco/ionic/issues/1325))
* **header:** Set a height for `.bar .title` ([0c960b54](https://github.com/driftyco/ionic/commit/0c960b545082c078b46fa80b83aa49d1f9c4832c))
* **headerBar:** tap to scroll to top only on the nearest scrollview ([58c97e0d](https://github.com/driftyco/ionic/commit/58c97e0d2eaab038e74435d014b12d3189bba913), closes [#1329](https://github.com/driftyco/ionic/issues/1329))
* **input:**
  * vertically align date input text ([e5af75fa](https://github.com/driftyco/ionic/commit/e5af75fa4897d428c81f089e7e9ef9b318f27739), closes [#1147](https://github.com/driftyco/ionic/issues/1147))
  * transparent bg for .item-input-inset input ([08f0adb1](https://github.com/driftyco/ionic/commit/08f0adb12b84e817a814524aada57bbb7b747933))
* **ion-header-bar:** when hidden, correctly offset the ion-content ([efa61844](https://github.com/driftyco/ionic/commit/efa61844860349fb3045cb3b9cd962fba615ae8c), closes [#1351](https://github.com/driftyco/ionic/issues/1351))
* **ionCheckbox:** make ng-checked and ng-change work ([a006d896](https://github.com/driftyco/ionic/commit/a006d896123b6eebd160dd5472b524c2e8693197), closes [#1349](https://github.com/driftyco/ionic/issues/1349))
* **ionItem:** transform to `<a>` tag for ui-sref ([c6c1300b](https://github.com/driftyco/ionic/commit/c6c1300b46b8ee9997713a415726872be610844b))
* **ionNavButtons:** do not append if page is removed very quickly ([24a488bb](https://github.com/driftyco/ionic/commit/24a488bbb3c4b782e25e8fede6a51d4e56556977))
* **ionToggle:** stop error in edge case of drag ending before raf ([d108a29e](https://github.com/driftyco/ionic/commit/d108a29e58bf5fe0825987880bb0d7b22a360217))
* **ionView:**
  * make it set navbar if title changes back to old value ([919d4f8d](https://github.com/driftyco/ionic/commit/919d4f8dcadd386a39f94dc817f6da757ca9e755), closes [#1121](https://github.com/driftyco/ionic/issues/1121))
  * make sure title is set correctly in edge cases ([4814a63b](https://github.com/driftyco/ionic/commit/4814a63bda911d7274dce40b5402518e1acfe4f7))
* **listView:** reordering upwards in a list is more responsive, fix scrolling error ([df9c0747](https://github.com/driftyco/ionic/commit/df9c0747c9aede5f6f8c91f953da312f5089d475), closes [#1202](https://github.com/driftyco/ionic/issues/1202))
* **refresher:** make arrow spin correctly ([2ec01733](https://github.com/driftyco/ionic/commit/2ec01733a592a404df6f11f670b035f20b2a2516), closes [#1319](https://github.com/driftyco/ionic/issues/1319))
* **scroll:**
  * scroll inputs correctly with footer ([373c0cd4](https://github.com/driftyco/ionic/commit/373c0cd44f065204571e53f10d5ad70e4d649e2c))
  * Scrolling using pointer events ([ed3ee1d0](https://github.com/driftyco/ionic/commit/ed3ee1d02b09bd3e3d1b82c263c84c70b1c7f612))
* **select:**
  * hide .item-select arrow in WP8 ([cb597d76](https://github.com/driftyco/ionic/commit/cb597d76be005fa1304eb4c93a211e0f3e12fab5))
  * select option in desktop Firefox ([65749a40](https://github.com/driftyco/ionic/commit/65749a40bb87609b94e6de54d5833d51818a3f87), closes [#1251](https://github.com/driftyco/ionic/issues/1251))
  * Open select options on Android 2.3 ([d839f4da](https://github.com/driftyco/ionic/commit/d839f4da64f640b31bec1de1ff34685c9d614d9f), closes [#1298](https://github.com/driftyco/ionic/issues/1298))
* **sideMenu:** Disable content interaction when menu open ([76d4c083](https://github.com/driftyco/ionic/commit/76d4c083cb6bfc653e230fd72e03105493ec8380), closes [#1339](https://github.com/driftyco/ionic/issues/1339))
* **tap:**
  * Normalize taps w/ pointer events also ([1a2e501f](https://github.com/driftyco/ionic/commit/1a2e501f259725b012e525c7c4e590106b6fd2b3))
  * Prevent different input focus after 300ms delay ([8730e62e](https://github.com/driftyco/ionic/commit/8730e62e627a5bf7407c3cf95f2a58fe4297d865), closes [#1370](https://github.com/driftyco/ionic/issues/1370))
* **textarea:** Allow scroll in textarea when focused ([5f2fdfdd](https://github.com/driftyco/ionic/commit/5f2fdfdd07d2cfcfa03113a4f94b302a13a6909e), closes [#1280](https://github.com/driftyco/ionic/issues/1280))


#### Features

* **$ionicModal:** allow configuration of backdropClickToClose ([291d723a](https://github.com/driftyco/ionic/commit/291d723ab1d8b173bb7581a48f796e9b3522d81f))
* **ionNavBackButton:** make pressed state work ([8d34ab28](https://github.com/driftyco/ionic/commit/8d34ab286e0ff6bf3730f928ce81a80d6e25a212))
* **platform:** added isWindowsPhone() method ([08e4b3d9](https://github.com/driftyco/ionic/commit/08e4b3d95b25bcfd8b297b4700c9f22f7ae4ceaf))
* **tap:** Make TAP_RELEASE_TOLERANCE configurable ([27369930](https://github.com/driftyco/ionic/commit/2736993083978ca23e356ae530aed1c761ff45dc))
* **touch-action:** add touch-action: manipulation ([40cd6f72](https://github.com/driftyco/ionic/commit/40cd6f729062a3bc72bdc36ae6efee6bc9411fa5))
* **ui-router:** upgrade to angular-ui-router v0.2.10 ([b9353e71](https://github.com/driftyco/ionic/commit/b9353e71f6ef5aa8f0ff55851a2ddcc414524a30), closes [#941](https://github.com/driftyco/ionic/issues/941))


#### Breaking Changes

* ion-checkbox no longer has an isolate scope.

This will break your checkbox only if you were relying upon the
checkbox having an isolate scope: if you were referencing
`$parent.value` as the ng-disabled attribute, for example.

Change your code from this:

```html
<ion-checkbox ng-disabled="{{$parent.isDisabled}}"></ion-checkbox>
```

To this:

```html
<ion-checkbox ng-disabled="{{isDisabled}}"></ion-checkbox>
```

 ([a006d896](https://github.com/driftyco/ionic/commit/a006d896123b6eebd160dd5472b524c2e8693197))


<a name="1.0.0-beta.4"></a>
### 1.0.0-beta.4 "antimony-antelope" (2014-05-07)


#### Bug Fixes

* **.pane:** Remove overflow:hidden from .pane,.view ([64f0030b](https://github.com/driftyco/ionic/commit/64f0030b99ba83772d698252470894740e270f9b))
* **.tabs-icon-*:** only work on directly descendant tabs ([77f26831](https://github.com/driftyco/ionic/commit/77f268312468b8272d009bd68b2e408316e00dc0), closes [#1261](https://github.com/driftyco/ionic/issues/1261))
* **bar:** properly align titles if switching to view with no buttons ([ade143ed](https://github.com/driftyco/ionic/commit/ade143ed35a4a17e5ffffaec17b5529eae3b1dde), closes [#1242](https://github.com/driftyco/ionic/issues/1242))
* **collectionRepeat:** correctly save user scroll position on back ([0a640758](https://github.com/driftyco/ionic/commit/0a640758842d4307dba43aa702fe8d9dc17b164a))
* **ionItem:** fix error when repeating ([f370db45](https://github.com/driftyco/ionic/commit/f370db45bc9cce3aee3d8b3dccad6f38dd203a20))
* **ionSlideBox:**
  * fix disable-scroll attr, deprecate in favor of $ionicSlideBoxDelegate.enableSlide(true/false) ([1bdb5e8d](https://github.com/driftyco/ionic/commit/1bdb5e8d9f1798fcd0acbf7cce6bd7b6166a0096), closes [#1113](https://github.com/driftyco/ionic/issues/1113))
  * prevent NPE during drag ([920dc59d](https://github.com/driftyco/ionic/commit/920dc59d75acdcc0a109a6731088b3d3cff09d85), closes [#1240](https://github.com/driftyco/ionic/issues/1240))
* **modal:** Remove modal flicker, closes #1150 ([d2ebed84](https://github.com/driftyco/ionic/commit/d2ebed847e0214e4654337947c8d3c15ee7c87f9))
* **scrollView:** recalculate size on mousewheel scroll ([89a9ed15](https://github.com/driftyco/ionic/commit/89a9ed1547010d90591798625eeaea973aaf6c20))
* **select:** Select options w/ mouse events, closes #1251 ([e3306293](https://github.com/driftyco/ionic/commit/e3306293cc62ff9ef931b4dc6d0b76c61ab247a2))
* **tap:** input[file] clicks within ion-content, closes #1237 ([05a6d7cc](https://github.com/driftyco/ionic/commit/05a6d7cca660e7f5b3b2ee4b5698dfb33df7b605))
* **toggle:** Right side padding for item-complex, closes #1091 ([45106a6a](https://github.com/driftyco/ionic/commit/45106a6acfedf8b77a0f46d9f0b1b35e4a76c548))
* **transitions:** Disable transitions on Android 2, closes #780 ([9c58d47b](https://github.com/driftyco/ionic/commit/9c58d47b2b7c4d5695c1eb1b2ee7d23555ae0137))
* **viewport:**
  * Auto update viewport tag ([5f8e9040](https://github.com/driftyco/ionic/commit/5f8e9040bd8eb8dfef0db5bfef9275ef4a51f0da))
  * Remove height value on iOS browser ([0ad10ede](https://github.com/driftyco/ionic/commit/0ad10edefcdcc67d20fb837f635609974af5dbd7))


#### Features

* **$ionicLoading:** on android, no back button action while loading ([fc8711c7](https://github.com/driftyco/ionic/commit/fc8711c7d000d06bfc30fcf813b2b9e26c228be5), closes [#1273](https://github.com/driftyco/ionic/issues/1273))
* **$ionicModal:** close on backdrop click on desktop/tablet ([554c4398](https://github.com/driftyco/ionic/commit/554c43980e555d4506b4035ed100aca22c51da0c), closes [#1087](https://github.com/driftyco/ionic/issues/1087))
* **ionNavBar:** allow navbar inside ion-view to transition whole bar ([42177c3b](https://github.com/driftyco/ionic/commit/42177c3b939f6fd2dafb7b6c30bce4ef31540411), closes [#1232](https://github.com/driftyco/ionic/issues/1232))
* **sideMenu:** make android back button close side menu ([10103559](https://github.com/driftyco/ionic/commit/101035593f520ded77d61013d0330f537d270168), closes [#1264](https://github.com/driftyco/ionic/issues/1264))


<a name="1.0.0-beta.3"></a>
### 1.0.0-beta.3 "americium" (2014-04-30)


#### Bug Fixes

* **$ionicModal:** do not inherit has-header etc from parent scope ([6c0c8350](https://github.com/driftyco/ionic/commit/6c0c8350f2d925a91bcf1460dc58c7beb8c97922), closes [#1191](https://github.com/driftyco/ionic/issues/1191))
* **.pane:** make pane class have overflow: hidden; fixes scrolling whole page from header/footer errors ([dca87e2c](https://github.com/driftyco/ionic/commit/dca87e2c5f8992c0b38ac02e3e71b73b6e18388d), closes [#1218](https://github.com/driftyco/ionic/issues/1218))
* **android-2.2:** use string notation for reserved 'class' keyword ([3bcf06f2](https://github.com/driftyco/ionic/commit/3bcf06f217582922bc16af198597ccc17274b929), closes [#1228](https://github.com/driftyco/ionic/issues/1228))
* **collectionRepeat:** allow percent expressions ([94bcbf75](https://github.com/driftyco/ionic/commit/94bcbf753bdefd2b7ff5ac34d1eb594af5bfb02d))
* **infiniteScroll:** allow to fire if list does not fill up screen ([e35b95e1](https://github.com/driftyco/ionic/commit/e35b95e1238038787def75c1cb9bf4cbb524d327))
* **ionHeaderBar:** have no side effects with content in other views ([7fd31b6a](https://github.com/driftyco/ionic/commit/7fd31b6aed4dbe132566071f54b5a7cbf6ab46cb), closes [#1095](https://github.com/driftyco/ionic/issues/1095))
* **ionList:** make reorder follow an offset list as it scrolls ([3a68a2c9](https://github.com/driftyco/ionic/commit/3a68a2c9022e586c7c313418be8c05005dc5c682))
* **ionRadio:** pass name property down to input element ([9995f46b](https://github.com/driftyco/ionic/commit/9995f46b223406fdf4a45270f185eacb5135bc37), closes [#1229](https://github.com/driftyco/ionic/issues/1229))
* **ionTab:** make it so tabNav works with ngRepeat ([288d4ac2](https://github.com/driftyco/ionic/commit/288d4ac230a00898b9388fdb6e6caf386dfb840d))
* **ionView:**
  * initialize hideBack/hideNav to false if undefined ([5e56c2d6](https://github.com/driftyco/ionic/commit/5e56c2d6b78dbb8943adc738dc214ffef066e654))
  * only $watch attributes if defined ([12e5f6c1](https://github.com/driftyco/ionic/commit/12e5f6c1162adc1094026c5539932a66f5767fb9), closes [#1216](https://github.com/driftyco/ionic/issues/1216))
* **scrollView:** stop polluting global.core ([8992e7c9](https://github.com/driftyco/ionic/commit/8992e7c903543340b50f3074a43eff3e1b884b45))


#### Features

* **$ionicActionSheet:** allow html binding of buttons and title ([3e5b39f2](https://github.com/driftyco/ionic/commit/3e5b39f20175fbe16d7439bdfbeb508544782fbf), closes [#1219](https://github.com/driftyco/ionic/issues/1219))
* **$ionicPopup:** on android, make back button close popup ([b87bcb30](https://github.com/driftyco/ionic/commit/b87bcb30c33fb577b41139c43089b2a864211d56), closes [#1222](https://github.com/driftyco/ionic/issues/1222))
* **$ionicSlideBoxDelegate:** add enableSlide(true/false) method ([e003bf18](https://github.com/driftyco/ionic/commit/e003bf18bc0d771c85ae124e89f0ad2dad0aae71), closes [#1122](https://github.com/driftyco/ionic/issues/1122))


<a name="1.0.0-beta.2"></a>
### 1.0.0-beta.2 "aluminum" (2014-04-28)


#### Bug Fixes

* **$ionicActionSheet:** provide default functions for options ([ba39fb00](https://github.com/driftyco/ionic/commit/ba39fb0046cf9ff8b3d18fb8ac7d10d734afe192), closes [#1013](https://github.com/driftyco/ionic/issues/1013))
* **$ionicLoading:** stop race condition with show and hide ([eb1dee93](https://github.com/driftyco/ionic/commit/eb1dee9303177d47315a02cf327e909c14c05b22), closes [#1100](https://github.com/driftyco/ionic/issues/1100))
* **$ionicModal:** make it use jqLite#remove() ([104c6420](https://github.com/driftyco/ionic/commit/104c642019a05ef70dee8de84a51b99272266d63), closes [#1138](https://github.com/driftyco/ionic/issues/1138))
* **$ionicPopup:**
  * stop race condition with show then hide ([698c93fc](https://github.com/driftyco/ionic/commit/698c93fcaf5def44cc01783faa6e188c15379e40))
  * make it work if jquery is included ([21ff7547](https://github.com/driftyco/ionic/commit/21ff75479f2dbc6cc4824732d7edc79e1d138491), closes [#1027](https://github.com/driftyco/ionic/issues/1027))
* **active:** Taps/clicks now use .activated instead of .active, closes #913 ([870dcd6f](https://github.com/driftyco/ionic/commit/870dcd6f992f62c1a34258039d2a427490aa1b6d))
* **bar:** Increased button icon font size ([8847774f](https://github.com/driftyco/ionic/commit/8847774f2aa6ce6eb4747d3ce1fe7a49e4bc8502))
* **checkbox:**
  * Remove tap highlight and fix checkbox appearance in Firefox, closes #496 ([b0b446d5](https://github.com/driftyco/ionic/commit/b0b446d5d93cbfca027c828bc38bf827b998b6c5))
  * stretch checkbox's clickable area to full width ([5238f8f3](https://github.com/driftyco/ionic/commit/5238f8f3dd6d527814f67fc5aa1ad003dc04c160))
  * Entire row of an .item w/ a checkbox is now tappable, closes #995 ([ac94bb23](https://github.com/driftyco/ionic/commit/ac94bb236ecb9646d406def39b56a2a099e76d28))
* **header:** Header input too long on Android 4.2, closes #1081 ([b654e02e](https://github.com/driftyco/ionic/commit/b654e02e0a8b852875509753eb106f60c11fa3c4))
* **input:** Fix to hide input overlays on old Android ([0e9072e4](https://github.com/driftyco/ionic/commit/0e9072e48123e3542680047d9378b9418a7a3311))
* **ion-scroll:**
  * removed 100% height ([f0d33981](https://github.com/driftyco/ionic/commit/f0d339812f869e919b6a434eb5674f3d06a518c1))
  * added display block ([d295aee4](https://github.com/driftyco/ionic/commit/d295aee416aa89a1284f015ed5f65d81a95b6173))
* **ionContent:**
  * fix scoping with ngController ([6abce8f7](https://github.com/driftyco/ionic/commit/6abce8f771f0e6eeae3e6e7d87f11bd3f2318dcc), closes [#1155](https://github.com/driftyco/ionic/issues/1155))
  * do not let child scopes inherit has-* classes ([a5eb48b9](https://github.com/driftyco/ionic/commit/a5eb48b9569d3c9f90c238a7ce6f33b5753266f7), closes [#924](https://github.com/driftyco/ionic/issues/924))
* **ionHeaderBar:**
  * do not tapScrollToTop for inputs ([5722900a](https://github.com/driftyco/ionic/commit/5722900a5851d8037ab933e16c94569efc11f476), closes [#1199](https://github.com/driftyco/ionic/issues/1199))
  * make it align after elements properly load ([d00aaa59](https://github.com/driftyco/ionic/commit/d00aaa59455fdd6b4e34ac4547e86e1049734954))
* **ionInfiniteScroll:**
  * remove listener on $destroy ([08da6f75](https://github.com/driftyco/ionic/commit/08da6f753c399a3e9fcf66bdc9008f9f6cb3e227))
  * work properly if past horizontal boundaries ([d58fff72](https://github.com/driftyco/ionic/commit/d58fff72ded2a74c1d4e757adfb256b7e74fb578), closes [#1073](https://github.com/driftyco/ionic/issues/1073))
* **ionList:**
  * disable swiping of items while option buttons are shown ([81676e6e](https://github.com/driftyco/ionic/commit/81676e6ef798422fed45b461bf80d1ebeef9fc33))
  * do not let option button click propagate to item ([a845ff34](https://github.com/driftyco/ionic/commit/a845ff348943beba2fd4758744f7ee7b865b4ade))
  * disable tap on element being edited ([634b3971](https://github.com/driftyco/ionic/commit/634b3971b1456744ccd4321600f8d50099245a56))
  * make reorder position work if list is offset ([90da2da6](https://github.com/driftyco/ionic/commit/90da2da66f87813afe9ee4a1727cbc423af77a64))
  * show reorder/delete on item creation if list is showing ([09a77299](https://github.com/driftyco/ionic/commit/09a7729914ee3e24fe12535f223f9f755c8791e1), closes [#1181](https://github.com/driftyco/ionic/issues/1181))
* **ionNavBar:** adjust has-header if ionNavBar is hidden ([41b73abf](https://github.com/driftyco/ionic/commit/41b73abf40a34d1c96245a2d73d977a9be05d6ea), closes [#927](https://github.com/driftyco/ionic/issues/927))
* **ionNavButtons:**
  * fix side="left" flicker with back button on ios ([b6266889](https://github.com/driftyco/ionic/commit/b6266889a43cc5b71b4520f8b43d5cc73139b3f3))
  * multiple ionNavButtons elements align correctly ([58de2671](https://github.com/driftyco/ionic/commit/58de267171790eb7ebfb8163ebc9523ce10b7e49), closes [#930](https://github.com/driftyco/ionic/issues/930))
* **ionRefresher:** do not animate pulling-text ([5c893ab8](https://github.com/driftyco/ionic/commit/5c893ab81acf2af8442b321ad1c9bfd47e1c7981), closes [#909](https://github.com/driftyco/ionic/issues/909))
* **ionTab:** make sure all tab-nav attributes are re-interpolated on change ([757f1819](https://github.com/driftyco/ionic/commit/757f1819313de58a3d419d0ec6075c80e40f3d61), closes [#955](https://github.com/driftyco/ionic/issues/955), [#1071](https://github.com/driftyco/ionic/issues/1071))
* **ionView:** do not set navbar title if no title attr set ([d53eab81](https://github.com/driftyco/ionic/commit/d53eab819728e56ec3ee9a0906b79e277c30c07e), closes [#915](https://github.com/driftyco/ionic/issues/915))
* **ionicPopup:** if input exists, focus it. else, focus first button ([93aa16a7](https://github.com/driftyco/ionic/commit/93aa16a78ba9732a3b47d3b952c1a58db755cc3b), closes [#1176](https://github.com/driftyco/ionic/issues/1176))
* **ionicTabBar:** detect if matches state in all cases ([ee2b7686](https://github.com/driftyco/ionic/commit/ee2b76864abfecbb1f8aa53c70339e82d22a23b3))
* **item:**
  * Vertically align nav icon w/out flexbox to prevent android crashes, #928 ([5b0f5d02](https://github.com/driftyco/ionic/commit/5b0f5d024c191f76b368858961d1c711d1eaa3ab))
  * Fix css overflow overrides for .item-text-wrap ([04b4d771](https://github.com/driftyco/ionic/commit/04b4d771c616a3884d127183bd12cf85f23232ab))
  * Fix delete icon alignment in .item-icon.left, closes #946 ([044211de](https://github.com/driftyco/ionic/commit/044211def34cc57e0b1a90e8541640b640a2de75))
* **labels:** Fix .input-label's width for androids w/out full flex box support, #998 ([096a01c1](https://github.com/driftyco/ionic/commit/096a01c117e4ba0eafc17af3f0992c5ff10008bd))
* **listView:** fixed active state on scroll ([040af824](https://github.com/driftyco/ionic/commit/040af8245d42fd17c7f2bd5bce5438330a90cf95))
* **loading:** fix not hiding after two shows, always cancel delay ([4216266f](https://github.com/driftyco/ionic/commit/4216266f2108f0b3c348b0888d37a59440099be4), closes [#1130](https://github.com/driftyco/ionic/issues/1130))
* **modal:** Increase delay of removing .modal-open to prevent focus under modals ([83fd11c5](https://github.com/driftyco/ionic/commit/83fd11c5655e38226029fc00c43b921430fb6b32))
* **navClear:**
  * only set viewOptions if click leads to state change ([4dffc5f6](https://github.com/driftyco/ionic/commit/4dffc5f6c646ee55a44c818aca9e635ea0934a3c), closes [#1043](https://github.com/driftyco/ionic/issues/1043))
  * be sure it runs before ngClick ([4f47bf24](https://github.com/driftyco/ionic/commit/4f47bf24f05c4f5007bad96c37d3a566ad50cb39), closes [#1047](https://github.com/driftyco/ionic/issues/1047))
* **popup:** Backwards compatible remove popup from DOM, closes #851 ([441a21c4](https://github.com/driftyco/ionic/commit/441a21c4949827a52d1a6edff58f1cb786744acb))
* **range:** Fix range being able to slide when in a side menu, closes #318 ([2fbdebcd](https://github.com/driftyco/ionic/commit/2fbdebcdea97ba2896106b80ca8c061588434c66))
* **refresher:** get rid of flickers except on droid-4.4 ([ad671848](https://github.com/driftyco/ionic/commit/ad67184800a22a8d27e3859298cc3f7e83b2a25c), closes [#1014](https://github.com/driftyco/ionic/issues/1014))
* **scroll:**
  * Allow scrolling when touchstart target is an input, #1078 ([8af018b1](https://github.com/driftyco/ionic/commit/8af018b1facff1dee753f0cf4c341f0a91285d6a))
  * Fix input focus when tapped, do not scroll when target is an input, closes #1020 ([66ecec70](https://github.com/driftyco/ionic/commit/66ecec7031ae472351da6a192364097e889d96a8))
  * Do not ignore taps if the target was an input, #997 ([e6f56237](https://github.com/driftyco/ionic/commit/e6f562377d124db4018d5664d4da6d41e7587230))
  * Fix scroll for devices w/out dataset support, closes #976 ([bfcf2650](https://github.com/driftyco/ionic/commit/bfcf26507f0f0c50405a6e48761f2a4eb76c5c02))
* **scss:** make tabs,header,footer aligned right with statusbar ([c2a38a6d](https://github.com/driftyco/ionic/commit/c2a38a6d3d105319a0462d90464562be3296295a))
* **tabs:** Tab icon align within nested tabs, closes #1093 ([2a6f7029](https://github.com/driftyco/ionic/commit/2a6f7029805596e56373213cf3c4139cc7d7d70c))
* **tabs-item-hide:** only hide tab nav items ([a7eb521c](https://github.com/driftyco/ionic/commit/a7eb521c90fa7c8c2412308951fd04a87544683f))
* **tap:**
  * Do not preventDefault after input focus, #1068 ([a977332f](https://github.com/driftyco/ionic/commit/a977332f2b847262a406cf1fbedb2c3bb6b560eb))
  * Remove 300ms delay when tapping select elements ([cf686548](https://github.com/driftyco/ionic/commit/cf686548daf3c33ada2fff7de048aeb2ce3c61a7))
  * Prevent clicks from firing after scrolling, #579 ([cb602b58](https://github.com/driftyco/ionic/commit/cb602b587bfb4e9c92ef9f0542927aafeb39eef1))
  * Deactivate elements during scroll at the same time click is ignored, #997 ([3ee5ea77](https://github.com/driftyco/ionic/commit/3ee5ea77a64f05423d34fbe6da8a4c4fcf0fdb6c))
  * Do not simulate a click if it was from a touchcanel event, closes #1015 ([78510099](https://github.com/driftyco/ionic/commit/78510099add6d65a925c497ab9303560474a1807))
  * Prevent multiple clicks when overriding cordova object, closes #1022 ([5f3a1d21](https://github.com/driftyco/ionic/commit/5f3a1d21c6352e51f450dbdacace1e527048698f))
  * Prevent "clicking" when scrolling ([f3bd258c](https://github.com/driftyco/ionic/commit/f3bd258c9ee39503c9d34d85ad31c754fff0c03c))
  * Increate isScrolledSinceStart from 2px radius to 15px, #970 ([9a49129a](https://github.com/driftyco/ionic/commit/9a49129aa090caf221f0c0b2a77f86b4a69ab652))


#### Features

* **$ionicBackdrop:** add backdrop show/hide service ([730a33b9](https://github.com/driftyco/ionic/commit/730a33b9c34babaa7f4c861fa172935eaabea740), closes [#1084](https://github.com/driftyco/ionic/issues/1084))
* **$ionicModal:**
  * pass modal instance to modal.shown/modal.hidden events ([a19e3b62](https://github.com/driftyco/ionic/commit/a19e3b62f80f69cec9d478a095b4a59d0dca8742), closes [#1065](https://github.com/driftyco/ionic/issues/1065))
  * show/hide/remove return promises for animating ([39385008](https://github.com/driftyco/ionic/commit/393850086fbff30f5f04026e70f8143c9c21f06f))
* **$ionicNavBarDelegate:**
  * showBackButton returns whether bar is shown ([933a555e](https://github.com/driftyco/ionic/commit/933a555e084234462ad04b7255bd1a0e0c6b2aef), closes [#1076](https://github.com/driftyco/ionic/issues/1076))
  * showBar returns whether navbar is shown ([24a415c3](https://github.com/driftyco/ionic/commit/24a415c32dfe922174dd3a36e9b63bd2ea426fd9))
* **$ionicScrollDelegate:**
  * add getScrollView(), getScrollPosition() ([b5ef9313](https://github.com/driftyco/ionic/commit/b5ef9313cfd227c716a2096a5ca40d38179ba50f), closes [#1117](https://github.com/driftyco/ionic/issues/1117))
  * add scrollBy(left,top,animate) to delegate ([f847c208](https://github.com/driftyco/ionic/commit/f847c2084774f51731239def71bd2612af5fc141), closes [#987](https://github.com/driftyco/ionic/issues/987))
* **$ionicSideMenuDelegate:**
  * add isOpen() method ([518e54ee](https://github.com/driftyco/ionic/commit/518e54ee86aa816d57ff0dcff33d2ce75fa0e712), closes [#1074](https://github.com/driftyco/ionic/issues/1074))
  * add getOpenRatio() method ([ac0e981f](https://github.com/driftyco/ionic/commit/ac0e981f9e0c90458e7ab4bb3c86545a26320065), closes [#944](https://github.com/driftyco/ionic/issues/944))
* **avatar:** Adding .item-avatar-left and deprecating .item-avatar ([9bac6050](https://github.com/driftyco/ionic/commit/9bac6050a0c4d7a3693eb9bcf8b7b7fc5cca980e))
* **collection-repeat:** add repeat lsdirective for huge lists ([f0a1c037](https://github.com/driftyco/ionic/commit/f0a1c0375979ef959bfe1acf80f6ecebb473a8c6))
* **grid:** Added .row-baseline and .row-stretch ([e0e7a83b](https://github.com/driftyco/ionic/commit/e0e7a83b076cc5c098c2b76348546bd716e5fddd))
* **ionCheckbox:** allow ng-disabled attribute ([d2e54a82](https://github.com/driftyco/ionic/commit/d2e54a823a105dbf65a1800cfa8fff1b4adec82b), closes [#939](https://github.com/driftyco/ionic/issues/939))
* **ionContent:** don't wrap in a .scroll element if scroll="false" ([73da93d4](https://github.com/driftyco/ionic/commit/73da93d4a42dd82ffbba9e18e12e70d39ff51a39), closes [#841](https://github.com/driftyco/ionic/issues/841))
* **ionNavBar:** make back button animated ([97257938](https://github.com/driftyco/ionic/commit/972579383a73af991924639299c933bd50ba0f6e), closes [#1030](https://github.com/driftyco/ionic/issues/1030))
* **ionSlideBox:** add pager-click attribute ([d6c960c2](https://github.com/driftyco/ionic/commit/d6c960c2a64372d158e675d6627209ae82d8c7ee), closes [#785](https://github.com/driftyco/ionic/issues/785))
* **loading:** Moved loading scss to its own file and added variables, closes #984 ([e3491864](https://github.com/driftyco/ionic/commit/e3491864b2ae117cb35400891253ead917b298de))
* **select:** Styled select elements, both inline and as a list item ([8a12f2d1](https://github.com/driftyco/ionic/commit/8a12f2d16c591199400ecbb478d5b047d6b46284))


#### Breaking Changes

* $ionicPopup.show()'s button onTap function has changed.

When using `$ionicPopup.show()`, previously a button's onTap function
would only result in closing the popup and resolving the promise if the
 `onTap(event)` function returned a truthy value.

Now, a button's onTap event will *always* close the popup and resolve
the popup's promise, no matter the return value, by default. The only
way to prevent the popup from closing is to call
`event.preventDefault()`.

Change your code from this:

```js
$ionicPopup.show({
  buttons: [{
    onTap: function(event) {
      if (!shouldClosePopup) {
        return false;
      }
    }
  }]
});
```

To this:

```js
$ionicPopup.show({
  buttons: [{
    onTap: function(event) {
      if (!shouldClosePopup) {
        event.preventDefault();
      }
    }
  }]
});
```
 ([cb1a5f62](https://github.com/driftyco/ionic/commit/cb1a5f62285fe5939274bdda9db169af69eddf35))
* The developer should be stating exactly how an icon
should show, but previously the right nav arrow icon violates this by
automatically showing a right arrow when an item was an anchor or
button. Instead of using the `:after` item selector, which was always
applied by default, it uses the same markup as `item-icon-right`, which
is easier to understand, customizable and not a hard coded default.

This change removes the `:after` nav icon styling, and creates a new
class, `icon-accessory`, based off of similar CSS. The change makes a
nav arrow highly customizable, allows RTL developers to easily control
the arrow direction, and the accessory class is something that's
reusable.

An example of right side arrow using `ion-chevron-right` as the icon:

    <a class="item item-icon-right" href="#">
      Check mail
      <i class="icon ion-chevron-right icon-accessory"></i>
    </a>
 ([c7e3defc](https://github.com/driftyco/ionic/commit/c7e3defca51f03368be84e7f86d71e7ec2fb374c))
* ionic.Platform.isCordova() has been renamed to
ionic.Platform.isWebView()
 ([5c300dd3](https://github.com/driftyco/ionic/commit/5c300dd3e094e20ca90a311a704dfa0864b320f4))
* ion-list syntax has changed in favor of simplicity &
flexibility.

Relevant documentation:
[ionList](http://ionicframework.com/docs/api/directive/ionList),
[ionItem](http://ionicframework.com/docs/api/directive/ionItem),
[ionOptionButton](http://ionicframework.com/docs/api/directive/ionOptionButton),
[ionReorderButton](http://ionicframework.com/docs/api/directive/ionReorderButton),
[ionDeleteButton](http://ionicframework.com/docs/api/directive/ionDeleteButton),
[$ionicListDelegate](http://ionicframework.com/docs/api/service/$ionicListDelegate).

To migrate, change your code from this:

```html
<ion-list option-buttons="[{text:'hello',type:'button-positive',onTap:tap()}]"
          on-delete="onDelete(el)"
          delete-icon="ion-minus-circled"
          can-delete="true"
          show-delete="shouldShowDelete"
          on-reorder="onReorder(el, startIndex, toIndex)"
          reorder-icon="ion-navicon"
          can-reorder="true"
          show-reorder="shouldShowReorder">
  <ion-item ng-repeat="item in items">
    {{item}}
  </ion-item>
</ion-list>
```

To this:

```html
<ion-list show-delete="shouldShowDelete"
          show-reorder="shouldShowReorder">
  <ion-item ng-repeat="item in items">
    {{item}}
    <ion-delete-button class="ion-minus-circled"
                       ng-click="onDelete(item)">
    </ion-delete-button>
    <ion-reorder-button class="ion-navicon"
                       ng-click="onReorder(item, $fromIndex, $toIndex)">
    </ion-reorder-button>
    <ion-option-button class="button-positive" ng-click="tap()">
      Hello
    </ion-option-button>
  </ion-item>
</ion-list>
```
 ([986dbac8](https://github.com/driftyco/ionic/commit/986dbac8936f7472c1fe7237c02789a5a37dce65))
* Before, if you did not have a `title` attribute set on your
ion-view, it would transition into that view and erase the navbar's current
title.

Now, if your ion-view does not have a `title` attribute set, the new
view will be transitioned in, but there will be no title change.

If you wish to have a blank title on your new view, you must now
explicitly set your `ion-view`'s title attribute to an empty string.

To migrate your code, change from this:

```html
<ion-view></ion-view>
```

To this:

```html
<ion-view title=""></ion-view>
```
 ([d53eab81](https://github.com/driftyco/ionic/commit/d53eab819728e56ec3ee9a0906b79e277c30c07e))



<a name="1.0.0-beta.1"></a>
### 1.0.0-beta.1 (2014-03-25)


#### Bug Fixes

* **active:** Updated which elements to set active class along w/ tests, closes #857 ([423f9e4f](git://github.com/driftyco/ionic.git/commit/423f9e4f77288e5092347fcb5ab038225fec34bc))
* **badge:** Badge horizontal alignment over item right side buttons, closes #826 ([ded46931](git://github.com/driftyco/ionic.git/commit/ded469311d7a0901fec79b98a87823b74c55b987))
* **click:**
  * Increase the ghost click prevent delay for grade C devices ([001bcca4](git://github.com/driftyco/ionic.git/commit/001bcca4fa74c2ec4f51891566c0220a2bace23f))
  * enter key submission blocked. ([72ee799c](git://github.com/driftyco/ionic.git/commit/72ee799c4e26c916bd330e2fdd093a297a928229), closes [#819](git://github.com/driftyco/ionic.git/issues/819))
  * Click Events In SlideBox Fire Multiple Times, closes #808 ([f8a71377](git://github.com/driftyco/ionic.git/commit/f8a713774459aedeb5662febab759a4a81cb88fc))
* **domready:** Fixed if firing off callbacks when DOM was already ready ([a637fb4d](git://github.com/driftyco/ionic.git/commit/a637fb4d1b0d64e3001d80576ab82484ee90340f))
* **grid:** Correct responsive grid breaks for col-XX, closes #803 ([8fae85e9](git://github.com/driftyco/ionic.git/commit/8fae85e9e60232a6dad2c1b65cfeb6b9b495dfc8))
* **input:** Fix input label from shifting when text is too long on iOS, closes #801 ([b8d4c51f](git://github.com/driftyco/ionic.git/commit/b8d4c51fe743759f216e5924d652636f86c2b55e))
* **ionList:** only stop side menu drag if canSwipe ([c653e83c](git://github.com/driftyco/ionic.git/commit/c653e83cec69535d95dc8ae40af519e5e7f29320), closes [#709](git://github.com/driftyco/ionic.git/issues/709))
* **ionTab:** stop browser-tooltip from appearing due to `title` attr ([aa30faf8](git://github.com/driftyco/ionic.git/commit/aa30faf86333f8e2065d08946b05ce4529b1f1ce), closes [#804](git://github.com/driftyco/ionic.git/issues/804))
* **item:**
  * Restructure item editing css for added reusability and organization ([07c824db](git://github.com/driftyco/ionic.git/commit/07c824db8d465a256c642dcd91d988688f6551f1))
  * fix avatar/thumbnail in .item-complex, and avatar misspelling ([947b8d69](git://github.com/driftyco/ionic.git/commit/947b8d6943376b4dd0c181cf4390650289f76d4a))
* **listView:**
  * send index on delete. ([75107771](git://github.com/driftyco/ionic.git/commit/75107771566ac4467c45497f657c0131ad3b2941), closes [#849](git://github.com/driftyco/ionic.git/issues/849))
  * only allow one swipeable item open. ([73b750fb](git://github.com/driftyco/ionic.git/commit/73b750fb37c26518fd9b34959b77012430e6ad45), closes [#763](git://github.com/driftyco/ionic.git/issues/763))
  * No slide drag if no hidden buttons. ([4e605979](git://github.com/driftyco/ionic.git/commit/4e605979ec8d80443d5a0722ea6ebc7227a4e2f3), closes [#847](git://github.com/driftyco/ionic.git/issues/847))
* **pointer:** Add pointer styling to .item[ng-click], closes #858 ([aa280910](git://github.com/driftyco/ionic.git/commit/aa280910dfc1d9e798f9fd0b5401ee59730d6ee8))
* **popup:**
  * Ensure popup is usable on top of a modal, closes #838 ([6ebfe776](git://github.com/driftyco/ionic.git/commit/6ebfe776bcca506e2168756b69e4823199c70c43))
  * focus popup. ([dddc34d8](git://github.com/driftyco/ionic.git/commit/dddc34d8d24273aecf15261dbc2f9df1b0f068d0), closes [#820](git://github.com/driftyco/ionic.git/issues/820))
* **range:** Clicking Line For Range Causes Drag Button To Follow Mouse, close #779 ([26c8f304](git://github.com/driftyco/ionic.git/commit/26c8f304e7d9d24006d17fcb4161195717ca26a0))
* **reorder:** Prevent scroll w/ data-prevent-scroll attr on reorder btn, closes #848 ([f1ed4b00](git://github.com/driftyco/ionic.git/commit/f1ed4b0084d6457959fe4c65cdefac34148278c3))
* **scrollView:**
  * browserify issue: undefined core ([cd27e1b7](git://github.com/driftyco/ionic.git/commit/cd27e1b79289c1ea6c8fea78da56d0c0c56dc827), closes [#825](git://github.com/driftyco/ionic.git/issues/825))
  * pull to refresh spin back. ([049aabc7](git://github.com/driftyco/ionic.git/commit/049aabc706cd4aae6b5608db2c7ba0f12b75b75a), closes [#774](git://github.com/driftyco/ionic.git/issues/774))
  * show bar with mouse wheel. ([d5a69575](git://github.com/driftyco/ionic.git/commit/d5a695757ace70f40db986d7793ecc72c2b4f2d1), closes [#809](git://github.com/driftyco/ionic.git/issues/809))
  * don't show bars if not scrolling. ([cb686636](git://github.com/driftyco/ionic.git/commit/cb686636cd34da6880036f7d72c8de18ed70d9b2), closes [#805](git://github.com/driftyco/ionic.git/issues/805))
* **tabs:** Renamed .tab-item active state from .active to .tab-item-active, closes #866 ([24160aa0](git://github.com/driftyco/ionic.git/commit/24160aa0bdd2df262d27fd14bc99c6d0e434eac0))
* **tap:**
  * Trigger clicks if touch/click held for more than 250ms, closes #791 ([60e45333](git://github.com/driftyco/ionic.git/commit/60e453331379c296534dc0fa43bf229016759a7c))
  * Reset startCoordinates on touchend/mouseup, closes #874 ([76a53134](git://github.com/driftyco/ionic.git/commit/76a531348078eb9a523e9123cadca9e3500f837d))
  * Remove select element from tap checking, closes #836 ([3d917c83](git://github.com/driftyco/ionic.git/commit/3d917c83f57bf7c568c08393472cbc7863322499))
* **toggle:** Changed tap listener to use "release", closes #882 #881 ([b1a7c199](git://github.com/driftyco/ionic.git/commit/b1a7c1990ad95d53bd10e7dd7215018671413c3e))


#### Features

* **$ionicLoading:** implement backdrop class ([57d71ed6](git://github.com/driftyco/ionic.git/commit/57d71ed6c321921a0b1adf501a2ce0bf432f3f61), closes [#837](git://github.com/driftyco/ionic.git/issues/837))
* **$ionicScrollDelegate:** rememberScrollPosition, scrollToRememberedPosition ([5a0efece](git://github.com/driftyco/ionic.git/commit/5a0efecef6ea2c4f89c6dfd3cbe98a98614a6e17))
* **content:** automatically add/remove has-* classes to content ([e94d4006](git://github.com/driftyco/ionic.git/commit/e94d400648a0770cea3909e2d2513c71e88978ae), closes [#619](git://github.com/driftyco/ionic.git/issues/619))
* **grid:** Remove column offset with responsive grid breaks ([73ba2a40](git://github.com/driftyco/ionic.git/commit/73ba2a405fabb306ac85f039620ee5df2d12bff2))
* **ion-content:** watch padding attribute ([532d473e](git://github.com/driftyco/ionic.git/commit/532d473e351db95160c3e8a2878dbf5a1de549a9))
* **ionTabs:** add available tabs-item-hide class ([5966dbf4](git://github.com/driftyco/ionic.git/commit/5966dbf43e56f2f65b18cb6f030a7b60ead236f2), closes [#395](git://github.com/driftyco/ionic.git/issues/395))
* **ionic:** remove all delegates ([dbe4e390](git://github.com/driftyco/ionic.git/commit/dbe4e3901d6ee70bae85e48b6e58c097b9f2810e))
* **ionicNavBar:** add getTitle() and getPreviousTitle() methods ([215b1c1e](git://github.com/driftyco/ionic.git/commit/215b1c1ea058bb76e4950d06e3e7e127c5a43cc6))
* **loadingView:**
  * add setContent method ([366bd686](git://github.com/driftyco/ionic.git/commit/366bd6866ffa513c1d99b36b841d5ad3fbe23622), closes [#732](git://github.com/driftyco/ionic.git/issues/732))
  * add setContent method ([e5cba05e](git://github.com/driftyco/ionic.git/commit/e5cba05e90a0c1f7ce6b032020ef212b19b7bc84))
* **navclear:** Ability to disable the next view transition and back button ([f744d9eb](git://github.com/driftyco/ionic.git/commit/f744d9ebcfaad9be237fd2b1753568bf832bfe0a))
* **popup:** Support for programatically closing popup. ([dc2b24ed](git://github.com/driftyco/ionic.git/commit/dc2b24ed6aa14f7db6c70791c16c5afc5e909c66), closes [#854](git://github.com/driftyco/ionic.git/issues/854))
* **progress:** Set progress element's default width to 100%, closes #872 ([b9cde47d](git://github.com/driftyco/ionic.git/commit/b9cde47dd039bc58f84e0af76fccbfcc9d7be74e))
* **ready:** Add 'platform-ready' css class to the body when the platform is ready ([681a6a2e](git://github.com/driftyco/ionic.git/commit/681a6a2ed743fab2352551156ff18dbb42549d4d))
* **sideMenu:** Added directive for simple toggling ([5a89df43](git://github.com/driftyco/ionic.git/commit/5a89df43363b1ea88bff25c73f019462c964fa7d))

#### Breaking Changes / Migration Guide

* **ionTabs**: `tabs-type` and `tabs-style` removed. Use classNames instead.

Relevant Documentation: [ionTabs](http://ionicframework.com/docs/api/directive/ionTabs).

Old Code:

`<ion-tabs tabs-type="tabs-top" tabs-style="tabs-positive" animation="slide-left-right">`

New Code:

`<ion-tabs class="tabs-top tabs-positive slide-left-right">`

* **ionHeaderBar, ionFooterBar**: remove `type`, `title`, `left-buttons`, `right-buttons`.

Relevant Documentation: [ionHeaderBar](http://ionicframework.com/docs/api/directive/ionHeaerBar),
[ionFooterBar](http://ionicframework.com/docs/api/directive/ionFooterBar).

Old Code:

```html
<ion-header-bar type="bar-positive"
  title="{{someTitle}}"
  left-buttons="left"
  right-buttons="right">
</ion-header-bar>
```

New Code:

```html
<ion-header-bar class="bar-positive">
  <div class="buttons">
    <button class="button" ng-click="leftButtonTap()">
      Left Button
    </button>
  </div>
  <h1 class="title">{{someTitle}}</h>
  <div class="buttons">
    <button class="button" ng-click="rightButtonTap()">
      Right Button
    </button>
  </div>
</ion-header-bar>
```

* **ionNavBar, ionView**: Remove `left-buttons`, `right-buttons`, `type`, `animation`,
`back-button-*` attributes from ionNavBar. Remove `left-buttons`, `right-buttons` from ionView.

Additionally, all 'viewState.*' events have been removed. Use [$ionicNavBarDelegate](http://ionicframework.com/docs/api/service/$ionicNavBarDelegate).

Relevant Documentation: [ionNavBar](http://ionicframework.com/docs/api/directive/ionNavBar),
[ionView](http://ionicframework.com/docs/api/directive/ionView),
[ionNavBackButton](http://ionicframework.com/docs/api/directive/ionNavBackButton) (new),
[ionNavButtons](http://ionicframework.com/docs/api/directive/ionNavButtons) (new).

Old Code:

```html
<ion-nav-bar type="bar-positive"
  animation="slide-left-right"
  back-button-type="button-icon"
  back-button-icon="ion-arrow-left-c"
  back-button-label="Back">
</ion-nav-bar>
<ion-nav-view>
  <ion-view left-buttons="leftButtons"
    title="someTitle"
    right-buttons="rightButtons">
  </ion-view>
</ion-nav-view>
```

New Code:

```html
<ion-nav-bar class="bar-positive slide-left-right">
  <ion-nav-back-button class="button-icon ion-arrow-left-c">
    Back
  </ion-nav-back-button>
</ion-nav-bar>
<ion-nav-view>
  <ion-view title="someTitle">

    <ion-nav-buttons side="left">
      <button class="button" ng-click="leftButtonTap()">
        Left Button
      </button>
    </ion-nav-buttons>
    <ion-nav-buttons side="right">
      <button class="button" ng-click="rightButtonTap()">
        Right Button
      </button>
    </ion-nav-buttons>

  </ion-view>
</ion-nav-view>
```

* **ionSideMenuContent**: is now an element directive.

Relevant documentation: [ionSideMenus](http://ionicframework.com/docs/api/directive/ionSideMenus),
[ionSideMenuContent](http://ionicframework.com/docs/api/directive/ionSideMenuContent),
[ionSideMenu](http://ionicframework.com/docs/api/directive/ionSideMenu).

Old Code:

```html
<ion-side-menus>
  <ion-pane ion-side-menu-content>
  </ion-pane>
</ion-side-menus>
```

New Code:

```html
<ion-side-menus>
  <ion-side-menu-content>
  </ion-side-menu-content>
</ion-side-menus>
```


<a name="0.9.27"></a>
### 0.9.27 "Salamander" (2014-03-15)


#### Bug Fixes

* **actionsheet:**
  * Use transition instead of animation for backdrop, fix for Android 2.3 ([c91622b7](https://github.com/driftyco/ionic/commit/c91622b760dd4e919f890de2ecdf46d4e9573d13))
  * Dismiss actionsheet when tapping backdrop, closes #733 ([668c646f](https://github.com/driftyco/ionic/commit/668c646faa25a10d67cf2beebb4bf119e758ff1d))
  * Fix slide-up animation, closes #713 ([44b31e18](https://github.com/driftyco/ionic/commit/44b31e18878b89d47d769505a619aa7f97cf740a))
* **backbutton:** Allow only one back button listener to run per click, closes #693 ([a491f22c](https://github.com/driftyco/ionic/commit/a491f22c1f2297dcbe7dbd9679593b896584cc87))
* **badge:**
  * Vertical align a badge in an item-divider, closes #707 ([cb5510c1](https://github.com/driftyco/ionic/commit/cb5510c1843c3debeb0b29d71cda7abbcd00f753))
  * Update badge alignment in tab items, closes #694 ([c4eed02f](https://github.com/driftyco/ionic/commit/c4eed02f29be9a82752915ee32c12be4f453645a))
* **button:**
  * Correct vertical alignment of header right buttons, closes #704 ([438f5fba](https://github.com/driftyco/ionic/commit/438f5fba582b7e391ec174d4c9a37d53579b7b47))
  * Tweak vertical alignment of button icons, closes #739 ([7ec0605e](https://github.com/driftyco/ionic/commit/7ec0605e06f89c6f3008c7ff16c795f6535822dc))
* **checkbox:** Fix checkmark in Android 2.3 ([717148d9](https://github.com/driftyco/ionic/commit/717148d9868922d899c29403d97943b679749617))
* **colors:** Update all #4A87EE colors to use $positive color, closes #731 ([d113ddfa](https://github.com/driftyco/ionic/commit/d113ddfa52c2c751be78de0770b50da0c7407123))
* **footer:** Show footers within tab content, closes #728 ([9c5772f3](https://github.com/driftyco/ionic/commit/9c5772f3c3aeb41ea10d8484867f4f240f48d953))
* **history:** Separate histories and views, clear other views in clearHistory(), closes #724 ([c99427aa](https://github.com/driftyco/ionic/commit/c99427aa9221caa9297a204abc7558c33594c38a))
* **input:** Correct vertical alignment of inputs and their labels, closes #799 ([6547ca60](https://github.com/driftyco/ionic/commit/6547ca60cbf445cb225f74154d4fa1563388229c))
* **ionTabs:** do not pre-transclude; stops error on compile ([ecfdbaa6](https://github.com/driftyco/ionic/commit/ecfdbaa67b076bab61e9573fc650ee6eccb459b1), closes [#730](https://github.com/driftyco/ionic/issues/730))
* **item:**
  * Fix badge moving to new line when text is too long, closes #551 ([4d366710](https://github.com/driftyco/ionic/commit/4d3667106e4078dc411aa55244b5efbd1e5672df))
  * Fix item-icon-left / right animating Ionicon not centered, closes #670 ([11a4338d](https://github.com/driftyco/ionic/commit/11a4338d136bb5be26f58a794b8c2e1ad9fe429f))
* **list:** Drag to expose list option buttons, closes #701 ([25650005](https://github.com/driftyco/ionic/commit/2565000564b12f408ac025d1a6b6dea2fe8c1181))
* **modal:**
  * Do not apply the same modal animation to all of its children, closes #683 ([9cff5d03](https://github.com/driftyco/ionic/commit/9cff5d030ce4b25abd0cfe1c68425b82761063d4))
  * Fix removing modal from DOM on .remove(), closes #755 ([c4ca7a85](https://github.com/driftyco/ionic/commit/c4ca7a85e0014cadd047065522b13b6eae4788f8))
  * Improve slide-up/down animations, remove flickers ([b593cf1b](https://github.com/driftyco/ionic/commit/b593cf1be67a98e95ba0d71c0997da0a9bda4bf7))
* **navView:** _getView renamed to _getViewById, closes #736 ([78206d0e](https://github.com/driftyco/ionic/commit/78206d0e7caee2212b13b75044681cdd534e9822))
* **platform:** Fix Platform.showStatusBar so it can be used multiple times, closes #702 ([a6c47cd3](https://github.com/driftyco/ionic/commit/a6c47cd3bfb5d441d906f18d85e39d10d90326ec))
* **sideMenu:**
  * Not snapping on close on certain conditions #795 ([a5899918](https://github.com/driftyco/ionic/commit/a58999180b9dbf4d07823dfef9cc67b8babc25ac))
  * Fix flashing when closing right side menu, closes #556 ([a0d60d52](https://github.com/driftyco/ionic/commit/a0d60d5228e385b952d6561ed6454e6add45401e))
  * Close side-menu if open and content tapped, closes #648 ([0c5c6751](https://github.com/driftyco/ionic/commit/0c5c675164eaf785f050e517842aa2002559c97f))
* **sideMenuController:** sticking issue #738 ([ea04e393](https://github.com/driftyco/ionic/commit/ea04e393c00b629455e737b64bdaccff6ff99424))
* **sidemenu:** Side menu always needs to have translate3d applied, closes #710 ([16ac2ff1](https://github.com/driftyco/ionic/commit/16ac2ff1d6ec7f7a32e8b6f7a21c3e7a807dbe4d))
* **tap:**
  * Do not trigger a click if the element was scrolled after touchstart/mousedown ([98e7e1aa](https://github.com/driftyco/ionic/commit/98e7e1aa87ef6fddc01443faa447a7f72f56994d))
  * Do not detect taps for input[type=file], closes #652 ([6f2d6e7c](https://github.com/driftyco/ionic/commit/6f2d6e7c5a775218a0f7424e6bdb0269fd9c7603))
* **toggle:** Fix toggle handle on Android 2.3 ([72f2e840](https://github.com/driftyco/ionic/commit/72f2e8407eabc87329ea89e476e9fd9b9989d405))


#### Features

* **active:** Removing use of :active in favor of .active for more control of active state ([baa04cde](https://github.com/driftyco/ionic/commit/baa04cde4d7292d07ec2bfae949e008aeaafae1b))
* **animation:** Add right to left animations, and their reverse, for RTL support, closes #643 ([4628b9fb](https://github.com/driftyco/ionic/commit/4628b9fb23c16cab8ba969342f6bd0be1a1bfc84))
* **ionInfiniteScroll:**
  * allow configuration of icon and text through `icon` and `text` attributes ([5f2c32ea](https://github.com/driftyco/ionic/commit/5f2c32ea9b19a773e943a9b21704f2138037e681))
* **ionRefresher:** allow custom text & icons through `pulling-text`, `pulling-icon`, `refreshing-text`, `refreshing-icon` attributes. ([573df56d](https://github.com/driftyco/ionic/commit/573df56db4d79eee517df61b45c4f780a58ce4f8), closes [#760](https://github.com/driftyco/ionic/issues/760))
* **modal:**
  * On larger displays modals will be inset and centered, not full width/height, clo ([ba2a40c8](https://github.com/driftyco/ionic/commit/ba2a40c845dade7cdc6f99de14b5467e327d1d3c))
  * Create a modal backdrop wrapper w/ internal modal directive, closes #605 ([7d076bd5](https://github.com/driftyco/ionic/commit/7d076bd55b2117b3ac569ef41ae9f42bc56eca58))
* **popup:** Added popup support ([a30b0b7d](https://github.com/driftyco/ionic/commit/a30b0b7d4fa5bc83e0ccdadee1d78faf996bef00))
* **toggle:** Added dragging support to toggle switches ([cc15a5b4](https://github.com/driftyco/ionic/commit/cc15a5b455b7b59469eb04503f0a7292d4ceddf2))


#### Breaking Changes

* on-refresh and on-refresh-opening are no longer on the
ion-content directive.  They are on the ion-refresher. In addition,
on-refresh-opening has been renamed to on-pulling.

Change your code from this:

```html
<ion-content on-refresh="onRefresh()"
  on-refresh-opening="onRefreshOpening()">
  <ion-refresher></ion-refresher>
</ion-content>
```

To this:

```html
<ion-content>
  <ion-refresher on-refresh="onRefresh()"
    on-pulling="onRefreshOpening()">
  </ion-refresher>
</ion-content>
```
 ([573df56d](https://github.com/driftyco/ionic/commit/573df56db4d79eee517df61b45c4f780a58ce4f8))

* on-infinite-scroll and infinite-scroll-distance are no longer attributes on the ion-content directive.  They are on the ion-infinite-scroll element.

Chang your code from this:

```html
<ion-content on-infinite-scroll="onInfiniteScroll()"
  infinite-scroll-distance="1%">
</ion-content>
```

To this:

```html
<ion-content>
  <ion-infinite-scroll on-infinite="onInfiniteScroll()"
    distance="1%"
  </ion-infinite-scroll>
</ion-content>
```


*
ionHeaderBar's title attribute is now interpolated.

Change this code: `<ion-header-bar title="myTitleVar"></ion-header-bar>`

To this code: `<ion-header-bar title="{{myTitleVar}}"></ion-header-bar>`
 ([a8e1524c](https://github.com/driftyco/ionic/commit/a8e1524ce8e6d2a805770585ffd7bb457460a104))
*
ionicSlideBox#getPos has been renamed to ionicSlideBox#currentIndex.

ionicSlideBox#numSlides has been renamed to ionicSlideBox#slidesCount.
 ([1dd55276](https://github.com/driftyco/ionic/commit/1dd552765568ba272dcc132a4889140c259b3ff1))


<a name="0.9.26"></a>
### 0.9.26 "Rabbit" (2014-02-26)


#### Bug Fixes

* **actionsheet:** Actionsheet in modal has pointer-events enabled, closes #660 ([1503cc72](http://github.com/driftyco/ionic/commit/1503cc7213c13e87804c210dea7465931e972f4a))
* **click:** event.preventDefault() when setting focus() on an input, closes 583 ([fc8ab4b8](http://github.com/driftyco/ionic/commit/fc8ab4b8ea9b89bd3446b835476950bb70bba879))
* **ionContent:**
  * Update scss for ion-infinite-scroll element ([788df524](http://github.com/driftyco/ionic/commit/788df5243dc5300204171bcd40bf1e20fe610dbe))
  * Use new name to find ion-infinite-scroll element ([1702f5c9](http://github.com/driftyco/ionic/commit/1702f5c916dda20957761fd1e7b30d5f9bc1b6b4))
* **ionPrefix:** disableRegisterByTagName updated w/ `ion-` prefix for correct view history ([2494b5f9](http://github.com/driftyco/ionic/commit/2494b5f988991b97c278102f0da385e9cde00aee))
* **ionSideMenu:** use manual transclude instead of ngTransclude ([991d3cfd](http://github.com/driftyco/ionic/commit/991d3cfda1831467e38c176c69f0ecd084c86e50), closes [#666](http://github.com/driftyco/ionic/issues/666))
* **ionTabs:** cleanup and fix many issues ([0f1b6f47](http://github.com/driftyco/ionic/commit/0f1b6f47b8ee4c72facc269da2b648bb9cc397e0), closes [#597](http://github.com/driftyco/ionic/issues/597))
* **ionicScrollDelegate:**
  * do not error if no scrollTop/Left values ([9e942f89](http://github.com/driftyco/ionic/commit/9e942f894b037284a2e36ff14d3615f076b84447), closes [#659](http://github.com/driftyco/ionic/issues/659)
* **item:** degrade .item right arrows by grade for low end devices ([3a69bb34](http://github.com/driftyco/ionic/commit/3a69bb3452944bc4d1764c7605aad0824cbb758c))
* **loading:** make showDelay option work correctly ([7281e2ab](http://github.com/driftyco/ionic/commit/7281e2abf0f6f624f296191b3f322227089e3658), closes [#562](http://github.com/driftyco/ionic/issues/562))
* **modal:**
  * Fix modal animation for firefox, closes #671 ([0033c880](http://github.com/driftyco/ionic/commit/0033c8809a810c8b518ca68a9ada5704a7f6e9c9))
* **navBar:**
  * animations, hide back button, no flicker ([465ea769](http://github.com/driftyco/ionic/commit/465ea76969b348b3074747dcd4cebf0861a38e6d), closes [#653](http://github.com/driftyco/ionic/issues/653))
* **platform:** Update ionic.Platform.is() to check all platforms, closes #604 ([fcd0fa73](http://github.com/driftyco/ionic/commit/fcd0fa73c4125593e6efce6b6410586f5a27fc02))
* **sideMenu:** remove translate3d when not needed, close #636 ([07092f00](http://github.com/driftyco/ionic/commit/07092f009cfa2b52b2dc2fdb915b237bd8c37dfa))
* **slideBox:** make `does-continue` attribute work continuously ([f6ec6a3c](http://github.com/driftyco/ionic/commit/f6ec6a3c89116174541c2fb08194a04ada92065b), closes [#575](http://github.com/driftyco/ionic/issues/575))
* **tabs:**
  * Double tapping a tab would set the wrong view history, closes #656 ([f0faae16](http://github.com/driftyco/ionic/commit/f0faae16574b1247b6f5b1fa0180cfb9248804a1))
* **text-rendering:** Disable text-rendering:optimizeLegibility for low end devices ([10289466](http://github.com/driftyco/ionic/commit/10289466162f4efa36dc902052b78e42d0df0b2d))
* **thumbnail:** Correctly apply thumbnail style to item directive, closes #509 ([977c1cc6](http://github.com/driftyco/ionic/commit/977c1cc6e511d752e083081adbed9f8fda1d0312))
* **transform:** Polyfill `style.transform` to work w/ non-webkit ([52671c18](http://github.com/driftyco/ionic/commit/52671c18f97d057aca581a566cc7ea27cc055314))


#### Features

* **grade:** Set grade in body class depending on platform performance ([b69b40c8](http://github.com/driftyco/ionic/commit/b69b40c82684acf3003f19277a44caf4614c75e4))
* **ionContent:** use child scope instead of isolate scope ([49e0dac9](http://github.com/driftyco/ionic/commit/49e0dac9992d60ca098eb1dbd1acecbc74eae85c), closes [#555](http://github.com/driftyco/ionic/issues/555))
* **ionInfiniteScroll:** use event system ([7b0716c2](http://github.com/driftyco/ionic/commit/7b0716c23c44fe5530526c86d590111382f991d7), closes [#661](http://github.com/driftyco/ionic/issues/661))
* **ionNavAnimation:** `<a href="#/page" ion-nav-animation="slide-in-up">` ([8354d42b](http://github.com/driftyco/ionic/commit/8354d42b4b049e97bd93ce8ebacf047284a8fad1))
* **item:** Auto right-arrow for complex list items w/ ng-click/href, closes #472 ([327a6866](http://github.com/driftyco/ionic/commit/327a686626c81072df8e055c8be220144fade26a))
 ([110ff9f4](http://github.com/driftyco/ionic/commit/110ff9f47583c7f04bcf5b1eebea6d7bd0b25e99), closes [#243](http://github.com/driftyco/ionic/issues/243))
* **sass:** All variables now have !default assigned, closes #631 ([53af2c7a](http://github.com/driftyco/ionic/commit/53af2c7a0177f9bcd2b43d9179832a319ecb8f7f))
* **scrollbar:** Do not use rgba background for scrollbar on grade-b and c devices ([805c35c1](http://github.com/driftyco/ionic/commit/805c35c1f119530777498177016bb0c448e92b90))
* **sideMenu:**
  * Degrade .menu-content box-shadow w/ platform grade for animation performance ([d2a0780b](http://github.com/driftyco/ionic/commit/d2a0780bbac5b17525def8b75c5c58c168675631))


#### Breaking Changes

* The binding for ionInfiniteScroll has changed, as well
as how you finish it.

If you had this code before:

```html
<ion-content on-infinite-scroll="doSomething"></ion-content>
```
```js
function MyCtrl($scope) {
  $scope.doSomething = function(scrollDoneCallback) {
    doSomething();
    scrollDoneCallback();
  };
}
```

Now, your code should look like this:

```html
<ion-content on-infinite-scroll="doSomething()"></ion-content>
```
```js
function MyCtrl($scope) {
  $scope.doSomething = function() {
    doSomething();
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };
}
```



<a name="0.9.25"></a>
### 0.9.25 "Quokka" (2014-02-19)


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

* **angular:** Update to Angular v1.2.12, closes #600 ([97f4f6ea](http://github.com/driftyco/ionic/commit/97f4f6eacea512c5ef3845e0ba89663ef0758915))
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
