# ion-action-sheet

An Action Sheet is a dialog that displays a set of options. It appears on top of the app's content, and must be manually dismissed by the user before they can resume interaction with the app. Destructive options are made obvious in `ios` mode. There are multiple ways to dismiss the action sheet, including tapping the backdrop or hitting the escape key on desktop.

### Creating

An action sheet can be created by the [Action Sheet Controller](../../action-sheet-controller/ActionSheetController) from an array of `buttons`, with each button including properties for its `text`, and optionally a `handler` and `role`. If a handler returns `false` then the action sheet will not be dismissed. An action sheet can also optionally have a `title`, `subTitle` and an `icon`.

### Buttons

A button's `role` property can either be `destructive` or `cancel`. Buttons without a role property will have the default look for the platform. Buttons with the `cancel` role will always load as the bottom button, no matter where they are in the array. All other buttons will be displayed in the order they have been added to the `buttons` array. Note: We recommend that `destructive` buttons are always the first button in the array, making them the top button. Additionally, if the action sheet is dismissed by tapping the backdrop, then it will fire the handler from the button with the cancel role.


<!-- Auto Generated Below -->


## Properties

#### buttons



An array of buttons for the action sheet.


#### cssClass

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### enableBackdropDismiss

boolean

If true, the action sheet will be dismissed when the backdrop is clicked. Defaults to `true`.


#### enterAnimation



Animation to use when the action sheet is presented.


#### header

string

Title for the action sheet.


#### keyboardClose

boolean

If the actionSheet should close the keyboard


#### leaveAnimation



Animation to use when the action sheet is dismissed.


#### overlayId

number

Unique ID to be used with the overlay. Internal only


#### subHeader

string

Subtitle for the action sheet.


#### translucent

boolean

If true, the action sheet will be translucent. Defaults to `false`.


#### willAnimate

boolean

If true, the action sheet will animate. Defaults to `true`.


## Attributes

#### buttons



An array of buttons for the action sheet.


#### css-class

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### enable-backdrop-dismiss

boolean

If true, the action sheet will be dismissed when the backdrop is clicked. Defaults to `true`.


#### enter-animation



Animation to use when the action sheet is presented.


#### header

string

Title for the action sheet.


#### keyboard-close

boolean

If the actionSheet should close the keyboard


#### leave-animation



Animation to use when the action sheet is dismissed.


#### overlay-id

number

Unique ID to be used with the overlay. Internal only


#### sub-header

string

Subtitle for the action sheet.


#### translucent

boolean

If true, the action sheet will be translucent. Defaults to `false`.


#### will-animate

boolean

If true, the action sheet will animate. Defaults to `true`.


## Events

#### ionActionSheetDidDismiss

Emitted after the alert has dismissed.


#### ionActionSheetDidLoad

Emitted after the alert has loaded.


#### ionActionSheetDidPresent

Emitted after the alert has presented.


#### ionActionSheetDidUnload

Emitted after the alert has unloaded.


#### ionActionSheetWillDismiss

Emitted before the alert has dismissed.


#### ionActionSheetWillPresent

Emitted before the alert has presented.


## Methods

#### dismiss()

Dismiss the action sheet overlay after it has been presented.


#### onDidDismiss()

Returns a promise that resolves when the action-sheet did dismiss. It also accepts a callback
that is called in the same circustances.

```
const {data, role} = await actionSheet.onDidDismiss();
```


#### onWillDismiss()

Returns a promise that resolves when the action-sheet will dismiss. It also accepts a callback
that is called in the same circustances.

```
const {data, role} = await actionSheet.onWillDismiss();
```


#### present()

Present the action sheet overlay after it has been created.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
