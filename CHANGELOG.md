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

  ```
  npm install -g ionic
  ```

  **Important:** if you have installed the `beta` cli you should run `npm uninstall -g ionic` first. You need version `2.1.0` for this release. Check your `cli` version by running `ionic -v` in the command line.

3. Create a new Ionic 2 RC0 app:

  ```
  ionic start --v2 myApp
  ```

4. Copy/paste all of your pages from `app/pages/` of your `beta.11` app to `src/pages/`, providers from `app/providers` to `src/providers`, pipes from `app/pipes` to `src/pipes` and any custom components to `src/components` in the new RC0 app.

5. Modify all `templateUrl`'s to be relative to the `.ts` file. For example in `app.component.ts` the url should change from `build/app.html` to `app.html` and in a page referencing `about.html` from `build/pages/about/about.html` to `about.html`.

6. Import and add each of your pages to the `declarations` array and the `entryComponents` array in `src/app/app.module.ts`.

7. Import and add each of your custom components and pipes to the `declarations` array in `src/app/app.module.ts`.

8. Import and add each of your providers to the `providers` array in `src/app/app.module.ts`.

9. Remove any use of the `providers`, `pipes` and `directives` entries in `@Component`, and their corresponding `import` statements, from your pages.

10. Change any uses of the `private` TypeScript keyword to `public`.

11. Change `<button>` to `<button ion-button>` according to [these instructions](#new-behavior-of-button).

12. Pass colors to the `color` attribute : `<button primary>` changes to `<button color="primary">`. See [component colors](#component-colors) above.

13. Move any Ionic config to the `IonicModule.forRoot` in `app.module.ts`. For example, the config should go where it says `configObject` here: `IonicModule.forRoot(MyApp, {configObject})`.

14. Move any variables from the mode specific sass files in your `beta.11` app into the `app.variables` file under the mode heading in the new RC0 app.


#### Modifying your Existing Project

1. Ensure that you're using npm version 3.x by running:

  ```
  npm --version
  ```

  If you are not running 3.x, the easiest way to update is to install the [latest version of Node.js](https://nodejs.org/en/).

  You can also update `npm` by following [these instructions](https://docs.npmjs.com/getting-started/installing-node#updating-npm).

2. Install the latest Ionic CLI:

  ```
  npm install -g ionic
  ```

  **Important:** if you have installed the `beta` cli you should run `npm uninstall -g ionic` first. You need version `2.1.0` for this release. Check your `cli` version by running `ionic -v` in the command line.

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

28. Modify `theme/` folder to delete the `app.core.scss` file and copy `app.variables.scss` from the [ionic2-app-base](https://github.com/driftyco/ionic2-app-base/blob/master/src/theme/variables.scss), then rename it to `variables.scss`.

29. Move any variables from the mode specific files into the `app.variables` file under the mode heading.

30. Fix any paths to images in your app. For example, before the path may look like `<img src="img/myImg.png">` and now it should be `<img src="assets/img/myImg.png">`.

31. Change any uses of the `private` TypeScript keyword to `public`.

32. Change any Ionic buttons from `<button>` to `<button ion-button>`. [See New Behavior of Button](#new-behavior-of-button).

33. Pass colors to the `color` attribute: `<button primary>` changes to `<button color="primary">`.

34. Add appropriate icon attributes, if the icon is on the left of the text in a button it should get `icon-left`, if the icon is on the right add `icon-right`, and if the button only has an icon in it, add the `icon-only` attribute to the button. [See New Behavior of Icons in Buttons](#new-behavior-of-icons-in-buttons).

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


<a name="2.0.0-beta.6"></a>
# [2.0.0-beta.6](https://github.com/driftyco/ionic/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2016-04-21)


### Bug Fixes

* **nav:** tabs should not dereg child navs ([f3ddb0b](https://github.com/driftyco/ionic/commit/f3ddb0b)), closes [#6267](https://github.com/driftyco/ionic/issues/6267)
* **sass:** fix sass errors ([219059c](https://github.com/driftyco/ionic/commit/219059c))
* **toast:** create unique toast id ([e07f0ae](https://github.com/driftyco/ionic/commit/e07f0ae))
* **toast:** remove default duration, allow close button click when bd disabled ([d6589e1](https://github.com/driftyco/ionic/commit/d6589e1))
* **toast:** remove unused options ([f9ea2d8](https://github.com/driftyco/ionic/commit/f9ea2d8))

### Features

* **toast:** add toast component ([3fb79cf](https://github.com/driftyco/ionic/commit/3fb79cf))
* **toast:** display the toast even on page change unless `dismissOnPageChange` is passed ([0264532](https://github.com/driftyco/ionic/commit/0264532)), closes [#5582](https://github.com/driftyco/ionic/issues/5582)



<a name="2.0.0-beta.5"></a>
# [2.0.0-beta.5](https://github.com/driftyco/ionic/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2016-04-20)


### Bug Fixes

* **alert:** remove justify content from buttons in an alert ([9412a7c](https://github.com/driftyco/ionic/commit/9412a7c))
* **app:** add iOS status bar padding to each mode ([5a1c441](https://github.com/driftyco/ionic/commit/5a1c441)), closes [#5924](https://github.com/driftyco/ionic/issues/5924)
* **button:** add a category to buttons so they won't get the button styles ([35dd0ed](https://github.com/driftyco/ionic/commit/35dd0ed)), closes [#6237](https://github.com/driftyco/ionic/issues/6237)
* **button:** buttons don't get activated when ion-label contains exotic elements ([0521ce2](https://github.com/driftyco/ionic/commit/0521ce2))
* **button:** remove classes from buttons with categories ([5f8edc2](https://github.com/driftyco/ionic/commit/5f8edc2))
* **checkbox:** add `type="button"` to button tag ([7583ebf](https://github.com/driftyco/ionic/commit/7583ebf))
* **content:** fix padding/margin attributes so all work on scroll-content ([9020d52](https://github.com/driftyco/ionic/commit/9020d52))
* **cordova:** add status bar padding for content for all modes ([f45ddf9](https://github.com/driftyco/ionic/commit/f45ddf9)), closes [#5934](https://github.com/driftyco/ionic/issues/5934)
* **cordova:** only target navbar section when it has the statusbar-padding ([422c983](https://github.com/driftyco/ionic/commit/422c983))
* **focus:** improve input focus control ([e27452b](https://github.com/driftyco/ionic/commit/e27452b)), closes [#5536](https://github.com/driftyco/ionic/issues/5536)
* **input:** add 'type="button"' to button tag ([f17f517](https://github.com/driftyco/ionic/commit/f17f517))
* **input:** blur when tapping outside input on iOS ([f9b46c2](https://github.com/driftyco/ionic/commit/f9b46c2)), closes [#5020](https://github.com/driftyco/ionic/issues/5020)
* **input:** move nested function outside of if statment so as to fix issue related to strict ([c8e58e5](https://github.com/driftyco/ionic/commit/c8e58e5))
* **keyboard:** remove content padding after input blur ([e21c4d5](https://github.com/driftyco/ionic/commit/e21c4d5)), closes [#5800](https://github.com/driftyco/ionic/issues/5800)
* **label:** remove flex-basis to fix floating/stacked labels on iOS/Safari ([cd62a4c](https://github.com/driftyco/ionic/commit/cd62a4c)), closes [#6109](https://github.com/driftyco/ionic/issues/6109)
* **loading:** present loading from root nav controller ([f972908](https://github.com/driftyco/ionic/commit/f972908)), closes [#6121](https://github.com/driftyco/ionic/issues/6121)
* **platform:** fire cordova platform.ready using zone ([ba5624b](https://github.com/driftyco/ionic/commit/ba5624b)), closes [#6186](https://github.com/driftyco/ionic/issues/6186)
* **platform:** run zone after cordova deviceready ([e082bd1](https://github.com/driftyco/ionic/commit/e082bd1)), closes [#6087](https://github.com/driftyco/ionic/issues/6087)
* **sass:** move the `@at-root` font import to the components file ([8f08de1](https://github.com/driftyco/ionic/commit/8f08de1)), closes [#5931](https://github.com/driftyco/ionic/issues/5931)
* **searchbar:** only show clear icon when focused on the searchbar ([ecf9302](https://github.com/driftyco/ionic/commit/ecf9302)), closes [#5922](https://github.com/driftyco/ionic/issues/5922)
* **showHideWhen:** remove hidden attribute on directives and use classes ([5692abe](https://github.com/driftyco/ionic/commit/5692abe)), closes [#5836](https://github.com/driftyco/ionic/issues/5836)
* **slides:** add id to the slide component to grab the correct pagination ([7263728](https://github.com/driftyco/ionic/commit/7263728)), closes [#5745](https://github.com/driftyco/ionic/issues/5745) [#5508](https://github.com/driftyco/ionic/issues/5508)
* **tabs:** do not init w/ tab that is hidden or disabled ([8d8cc4c](https://github.com/driftyco/ionic/commit/8d8cc4c)), closes [#6226](https://github.com/driftyco/ionic/issues/6226)
* **tabs:** remove tabbarIcons and fix windows styling to use tabbarLayout ([81dd1cc](https://github.com/driftyco/ionic/commit/81dd1cc)), closes [#6126](https://github.com/driftyco/ionic/issues/6126)
* **toolbar:** add border-top when toolbar is positioned to the bottom ([29e6242](https://github.com/driftyco/ionic/commit/29e6242)), closes [#5967](https://github.com/driftyco/ionic/issues/5967)
* **virtualScroll:** load async data ([16a283e](https://github.com/driftyco/ionic/commit/16a283e)), closes [#6124](https://github.com/driftyco/ionic/issues/6124)

### Features

* **app:** getActiveNav() method ([7777237](https://github.com/driftyco/ionic/commit/7777237))
* **backbutton:** add hardware back button ([68278b0](https://github.com/driftyco/ionic/commit/68278b0)), closes [#5071](https://github.com/driftyco/ionic/issues/5071)
* **changeDetection:** detach Tabs when not active ([0c4171e](https://github.com/driftyco/ionic/commit/0c4171e))
* **changeDetection:** detach ViewControllers when not active ([b282e90](https://github.com/driftyco/ionic/commit/b282e90))
* **config:** create a method to access the global app injector which contains references the  ([17a9e6d](https://github.com/driftyco/ionic/commit/17a9e6d)), closes [#5973](https://github.com/driftyco/ionic/issues/5973)
* **content:** add scrollToBottom ([bef4a67](https://github.com/driftyco/ionic/commit/bef4a67))
* **directives:** auto provide IONIC_DIRECTIVES to all components ([0a83f2f](https://github.com/driftyco/ionic/commit/0a83f2f)), closes [#6092](https://github.com/driftyco/ionic/issues/6092)
* **platform:** add backbutton event ([156fdc3](https://github.com/driftyco/ionic/commit/156fdc3))
* **platform:** default desktop to use material design ([51032d2](https://github.com/driftyco/ionic/commit/51032d2)), closes [#6003](https://github.com/driftyco/ionic/issues/6003)
* **select:** fallback to alert interface when more than 6 opts ([1c67b02](https://github.com/driftyco/ionic/commit/1c67b02))
* **select:** using action-sheet as ion-select interface ([81096f1](https://github.com/driftyco/ionic/commit/81096f1))
* **slides:** add ability to slide to specific index ([a6091bd](https://github.com/driftyco/ionic/commit/a6091bd))
* **slides:** add method to get previous index ([a54361c](https://github.com/driftyco/ionic/commit/a54361c))
* **statusbarPadding:** add statusbar-padding css to content ([98c2aab](https://github.com/driftyco/ionic/commit/98c2aab))
* **statusbarPadding:** add statusbar-padding css to toolbars ([44403d1](https://github.com/driftyco/ionic/commit/44403d1))
* **tabs:** enabled and show inputs ([1b085e3](https://github.com/driftyco/ionic/commit/1b085e3)), closes [#5768](https://github.com/driftyco/ionic/issues/5768)
* **toggle:** add animation for windows mode toggle ([f841bef](https://github.com/driftyco/ionic/commit/f841bef)), closes [#5981](https://github.com/driftyco/ionic/issues/5981)

### Performance Improvements

* **img:** do not reuse img elements ([b744275](https://github.com/driftyco/ionic/commit/b744275)), closes [#6112](https://github.com/driftyco/ionic/issues/6112)


### BREAKING CHANGES

* **tabs:** `tabbarIcons` is officially removed, please use `tabbarLayout` instead. View the [Tabs API docs](http://ionicframework.com/docs/v2/api/components/tabs/Tabs/) for more information.
* **slides:** The Slides component has been refactored. Many methods and events were
    renamed.

  The following events have been renamed:

  - `slideChangeStart` has been renamed `willChange`
  - `change` has been renamed `didChange`

  The following methods have been renamed:

  - `next()` has been renamed to `slideNext()`
  - `prev()` has been renamed to `slidePrev()`
  - `getIndex()` has been renamed to `getActiveIndex()`
  - `getNumSlides()` has been renamed to `length()`
  - `isAtEnd()` has been renamed to `isEnd()`
  - `isAtBeginning()` has been renamed to `isBeginning()`
  - `getSliderWidget()` has been renamed to `getSlider()`

  All methods have been documented in the API docs:
  http://ionicframework.com/docs/v2/api/components/slides/Slides/

* **platform:** `platform.versions()` no longer accepts an optional parameter for platform name
and now returns only an object containing all of the platforms and their versions.

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

In order to use the Ionic Sass functions in your app's theming files, you need to import `globals.core` at the beginning of your `app.variables.scss` file. It should look like this:

```scss
// http://ionicframework.com/docs/v2/theming/

// Ionic Shared Functions
// --------------------------------------------------
// Makes Ionic Sass functions available to your App

@import 'globals.core';
```

If you are using the `map-get` function in your app, you should replace it with the `color` function. The `color` function takes the `$colors` map as the first argument, and the color you want to get as the second. You can optionally pass `base` or `contrast` as the third argument. If there is no third argument it will return the `base` color.

If you are already using the function `color` in your app, you need to update it so this:

```scss
color: color(primary);
```

becomes this:

```scss
color: color($colors, primary);
```

If you'd like to grab the `contrast` color you can use:

```scss
color: color($colors, primary, contrast);
```

See the conference app's [theme directory](https://github.com/driftyco/ionic-conference-app/tree/master/app/theme) for example usage.

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

* **menu:** improve menu get lookup ([004e635](https://github.com/driftyco/ionic/commit/004e635)), closes [#5535](https://github.com/driftyco/ionic/issues/5535)
* **tabs:** remove duplicated styles from imports ([d5ebf3f](https://github.com/driftyco/ionic/commit/d5ebf3f)), closes [#5624](https://github.com/driftyco/ionic/issues/5624)
* **tabs:** remove tabbarIcons and add tabbarLayout which accepts different values ([8cfebe1](https://github.com/driftyco/ionic/commit/8cfebe1)), closes [#5625](https://github.com/driftyco/ionic/issues/5625)
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
