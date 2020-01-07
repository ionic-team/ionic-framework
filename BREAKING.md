# Breaking Changes

- [5.0.0](#5.0.0)
- [4.0.0](#4.0.0)


## 5.0.0

- [CSS](#css)
  * [CSS Utility Attributes](#css-utility-attributes)
  * [Display Classes](#display-classes)
  * [Activated, Focused, Hover States](#activated--focused--hover-states)
- [Component Renames](#component-renames)
  * [Anchor](#anchor)
  * [Nav Link](#nav-link)
- [Property Removals](#property-removals)
  * [Toast](#toast)
  * [Menu](#menu)
  * [Skeleton Text](#skeleton-text)
  * [Searchbar](#searchbar)
  * [Split Pane](#split-pane)


### CSS

#### CSS Utility Attributes

We originally added CSS attributes for styling components because it was a quick and easy way to wrap text or add padding to an element. Once we added support for multiple frameworks as part of our Ionic for everyone approach, we quickly determined there were problems with using CSS attributes with frameworks that use JSX and Typescript. In order to solve this we added CSS classes. Rather than support CSS attributes in certain frameworks and classes in others, we decided to remove the CSS attributes and support what works in all of them, classes, for consistency. In the latest version of Ionic 4, there are deprecation warnings printed in the console to show what the new classes are, and the documentation has been updated since support for classes was added to remove all references to attributes: https://ionicframework.com/docs/layout/css-utilities.


#### Display Classes

The responsive display classes found in the `display.css` file have had their media queries updated to better reflect how they should work. Instead of using the maximum value of the breakpoint (for `.ion-hide-{breakpoint}-down` classes) the maximum of the media query will be the minimum of that breakpoint.


#### Activated, Focused, Hover States

The `.activated` class that gets added has been renamed to `.ion-activated` for consistency with how we add focused to elements and to avoid conflicts in user’s CSS.

<!-- TODO mention some of the changes to the hover values: https://github.com/ionic-team/ionic/pull/19440 -->


### Component Renames

#### Anchor

The `ion-anchor` component has been renamed to `ion-router-link` as this is a better description of which component it should be used with. This component should still only be used in vanilla and Stencil JavaScript projects. Angular projects should use an `<a>` and `routerLink` with the Angular router. See the [documentation for router-link](https://ionicframework.com/docs/api/router-link) for more information.

#### Nav Link

The `ion-nav-push`, `ion-nav-back`, and `ion-nav-set-root` components have been removed in favor of using `ion-nav-link` with a `router-direction` property which accepts `”root”`, `“forward”`, and `“back”`. This reduces the need for maintaining multiple components when they all do the same thing with different transition directions. See the [documentation for nav-link](https://ionicframework.com/docs/api/nav-link) for more information.


### Property Removals

#### Toast

The close button properties (`showCloseButton` and `closeButtonText`) have been removed, use the `buttons` array instead with `role: 'cancel'`. See the [usage documentation](https://ionicframework.com/docs/api/toast#usage) for more information.

```javascript
async presentToast() {
  const toast = await this.toastController.create({
    message: 'Your settings have been saved.',
    showCloseButton: true,
    closeButtonText: 'Close'
  });
  toast.present();
}
```

becomes

```javascript
async presentToast() {
  const toast = await this.toastController.create({
    message: 'Your settings have been saved.',
    buttons: [
      {
        text: 'Close',
        role: 'cancel',
        handler: () => {
          console.log('Close clicked');
        }
      }
    ]
  });
  toast.present();
}
```

#### Menu

- The `swipeEnable()` function has been removed in Angular, use `swipeGesture()` instead.
- The `side` values `left` and `right` have been removed, use `start` and `end` instead.
- Removed the `main` attribute, use `content-id` instead.

#### Skeleton Text

The `width` property has been removed in favor of using CSS styling.

#### Searchbar

The `show-cancel-button` property of the searchbar no longer accepts boolean values. Accepted values are strings: `"focus"`, `"always"`, `"never"`.

```html
<ion-searchbar show-cancel-button>
<ion-searchbar show-cancel-button="true">
<ion-searchbar show-cancel-button="false">
```

becomes

```html
<ion-searchbar show-cancel-button="focus">
<ion-searchbar show-cancel-button="focus">
<ion-searchbar show-cancel-button="never">
```

See the [Searchbar documentation](https://ionicframework.com/docs/api/searchbar#properties) for more information.

#### Split Pane
- Removed the `main` attribute, use `content-id` instead.


--------------------------------------------------------------------------------------------------

## 4.0.0

The list of the breaking changes introduced in Ionic Angular v4 can be found in [angular/BREAKING.md](https://github.com/ionic-team/ionic/blob/master/angular/BREAKING.md).
