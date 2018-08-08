# ion-alert

An Alert is a dialog that presents users with information or collects information from the user using inputs. An alert appears on top of the app's content, and must be manually dismissed by the user before they can resume interaction with the app. It can also optionally have a `title`, `subTitle` and `message`.


### Creating

Alerts can be created using a [Alert Controller](../../alert-controller/AlertController). They can be customized by passing alert options in the alert controller's create method.


### Buttons

In the array of `buttons`, each button includes properties for its `text`, and optionally a `handler`. If a handler returns `false` then the alert will not automatically be dismissed when the button is clicked. All buttons will show up in the order they have been added to the `buttons` array from left to right. Note: The right most button (the last one in the array) is the main button.

Optionally, a `role` property can be added to a button, such as `cancel`. If a `cancel` role is on one of the buttons, then if the alert is dismissed by tapping the backdrop, then it will fire the handler from the button with a cancel role.


### Inputs

Alerts can also include several different inputs whose data can be passed back to the app. Inputs can be used as a simple way to prompt users for information. Radios, checkboxes and text inputs are all accepted, but they cannot be mixed. For example, an alert could have all radio button inputs, or all checkbox inputs, but the same alert cannot mix radio and checkbox inputs. Do note however, different types of "text"" inputs can be mixed, such as `url`, `email`, `text`, etc. If you require a complex form UI which doesn't fit within the guidelines of an alert then we recommend building the form within a modal instead.


<!-- Auto Generated Below -->


## Properties

#### buttons

(AlertButton | string)[]

Array of buttons to be added to the alert.


#### cssClass

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### enableBackdropDismiss

boolean

If true, the alert will be dismissed when the backdrop is clicked. Defaults to `true`.


#### enterAnimation

AnimationBuilder

Animation to use when the alert is presented.


#### header

string

The main title in the heading of the alert.


#### inputs

AlertInput[]

Array of input to show in the alert.


#### keyboardClose

boolean


#### leaveAnimation

AnimationBuilder

Animation to use when the alert is dismissed.


#### message

string

The main message to be displayed in the alert.


#### mode

string


#### overlayId

number


#### subHeader

string

The subtitle in the heading of the alert. Displayed under the title.


#### translucent

boolean

If true, the alert will be translucent. Defaults to `false`.


#### willAnimate

boolean

If true, the alert will animate. Defaults to `true`.


## Attributes

#### buttons



Array of buttons to be added to the alert.


#### css-class

string

Additional classes to apply for custom CSS. If multiple classes are
provided they should be separated by spaces.


#### enable-backdrop-dismiss

boolean

If true, the alert will be dismissed when the backdrop is clicked. Defaults to `true`.


#### enter-animation



Animation to use when the alert is presented.


#### header

string

The main title in the heading of the alert.


#### inputs



Array of input to show in the alert.


#### keyboard-close

boolean


#### leave-animation



Animation to use when the alert is dismissed.


#### message

string

The main message to be displayed in the alert.


#### mode

string


#### overlay-id

number


#### sub-header

string

The subtitle in the heading of the alert. Displayed under the title.


#### translucent

boolean

If true, the alert will be translucent. Defaults to `false`.


#### will-animate

boolean

If true, the alert will animate. Defaults to `true`.


## Events

#### ionAlertDidDismiss

Emitted after the alert has dismissed.


#### ionAlertDidLoad

Emitted after the alert has presented.


#### ionAlertDidPresent

Emitted after the alert has presented.


#### ionAlertDidUnload

Emitted before the alert has presented.


#### ionAlertWillDismiss

Emitted before the alert has dismissed.


#### ionAlertWillPresent

Emitted before the alert has presented.


## Methods

#### dismiss()

Dismiss the alert overlay after it has been presented.


#### onDidDismiss()

Returns a promise that resolves when the alert did dismiss. It also accepts a callback
that is called in the same circumstances.


#### onWillDismiss()

Returns a promise that resolves when the alert will dismiss. It also accepts a callback
that is called in the same circumstances.


#### present()

Present the alert overlay after it has been created.


## CSS Custom Properties

| Name                    | Description                      |
| ----------------------- | -------------------------------- |
| `--background`          | Background of the alert          |
| `--border-radius`       | Border radius of the alert       |
| `--box-shadow`          | Box shadow of the alert          |
| `--button-font-size`    | Font size of the alert button    |
| `--button-line-height`  | Line height of the alert button  |
| `--head-padding-bottom` | Padding bottom of the alert head |
| `--head-padding-end`    | Padding end of the alert head    |
| `--head-padding-start`  | Padding start of the alert head  |
| `--head-padding-top`    | Padding top of the alert head    |
| `--head-text-align`     | Text alignment of the alert head |
| `--max-height`          | Maximum height of the alert      |
| `--max-width`           | Maximum width of the alert       |
| `--min-width`           | Minimum width of the alert       |
| `--sub-title-color`     | Color of the alert subtitle      |
| `--sub-title-font-size` | Font size of the alert subtitle  |
| `--title-color`         | Color of the alert title         |
| `--title-font-size`     | Font size of the alert title     |
| `--title-font-weight`   | Font weight of the alert title   |
| `--title-margin-bottom` | Margin bottom of the alert title |
| `--title-margin-end`    | Margin end of the alert title    |
| `--title-margin-start`  | Margin start of the alert title  |
| `--title-margin-top`    | Margin top of the alert title    |
| `--width`               | Width of the alert               |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
