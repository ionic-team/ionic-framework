<a name="2.0.0-alpha.51"></a>
# 2.0.0-alpha.51 (2016-1-21)

### Breaking Changes

##### Angular was updated to Beta 1

* Update the version of Angular in your `package.json` file:

  ```
  "angular2": "2.0.0-beta.1",
  ```

##### Ionicons were moved

* Install ionicons (this will be added in the starters): `npm install --save ionicons`
* Modify the sass `include` in your `ionic.config.js` file:

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


<a name="2.0.0-alpha.48"></a>
# 2.0.0-alpha.48 (2016-1-7)

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
# 2.0.0-alpha.47 (2016-1-4)

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

```
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

```
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

```
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

```
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

```
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

```
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

```
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

```
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

```
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

```
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

  ```
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
