# ion-picker

A Picker is a dialog that displays a row of buttons and columns underneath. It appears on top of the app's content, and at the bottom of the viewport.



<!-- Auto Generated Below -->


## Properties

#### buttons



Array of buttons to be displayed at the top of the picker.


#### columns



Array of columns to be displayed in the picker.


#### cssClass

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### duration

number

Number of milliseconds to wait before dismissing the picker.


#### enableBackdropDismiss

boolean

If true, the picker will be dismissed when the backdrop is clicked. Defaults to `true`.


#### enterAnimation



Animation to use when the picker is presented.


#### keyboardClose

boolean


#### leaveAnimation



Animation to use when the picker is dismissed.


#### overlayId

number


#### showBackdrop

boolean

If true, a backdrop will be displayed behind the picker. Defaults to `true`.


#### willAnimate

boolean

If true, the picker will animate. Defaults to `true`.


## Attributes

#### buttons



Array of buttons to be displayed at the top of the picker.


#### columns



Array of columns to be displayed in the picker.


#### css-class

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### duration

number

Number of milliseconds to wait before dismissing the picker.


#### enable-backdrop-dismiss

boolean

If true, the picker will be dismissed when the backdrop is clicked. Defaults to `true`.


#### enter-animation



Animation to use when the picker is presented.


#### keyboard-close

boolean


#### leave-animation



Animation to use when the picker is dismissed.


#### overlay-id

number


#### show-backdrop

boolean

If true, a backdrop will be displayed behind the picker. Defaults to `true`.


#### will-animate

boolean

If true, the picker will animate. Defaults to `true`.


## Events

#### ionPickerDidDismiss

Emitted after the picker has dismissed.


#### ionPickerDidLoad

Emitted after the picker has loaded.


#### ionPickerDidPresent

Emitted after the picker has presented.


#### ionPickerDidUnload

Emitted after the picker has unloaded.


#### ionPickerWillDismiss

Emitted before the picker has dismissed.


#### ionPickerWillPresent

Emitted before the picker has presented.


## Methods

#### addButton()


#### addColumn()


#### dismiss()

Dismiss the picker overlay after it has been presented.


#### getColumn()


#### getColumns()


#### onDidDismiss()

Returns a promise that resolves when the picker did dismiss. It also accepts a callback
that is called in the same circustances.

```
const {data, role} = await picker.onDidDismiss();
```


#### onWillDismiss()

Returns a promise that resolves when the picker will dismiss. It also accepts a callback
that is called in the same circustances.

```
const {data, role} = await picker.onWillDismiss();
```


#### present()

Present the picker overlay after it has been created.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
