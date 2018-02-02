# ion-select

The `<ion-select>` element is similar to a native `<select>` element, however, it is easier for users to sort through and select the preferred option or options. When a user taps the select component, a dialog appears with all of the options in a large, easy to select list.

It should be used with child `ion-select-option` elements. If the child option is not given a `value` attribute then it will use its text as the value.

If `value` is set on the `ion-select`, the selected option will be based on that value. Otherwise, the `selected` attribute can be used on the `ion-select-option` elements.

## Interfaces

By default, the `ion-select` uses the [AlertController API](../../alert/AlertController) to open up the overlay of options in an alert. The interface can be changed to use the [ActionSheetController API](../../action-sheet/ActionSheetController) or [PopoverController API](../../popover/PopoverController) by passing `action-sheet` or `popover`, respectively, to the `interface` property. Read on to the other sections for the limitations of the different interfaces.

## Single Value: Radio Buttons

The standard `ion-select` component allows the user to select only one option. When selecting only one option the alert interface presents users with a radio button styled list of options. The action sheet interface can only be used with a single value select. The `ion-select` component's value receives the value of the selected option's value.

```html
<ion-item>
  <ion-label>Gender</ion-label>
  <ion-select id="gender">
    <ion-select-option value="f">Female</ion-select-option>
    <ion-select-option value="m">Male</ion-select-option>
  </ion-select>
</ion-item>
```

### Multiple Value: Checkboxes

By adding the `multiple="true"` attribute to `ion-select`, users are able to select multiple options. When multiple options can be selected, the alert overlay presents users with a checkbox styled list of options. The `ion-select` component's value receives an array of all the selected option values. In the example below, because each option is not given a `value`, it will use the option's text as the value.

Note: the `action-sheet` and `popover` interfaces will not work with a multiple-value select.

```html
<ion-item>
  <ion-label>Toppings</ion-label>
  <ion-select id="toppings" multiple="true">
    <ion-select-option>Bacon</ion-select-option>
    <ion-select-option>Black Olives</ion-select-option>
    <ion-select-option>Extra Cheese</ion-select-option>
    <ion-select-option>Mushrooms</ion-select-option>
    <ion-select-option>Pepperoni</ion-select-option>
    <ion-select-option>Sausage</ion-select-option>
  </ion-select>
</ion-item>
```

## Select Buttons

By default, the two buttons read `Cancel` and `OK`. Each button's text can be customized using the `cancelText` and `okText` attributes:

```html
<ion-select ok-text="Okay" cancel-text="Dismiss">
  ...
</ion-select>
```

The `action-sheet` and `popover` interfaces do not have an `OK` button, clicking on any of the options will automatically close the overlay and select that value. The `popover` interface does not have a `Cancel` button, clicking on the backdrop will close the overlay.

## Interface Options

Since `ion-select` uses the `Alert`, `Action Sheet` and `Popover` interfaces, options can be passed to these components through the `interfaceOptions` property. This can be used to pass a custom title, subTitle, css class, and more. See the [AlertController API docs](../../alert/AlertController/#create), [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create), and [PopoverController API docs](../../popover/PopoverController/#create) for the properties that each interface accepts.

For example, to change the `title` and `subTitle` of the overlay, pass it into `interfaceOptions`.

```html
<ion-select id="customSelect">
  ...
</ion-select>
```

```javascript
var customSelect = document.getElementById('customSelect');
customSelect.interfaceOptions = {
  title: 'Pizza Toppings',
  subTitle: 'Select your toppings'
};
```


<!-- Auto Generated Below -->


## Properties

#### cancelText

string

The text to display on the cancel button. Default: `Cancel`.


#### disabled

boolean

If true, the user cannot interact with the select. Defaults to `false`.


#### interface

string

The interface the select should use: `action-sheet`, `popover` or `alert`. Default: `alert`.


#### interfaceOptions

any

Any additional options that the `alert`, `action-sheet` or `popover` interface
can take. See the [AlertController API docs](../../alert/AlertController/#create), the
[ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the
[PopoverController API docs](../../popover/PopoverController/#create) for the
create options for each interface.


#### multiple

boolean

If true, the select can accept multiple values.


#### name

string

The name of the control, which is submitted with the form data.


#### okText

string

The text to display on the ok button. Default: `OK`.


#### placeholder

string

The text to display when the select is empty.


#### selectedText

string

The text to display instead of the selected option's value.


#### value



the value of the select.


## Attributes

#### cancel-text

string

The text to display on the cancel button. Default: `Cancel`.


#### disabled

boolean

If true, the user cannot interact with the select. Defaults to `false`.


#### interface

string

The interface the select should use: `action-sheet`, `popover` or `alert`. Default: `alert`.


#### interface-options

any

Any additional options that the `alert`, `action-sheet` or `popover` interface
can take. See the [AlertController API docs](../../alert/AlertController/#create), the
[ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the
[PopoverController API docs](../../popover/PopoverController/#create) for the
create options for each interface.


#### multiple

boolean

If true, the select can accept multiple values.


#### name

string

The name of the control, which is submitted with the form data.


#### ok-text

string

The text to display on the ok button. Default: `OK`.


#### placeholder

string

The text to display when the select is empty.


#### selected-text

string

The text to display instead of the selected option's value.


#### value



the value of the select.


## Events

#### ionBlur

Emitted when the select loses focus.


#### ionCancel

Emitted when the selection is cancelled.


#### ionChange

Emitted when the value has changed.


#### ionFocus

Emitted when the select has focus.


#### ionStyle

Emitted when the styles change.



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
