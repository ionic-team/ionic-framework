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

