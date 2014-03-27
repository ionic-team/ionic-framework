<a name="1.0.0-beta.1"></a>
### 1.0.0-beta.1 (2014-03-25)


#### Bug Fixes

* **active:** Updated which elements to set active class along w/ tests, closes #857 ([423f9e4f](https://github.com/driftyco/ionic/commit/423f9e4f77288e5092347fcb5ab038225fec34bc))
* **badge:** Badge horizontal alignment over item right side buttons, closes #826 ([ded46931](https://github.com/driftyco/ionic/commit/ded469311d7a0901fec79b98a87823b74c55b987))
* **click:**
  * Increase the ghost click prevent delay for grade C devices ([001bcca4](https://github.com/driftyco/ionic/commit/001bcca4fa74c2ec4f51891566c0220a2bace23f))
  * enter key submission blocked. ([72ee799c](https://github.com/driftyco/ionic/commit/72ee799c4e26c916bd330e2fdd093a297a928229), closes [#819](https://github.com/driftyco/ionic/issues/819))
  * Click Events In SlideBox Fire Multiple Times, closes #808 ([f8a71377](https://github.com/driftyco/ionic/commit/f8a713774459aedeb5662febab759a4a81cb88fc))
* **domready:** Fixed if firing off callbacks when DOM was already ready ([a637fb4d](https://github.com/driftyco/ionic/commit/a637fb4d1b0d64e3001d80576ab82484ee90340f))
* **grid:** Correct responsive grid breaks for col-XX, closes #803 ([8fae85e9](https://github.com/driftyco/ionic/commit/8fae85e9e60232a6dad2c1b65cfeb6b9b495dfc8))
* **input:** Fix input label from shifting when text is too long on iOS, closes #801 ([b8d4c51f](https://github.com/driftyco/ionic/commit/b8d4c51fe743759f216e5924d652636f86c2b55e))
* **ionList:** only stop side menu drag if canSwipe ([c653e83c](https://github.com/driftyco/ionic/commit/c653e83cec69535d95dc8ae40af519e5e7f29320), closes [#709](https://github.com/driftyco/ionic/issues/709))
* **ionTab:** stop browser-tooltip from appearing due to `title` attr ([aa30faf8](https://github.com/driftyco/ionic/commit/aa30faf86333f8e2065d08946b05ce4529b1f1ce), closes [#804](https://github.com/driftyco/ionic/issues/804))
* **item:**
  * Restructure item editing css for added reusability and organization ([07c824db](https://github.com/driftyco/ionic/commit/07c824db8d465a256c642dcd91d988688f6551f1))
  * fix avatar/thumbnail in .item-complex, and avatar misspelling ([947b8d69](https://github.com/driftyco/ionic/commit/947b8d6943376b4dd0c181cf4390650289f76d4a))
* **listView:**
  * send index on delete. ([75107771](https://github.com/driftyco/ionic/commit/75107771566ac4467c45497f657c0131ad3b2941), closes [#849](https://github.com/driftyco/ionic/issues/849))
  * only allow one swipeable item open. ([73b750fb](https://github.com/driftyco/ionic/commit/73b750fb37c26518fd9b34959b77012430e6ad45), closes [#763](https://github.com/driftyco/ionic/issues/763))
  * No slide drag if no hidden buttons. ([4e605979](https://github.com/driftyco/ionic/commit/4e605979ec8d80443d5a0722ea6ebc7227a4e2f3), closes [#847](https://github.com/driftyco/ionic/issues/847))
* **pointer:** Add pointer styling to .item[ng-click], closes #858 ([aa280910](https://github.com/driftyco/ionic/commit/aa280910dfc1d9e798f9fd0b5401ee59730d6ee8))
* **popup:**
  * Ensure popup is usable on top of a modal, closes #838 ([6ebfe776](https://github.com/driftyco/ionic/commit/6ebfe776bcca506e2168756b69e4823199c70c43))
  * focus popup. ([dddc34d8](https://github.com/driftyco/ionic/commit/dddc34d8d24273aecf15261dbc2f9df1b0f068d0), closes [#820](https://github.com/driftyco/ionic/issues/820))
* **range:** Clicking Line For Range Causes Drag Button To Follow Mouse, close #779 ([26c8f304](https://github.com/driftyco/ionic/commit/26c8f304e7d9d24006d17fcb4161195717ca26a0))
* **reorder:** Prevent scroll w/ data-prevent-scroll attr on reorder btn, closes #848 ([f1ed4b00](https://github.com/driftyco/ionic/commit/f1ed4b0084d6457959fe4c65cdefac34148278c3))
* **scrollView:**
  * browserify issue: undefined core ([cd27e1b7](https://github.com/driftyco/ionic/commit/cd27e1b79289c1ea6c8fea78da56d0c0c56dc827), closes [#825](https://github.com/driftyco/ionic/issues/825))
  * pull to refresh spin back. ([049aabc7](https://github.com/driftyco/ionic/commit/049aabc706cd4aae6b5608db2c7ba0f12b75b75a), closes [#774](https://github.com/driftyco/ionic/issues/774))
  * show bar with mouse wheel. ([d5a69575](https://github.com/driftyco/ionic/commit/d5a695757ace70f40db986d7793ecc72c2b4f2d1), closes [#809](https://github.com/driftyco/ionic/issues/809))
  * don't show bars if not scrolling. ([cb686636](https://github.com/driftyco/ionic/commit/cb686636cd34da6880036f7d72c8de18ed70d9b2), closes [#805](https://github.com/driftyco/ionic/issues/805))
* **tabs:** Renamed .tab-item active state from .active to .tab-item-active, closes #866 ([24160aa0](https://github.com/driftyco/ionic/commit/24160aa0bdd2df262d27fd14bc99c6d0e434eac0))
* **tap:**
  * Trigger clicks if touch/click held for more than 250ms, closes #791 ([60e45333](https://github.com/driftyco/ionic/commit/60e453331379c296534dc0fa43bf229016759a7c))
  * Reset startCoordinates on touchend/mouseup, closes #874 ([76a53134](https://github.com/driftyco/ionic/commit/76a531348078eb9a523e9123cadca9e3500f837d))
  * Remove select element from tap checking, closes #836 ([3d917c83](https://github.com/driftyco/ionic/commit/3d917c83f57bf7c568c08393472cbc7863322499))
* **toggle:** Changed tap listener to use "release", closes #882 #881 ([b1a7c199](https://github.com/driftyco/ionic/commit/b1a7c1990ad95d53bd10e7dd7215018671413c3e))


#### Features

* **$ionicLoading:** implement backdrop class ([57d71ed6](https://github.com/driftyco/ionic/commit/57d71ed6c321921a0b1adf501a2ce0bf432f3f61), closes [#837](https://github.com/driftyco/ionic/issues/837))
* **$ionicScrollDelegate:** rememberScrollPosition, scrollToRememberedPosition ([5a0efece](https://github.com/driftyco/ionic/commit/5a0efecef6ea2c4f89c6dfd3cbe98a98614a6e17))
* **content:** automatically add/remove has-* classes to content ([e94d4006](https://github.com/driftyco/ionic/commit/e94d400648a0770cea3909e2d2513c71e88978ae), closes [#619](https://github.com/driftyco/ionic/issues/619))
* **grid:** Remove column offset with responsive grid breaks ([73ba2a40](https://github.com/driftyco/ionic/commit/73ba2a405fabb306ac85f039620ee5df2d12bff2))
* **ion-content:** watch padding attribute ([532d473e](https://github.com/driftyco/ionic/commit/532d473e351db95160c3e8a2878dbf5a1de549a9))
* **ionTabs:** add available tabs-item-hide class ([5966dbf4](https://github.com/driftyco/ionic/commit/5966dbf43e56f2f65b18cb6f030a7b60ead236f2), closes [#395](https://github.com/driftyco/ionic/issues/395))
* **ionicNavBar:** add getTitle() and getPreviousTitle() methods ([215b1c1e](https://github.com/driftyco/ionic/commit/215b1c1ea058bb76e4950d06e3e7e127c5a43cc6))
* **loadingView:**
  * add setContent method ([366bd686](https://github.com/driftyco/ionic/commit/366bd6866ffa513c1d99b36b841d5ad3fbe23622), closes [#732](https://github.com/driftyco/ionic/issues/732))
  * add setContent method ([e5cba05e](https://github.com/driftyco/ionic/commit/e5cba05e90a0c1f7ce6b032020ef212b19b7bc84))
* **navclear:** Ability to disable the next view transition and back button ([f744d9eb](https://github.com/driftyco/ionic/commit/f744d9ebcfaad9be237fd2b1753568bf832bfe0a))
* **popup:** Support for programatically closing popup. ([dc2b24ed](https://github.com/driftyco/ionic/commit/dc2b24ed6aa14f7db6c70791c16c5afc5e909c66), closes [#854](https://github.com/driftyco/ionic/issues/854))
* **progress:** Set progress element's default width to 100%, closes #872 ([b9cde47d](https://github.com/driftyco/ionic/commit/b9cde47dd039bc58f84e0af76fccbfcc9d7be74e))
* **ready:** Add 'platform-ready' css class to the body when the platform is ready ([681a6a2e](https://github.com/driftyco/ionic/commit/681a6a2ed743fab2352551156ff18dbb42549d4d))
* **sideMenu:** Added directive for simple toggling ([5a89df43](https://github.com/driftyco/ionic/commit/5a89df43363b1ea88bff25c73f019462c964fa7d))

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

