<a name="2.0.0-beta.4"></a>
# [2.0.0-beta.4](https://github.com/driftyco/ionic/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2016-04-07)

### Features

#### Virtual Scroll - [#5418](https://github.com/driftyco/ionic/issues/5418)

Virtual Scroll is useful for displaying large lists of data. For performance reasons, not every record in the list is rendered at once; instead a small subset of records (enough to fill the viewport) are rendered and reused as the user scrolls.

This feature was known as [Collection Repeat](http://ionicframework.com/docs/api/directive/collectionRepeat/) in v1 of Ionic.

For more information on Virtual Scroll, check out the [API docs](http://ionicframework.com/docs/v2/api/components/virtual-scroll/VirtualScroll/).


#### Loading Indicator - [#5426](https://github.com/driftyco/ionic/issues/5426)

An overlay that can be used to indicate activity while blocking user interaction. The loading indicator appears on top of the app's content, and can be dismissed by the app to resume user interaction with the app.

For more information on the Loading component, check out the [API docs](http://ionicframework.com/docs/v2/api/components/loading/Loading/).

* **img:** create ion-img ([7a82727](https://github.com/driftyco/ionic/commit/7a82727))
* **ion-content:** adds <ion-fixed> for non-scrollable page content ([442d135](https://github.com/driftyco/ionic/commit/442d135)), closes [#5987](https://github.com/driftyco/ionic/issues/5987)
* **loading:** add ability to hide spinner in the config or options ([dae37e7](https://github.com/driftyco/ionic/commit/dae37e7))
* **loading:** add internal stack for the loading service ([d3fa29f](https://github.com/driftyco/ionic/commit/d3fa29f))
* **loading:** add loading indicator component and styles ([a485cd0](https://github.com/driftyco/ionic/commit/a485cd0))
* **router:** allow multiple routers ([3733ebc](https://github.com/driftyco/ionic/commit/3733ebc))
* **sass:** add support for contrast color in MD mode colors map ([9efa3ea](https://github.com/driftyco/ionic/commit/9efa3ea))
* **sass:** add support for contrast in color map for wp mode ([5f2e737](https://github.com/driftyco/ionic/commit/5f2e737))
* **sass:** add the ability to pass a contrast color in the colors map to iOS ([ff1a8ac](https://github.com/driftyco/ionic/commit/ff1a8ac))
* **storage:** clear() removes all entries in the storage engine ([6e7cc97](https://github.com/driftyco/ionic/commit/6e7cc97))
* **virtualScroll:** init virtual scroll ([7679ac0](https://github.com/driftyco/ionic/commit/7679ac0)), closes [#5418](https://github.com/driftyco/ionic/issues/5418)


### Bug Fixes

* **action-sheet:** action sheet button shortens when activated in Safari ([6d55abc](https://github.com/driftyco/ionic/commit/6d55abc)), closes [#5828](https://github.com/driftyco/ionic/issues/5828)
* **alert:** disable listeners until ready ([5844703](https://github.com/driftyco/ionic/commit/5844703)), closes [#5821](https://github.com/driftyco/ionic/issues/5821)
* **alert:** prevent both click and enter keyup from firing ([2000b1e](https://github.com/driftyco/ionic/commit/2000b1e))
* **build:** output.css needs to exist prior to doc gen ([7dfbb9d](https://github.com/driftyco/ionic/commit/7dfbb9d))
* **button:** normalize generated button class names ([5f621ab](https://github.com/driftyco/ionic/commit/5f621ab))
* **card:** maintain card width when absolute positioned ([349c577](https://github.com/driftyco/ionic/commit/349c577))
* **config:** improve getBoolean() and getNumber() ([d44f8f6](https://github.com/driftyco/ionic/commit/d44f8f6))
* **generators:** add tabs Sass file ([80109b8](https://github.com/driftyco/ionic/commit/80109b8))
* **generators:** add TS tabs generator ([3ad15b1](https://github.com/driftyco/ionic/commit/3ad15b1))
* **img:** only load ion-img when visible ([0701338](https://github.com/driftyco/ionic/commit/0701338))
* **input:** add event emitters for blur and focus to the ion-input component ([3e88fe9](https://github.com/driftyco/ionic/commit/3e88fe9)), closes [#5487](https://github.com/driftyco/ionic/issues/5487)
* **input:** align item right to the bottom for windows mode ([b3bea83](https://github.com/driftyco/ionic/commit/b3bea83))
* **input:** update width of inputs so they don't exceed the item ([4d4f1d4](https://github.com/driftyco/ionic/commit/4d4f1d4)), closes [#5835](https://github.com/driftyco/ionic/issues/5835)
* **infinite-scroll:** always check on scroll change ([fe04c51](https://github.com/driftyco/ionic/commit/fe04c51))
* **infinite-scroll:** Fix error leaving page ([05823f9](https://github.com/driftyco/ionic/commit/05823f9))
* **label:** add color to label in a select ([8fff76e](https://github.com/driftyco/ionic/commit/8fff76e))
* **loading:** fix animation for loading the first time ([6cd90ee](https://github.com/driftyco/ionic/commit/6cd90ee))
* **nav:** correctly set zIndex when there's a previous view ([1dd73aa](https://github.com/driftyco/ionic/commit/1dd73aa))
* **nav:** portal nav should always animate ([86fc741](https://github.com/driftyco/ionic/commit/86fc741)), closes [#6059](https://github.com/driftyco/ionic/issues/6059)
* **nav:** fixes swipeBackEnabled as attribute ([17c3886](https://github.com/driftyco/ionic/commit/17c3886)), closes [#5653](https://github.com/driftyco/ionic/issues/5653)
* **nav:** call onDismiss after transition ends ([24443c3](https://github.com/driftyco/ionic/commit/24443c3)), closes [#5818](https://github.com/driftyco/ionic/issues/5818)
* **platform:** windows UA should not trigger iOS ([6dae784](https://github.com/driftyco/ionic/commit/6dae784))
* **router:** fix nested ion-nav router ([b063566](https://github.com/driftyco/ionic/commit/b063566))
* **router:** update path recognizer ([3df5989](https://github.com/driftyco/ionic/commit/3df5989)), closes [#5997](https://github.com/driftyco/ionic/issues/5997)
* **sass:** change map-get to use color function in default themes ([30bb005](https://github.com/driftyco/ionic/commit/30bb005))
* **scroll:** correctly resolve when scrolling finishes ([35a3357](https://github.com/driftyco/ionic/commit/35a3357))
* **searchbar:** add padding around the floating searchbar wp ([5ca6bf4](https://github.com/driftyco/ionic/commit/5ca6bf4)), closes [#5921](https://github.com/driftyco/ionic/issues/5921)
* **searchbar:** call the input changed event on input not keyup ([94707bf](https://github.com/driftyco/ionic/commit/94707bf)), closes [#5584](https://github.com/driftyco/ionic/issues/5584)
* **searchbar:** fix the border color and toolbar padding ([0e91a69](https://github.com/driftyco/ionic/commit/0e91a69))
* **select:** change windows border colors for selects to match input ([6063932](https://github.com/driftyco/ionic/commit/6063932))
* **select:** fix select styling on windows mode ([a4fc96d](https://github.com/driftyco/ionic/commit/a4fc96d)), closes [#5787](https://github.com/driftyco/ionic/issues/5787)
* **select:** make select full width when with a stacked/floating label ([4e37524](https://github.com/driftyco/ionic/commit/4e37524)), closes [#5715](https://github.com/driftyco/ionic/issues/5715)
* **toolbar:** fix back button for md mode ([7dc58ef](https://github.com/driftyco/ionic/commit/7dc58ef)), closes [#5923](https://github.com/driftyco/ionic/issues/5923)
* **toolbar:** fix wp back button in toolbar ([9a23a92](https://github.com/driftyco/ionic/commit/9a23a92))
* **toolbar:** reduce min width on back button for wp mode ([96375b6](https://github.com/driftyco/ionic/commit/96375b6)), closes [#5759](https://github.com/driftyco/ionic/issues/5759)


### Performance Improvements

* **infinite-scroll:** display none svg until needed ([085088e](https://github.com/driftyco/ionic/commit/085088e)), closes [#5776](https://github.com/driftyco/ionic/issues/5776)


### BREAKING CHANGES

#### Theming with Base / Contrast Colors - [#5445](https://github.com/driftyco/ionic/issues/5445)

You can now further customize your app by passing a `base` and `contrast` to the Sass `$colors` map.

Depending on the component, these values will be used for different things, but in general the `base` color is used as a background color, and `contrast` is used as a text color. This makes it easier than ever to change the colors of components to match your theme. For example, this is a valid `$colors` map:

```scss
$colors: (
  primary: (
    base: #327eff,
    contrast: #ffff00
  ),
  secondary: (
    base: #32db64,
    contrast: #ff69b4
  ),
  danger: #d91e18,
  light: #f4f4f4,
  dark: #222
);
```

###### Important

If you are using the function `color` anywhere in your app to get a color from the map, it has changed to require the `$colors` map as the first argument. Therefore, this:

```scss
color: color(primary);
```

has become this:

```scss
color: color($colors, primary);
```

If you'd like to grab the `contrast` color you can use:

```scss
color: color($colors, primary, contrast);
```

###### Note

If you include a `base` you must include a `contrast` and vice-versa. If you don't provide a `base` and `contrast`, such as `light: #f4f4f4` above, we use the given color as the base, and a custom function to determine the contrast color.


#### Angular Update to Beta 13 - [#6026](https://github.com/driftyco/ionic/issues/6026)

Angular has been updated to 2.0.0-beta.13. Issue [#5060](https://github.com/driftyco/ionic/issues/5060) has been fixed and content projection is now working as expected. As a result of this update, many of the dependencies will need to be updated in your `package.json`:

```json
"dependencies": {
  "angular2": "2.0.0-beta.13",
  "es6-promise": "3.0.2",
  "es6-shim": "^0.35.0",
  "ionic-angular": "2.0.0-beta.4",
  "ionic-native": "^1.1.0",
  "ionicons": "3.0.0-alpha.3",
  "reflect-metadata": "0.1.2",
  "rxjs": "5.0.0-beta.2",
  "zone.js": "0.6.6"
}
```

#### Webpack Users

Update your `webpack.config.js` from:

```js
entry: [
  path.normalize('es6-shim/es6-shim.min'),
  'reflect-metadata',
  path.normalize('zone.js/dist/zone-microtask'),
  path.resolve('app/app')
],
```

to:

```js
entry: [
  path.normalize('es6-shim/es6-shim.min'),
  'reflect-metadata',
  path.normalize('zone.js/dist/zone'),
  path.resolve('app/app')
],
```


<a name="2.0.0-beta.3"></a>
# [2.0.0-beta.3](https://github.com/driftyco/ionic/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2016-03-07)


### Bug Fixes

* **actionsheet:** fix md ripple on actionsheet ([f51a3f5](https://github.com/driftyco/ionic/commit/f51a3f5))
* **alert:** increase padding on windows alert ([c96af06](https://github.com/driftyco/ionic/commit/c96af06)), closes [#5722](https://github.com/driftyco/ionic/issues/5722)
* **alert:** update radio/checkbox items to buttons elements ([b24dc27](https://github.com/driftyco/ionic/commit/b24dc27))
* **animations:** get easing curve from parent animation ([bc06994](https://github.com/driftyco/ionic/commit/bc06994))
* **chip:** cleaned up some of the UI and added some sass variables ([eeac795](https://github.com/driftyco/ionic/commit/eeac795))
* **config:** fix config set function so that it has arguments defined ([894824e](https://github.com/driftyco/ionic/commit/894824e)), closes [#5696](https://github.com/driftyco/ionic/issues/5696)
* **infinitescroll:** only show spinner when loading ([7ee0b52](https://github.com/driftyco/ionic/commit/7ee0b52)), closes [#5690](https://github.com/driftyco/ionic/issues/5690)
* **input:** add tappable attr to input-cover ([b814314](https://github.com/driftyco/ionic/commit/b814314))
* **item:** add a default size for items in buttons to use the content button sizes ([7b14a29](https://github.com/driftyco/ionic/commit/7b14a29)), closes [#5580](https://github.com/driftyco/ionic/issues/5580)
* **label:** change the flex for stacked and floating labels so buttons can be added ([65ee86f](https://github.com/driftyco/ionic/commit/65ee86f)), closes [#5319](https://github.com/driftyco/ionic/issues/5319)
* **label:** remove margin from item-right in a stacked or floating label ([7416827](https://github.com/driftyco/ionic/commit/7416827))
* **nav:** change init zIndex to 100 ([5863e2c](https://github.com/driftyco/ionic/commit/5863e2c))
* **nav:** create opts object when undefined/null ([8975016](https://github.com/driftyco/ionic/commit/8975016)), closes [#5737](https://github.com/driftyco/ionic/issues/5737)
* **nav:** do not hide pages if an overlay is in the stack ([4922fc6](https://github.com/driftyco/ionic/commit/4922fc6)), closes [#5430](https://github.com/driftyco/ionic/issues/5430)
* **nav:** reset zIndex when goes under 0 ([ad50a11](https://github.com/driftyco/ionic/commit/ad50a11)), closes [#5718](https://github.com/driftyco/ionic/issues/5718)
* **nav:** use setRoot when root property changes ([d77e8d9](https://github.com/driftyco/ionic/commit/d77e8d9)), closes [#5668](https://github.com/driftyco/ionic/issues/5668)
* **overlays:** update keyboard focus management ([e639457](https://github.com/driftyco/ionic/commit/e639457))
* **radio:** do not use strict comparison for values ([a2f858b](https://github.com/driftyco/ionic/commit/a2f858b)), closes [#5660](https://github.com/driftyco/ionic/issues/5660)
* **radio:** improve group/button value comparisons ([5d9b169](https://github.com/driftyco/ionic/commit/5d9b169))
* **radio:** select only one radio when w/out ngModel ([e92feef](https://github.com/driftyco/ionic/commit/e92feef)), closes [#5659](https://github.com/driftyco/ionic/issues/5659)
* **select:** do not open on form submit ([b219de5](https://github.com/driftyco/ionic/commit/b219de5)), closes [#5596](https://github.com/driftyco/ionic/issues/5596)
* **select:** improve value comparisons ([b967b1e](https://github.com/driftyco/ionic/commit/b967b1e))
* **tabs:** don't add the has-icon class to a tab button if the layout is icon-hide ([6b93bc1](https://github.com/driftyco/ionic/commit/6b93bc1)), closes [#5658](https://github.com/driftyco/ionic/issues/5658)
* **tabs:** improves tabs style for iOS ([b9a4628](https://github.com/driftyco/ionic/commit/b9a4628))
* **textarea:** width of textarea was exceeding page area ([ec11ae3](https://github.com/driftyco/ionic/commit/ec11ae3))
* **touchaction:** apply to child touch elements ([0129410](https://github.com/driftyco/ionic/commit/0129410))
* **util:** array length check ([9dc3840](https://github.com/driftyco/ionic/commit/9dc3840))
* **util:** getQueryString tests ([f8e38ef](https://github.com/driftyco/ionic/commit/f8e38ef))
* **util:** ignore empty query param in getQueryString ([908ea8c](https://github.com/driftyco/ionic/commit/908ea8c))
* **windows:** detect windows phone via user agent ([703fe16](https://github.com/driftyco/ionic/commit/703fe16))

### Features

* **buttons:** dynamically add button attributes ([154a69c](https://github.com/driftyco/ionic/commit/154a69c)), closes [#5186](https://github.com/driftyco/ionic/issues/5186)
* **searchbar:** debounce input events ([f6af807](https://github.com/driftyco/ionic/commit/f6af807)), closes [#5429](https://github.com/driftyco/ionic/issues/5429)
* **searchbar:** disable autocorrect/autocapitalize/spellcheck ([498dd54](https://github.com/driftyco/ionic/commit/498dd54)), closes [#5749](https://github.com/driftyco/ionic/issues/5749)
* **touchaction:** remove 300ms delay via touch-action ([e1c77a3](https://github.com/driftyco/ionic/commit/e1c77a3))
* **windows:** add card components ([dd7def6](https://github.com/driftyco/ionic/commit/dd7def6))
* **windows:** add checkbox styling and update alert checkbox ([1ecfa6f](https://github.com/driftyco/ionic/commit/1ecfa6f))
* **windows:** add chip component ([2699b44](https://github.com/driftyco/ionic/commit/2699b44))
* **windows:** add content padding/margin components for wp ([fe11ecc](https://github.com/driftyco/ionic/commit/fe11ecc))
* **windows:** add detail-push icon ([706e0d7](https://github.com/driftyco/ionic/commit/706e0d7))
* **windows:** add input border color variable to theme ([0d4971f](https://github.com/driftyco/ionic/commit/0d4971f))
* **windows:** add input component sass ([f8ef960](https://github.com/driftyco/ionic/commit/f8ef960))
* **windows:** add label Sass file ([8a1e450](https://github.com/driftyco/ionic/commit/8a1e450))
* **windows:** add list and item components ([1cf56ee](https://github.com/driftyco/ionic/commit/1cf56ee))
* **windows:** add menu Sass component ([cd7d627](https://github.com/driftyco/ionic/commit/cd7d627))
* **windows:** add modal file ([a323aa1](https://github.com/driftyco/ionic/commit/a323aa1))
* **windows:** add noto sans as a fallback font ([85c1637](https://github.com/driftyco/ionic/commit/85c1637))
* **windows:** add radio component for wp mode ([dd206ad](https://github.com/driftyco/ionic/commit/dd206ad))
* **windows:** add searchbar component with styling ([a9054ad](https://github.com/driftyco/ionic/commit/a9054ad))
* **windows:** add segment component ([922e1f1](https://github.com/driftyco/ionic/commit/922e1f1))
* **windows:** add select component ([781ea83](https://github.com/driftyco/ionic/commit/781ea83))
* **windows:** add tabs component and clean up windows UI ([fa2e4b2](https://github.com/driftyco/ionic/commit/fa2e4b2))
* **windows:** add toggles ([b7bcd39](https://github.com/driftyco/ionic/commit/b7bcd39))
* **windows:** add windows support to snapshot ([368c12a](https://github.com/driftyco/ionic/commit/368c12a))
* **windows:** change windowsphone platform to windows ([8df8420](https://github.com/driftyco/ionic/commit/8df8420))
* **windows:** clean up action sheet UI ([138e876](https://github.com/driftyco/ionic/commit/138e876))
* **windows:** clean up button and alert UI ([13f3e83](https://github.com/driftyco/ionic/commit/13f3e83))
* **windows:** clean up button css, rename Sass variables and add more ([bba3c5c](https://github.com/driftyco/ionic/commit/bba3c5c))
* **windows:** fix card and alert UI ([69c0da2](https://github.com/driftyco/ionic/commit/69c0da2))
* **windows:** fix config so it will disable hover ([996f944](https://github.com/driftyco/ionic/commit/996f944))
* **windows:** initial add for windows badges ([1fc0a23](https://github.com/driftyco/ionic/commit/1fc0a23))
* **windows:** initial add of action sheet ([370490e](https://github.com/driftyco/ionic/commit/370490e))
* **windows:** initial add of alert with windows dialog styles ([6af9b77](https://github.com/driftyco/ionic/commit/6af9b77))
* **windows:** initial add of toolbar with some custom theming ([6062bb6](https://github.com/driftyco/ionic/commit/6062bb6))
* **windows:** initial add of windows mode ([a9c995d](https://github.com/driftyco/ionic/commit/a9c995d))
* **windows:** make wp buttons more windows-y ([b91f8de](https://github.com/driftyco/ionic/commit/b91f8de))
* **windows:** more UI cleanup ([a594531](https://github.com/driftyco/ionic/commit/a594531))
* **windows:** UI fixes ([29ff7f1](https://github.com/driftyco/ionic/commit/29ff7f1))
* **windows:** windows UI cleanup ([e05f147](https://github.com/driftyco/ionic/commit/e05f147))
* **windows:** fix incorrect sass value, add max width to alert ([3d12e69](https://github.com/driftyco/ionic/commit/3d12e69)), references [#5565](https://github.com/driftyco/ionic/issues/5565)

### Refactor

* **sass:** add Sass variables for action sheet and rename some ([50b7d70](https://github.com/driftyco/ionic/commit/50b7d70)), references [#5651](https://github.com/driftyco/ionic/issues/5651)
* **sass:** add Sass variables for alert, remove unused selectors ([374efde](https://github.com/driftyco/ionic/commit/374efde)), references [#5651](https://github.com/driftyco/ionic/issues/5651)
* **sass:** replace all instances of `bg` in sass variables with `background` ([8db6a85](https://github.com/driftyco/ionic/commit/8db6a85)), references [#5651](https://github.com/driftyco/ionic/issues/5651)
* **sass:** update windows action sheet sass to use variables ([a51268cd](https://github.com/driftyco/ionic/commit/a51268cd)), references [#5651](https://github.com/driftyco/ionic/issues/5651)
* **sass:** update windows alert sass to use variables ([1e73a34](https://github.com/driftyco/ionic/commit/1e73a34)), references [#5651](https://github.com/driftyco/ionic/issues/5651)

### Breaking Changes

#### Windows Mode

Windows platform support has been added to Ionic! The Windows mode is abbreviated as `wp`. Please go through the following steps to get your app working with the Windows mode:

1. Add this line to your project's `www/index.html` file:

  ```
  <link wp-href="build/css/app.wp.css" rel="stylesheet">
  ```

2. Add a new file named `app.wp.scss` to your project's `app/theme/` folder and then add the following code to it:

  ```
  // http://ionicframework.com/docs/v2/theming/


  // App Shared Variables
  // --------------------------------------------------
  // Shared Sass variables go in the app.variables.scss file
  @import 'app.variables';


  // App Windows Variables
  // --------------------------------------------------
  // Windows only Sass variables can go here


  // Ionic Windows Sass
  // --------------------------------------------------
  // Custom App variables must be declared before importing Ionic.
  // Ionic will use its default values when a custom variable isn't provided.
  @import "ionic.wp";


  // App Shared Sass
  // --------------------------------------------------
  // All Sass files that make up this app goes into the app.core.scss file.
  // For simpler CSS overrides, custom app CSS must come after Ionic's CSS.
  @import 'app.core';


  // App Windows Only Sass
  // --------------------------------------------------
  // CSS that should only apply to the Windows app
  ```

3. Modify the `ionic.config.js` file to add the `wp` mode on line 9:

  ```
  sass: {
    src: ['app/theme/app.+(ios|md|wp).scss'],
    dest: 'www/build/css',
    include: [
      'node_modules/ionic-angular',
      'node_modules/ionicons/dist/scss'
    ]
  },
  ```

<a name="2.0.0-beta.2"></a>
# [2.0.0-beta.2](https://github.com/driftyco/ionic/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2016-03-01)


### Bug Fixes

* **alert:** add max height to alert body so it will overflow ([9c0eebd](https://github.com/driftyco/ionic/commit/9c0eebd)), closes [#5316](https://github.com/driftyco/ionic/issues/5316)
* **animation:** ensure final inline styles applied when fallback runs ([4524e5a](https://github.com/driftyco/ionic/commit/4524e5a)), closes [#5484](https://github.com/driftyco/ionic/issues/5484)
* **generate:** output correct Sass import for pages ([3784f47](https://github.com/driftyco/ionic/commit/3784f47)), closes [#5641](https://github.com/driftyco/ionic/issues/5641)
* **menu:** fix enabled check ([8564d79](https://github.com/driftyco/ionic/commit/8564d79))
* **nav:** immediately stop if view removed before trans finished ([4fabade](https://github.com/driftyco/ionic/commit/4fabade))
* **overlay:** do not dom cache views before overlays ([4cae151](https://github.com/driftyco/ionic/commit/4cae151)), closes [#5483](https://github.com/driftyco/ionic/issues/5483)
* **refresher:** get scrollTop from the scroll element to prevent refreshing when dragging up ([ea884de](https://github.com/driftyco/ionic/commit/ea884de)), closes [#5207](https://github.com/driftyco/ionic/issues/5207)
* **sass:** rename brightness/inverse sass functions ([892b007](https://github.com/driftyco/ionic/commit/892b007)), closes [#5542](https://github.com/driftyco/ionic/issues/5542)
* **tabs:** pop tab page to parent nav ([b9eec24](https://github.com/driftyco/ionic/commit/b9eec24)), closes [#5196](https://github.com/driftyco/ionic/issues/5196)
* **toolbar:** add a min-width to the toolbar content so that it won't overlap buttons ([5fb1e08](https://github.com/driftyco/ionic/commit/5fb1e08)), closes [#5657](https://github.com/driftyco/ionic/issues/5657)

### Features

* **checkbox:** add change event ([2596731](https://github.com/driftyco/ionic/commit/2596731))
* **infiniteScroll:** add infinite scroll ([0480fa3](https://github.com/driftyco/ionic/commit/0480fa3)), closes [#5415](https://github.com/driftyco/ionic/issues/5415)
* **input:** default autocomplete/autocorrect=off, fix autofocus ([b53d707](https://github.com/driftyco/ionic/commit/b53d707))
* **menu:** grab the menu by side only if it is enabled ([a2b7a21](https://github.com/driftyco/ionic/commit/a2b7a21))
* **NavController:** prevent other lifecycle events from firing ([6b9e59d](https://github.com/driftyco/ionic/commit/6b9e59d)), closes [#5516](https://github.com/driftyco/ionic/issues/5516)
* **prodMode:** set isProd() when prodMode set in @App config ([3c8daa0](https://github.com/driftyco/ionic/commit/3c8daa0))
* **spinner:** SVG spinners ([6c73446](https://github.com/driftyco/ionic/commit/6c73446))
* **toggle:** add change event ([730cccd](https://github.com/driftyco/ionic/commit/730cccd))

### Refactor

* **alert:** remove tabbarIcons and add tabbarLayout which accepts different values ([8cfebe1](https://github.com/driftyco/ionic/commit/8cfebe1)), closes [#5625](https://github.com/driftyco/ionic/issues/5625)
* **menu:** improve menu get lookup ([004e635](https://github.com/driftyco/ionic/commit/004e635)), closes [#5535](https://github.com/driftyco/ionic/issues/5535)
* **tabs:** remove duplicated styles from imports ([d5ebf3f](https://github.com/driftyco/ionic/commit/d5ebf3f)), closes [#5624](https://github.com/driftyco/ionic/issues/5624)
* **searchbar:** add class to searchbar when hideCancel is passed ([a0f0004](https://github.com/driftyco/ionic/commit/a0f0004))

### Breaking Changes

#### New npm module

The npm module has been renamed from `ionic-framework` to `ionic-angular`.

Update package.json to reflect this:

```
"ionic-angular": "2.0.0-beta.2",
```

imports from the framework were:

```js
  import {Platform} from 'ionic-framework/ionic';
```

and are now:

```js
  import {Platform} from 'ionic-angular';
```

#### Infinite Scroll

Infinite Scroll has been added: [docs](http://ionicframework.com/docs/v2/api/components/infinite-scroll/InfiniteScroll/)

#### Refresher:

- `<ion-refresher>` now takes a child `<ion-refresher-content>`
component.
- Custom refresh content components can now be replaced for Ionic's
default refresher content.
- Properties `pullingIcon`, `pullingText` and `refreshingText` have
been moved to the `<ion-refresher-content>` component.
- `spinner` property has been renamed to `refreshingSpinner` and now
goes on the `<ion-refresher-content>` component.
- `refreshingIcon` property is no longer an input, but instead
`refreshingSpinner` should be used.

Was:

```
<ion-refresher (refresh)="doRefresh($event)"
pullingIcon="arrow-dropdown">
</ion-refresher>
```

Now:

```
<ion-refresher (refresh)="doRefresh($event)">
  <ion-refresher-content
pullingIcon="arrow-dropdown"></ion-refresher-content>
</ion-refresher>
```

#### Tabs

Input property `tabbarIcons` has been replaced by `tabbarLayout` and accepts the following values: `icon-top`, `icon-left`, `icon-right`, `icon-bottom`, `icon-hide`, `title-hide`.


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

* **card:** create ion-card-title element and remove card-title ([7aabd0f](https://github.com/driftyco/ionic/commit/7aabd0f)), closes [#5303](https://github.com/driftyco/ionic/issues/5303)
* **segment:** increase icon size inside of segment buttons ([7249cb3](https://github.com/driftyco/ionic/commit/7249cb3)), closes [#5330](https://github.com/driftyco/ionic/issues/5330)
* **pull-to-refresh:** emit start event and change all events to emit refresher ([acf1894](https://github.com/driftyco/ionic/commit/acf1894)), references [#5207](https://github.com/driftyco/ionic/issues/5207)
* **slides:** remove the attributes from the slider and use options instead ([d21ae88](https://github.com/driftyco/ionic/commit/d21ae88)), closes [#5189](https://github.com/driftyco/ionic/issues/5189)

### Breaking Changes

* **card:** `.card-title` class does not exist anymore, use the `ion-card-title` element instead.
* **pull-to-refresh:** `(starting)` event has been renamed to `(start)`.
* **slides:** many attributes have been removed, must use `options` to pass configuration the slider. See the [Swiper Parameters API](http://www.idangero.us/swiper/api).
* **angular 2.0.0-beta.6**: if you are using typescript, update the following:
https://github.com/driftyco/ionic-conference-app/commit/26f3393fe4be78468e1c51e0bbf5d05a2666cd20

<a name="2.0.0-beta.0"></a>
# [2.0.0-beta.0](https://github.com/driftyco/ionic/compare/v2.0.0-alpha.56...v2.0.0-beta.0) (2016-02-10)

Enjoy!

<3 The Ionic Team

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
