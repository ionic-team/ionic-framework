# ion-toast

A Toast is a subtle notification commonly used in modern applications. It can be used to provide feedback about an operation or to display a system message. The toast appears on top of the app's content, and can be dismissed by the app to resume user interaction with the app.

### Creating

All of the toast options should be passed in the create method. The message to display should be passed in the `message` property. The `showCloseButton` option can be set to true in order to display a close button on the toast. See the properties below for all available options.

### Positioning

Toasts can be positioned at the top, bottom or middle of the viewport. The position can be passed upon creation. The possible values are `top`, `bottom` and `middle`. If the position is not specified, the toast will be displayed at the bottom of the viewport.

### Dismissing

The toast can be dismissed automatically after a specific amount of time by passing the number of milliseconds to display it in the `duration` of the toast options. If `showCloseButton` is set to true, then the close button will dismiss the toast. To dismiss the toast after creation, call the `dismiss()` method on the instance.


<!-- Auto Generated Below -->


## Properties

#### closeButtonText

string

Text to display in the close button.


#### cssClass

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### duration

number

How many milliseconds to wait before hiding the toast. By default, it will show
until `dismiss()` is called.


#### enterAnimation



Animation to use when the toast is presented.


#### keyboardClose

boolean


#### leaveAnimation



Animation to use when the toast is dismissed.


#### message

string

Message to be shown in the toast.


#### overlayId

number


#### position

string

The position of the toast on the screen. Possible values: "top", "middle", "bottom".


#### showCloseButton

boolean

If true, the close button will be displayed. Defaults to `false`.


#### translucent

boolean

If true, the toast will be translucent. Defaults to `false`.


#### willAnimate

boolean

If true, the toast will animate. Defaults to `true`.


## Attributes

#### close-button-text

string

Text to display in the close button.


#### css-class

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### duration

number

How many milliseconds to wait before hiding the toast. By default, it will show
until `dismiss()` is called.


#### enter-animation



Animation to use when the toast is presented.


#### keyboard-close

boolean


#### leave-animation



Animation to use when the toast is dismissed.


#### message

string

Message to be shown in the toast.


#### overlay-id

number


#### position

string

The position of the toast on the screen. Possible values: "top", "middle", "bottom".


#### show-close-button

boolean

If true, the close button will be displayed. Defaults to `false`.


#### translucent

boolean

If true, the toast will be translucent. Defaults to `false`.


#### will-animate

boolean

If true, the toast will animate. Defaults to `true`.


## Events

#### ionToastDidDismiss

Emitted after the toast has dismissed.


#### ionToastDidLoad

Emitted after the toast has loaded.


#### ionToastDidPresent

Emitted after the toast has presented.


#### ionToastDidUnload

Emitted after the toast has unloaded.


#### ionToastWillDismiss

Emitted before the toast has dismissed.


#### ionToastWillPresent

Emitted before the toast has presented.


## Methods

#### dismiss()

Dismiss the toast overlay after it has been presented.


#### onDidDismiss()

Returns a promise that resolves when the toast did dismiss. It also accepts a callback
that is called in the same circustances.

```
const {data, role} = await toast.onDidDismiss();
```


#### onWillDismiss()

Returns a promise that resolves when the toast will dismiss. It also accepts a callback
that is called in the same circustances.

```
const {data, role} = await toast.onWillDismiss();
```


#### present()

Present the toast overlay after it has been created.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
