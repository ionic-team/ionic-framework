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
