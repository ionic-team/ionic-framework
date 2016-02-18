<a name="2.0.0-beta.1"></a>
# [2.0.0-beta.1](https://github.com/driftyco/ionic/compare/v2.0.0-beta.0...v2.0.0-beta.1) (2016-02-18)


### Bug Fixes

* **alert:** add padding under the alert title for iOS when there is no message ([c365c92](https://github.com/driftyco/ionic/commit/c365c92)), closes [#5299](https://github.com/driftyco/ionic/issues/5299)
* **alert:** fix alert button background color on activated ([fd0b851](https://github.com/driftyco/ionic/commit/fd0b851))
* **animations:** remove inline styles when finished ([22c32f3](https://github.com/driftyco/ionic/commit/22c32f3)), closes [#5130](https://github.com/driftyco/ionic/issues/5130)
* **button:** button goes transparent on hover on desktop (non-touch devices) ([0e5d3d7](https://github.com/driftyco/ionic/commit/0e5d3d7))
* **button:** fix colorized buttons on hover and outline buttons on hover ([2df72cc](https://github.com/driftyco/ionic/commit/2df72cc))
* **checkbox:** use value accessor provider ([e468a21](https://github.com/driftyco/ionic/commit/e468a21)), closes [#5353](https://github.com/driftyco/ionic/issues/5353)
* **colors:** update sass inverse color function ([55ef5a8](https://github.com/driftyco/ionic/commit/55ef5a8))
* **input:** fix stand-alone text-input item cover ([e2554f0](https://github.com/driftyco/ionic/commit/e2554f0)), closes [#5387](https://github.com/driftyco/ionic/issues/5387)
* **input:** make ion-label tappable to focus input ([38595fa](https://github.com/driftyco/ionic/commit/38595fa)), closes [#5378](https://github.com/driftyco/ionic/issues/5378)
* **item:** add min-height to item-inner to remove gap between items ([90f165f](https://github.com/driftyco/ionic/commit/90f165f)), closes [#5350](https://github.com/driftyco/ionic/issues/5350)
* **menu:** add/remove gesture listeners per enabled menu ([ff24152](https://github.com/driftyco/ionic/commit/ff24152))
* **NavController:** fire onPageWillUnload/DidUnload ([8f0b88b](https://github.com/driftyco/ionic/commit/8f0b88b)), closes [#5507](https://github.com/driftyco/ionic/issues/5507)
* **radio:** radio w/ falsy value not checkable ([89861e0](https://github.com/driftyco/ionic/commit/89861e0)), closes [#5348](https://github.com/driftyco/ionic/issues/5348)
* **radio:** use value accessor provider ([b85d7aa](https://github.com/driftyco/ionic/commit/b85d7aa))
* **segment:** add the active background color to the colorized segments and remove activated ([df9a4df](https://github.com/driftyco/ionic/commit/df9a4df)), closes [#5308](https://github.com/driftyco/ionic/issues/5308)
* **select:** use value accessor provider ([3444a3c](https://github.com/driftyco/ionic/commit/3444a3c))
* **toggle:** use value accessor provider ([5034c1d](https://github.com/driftyco/ionic/commit/5034c1d)), closes [#5425](https://github.com/driftyco/ionic/issues/5425)
* **toolbar:** fix md toolbar so it doesn't flow off the screen ([bd03760](https://github.com/driftyco/ionic/commit/bd03760)), closes [#5414](https://github.com/driftyco/ionic/issues/5414)
* **toolbar:** fixes segment/title aligment when cordova iOS style is applied ([2766f7f](https://github.com/driftyco/ionic/commit/2766f7f)), closes [#5208](https://github.com/driftyco/ionic/issues/5208)
* **toolbar:** toolbar padding when running in cordova iOS ([db535dd](https://github.com/driftyco/ionic/commit/db535dd))

### Features

* **generators:** add Sass import reminder to page generator ([b22b5ff](https://github.com/driftyco/ionic/commit/b22b5ff))
* **menu:** allow persistent menus ([0d47a1b](https://github.com/driftyco/ionic/commit/0d47a1b)), closes [#5204](https://github.com/driftyco/ionic/issues/5204)
* **menu:** close any opened menu ([c02fb51](https://github.com/driftyco/ionic/commit/c02fb51))
* **MenuController:** create isOpen() and isEnabled() ([3bb09ce](https://github.com/driftyco/ionic/commit/3bb09ce)), closes [#5390](https://github.com/driftyco/ionic/issues/5390)
* **nav:** iOS swipe to go back ([da37029](https://github.com/driftyco/ionic/commit/da37029)), closes [#5185](https://github.com/driftyco/ionic/issues/5185)
* **select:** cancel output event ([6a7c97d](https://github.com/driftyco/ionic/commit/6a7c97d)), closes [#5439](https://github.com/driftyco/ionic/issues/5439)
* **slides:** add slideChangeStart event output ([736140c](https://github.com/driftyco/ionic/commit/736140c)), closes [#5301](https://github.com/driftyco/ionic/issues/5301)
* **slides:** added move event onSlideMove ([daceb98](https://github.com/driftyco/ionic/commit/daceb98))
* **tabs:** rootParams, pass params to tabs ([e06cf71](https://github.com/driftyco/ionic/commit/e06cf71)), closes [#5172](https://github.com/driftyco/ionic/issues/5172)
* **themes:** add dark theme ([7eb7952](https://github.com/driftyco/ionic/commit/7eb7952)),  ([3ee5bd3](https://github.com/driftyco/ionic/commit/3ee5bd3)),  ([3dbd9a9](https://github.com/driftyco/ionic/commit/3dbd9a9)),  ([eb8e778](https://github.com/driftyco/ionic/commit/eb8e778)),  ([bcaa484](https://github.com/driftyco/ionic/commit/bcaa484)),  ([569beab](https://github.com/driftyco/ionic/commit/569beab)), closes [#4967](https://github.com/driftyco/ionic/issues/4967)

### Performance Improvements

* **animation:** only update progressStep once per 16ms ([098371a](https://github.com/driftyco/ionic/commit/098371a))

### Refactor

* **card:** create ion-card-title element and remove card-title ([7aabd0f](https://github.com/driftyco/ionic/commit/7aabd0f), closes [#5303](https://github.com/driftyco/ionic/issues/5303)
* **segment:** increase icon size inside of segment buttons ([7249cb3](https://github.com/driftyco/ionic/commit/7249cb3), closes [#5330](https://github.com/driftyco/ionic/issues/5330)
* **pull-to-refresh:** emit start event and change all events to emit refresher ([acf1894](https://github.com/driftyco/ionic/commit/acf1894), references [#5207](https://github.com/driftyco/ionic/issues/5207)
* **slides:** remove the attributes from the slider and use options instead ([d21ae88](https://github.com/driftyco/ionic/commit/d21ae88), closes [#5189](https://github.com/driftyco/ionic/issues/5189)

### Breaking Changes

* **card:** `.card-title` class does not exist anymore, use the `ion-card-title` element instead.
* **pull-to-refresh:** `(starting)` event has been renamed to `(start)`.
* **slides:** many attributes have been removed, must use `options` to pass configuration the slider. See the [Swiper Parameters API](http://www.idangero.us/swiper/api).

<a name="2.0.0-beta.0"></a>
# 2.0.0-beta.0

Enjoy!

<3 The Ionic Team



<a name="2.0.0-alpha.57"></a>
# [2.0.0-alpha.57](https://github.com/driftyco/ionic/compare/v2.0.0-alpha.56...v2.0.0-alpha.57) (2016-02-10)


### Bug Fixes

* **button:** bar-button uses inner span as flexbox ([38a3be4](https://github.com/driftyco/ionic/commit/38a3be4))

### Features

* Improved transitions and animations
* hairlines width can be configured with a sass variable ([06b3a5b](https://github.com/driftyco/ionic/commit/06b3a5b))
* **ion-item-sliding:** style icons on top of text in an option button ([4e57fcf](https://github.com/driftyco/ionic/commit/4e57fcf)), closes [#5352](https://github.com/driftyco/ionic/issues/5352)

### Refactor

* **animations:** no longer using Web Animations polyfill ([da18868](https://github.com/driftyco/ionic/commit/da18868))

### Breaking Changes

The Web Animations polyfill is no longer shipped with the framework and may cause build errors.  

Projects will need to be [updated accordingly](https://github.com/driftyco/ionic-conference-app/commit/2ed59e6fd275c4616792c7b2e5aa9da4a20fb188).

<a name="2.0.0-alpha.56"></a>
# [2.0.0-alpha.56](https://github.com/driftyco/ionic/compare/v2.0.0-alpha.55...v2.0.0-alpha.56) (2016-02-05)


### Bug Fixes

* **tabs:** show navbar on second page in tab ([f2db74b](https://github.com/driftyco/ionic/commit/f2db74b))



<a name="2.0.0-alpha.55"></a>
# [2.0.0-alpha.55](https://github.com/driftyco/ionic/compare/v2.0.0-alpha.54...v2.0.0-alpha.55) (2016-02-05)


### Bug Fixes

* **alert:** ensure keyup listener has been removed ([2710e34](https://github.com/driftyco/ionic/commit/2710e34))
* **build:** tell gulp when finished building ([60e1278](https://github.com/driftyco/ionic/commit/60e1278))
* **generators:** use mkdirp-no-bin ([dcc20fa](https://github.com/driftyco/ionic/commit/dcc20fa))
* **input:** copy custom attrs from ion-input to native input ([4cfe210](https://github.com/driftyco/ionic/commit/4cfe210))
* **menu:** fix scrolling page w/ side menus ([72699db](https://github.com/driftyco/ionic/commit/72699db)), closes [#5272](https://github.com/driftyco/ionic/issues/5272)
* **menu:** only close when open on enable change ([a428363](https://github.com/driftyco/ionic/commit/a428363))
* **searcher:** add autocomplete="off" to native input ([f47c3c3](https://github.com/driftyco/ionic/commit/f47c3c3))

### Features

* **actionsheet:** disable clicking backdrop to dismiss ([7686767](https://github.com/driftyco/ionic/commit/7686767))
* **alert:** disable clicking backdrop to dismiss ([53e014f](https://github.com/driftyco/ionic/commit/53e014f))

### Performance Improvements

* **cards:** remove translateZ from ion-card ([60fdc5c](https://github.com/driftyco/ionic/commit/60fdc5c))
* **tabs:** render tab navbar at same time of tab content ([687a17b](https://github.com/driftyco/ionic/commit/687a17b))

### Breaking Changes

Menu has been improved to make it easier to open, close, toggle and enable menus.
Instead of injecting `IonicApp` to find the menu component, you now inject
`MenuController`.

Was:

```
constructor(app: IonicApp) {
  this.app = app;
}
openMenu() {
  this.app.getComponent('leftMenu').close();
}
```

Now:

To programmatically interact with any menu, you can inject the `MenuController`
provider into any component or directive. This makes it easy get ahold
of and control the correct menu instance. By default Ionic will find the app's
menu without requiring a menu ID. An id attribute on an `<ion-menu>` is only
required if there are multiple menus on the same side. If there are multiple
menus, but on different sides, you can use the name of the side to get the correct
menu

If there's only one menu:

```
constructor(menu: MenuController) {
  this.menu = menu;
}
openMenu() {
  this.menu.close();
}
```

If there is a menu on the left and right side:

```
toggleMenu() {
  this.menu.toggle('left');
}
```

If there are multiple menus on the same side:

```
<ion-menu id="myMenuId" side="left">...</ion-menu>
<ion-menu id="otherMenuId" side="left">...</ion-menu>

closeMenu() {
  this.menu.close('myMenuId');
}
```


<a name="2.0.0-alpha.54"></a>
# [2.0.0-alpha.54](https://github.com/driftyco/ionic/compare/v2.0.0-alpha.53...v2.0.0-alpha.54) (2016-02-02)


### Bug Fixes

* **alert:** add checkbox icon for iOS using Sass variables from regular checkbox ([68819f0](https://github.com/driftyco/ionic/commit/68819f0)), closes [#5253](https://github.com/driftyco/ionic/issues/5253)
* **badge:** change default badge color to primary ([93b9891](https://github.com/driftyco/ionic/commit/93b9891)), closes [#5222](https://github.com/driftyco/ionic/issues/5222)
* **badge:** split badge color into separate modes ([b472c6c](https://github.com/driftyco/ionic/commit/b472c6c))
* **css:** minor updates to match previous snapshots ([9749b06](https://github.com/driftyco/ionic/commit/9749b06))
* **input:** add/remove disabled on native text input ([11b8e08](https://github.com/driftyco/ionic/commit/11b8e08)), closes [#5280](https://github.com/driftyco/ionic/issues/5280)
* **input:** check has value on writeValue ([181a070](https://github.com/driftyco/ionic/commit/181a070))
* **input:** parent Item is optional ([db6f4bc](https://github.com/driftyco/ionic/commit/db6f4bc))
* **prepare:** add missing require to prepare task ([b2f7278](https://github.com/driftyco/ionic/commit/b2f7278))
* **scrollbars:** do not apply css scrollbars ([f3fb182](https://github.com/driftyco/ionic/commit/f3fb182))
* **select:** always update value and text ([58443f0](https://github.com/driftyco/ionic/commit/58443f0))
* **select:** null value clears select text ([c264e31](https://github.com/driftyco/ionic/commit/c264e31)), closes [#5288](https://github.com/driftyco/ionic/issues/5288)

### Features

* **button:** increase hit area of toolbar buttons ([cad9e49](https://github.com/driftyco/ionic/commit/cad9e49))
* **checkbox:** add bg transition to md checkbox ([8466d39](https://github.com/driftyco/ionic/commit/8466d39))
* **overlay:** fire the cancel handler when dismissing from backdrop ([1c618b5](https://github.com/driftyco/ionic/commit/1c618b5))
* **scrollbars:** webkit scrollbar styling for desktop ([c7f2268](https://github.com/driftyco/ionic/commit/c7f2268))

### Breaking Changes

* **action-sheet:** Button `style` property renamed to `role` ([1c618b5](https://github.com/driftyco/ionic/commit/1c618b51eb0a31013f7d3509d34c796d65689836#diff-f61014c4fb6e166fa1b5645d126dd4f6L26))

##### Angular was updated to Beta 2

* Update the version of Angular in your `package.json` file:

  ```
  "angular2": "2.0.0-beta.2",
  ```


<a name="2.0.0-alpha.53"></a>
# 2.0.0-alpha.53 (2016-01-28)

### Features

* Normalize how `ion-item` and inner inputs/avatars/icons/etc are written
* Only one type of `ion-item`, rather than every input also having a similar structure
* Multiple inputs can be placed inside of an `ion-item`
* Allow avatars/thumbnails/icons next to checkbox/radio/toggle/select/input
* Inputs can be stand-alone components, and not required within an `ion-item`


### Breaking Changes

* CSS may not get updated if your `ionic.config` file is not correct:

  If you have the following directory structure:

  ```
  │   ├── theme/                         * App theme files
  │   │   ├── app.core.scss              * App Shared Sass Imports
  │   │   ├── app.ios.scss               * iOS Sass Imports & iOS Variables
  │   │   ├── app.md.scss                * MD Sass Imports & MD Variables
  │   │   └── app.variables.scss         * App Shared Sass Variables
  ```

  Make sure the `ionic.config` file looks like this:

  ```
  sass: {
    src: ['app/theme/app.+(ios|md).scss'],
    dest: 'www/build/css',
    include: [
      'node_modules/ionic-framework',
      'node_modules/ionicons/dist/scss'
    ]
  },
  ```
* Inputs are now placed inside of `ion-item`
* Inputs do not come with their own label
* `ion-item-content` has been replaced with `ion-label`
* Label attributes are placed on `ion-label` rather than `ion-input`
* Native HTML `<input>` and `<textarea>` should not be used in items, but instead `<ion-input>` and `<ion-textarea>`


##### Text Input Refactor

Was:

```html
<ion-input>
  <ion-label>Email</ion-label>
  <input type="email">
</ion-input>

<ion-input>
  <ion-label>Comments</ion-label>
  <textarea></textarea>
</ion-input>
```

Now:

```html
<ion-item>
  <ion-label>Email</ion-label>
  <ion-input type="email"></ion-input>
</ion-item>

<ion-item>
  <ion-label>Comments</ion-label>
  <ion-textarea></ion-textarea>
</ion-item>

```


##### Checkbox Refactor

Was:

```html
  <ion-checkbox [(ngModel)]="data">
    My Checkbox
  </ion-checkbox>
```

Now:

```html
  <ion-item>
    <ion-label>My Checkbox</ion-label>
    <ion-checkbox [(ngModel)]="data"></ion-checkbox>
  </ion-item>
```


##### Radio Button Refactor

Was:

```html
<ion-list radio-group [(ngModel)]="data">

  <ion-list-header>
    Auto Manufacturers
  </ion-list-header>

  <ion-radio value="cord">
    Cord
  </ion-radio>

  <ion-radio value="duesenberg" checked="true">
    Duesenberg
  </ion-radio>

  <ion-radio value="hudson">
    Hudson
  </ion-radio>

</ion-list>
```

Now:

```html
<ion-list radio-group [(ngModel)]="data">

  <ion-list-header>
    Auto Manufacturers
  </ion-list-header>

  <ion-item>
    <ion-label>Cord</ion-label>
    <ion-radio value="cord"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>Duesenberg</ion-label>
    <ion-radio value="duesenberg" checked="true"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>Hudson</ion-label>
    <ion-radio value="hudson"></ion-radio>
  </ion-item>

</ion-list>
```


##### Select Refactor

Was:

```html
  <ion-select [(ngModel)]="gender">
    <ion-label>Gender</ion-label>
    <ion-option value="f" checked="true">Female</ion-option>
    <ion-option value="m">Male</ion-option>
  </ion-select>
```

Now:

```html
  <ion-item>
    <ion-label>Gender</ion-label>
    <ion-select [(ngModel)]="gender">
      <ion-option value="f" checked="true">Female</ion-option>
      <ion-option value="m">Male</ion-option>
    </ion-select>
  <ion-item>
```


##### Toggle Refactor

Was:

```html
  <ion-toggle [(ngModel)]="data">
    My Toggle
  </ion-toggle>
```

Now:

```html
  <ion-item>
    <ion-label>My Toggle</ion-label>
    <ion-toggle [(ngModel)]="data"></ion-toggle>
  </ion-item>
```


##### Label Attribute Refactor

Was:

```html
<ion-input fixed-label>
  <ion-label>Username</ion-label>
  <input type="text">
</ion-input>

<ion-input floating-label>
  <ion-label>Email</ion-label>
  <input type="email">
</ion-input>
```

Now:

```html
<ion-item>
  <ion-label fixed>Username</ion-label>
  <ion-input></ion-input>
</ion-item>

<ion-item>
  <ion-label floating>Email</ion-label>
  <ion-input type="email"></ion-input>
</ion-item>
```
### misc

* Code and syntax highlighting in markdown ([8cb2b4d](https://github.com/driftyco/ionic2/commit/8cb2b4d))
* Merge pull request #5217 from manucorporat/2.0 ([e1b514d](https://github.com/driftyco/ionic2/commit/e1b514d))

### chore

* chore(changelog): label attr refactor ([ca6eef9](https://github.com/driftyco/ionic2/commit/ca6eef9))
* chore(changelog): updates for alpha.53 ([47806dc](https://github.com/driftyco/ionic2/commit/47806dc))
* chore(package): don't increment version in `gulp package` ([ab4c7c3](https://github.com/driftyco/ionic2/commit/ab4c7c3))
* chore(snapshot): update snapshot to run all tests ([cb7a358](https://github.com/driftyco/ionic2/commit/cb7a358))

### docs

* docs(): hide methods not requiring docs ([dbc681f](https://github.com/driftyco/ionic2/commit/dbc681f))
* docs(): update for alpha52 ([cefc305](https://github.com/driftyco/ionic2/commit/cefc305))
* docs(blur): hide docs for blur ([4435451](https://github.com/driftyco/ionic2/commit/4435451))
* docs(demos): clean up blur demo ([779a494](https://github.com/driftyco/ionic2/commit/779a494))
* docs(demos): clean up nav-push-pop ([4eadc78](https://github.com/driftyco/ionic2/commit/4eadc78))
* docs(demos): fix scroll demo to use correct attributes ([4df4afd](https://github.com/driftyco/ionic2/commit/4df4afd))
* docs(demos): prettify ShowWhen demo ([aca9ea6](https://github.com/driftyco/ionic2/commit/aca9ea6))
* docs(demos): prettify config some more and add another page - fix back button icon ([e982c69](https://github.com/driftyco/ionic2/commit/e982c69))
* docs(demos): prettify nav params demo ([58dfa3d](https://github.com/driftyco/ionic2/commit/58dfa3d))
* docs(demos): prettify the config demo ([a8bc0d2](https://github.com/driftyco/ionic2/commit/a8bc0d2))
* docs(demos): prettify the hide-when demo ([a676d7d](https://github.com/driftyco/ionic2/commit/a676d7d))
* docs(demos): prettify the platform demo ([b933029](https://github.com/driftyco/ionic2/commit/b933029))
* docs(demos): prettifying local-storage demo ([8bc853f](https://github.com/driftyco/ionic2/commit/8bc853f))
* docs(demos): prettifying modal demo ([95d03ca](https://github.com/driftyco/ionic2/commit/95d03ca))
* docs(demos): prettifying some more local-storage ([2d691b0](https://github.com/driftyco/ionic2/commit/2d691b0))
* docs(demos): remove attr from docs ([047a939](https://github.com/driftyco/ionic2/commit/047a939))
* docs(demos): remove unused demos ([c68da33](https://github.com/driftyco/ionic2/commit/c68da33)), closes [#5216](https://github.com/driftyco/ionic2/issues/5216)
* docs(demos): remove unused demos ([e50eb89](https://github.com/driftyco/ionic2/commit/e50eb89)), closes [#5216](https://github.com/driftyco/ionic2/issues/5216)
* docs(demos): update demos to latest alpha ([59c62a0](https://github.com/driftyco/ionic2/commit/59c62a0))
* docs(demos): update demos with item-refactor ([d7dec0a](https://github.com/driftyco/ionic2/commit/d7dec0a))
* docs(demos): update menu demo to use menuClose attribute ([e7fe7e4](https://github.com/driftyco/ionic2/commit/e7fe7e4))
* docs(toolbar): add subheader and footer examples ([d971f3e](https://github.com/driftyco/ionic2/commit/d971f3e)), closes [#5174](https://github.com/driftyco/ionic2/issues/5174) [#5063](https://github.com/driftyco/ionic2/issues/5063)
* docs(toolbar): clean up docs ([18eb967](https://github.com/driftyco/ionic2/commit/18eb967))

### feat

* feat(checkbox): stand-alone checkbox components ([6890532](https://github.com/driftyco/ionic2/commit/6890532))
* feat(select): emit change and select events ([e19d4e3](https://github.com/driftyco/ionic2/commit/e19d4e3)), closes [#5219](https://github.com/driftyco/ionic2/issues/5219)
* feat(util): add margin attributes ([e22ccf4](https://github.com/driftyco/ionic2/commit/e22ccf4))

### fix

* fix(alert): add z-index and border-radius to fix ripple ([5b0d60d](https://github.com/driftyco/ionic2/commit/5b0d60d)), closes [#5203](https://github.com/driftyco/ionic2/issues/5203)
* fix(blur): fix blur directive so it adds the filter and add a test ([4af0e41](https://github.com/driftyco/ionic2/commit/4af0e41))
* fix(input): change next input imports ([70a9eb3](https://github.com/driftyco/ionic2/commit/70a9eb3))
* fix(input): checked attr can be an empty string or no value ([e76b559](https://github.com/driftyco/ionic2/commit/e76b559))
* fix(input): clean up CSS on inputs and labels ([2fc9753](https://github.com/driftyco/ionic2/commit/2fc9753))
* fix(input): fix floating label on blur w/ value ([5d4a8fe](https://github.com/driftyco/ionic2/commit/5d4a8fe))
* fix(input): fix floating/stacked label relocate ([ad7885f](https://github.com/driftyco/ionic2/commit/ad7885f))
* fix(input): update input css/tests ([42f6b10](https://github.com/driftyco/ionic2/commit/42f6b10))
* fix(label): fix label for item and inputs by adding flex back ([3cbbfdc](https://github.com/driftyco/ionic2/commit/3cbbfdc))
* fix(label): remove left margin for md labels in items ([3be8952](https://github.com/driftyco/ionic2/commit/3be8952))
* fix(menu): fix right side menu - platform becomes \_platform ([0b0500d](https://github.com/driftyco/ionic2/commit/0b0500d)), closes [#5147](https://github.com/driftyco/ionic2/issues/5147)
* fix(radio): allow radios to check even without values ([f20ae8f](https://github.com/driftyco/ionic2/commit/f20ae8f))
* fix(radio): prevent multiple radio buttons from being checked ([334fb3c](https://github.com/driftyco/ionic2/commit/334fb3c))
* fix(scroll): add pull to refresh Sass back to core component ([adce1e5](https://github.com/driftyco/ionic2/commit/adce1e5))
* fix(scroll): canOverscroll was set to false which prevented PTR from ever working ([e4b2006](https://github.com/driftyco/ionic2/commit/e4b2006))
* fix(searchbar): modify height on the input to fix it on Canary ([e672de5](https://github.com/driftyco/ionic2/commit/e672de5)), closes [#5176](https://github.com/driftyco/ionic2/issues/5176)
* fix(select): fix select disabled state ([eb03159](https://github.com/driftyco/ionic2/commit/eb03159))
* fix(select): update text on ngModel change ([0a04522](https://github.com/driftyco/ionic2/commit/0a04522))
* fix(slides): convert loop attribute to a boolean and index to a number before passing to slides ([de9a986](https://github.com/driftyco/ionic2/commit/de9a986)), closes [#5189](https://github.com/driftyco/ionic2/issues/5189)

### refactor

* refactor(input): break apart input source files ([aea2217](https://github.com/driftyco/ionic2/commit/aea2217))
* refactor(input): place inputs inside of ion-item ([b3a7298](https://github.com/driftyco/ionic2/commit/b3a7298))

### release

* release: 2.0.0-alpha.53 ([9a78d68](https://github.com/driftyco/ionic2/commit/9a78d68))

### test

* test(input): add test to reproduce a floating label bug ([c1fbbb1](https://github.com/driftyco/ionic2/commit/c1fbbb1))
* test(list): add some markup for checkboxes and avatars ([e568eb9](https://github.com/driftyco/ionic2/commit/e568eb9))
* test(list): fix toggle to represent new ion-item ([58d994b](https://github.com/driftyco/ionic2/commit/58d994b))
* test(radio): add e2e test for radios with no value ([f79a121](https://github.com/driftyco/ionic2/commit/f79a121))



<a name="2.0.0-alpha.52"></a>
# 2.0.0-alpha.52 (2016-01-25)

- Bug fixes


<a name="2.0.0-alpha.51"></a>
# 2.0.0-alpha.51 (2016-01-21)

### Breaking Changes

##### Angular was updated to Beta 1

* Update the version of Angular in your `package.json` file:

  ```
  "angular2": "2.0.0-beta.1",
  ```

##### Ionicons were moved

* Install ionicons (this will be added in the starters): `npm install --save ionicons@latest`
* Modify the sass `include` in your `ionic.config.js` file:

  ```js
    sass: {
      src: ['app/theme/app.+(ios|md).scss'],
      dest: 'www/build/css',
      include: [
        'node_modules/ionic-framework',
        'node_modules/ionicons/dist/scss'
      ]
    },
  ```

* Modify the fonts `src` in your `ionic.config.js` file:

  ```js
    fonts: {
      src: ['node_modules/ionic-framework/fonts/**/*.+(ttf|woff|woff2)'],
      dest: "www/build/fonts"
    },
  ```

<a name="2.0.0-alpha.48"></a>
# 2.0.0-alpha.48 (2016-01-07)

### Breaking Changes

##### Icon Refactor

* `<icon>` has been renamed to `<ion-icon>`
* `<ion-icon>` requires the `name` attribute with a value
* Icon names with an `ion-` prefix are no longer needed
* Icons with `social-` prefix have been changed to a `logo-` prefix

Was:

`<icon home></icon>`
`<icon ion-social-twitter></icon>`

Now:

`<ion-icon name="home"></ion-icon>`
`<ion-icon name="logo-twitter"></ion-icon>`


<a name="2.0.0-alpha.47"></a>
# 2.0.0-alpha.47 (2016-01-04)

### Breaking Changes

##### Overlay Refactor

* `<ion-overlay></ion-overlay>` is no longer required within any template
* `Popup` has been renamed to `Alert`
* Common API for all overlays: `Alert`, `ActionSheet`, `Modal`, etc.
* `Alert` is more generic and you can mix and match any number of buttons/inputs
* `Alert` and `ActionSheet` can take an array of buttons with `handlers`
* Returning `false` from button handlers prevent the overlay from closing
* `ActionSheet` buttons no longer use an index and only one handler
* `ActionSheet` cancel and destructive buttons go within the `buttons` array, but with an added `style` property
* An actionsheet's desctructive button renders in the order it was added to the array (we recommend it always goes first)
* An actionsheet's cancel button will always be last, no matter where it is in the array
* All overlays use `NavController` `present()`, similar to `push()`
* A `Modal` uses an injected `ViewController` to dismiss itself
  and optionally pass data to modal's `onDismss()`

##### Alert Refactor

Was:

```js
import {Popup} from 'ionic/ionic';

@Page(...)
class MyPage {
  constructor(popup: Popup) {
    this.popup = popup;
  }
  doAlert() {
    this.popup.alert({
      title: "New Friend!",
      template: "Obi wan Kenobi just accepted your friend request!"
    });
  }
}
```

Now:

```js
import {Alert, NavController} from 'ionic/ionic';

@Page(...)
class MyPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  doAlert() {
    let alert = Alert.create({
      title: "New Friend!",
      body: "Obi wan Kenobi just accepted your friend request!",
      buttons: ['Ok']
    });

    this.nav.present(alert);
  }
}
```

##### Confirm Refactor

Was:

```js
import {Popup} from 'ionic/ionic';

@Page(...)
class MyPage {
  constructor(popup: Popup) {
    this.popup = popup;
  }
  doConfirm() {
    this.popup.confirm({
      title: "Use this lightsaber?",
      subTitle: "You can't exchange lightsabers",
      template: "Do you agree to use this lightsaber to do good across the intergalactic galaxy?",
      cancelText: "Disagree",
      okText: "Agree"
    }).then((result, ev) => {
      console.log('Confirmed!', result);
    }, () => {
      console.error('Not confirmed!');
    });
  }
}
```

Now:

```js
import {Alert, NavController} from 'ionic/ionic';

@Page(...)
class MyPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  doConfirm() {
    let alert = Alert.create({
      title: "Use this lightsaber?",
      subTitle: "You can't exchange lightsabers",
      body: "Do you agree to use this lightsaber to do good across the intergalactic galaxy?",
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagreed :(');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agreed!');
          }
        }
      ]
    });

    this.nav.present(alert);
  }
}
```

##### Prompt Refactor

Was:

```js
import {Popup} from 'ionic/ionic';

@Page(...)
class MyPage {
  constructor(popup: Popup) {
    this.popup = popup;
  }
  doPrompt() {
    this.popup.prompt({
      title: "New Album",
      template: "Enter a name for this new album you're so keen on adding",
      inputPlaceholder: "Album Name",
      okText: "Save",
      okType: "secondary"
    }).then((name) => {
      console.log('Name entered:', name);
    }, () => {
      console.error('Prompt closed');
    });
  }
}
```

Now:

```js
import {Alert, NavController} from 'ionic/ionic';

@Page(...)
class MyPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  doConfirm() {
    let alert = Alert.create({
      title: "New Album",
      body: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'album',
          placeholder: 'Album Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Canceled!', data);
          }
        },
        {
          text: 'Ok',
          handler: data => {
            console.log('Submitted', data);
          }
        }
      ]
    });

    this.nav.present(alert);
  }
}
```

##### ActionSheet Refactor

Was:

```js
import {ActionSheet} from 'ionic/ionic';

@Page(...)
class MyPage {
  constructor(actionSheet: ActionSheet) {
    this.actionSheet = actionSheet;
  }
  doActionSheet() {
    this.actionSheet.open({
      buttons: [
        { text: 'Archive' }
      ],
      titleText: 'Modify your album',
      cancelText: 'Cancel',
      cancel: function() {
        console.log('Canceled clicked');
      },
      destructiveText: 'Delete',
      destructiveButtonClicked: () => {
        console.log('Delete clicked');
      },
      buttonClicked: function(index) {
        if (index == 0) {
          console.log('Archive clicked');
        }
        return true;
      }

    }).then(actionSheetRef => {
      this.actionSheetRef = actionSheetRef;
    });
  }
}
```

Now:

```js
import {ActionSheet, NavController} from 'ionic/ionic';

@Page(...)
class MyPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  doActionSheet(ev) {
    let actionSheet = ActionSheet.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Delete',
          style: 'destructive',
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    });

    this.nav.present(actionSheet);
  }
}
```

##### Modal Refactor

Was:

```js
import {Modal} from 'ionic/ionic';

@Page(...)
class MyApp {

 constructor(modal: Modal) {
   this.modal = modal;
 }

 openContactModal() {
   this.modal.open(EditUser, { userId: 8675309 });
 }

}
```

Now:

```js
import {Modal, NavController} from 'ionic/ionic';

@Page(...)
class MyPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  presentModal() {
    let modal = Modal.create(EditUser, { userId: 8675309 });
    this.nav.present(modal);
  }
}
```


<a name="2.0.0-alpha.42"></a>
# 2.0.0-alpha.42 (2015-12-11)


### Breaking Changes

##### CSS Refactor

* Attributes are now used by Ionic to add the correct CSS classes to elements
* Drastically reduced the depth of CSS selectors
* Further modularized Sass files to allow individual imports
* Ionic CSS comes in 3 flavors
    * `ionic.css`: Core CSS, iOS CSS, and Material Design CSS
    * `ionic.ios.css`: Core CSS and iOS CSS
    * `ionic.md.css`: Core CSS and Material Design CSS
* App's `index.html` file can be setup to dynamically load only the stylesheet it needs
* Different Sass color maps for iOS and Material Design
    * Allows colors to be different per platform
    * ie: Gray navbars in iOS, blue navbars in MD. Identical HTML/JS
* config: `tabbarStyle`, `navbarStyle` has been removed, should now use different Sass color maps instead of setting it in the config
* text-input: class `has-value` has become `input-has-value`
* text-input: class `has-focus` has become `input-focused`
* searchbar: class `left-align` has become `searchbar-left-aligned`
* searchbar: class `focused` has become `searchbar-focused`


#####  `<ion-nav-items>` renamed to `<ion-buttons>`

* `primary` attribute `<ion-nav-items primary>` now `<ion-buttons start>`
* `secondary` attribute `<ion-nav-items secondary>` now `<ion-buttons end>`

##### `<a menu-toggle>` should now be `<button menuToggle>`

* If a menu is not given an `id`, then it is automatically assigned an id, such as `leftMenu` or `rightMenu`.
* If the menu toggle/close directives are not given a value then it tries the menu ids of `leftMenu` then `rightMenu`.

#####  `<ion-switch>` renamed to `<ion-toggle>`

* Consistent naming with Ionic v1
* Reduce potential confusion with `ng-switch`


##### Bug Fixes

* **item-sliding**: fixed item-sliding, onDragEnd on mouseout of sliding element [f9199fb](https://github.com/driftyco/ionic2/commit/f9199fb3be6ce6b0a693e2e3b944b47ed8575531), closes [#702](https://github.com/driftyco/ionic2/issues/702)


##### Features

* Upgraded to Angular alpha.50
  * Life cycle hooks are now prefixed with `ng`
    * ngOnChanges
    * ngOnInit
    * ngDoCheck
    * ngAfterContentInit
    * ngAfterContentChecked
    * ngAfterViewInit
    * ngAfterViewChecked
    * ngOnDestroy

### Steps to Upgrade to alpha.42


1. Update to the latest beta CLI: `npm install -g ionic@beta`
2. Update `ionic-framework` in your `package.json` and then run `npm install` in the project directory:

   ```
   "ionic-framework": "2.0.0-alpha.42",
   ```

3. Convert dash attributes to camelCase (see [Angular Changelog](https://github.com/angular/angular/blob/master/CHANGELOG.md#200-alpha52-2015-12-10))
4. Remove the Sass imports in JS files
5. Update css reference in index.html (remove build/css/app.css if it exists)

  ```html
  <link ios-href="build/css/app.ios.css" rel="stylesheet">
  <link md-href="build/css/app.md.css" rel="stylesheet">
  ```

6. Add core stylesheets (copy from a [starter](https://github.com/driftyco/ionic2-starter-tabs) or [conference app](https://github.com/driftyco/ionic-conference-app)) and remove app.scss:

  ```
  app.core.scss
  app.ios.scss
  app.md.scss
  app.variables.scss
  ```

7. Update `app.core.scss` to reflect your Sass files
8. Add the new gulp packages and gulp file found in the [ionic2-app-base](https://github.com/driftyco/ionic2-app-base) or any of the starters
9. Add the contents from the [ionic2-app-base](https://github.com/driftyco/ionic2-app-base) ionic.config.js file
10. Run `ionic serve` to watch and compile the sass, and run the app in a browser
11. When in doubt, reference the [conference app](https://github.com/driftyco/ionic-conference-app) or any [starter](https://github.com/driftyco/ionic2-starter-tabs).
