# Breaking Changes

- [5.0.0](#5.0.0)
- [4.0.0](#4.0.0)


## 5.0.0

- [CSS](#css)
  * [CSS Utility Attributes](#css-utility-attributes)
  * [Display Classes](#display-classes)
  * [Activated, Focused, Hover States](#activated--focused--hover-states)
- [Components](#components)
  * [Anchor](#anchor)
  * [Menu](#menu)
  * [Nav Link](#nav-link)
  * [Searchbar](#searchbar)
  * [Segment](#segment)
  * [Skeleton Text](#skeleton-text)
  * [Split Pane](#split-pane)
  * [Toast](#toast)
- [Colors](#colors)
- [Ionicons](#ionicons)


### CSS

#### CSS Utility Attributes

We originally added CSS attributes for styling components because it was a quick and easy way to wrap text or add padding to an element. Once we added support for multiple frameworks as part of our Ionic for everyone approach, we quickly determined there were problems with using CSS attributes with frameworks that use JSX and Typescript. In order to solve this we added CSS classes. Rather than support CSS attributes in certain frameworks and classes in others, we decided to remove the CSS attributes and support what works in all of them, classes, for consistency. In the latest version of Ionic 4, there are deprecation warnings printed in the console to show what the new classes are, and the documentation has been updated since support for classes was added to remove all references to attributes: https://ionicframework.com/docs/layout/css-utilities.


#### Display Classes

The responsive display classes found in the `display.css` file have had their media queries updated to better reflect how they should work. Instead of using the maximum value of the breakpoint (for `.ion-hide-{breakpoint}-down` classes) the maximum of the media query will be the minimum of that breakpoint.


#### Activated, Focused, Hover States

The `.activated` class that gets added has been renamed to `.ion-activated` for consistency with how we add focused to elements and to avoid conflicts in user’s CSS.

<!-- TODO mention some of the changes to the hover values: https://github.com/ionic-team/ionic/pull/19440 -->


### Components

#### Anchor

The `ion-anchor` component has been renamed to `ion-router-link` as this is a better description of which component it should be used with. This component should still only be used in vanilla and Stencil JavaScript projects. Angular projects should use an `<a>` and `routerLink` with the Angular router. See the [documentation for router-link](https://ionicframework.com/docs/api/router-link) for more information.


#### Menu

- The `swipeEnable()` function has been removed in Angular, use `swipeGesture()` instead.
- The `side` values `left` and `right` have been removed, use `start` and `end` instead.
- Removed the `main` attribute, use `content-id` instead.
- The presentation type in `ios` now defaults to `"overlay"`.

#### Nav Link

The `ion-nav-push`, `ion-nav-back`, and `ion-nav-set-root` components have been removed in favor of using `ion-nav-link` with a `router-direction` property which accepts `”root”`, `“forward”`, and `“back”`. This reduces the need for maintaining multiple components when they all do the same thing with different transition directions. See the [documentation for nav-link](https://ionicframework.com/docs/api/nav-link) for more information.


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


#### Segment

<!-- TODO https://gist.github.com/brandyscarney/e6cfe43c359bb2c932e12f8d615e1669 -->


#### Skeleton Text

The `width` property has been removed in favor of using CSS styling.


#### Split Pane
- Removed the `main` attribute, use `content-id` instead.


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

### Colors

The default Ionic colors have been updated to the following:

```
primary:         #3880ff
secondary:       #3dc2ff
tertiary:        #5260ff
success:         #2dd36f
warning:         #ffc409
danger:          #eb445a
light:           #f4f5f8
medium:          #92949c
dark:            #222428
```

`primary`, `light` and `dark` have not changed. The contrast color for `warning` has been updated to `#000`.

This will only be a breaking change in your app if you are not using one of our starters & not overriding the defaults. If you are overriding the defaults already these will need to be manually updated if desired.


### Ionicons

<!-- TODO verify / add link to site -->

The table below outlines icons that were removed or renamed.


| Icon Name                    |             | Status      | Notes                                                                 |
| -----------------------------| ------------| ------------| ----------------------------------------------------------------------|
| add-circle            	     | :x:         | deleted     | re-added as "circled" icon                                            |
| add-circle-outline    	     | :x:         | deleted     | re-added as "circled" icon                                            |
| appstore                     | :x:         | deleted     | added as google play & apple app store logos                          |
| arrow-dropdown-circle        | :pencil2:   | renamed     | renamed to "arrow-down-circle"                                        |
| arrow-dropdown               | :pencil2:   | renamed     | renamed to "arrow-down"                                               |
| arrow-dropleft-circle        | :pencil2:   | renamed     | renamed to "arrow-back-circle"                                        |
| arrow-dropleft               | :pencil2:   | renamed     | renamed to "arrow-back"                                               |
| arrow-dropright-circle       | :pencil2:   | renamed     | renamed to "arrow-forward-circle"                                     |
| arrow-dropright              | :pencil2:   | renamed     | renamed to "arrow-forward"                                            |
| arrow-dropup-circle          | :pencil2:   | renamed     | renamed to "arrow-up-circle"                                          |
| arrow-dropup                 | :pencil2:   | renamed     | renamed to "arrow-up"                                                 |
| arrow-round-back             | :x:         | deleted     | becomes "arrow-back"                                                  |
| arrow-round-down             | :x:         | deleted     | becomes "arrow-down"                                                  |
| arrow-round-forward          | :x:         | deleted     | becomes "arrow-forward"                                               |
| arrow-round-up               | :x:         | deleted     | becomes "arrow-up"                                                    |
| bowtie                       | :x:         | deleted     |                                                                       |
| chatboxes                    | :pencil2:   | renamed     | renamed to "chatbox"                                                  |
| checkbox-outline             | :x:         | deleted     |                                                                       |
| checkmark-circle-outline     | :x:         | deleted     |                                                                       |
| clock                        | :x:         | deleted     |                                                                       |
| close-circle-outline         | :x:         | deleted     |                                                                       |
| cloud-outline                | :pencil2:   | renamed     | renamed to "cloud"                                                    |
| contact                      | :pencil2:   | renamed     | renamed to "person-circle"                                            |
| contacts                     | :pencil2:   | renamed     | renamed to "person-circle"                                            |
| done-all                     | :pencil2:   | renamed     | renamed to "checkmark-done"                                           |
| fastforward	                 | :pencil2:   | renamed     | renamed to "play-forward"                                             |
| filing                       | :pencil2:   | renamed     | renamed to "file-tray"                                                |
| freebsd-devil                | :x:         | deleted     |                                                                       |
| game-controller-a            | :x:         | deleted     |                                                                       |
| game-controller-b            | :x:         | deleted     | added as "game-controller"                                            |
| googleplus                   | :x:         | deleted     |                                                                       |
| hand                         | :x:         | deleted     | split into "hand-left" and "hand-right"                               |
| heart-empty                  | :pencil2:   | renamed     | renamed to "heart"                                                    |
| help-circle-outline          | :x:         | deleted     | exists as circled version                                             |
| information-circle-outline   | :x:         | deleted     | exists as circled version                                             |
| jet                          | :x:         | deleted     | use "airplane"                                                        |
| list-box                     | :x:         | deleted     |                                                                       |
| lock                         | :pencil2:   | renamed     | renamed to "lock-closed"                                              |
| microphone                   | :x:         | deleted     |                                                                       |
| model-s                      | :x:         | deleted     | added as "car-sport"                                                  |
| more                         | :x:         | deleted     | use "ellipsis-horizontal" for `ios` and "ellipsis-vertical" for `md`  |
| notifications-outline        | :x:         | deleted     | exists as circled version                                             |
| outlet                       | :x:         | deleted     |                                                                       |
| paper                        | :pencil2:   | renamed     | renamed to "newspaper"                                                |
| pie                          | :pencil2:   | renamed     | renamed to "pie chart"                                                |
| pint                         | :x:         | deleted     |                                                                       |
| photos                       | :x:         | deleted     | use "image" or "images"                                               |
| qr-scanner                   | :pencil2:   | renamed     | renamed to "scanner"                                                  |
| quote                        | :x:         | deleted     |                                                                       |
| redo                         | :pencil2:   | renamed     | renamed to "arrow-redo"                                               |
| remove-circle-outline        | :x:         | deleted     | exists as circled version                                             |
| reorder                      | :x:         | deleted     | added as reorder-two, reorder-three, reorder-four                     |
| return-left                  | :pencil2:   | renamed     | renamed to "return-right-up/down-arrow"                               |
| return-right                 | :pencil2:   | renamed     | renamed to "return-right-up/down-arrow"                               |
| rewind                       | :pencil2:   | renamed     | renamed to "play-back"                                                |
| reverse-camera               | :pencil2:   | renamed     | renamed to "camera-reverse"                                           |
| share-alt                    | :x:         | deleted     |                                                                       |
| skip-backward	               | :pencil2:   | renamed     | renamed to "play-skip-back"					                                 |
| skip-forward	               | :pencil2:   | renamed     | renamed to "play-skip-forward"					                               |
| star-outline                 | :pencil2:   | renamed     | renamed to "star"                                                     |
| stats	                       | :pencil2:   | renamed     | renamed to "stats-chart"                                              |
| swap                         | :x:         | deleted     | use "swap-horizontal" or "swap-vertical"                              |
| text                         | :pencil2:   | renamed     | renamed to "chatbox-ellipsis"                                         |
| undo                         | :pencil2:   | renamed     | renamed to "arrow-undo"	                                             |
| unlock                       | :pencil2:   | renamed     | renamed to "lock-open"		                                             |



--------------------------------------------------------------------------------------------------

## 4.0.0

The list of the breaking changes introduced in Ionic Angular v4 can be found in [angular/BREAKING.md](https://github.com/ionic-team/ionic/blob/master/angular/BREAKING.md).
