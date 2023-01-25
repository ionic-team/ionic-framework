# [7.0.0-beta.0](https://github.com/ionic-team/ionic-framework/compare/v6.5.1...v7.0.0-beta.0) (2023-01-25)


### Bug Fixes

* **accordion-group:** do not adjust incorrect values ([#26086](https://github.com/ionic-team/ionic-framework/issues/26086)) ([e2cbeeb](https://github.com/ionic-team/ionic-framework/commit/e2cbeeb8ace969d49e16ccdc496adc559e40b1f2))
* **action-sheet:** container animates in correctly ([#26347](https://github.com/ionic-team/ionic-framework/issues/26347)) ([1e855e7](https://github.com/ionic-team/ionic-framework/commit/1e855e7699a0b5c3792a9ef84e863df6fe552437)), closes [#25368](https://github.com/ionic-team/ionic-framework/issues/25368)
* **angular:** null values are not converted to falsy value ([#26341](https://github.com/ionic-team/ionic-framework/issues/26341)) ([ce2e37b](https://github.com/ionic-team/ionic-framework/commit/ce2e37b1a172722630953dcb9560f334048c5b72))
* **back-button:** update style for ios spec ([#26395](https://github.com/ionic-team/ionic-framework/issues/26395)) ([1a840c4](https://github.com/ionic-team/ionic-framework/commit/1a840c43e90a65a910877599f6a2d52ccc65db6b)), closes [#26393](https://github.com/ionic-team/ionic-framework/issues/26393)
* **breadcrumb:** add aria-label to collapsed indicator ([#26615](https://github.com/ionic-team/ionic-framework/issues/26615)) ([f8a2c79](https://github.com/ionic-team/ionic-framework/commit/f8a2c7948894e82b1bc41fa45e1716bc733b087c))
* **card-header:** reverse order of title and subtitle on ios ([#26084](https://github.com/ionic-team/ionic-framework/issues/26084)) ([2080890](https://github.com/ionic-team/ionic-framework/commit/2080890c11539938dd96c0f2ed08785100112587))
* **datetime:** do not report timezone in ionChange ([#26183](https://github.com/ionic-team/ionic-framework/issues/26183)) ([3fb4caf](https://github.com/ionic-team/ionic-framework/commit/3fb4caf21ffac12f765c4c80bf1850e05d211c6a)), closes [#25577](https://github.com/ionic-team/ionic-framework/issues/25577)
* **datetime:** haptics are enabled only on ios ([#26370](https://github.com/ionic-team/ionic-framework/issues/26370)) ([8eec197](https://github.com/ionic-team/ionic-framework/commit/8eec1974da3dd4820d29126f17d1e14b5132c9f4)), closes [#25508](https://github.com/ionic-team/ionic-framework/issues/25508)
* **input, searchbar, select, textarea:** placeholder has improved contrast ([#26486](https://github.com/ionic-team/ionic-framework/issues/26486)) ([6c82435](https://github.com/ionic-team/ionic-framework/commit/6c824350257fce45ce3b8c166a864efe6789c505))
* **input, textarea:** inputs now scroll into view when tapping labels ([#25848](https://github.com/ionic-team/ionic-framework/issues/25848)) ([cb265d6](https://github.com/ionic-team/ionic-framework/commit/cb265d6cc6d4890608d2873a5726f5d7d37adae6))
* **input, textarea:** padding is now added to content so inputs scroll above keyboard ([#25849](https://github.com/ionic-team/ionic-framework/issues/25849)) ([ba6b539](https://github.com/ionic-team/ionic-framework/commit/ba6b5396754151d884fa276a7227facd28a431df)), closes [#18532](https://github.com/ionic-team/ionic-framework/issues/18532)
* **input:** clearOnEdit clears input when user initially types ([#26005](https://github.com/ionic-team/ionic-framework/issues/26005)) ([bf5e118](https://github.com/ionic-team/ionic-framework/commit/bf5e1183135d1d56a7ba0f63723724521f9d51d0))
* **item:** align iOS font size to spec ([#26445](https://github.com/ionic-team/ionic-framework/issues/26445)) ([eea91bb](https://github.com/ionic-team/ionic-framework/commit/eea91bbbe1a4ccc4797742ee4e2c320dba6d9517))
* **item:** ios mode has correct padding ([#26511](https://github.com/ionic-team/ionic-framework/issues/26511)) ([96147ec](https://github.com/ionic-team/ionic-framework/commit/96147ec1b0fcfd31e48d450201fc32b58105dea7))
* **overlays:** dismiss on keydown to avoid chrome for windows and firefox bug ([#25811](https://github.com/ionic-team/ionic-framework/issues/25811)) ([a1ec9aa](https://github.com/ionic-team/ionic-framework/commit/a1ec9aabd806964206010000294b8781c516c4f3)), closes [#25802](https://github.com/ionic-team/ionic-framework/issues/25802)
* **overlays:** triggerController warns about missing triggers ([#26651](https://github.com/ionic-team/ionic-framework/issues/26651)) ([a7c2c55](https://github.com/ionic-team/ionic-framework/commit/a7c2c555f34795a3a9349987141eef929ad88807))
* **range:** range matches iOS design specification ([#25873](https://github.com/ionic-team/ionic-framework/issues/25873)) ([da05ffe](https://github.com/ionic-team/ionic-framework/commit/da05ffe462b36ce6fd6cdaeb25cf0f8f4b0e7ef2)), closes [#25872](https://github.com/ionic-team/ionic-framework/issues/25872)
* **segment:** click event triggers ionChange ([#26162](https://github.com/ionic-team/ionic-framework/issues/26162)) ([70781e4](https://github.com/ionic-team/ionic-framework/commit/70781e4c9f93e8e58917083da43536389ac5332e))
* **select:** chevron icon is now an ionicon ([#26484](https://github.com/ionic-team/ionic-framework/issues/26484)) ([0823c09](https://github.com/ionic-team/ionic-framework/commit/0823c09d9c5f4f07a847fecfd3d3c1915eeb1ddf))
* **select:** modern component takes up full line ([#26670](https://github.com/ionic-team/ionic-framework/issues/26670)) ([4d24b32](https://github.com/ionic-team/ionic-framework/commit/4d24b328e2021f0d14b278df7535c9bdb9851952))
* **textarea:** clearOnEdit clears textarea when user initially types ([#26006](https://github.com/ionic-team/ionic-framework/issues/26006)) ([f7176bb](https://github.com/ionic-team/ionic-framework/commit/f7176bbb44c230d6f20b023942c577236e676b02))
* **textarea:** render icon for clearing input ([3271ecf](https://github.com/ionic-team/ionic-framework/commit/3271ecf1dec4f9baf238ea94e4047f2c26835b4b))


### Code Refactoring

* **config:** remove stencil extras ([#26461](https://github.com/ionic-team/ionic-framework/issues/26461)) ([bd4027b](https://github.com/ionic-team/ionic-framework/commit/bd4027b0fa1494c58e4ab7c804acfa053c63113a))
* **core:** remove global hidden attribute ([#25829](https://github.com/ionic-team/ionic-framework/issues/25829)) ([f5a6b5a](https://github.com/ionic-team/ionic-framework/commit/f5a6b5a4c434167cafd9060911ccbfda2a89734c)), closes [#17583](https://github.com/ionic-team/ionic-framework/issues/17583)
* **modal:** remove swipeToClose in favor of canDismiss ([#26050](https://github.com/ionic-team/ionic-framework/issues/26050)) ([1f3ddf2](https://github.com/ionic-team/ionic-framework/commit/1f3ddf2370c29f0fd2dd96aa9b3927ef96bdc5ae))
* **picker:** remove refresh key ([#26340](https://github.com/ionic-team/ionic-framework/issues/26340)) ([0fbcc5b](https://github.com/ionic-team/ionic-framework/commit/0fbcc5b9a97861dc31742db80b187d077a0d6750))
* **react:** only ship es modules ([#26044](https://github.com/ionic-team/ionic-framework/issues/26044)) ([c946af2](https://github.com/ionic-team/ionic-framework/commit/c946af29d3d65e4e78c03f0bbcb2376fd9d8c469))
* **types:** remove overlay attribute interfaces ([#26181](https://github.com/ionic-team/ionic-framework/issues/26181)) ([322a1db](https://github.com/ionic-team/ionic-framework/commit/322a1dbcd00fc1f3db17fb9fb46ba91ba164acd3))
* **vue:** only ship es modules ([#26054](https://github.com/ionic-team/ionic-framework/issues/26054)) ([86bbed0](https://github.com/ionic-team/ionic-framework/commit/86bbed07fc51fa1e3771f0198211c5064606e5bb)), closes [#25104](https://github.com/ionic-team/ionic-framework/issues/25104)


### Features

* **accordion:** ionChange will only emit from user committed changes ([#25922](https://github.com/ionic-team/ionic-framework/issues/25922)) ([4eea9fa](https://github.com/ionic-team/ionic-framework/commit/4eea9fa5c07d2a48bf5d224cd9b9e63453125b77))
* **action-sheet:** use action sheet overlay inline ([#26172](https://github.com/ionic-team/ionic-framework/issues/26172)) ([92b763a](https://github.com/ionic-team/ionic-framework/commit/92b763a538f1c935e10d90c3f4af1debf1cab2c3)), closes https://github.com/ionic-team/ionic-framework/issues/22799, https://github.com/ionic-team/ionic-framework/issues/23219
* **alert:** add ability to use alert inline ([#26316](https://github.com/ionic-team/ionic-framework/issues/26316)) ([08c0a55](https://github.com/ionic-team/ionic-framework/commit/08c0a5520a4f9be19d88644df26f4d38587985fa)), closes https://github.com/ionic-team/ionic-framework/issues/22799, https://github.com/ionic-team/ionic-framework/issues/23219
* **base-components:** add ability to remove ios and md theme ([#26669](https://github.com/ionic-team/ionic-framework/issues/26669)) ([18f109c](https://github.com/ionic-team/ionic-framework/commit/18f109c7dae97d4e74bee9b72a341aeafd95b222))
* **checkbox:** component can be used outside ion-item ([#26518](https://github.com/ionic-team/ionic-framework/issues/26518)) ([9d52e70](https://github.com/ionic-team/ionic-framework/commit/9d52e703610d0211667f0152e6c2b90ec6f13198)), closes https://github.com/ionic-team/ionic-framework/issues/21513, https://github.com/ionic-team/ionic-framework/issues/23332, https://github.com/ionic-team/ionic-framework/issues/23289
* **checkbox:** ionChange fires on user interaction ([#25923](https://github.com/ionic-team/ionic-framework/issues/25923)) ([a6b2629](https://github.com/ionic-team/ionic-framework/commit/a6b2629ede9f2b0e16343b9afabf68eb53cacc17))
* **datetime:** ionChange will only emit from user committed changes ([#26083](https://github.com/ionic-team/ionic-framework/issues/26083)) ([cc2af20](https://github.com/ionic-team/ionic-framework/commit/cc2af202a95c049c9dd11ffd50c0dec3c84bf3c0)), closes [#20873](https://github.com/ionic-team/ionic-framework/issues/20873) [#24452](https://github.com/ionic-team/ionic-framework/issues/24452)
* **input, textarea:** change default debounce to undefined ([#26073](https://github.com/ionic-team/ionic-framework/issues/26073)) ([c45d054](https://github.com/ionic-team/ionic-framework/commit/c45d05476b34648b59dc8d407a8a1c9f8bd4f409))
* **input, textarea:** ionInput and ionChange pass event and value ([#26176](https://github.com/ionic-team/ionic-framework/issues/26176)) ([eea6ba9](https://github.com/ionic-team/ionic-framework/commit/eea6ba996ce0f71546f5a14109d0d279400a27e5))
* **input:** component can be used outside of ion-item ([#26283](https://github.com/ionic-team/ionic-framework/issues/26283)) ([44472ae](https://github.com/ionic-team/ionic-framework/commit/44472aeb9f12585d7b5d40b5721d4281b66b5004)), closes [#20153](https://github.com/ionic-team/ionic-framework/issues/20153) [#19084](https://github.com/ionic-team/ionic-framework/issues/19084) [#22736](https://github.com/ionic-team/ionic-framework/issues/22736), https://github.com/ionic-team/ionic-framework/issues/24312, https://github.com/ionic-team/ionic-framework/issues/24333, https://github.com/ionic-team/ionic-framework/issues/24639, https://github.com/ionic-team/ionic-framework/issues/26178, https://github.com/ionic-team/ionic-framework/issues/24966, https://github.com/ionic-team/ionic-framework/issues/23331, https://github.com/ionic-team/ionic-framework/issues/18037, https://github.com/ionic-team/ionic-framework/issues/23335
* **input:** debounce controls the timing to delay the ionInput event ([#25969](https://github.com/ionic-team/ionic-framework/issues/25969)) ([35041b2](https://github.com/ionic-team/ionic-framework/commit/35041b2f3c99135d292500a662b889bdaaec6876))
* **input:** ionChange will only emit from user committed changes  ([#25858](https://github.com/ionic-team/ionic-framework/issues/25858)) ([8732b7b](https://github.com/ionic-team/ionic-framework/commit/8732b7bdb76320d5eeba1121ac5f5eefa343526f)), closes [#20106](https://github.com/ionic-team/ionic-framework/issues/20106) [#20061](https://github.com/ionic-team/ionic-framework/issues/20061)
* **loading:** use loading overlay inline ([#26153](https://github.com/ionic-team/ionic-framework/issues/26153)) ([34ca337](https://github.com/ionic-team/ionic-framework/commit/34ca337b8af27b144fb44428c8ed8cf07fc79bfc)), closes https://github.com/ionic-team/ionic-framework/issues/22799, https://github.com/ionic-team/ionic-framework/issues/23219
* **picker:** add ability to use picker inline ([#26336](https://github.com/ionic-team/ionic-framework/issues/26336)) ([c0a8501](https://github.com/ionic-team/ionic-framework/commit/c0a85016572956149ed4f01109f11154d7b5cb57)), closes https://github.com/ionic-team/ionic-framework/issues/22799, https://github.com/ionic-team/ionic-framework/issues/23219
* **radio-group:** ionChange will only emit from user committed changes ([#26223](https://github.com/ionic-team/ionic-framework/issues/26223)) ([c299d36](https://github.com/ionic-team/ionic-framework/commit/c299d3666aae96d0e67ce4d2c70efbe95bee81da))
* **radio:** component can be used outside of ion-item ([#26582](https://github.com/ionic-team/ionic-framework/issues/26582)) ([9761b0a](https://github.com/ionic-team/ionic-framework/commit/9761b0a092e50ac4cc9176b6bcd5b9d29a5b22b3)), closes https://github.com/ionic-team/ionic-framework/issues/21513
* **range:** component can be used outside of ion-item ([#26479](https://github.com/ionic-team/ionic-framework/issues/26479)) ([49baad8](https://github.com/ionic-team/ionic-framework/commit/49baad8ee6cfe7e26068f4c9954d4a59d343b339))
* **range:** ionChange will only emit from user committed changes ([#26089](https://github.com/ionic-team/ionic-framework/issues/26089)) ([d1fb7b0](https://github.com/ionic-team/ionic-framework/commit/d1fb7b039b8e11e9d9ede850f90b977a46b52de8))
* **searchbar:** ionChange will only emit from user committed changes ([#26026](https://github.com/ionic-team/ionic-framework/issues/26026)) ([b052d3b](https://github.com/ionic-team/ionic-framework/commit/b052d3b2622b795cde102591f0191338e15b14a0))
* **segment:** ionChange will only emit from user committed changes ([#25934](https://github.com/ionic-team/ionic-framework/issues/25934)) ([a03c8af](https://github.com/ionic-team/ionic-framework/commit/a03c8afb3dc4e6672beae680c61c89477478f28b))
* **select:** component can be used outside ion-item ([#26572](https://github.com/ionic-team/ionic-framework/issues/26572)) ([02640b5](https://github.com/ionic-team/ionic-framework/commit/02640b5795c4fb8a46f0cdc8903f2a08abfa9135)), closes https://github.com/ionic-team/ionic-framework/issues/23540, https://github.com/ionic-team/ionic-framework/issues/24322, https://github.com/ionic-team/ionic-framework/issues/25449, https://github.com/ionic-team/ionic-framework/issues/25639, https://github.com/ionic-team/ionic-framework/issues/19936
* **select:** ionChange will only emit from user committed changes ([#26066](https://github.com/ionic-team/ionic-framework/issues/26066)) ([34c4137](https://github.com/ionic-team/ionic-framework/commit/34c41378682a202d4fab11aad171df7f55f4c243))
* **slides:** remove ion-slide, ion-slides, and IonicSwiper module ([#25868](https://github.com/ionic-team/ionic-framework/issues/25868)) ([d478e03](https://github.com/ionic-team/ionic-framework/commit/d478e03914fed15766c893738d6386d7623d066d))
* **textarea:** component can be used outside of ion-item ([#26674](https://github.com/ionic-team/ionic-framework/issues/26674)) ([8d3edd0](https://github.com/ionic-team/ionic-framework/commit/8d3edd049dfdb2a781d80da810a5bee3b490b7b6)), closes https://github.com/ionic-team/ionic-framework/issues/22269
* **textarea:** ionChange will only emit from user committed changes ([#25953](https://github.com/ionic-team/ionic-framework/issues/25953)) ([68bae80](https://github.com/ionic-team/ionic-framework/commit/68bae80a51dae70c4cd7e598c1f2eabb025f173e))
* **toast:** add ability to use toast inline ([#26215](https://github.com/ionic-team/ionic-framework/issues/26215)) ([003de44](https://github.com/ionic-team/ionic-framework/commit/003de44d9283d23ecfdf1ab5fada2b7a372a4ca9)), closes https://github.com/ionic-team/ionic-framework/issues/22799, https://github.com/ionic-team/ionic-framework/issues/23219
* **toggle:** component can be used outside of ion-item ([#26357](https://github.com/ionic-team/ionic-framework/issues/26357)) ([c74901c](https://github.com/ionic-team/ionic-framework/commit/c74901c973c153ce1954646ef7944f7db193ea28)), closes [#25570](https://github.com/ionic-team/ionic-framework/issues/25570) [#23213](https://github.com/ionic-team/ionic-framework/issues/23213), closes https://github.com/ionic-team/ionic-framework/issues/23332, https://github.com/ionic-team/ionic-framework/issues/23213
* **toggle:** ionChange will only emit from user committed changes ([#26078](https://github.com/ionic-team/ionic-framework/issues/26078)) ([85d3bd9](https://github.com/ionic-team/ionic-framework/commit/85d3bd99be3ae0f33a480e256381f7125f3389fd))
* **virtual-scroll:** remove virtual scroll component ([#25808](https://github.com/ionic-team/ionic-framework/issues/25808)) ([1eb6fd0](https://github.com/ionic-team/ionic-framework/commit/1eb6fd04d7f8c7ccd7dac08d085dc90d9f6283cc))


### Performance Improvements

* **item:** remove delegatesFocus patch for iOS 13 ([#25822](https://github.com/ionic-team/ionic-framework/issues/25822)) ([ee3467c](https://github.com/ionic-team/ionic-framework/commit/ee3467c9f1aa415ff6bda19e460b5c3482b94efc)), closes https://github.com/ionic-team/ionic-framework/issues/25273
* **many:** reduce delay when performing overlay or page transitions ([#26189](https://github.com/ionic-team/ionic-framework/issues/26189)) ([30e3a14](https://github.com/ionic-team/ionic-framework/commit/30e3a1485d9bc94b31c297bdd05fa847b4bcfb56)), closes [#24346](https://github.com/ionic-team/ionic-framework/issues/24346)


### BREAKING CHANGES

* **config:** The supported version of Firefox for Ionic v7 has changed to Firefox v70+
* **input, searchbar, select, textarea:** The default value for the `--placeholder-opacity` CSS Variable on `ion-input`, `ion-searchbar`, `ion-select`, and `ion-textarea` has been updated to `0.6`.
* **select:** The `icon` CSS Shadow Part for `ion-select` now targets an `ion-icon` component.
* **datetime:** The haptics when swiping the wheel picker are now enabled only on iOS.
* **toggle:** The `--background` and `--background-checked` variables have been renamed to `--track-background` and `--track-background-checked`, respectively.
* **angular:** Datetime:

Passing the empty string to the `value` property will now error as it is not a valid ISO-8601 value.

Angular:

`null` values on form components will no longer be converted to the empty string (`''`) or `false`. This impacts `ion-checkbox`, `ion-datetime`, `ion-input`, `ion-radio`, `ion-radio-group`, ion-range`, `ion-searchbar`, `ion-segment`, `ion-select`, `ion-textarea`, and `ion-toggle`.
* **picker:** The `refresh` key has been removed from the `PickerColumn` interface. Developers should use the `columns` property to refresh the `ion-picker` view.
* **input, textarea:** The `detail` payload for the `ionInput` event on `ion-input` and `ion-textarea` now contains an object with the current `value` as well as the native event that triggered `ionInput`.
* **datetime:** Datetime no longer incorrectly reports the time zone when `value` is updated. Datetime does not manage time zones, so any time zone information provided is ignored.
* **types:** `ActionSheetAttributes`, `AlertAttributes`, `AlertTextareaAttributes`, `AlertInputAttributes`, `LoadingAttributes`, `ModalAttributes`, `PickerAttributes`, `PopoverAttributes`, and `ToastAttributes` have been removed. Developers should use `{ [key: string]: any }` instead.
* **card-header:** - The card header has ben changed to a flex container with direction set to `column` (top to bottom). In `ios` mode the direction is set to `column-reverse` which results in the subtitle displaying on top of the title.
* **accordion-group:** Accordion Group no longer automatically adjusts the `value` property when passed an array and `multiple="false"`. Developers should update their apps to ensure they are using the API correctly.
* **select:** `ionChange` is no longer emitted when the `value` of `ion-select` is modified externally. `ionChange` is only emitted from user committed changes, such as confirming a selected option in the select's overlay.
* **react:** `@ionic/react` and `@ionic/react-router` no longer ship a CommonJS entry point. Instead, only an ES Module entry point is provided for improved compatibility with Vite.
* **vue:** `@ionic/vue` and `@ionic/vue-router` no longer ship a CommonJS entry point. Instead, only an ES Module entry point is provided for improved compatibility with Vite.
* **modal:** - The `swipeToClose` property has been removed in favor of `canDismiss`.
- The `canDismiss` property now defaults to `true` and can no longer be set to `undefined`.
* **checkbox:** `ionChange` is no longer emitted when the `checked` property of `ion-checkbox` is modified externally. `ionChange` is only emitted from user committed changes, such as clicking or tapping the checkbox.
* **accordion:** `ionChange` is no longer emitted when the `value` of `ion-accordion-group` is modified externally. `ionChange` is only emitted from user committed changes, such as clicking or tapping the accordion header.
* **core:** The `[hidden]` attribute has been removed from Ionic's global stylesheet. The `[hidden]` attribute can continue to be used, but developers will get the [native `hidden` implementation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) instead. The main difference is that the native implementation is easier to override using `display` than Ionic's implementation.

Developers can add the following CSS to their global stylesheet if they need the old behavior:

```css
[hidden] {
  display: none !important;
}
```
* **overlays:** Ionic now listens on the `keydown` event instead of the `keyup` event when determining when to dismiss overlays via the "Escape" key. Any applications that were listening on `keyup` to suppress this behavior should listen on `keydown` instead. 



