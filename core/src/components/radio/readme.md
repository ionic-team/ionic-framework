# ion-radio

Radios are generally used as a set of related options inside of a group, but they can also be used alone. Pressing on a radio will check it. They can also be checked programmatically by setting the `checked` property.

An `ion-radio-group` can be used to group a set of radios. When radios are inside of a [radio group](../radio-group), only one radio in the group will be checked at any time. Pressing a radio will check it and uncheck the previously selected radio, if there is one. If a radio is not in a group with another radio, then both radios will have the ability to be checked at the same time.




<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-list>
  <ion-radio-group>
    <ion-list-header>
      <ion-label>Name</ion-label>
    </ion-list-header>

    <ion-item>
      <ion-label>Biff</ion-label>
      <ion-radio slot="start" value="biff" checked></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Griff</ion-label>
      <ion-radio slot="start" value="griff"></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Buford</ion-label>
      <ion-radio slot="start" value="buford"></ion-radio>
    </ion-item>
  </ion-radio-group>
</ion-list>
```


### Javascript

```html
<ion-list>
  <ion-radio-group>
    <ion-list-header>
      <ion-label>Name</ion-label>
    </ion-list-header>

    <ion-item>
      <ion-label>Biff</ion-label>
      <ion-radio slot="start" value="biff" checked></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Griff</ion-label>
      <ion-radio slot="start" value="griff"></ion-radio>
    </ion-item>

    <ion-item>
      <ion-label>Buford</ion-label>
      <ion-radio slot="start" value="buford"></ion-radio>
    </ion-item>
  </ion-radio-group>
</ion-list>
```



## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                  | Default        |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------- |
| `checked`  | `checked`  | If `true`, the radio is selected.                                                                                                                                                                                                                                      | `boolean`             | `false`        |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined`    |
| `disabled` | `disabled` | If `true`, the user cannot interact with the radio.                                                                                                                                                                                                                    | `boolean`             | `false`        |
| `mode`     | `mode`     | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined`    |
| `name`     | `name`     | The name of the control, which is submitted with the form data.                                                                                                                                                                                                        | `string`              | `this.inputId` |
| `value`    | `value`    | the value of the radio.                                                                                                                                                                                                                                                | `any`                 | `undefined`    |


## Events

| Event               | Description                                | Detail                  |
| ------------------- | ------------------------------------------ | ----------------------- |
| `ionBlur`           | Emitted when the radio button loses focus. | void                    |
| `ionFocus`          | Emitted when the radio button has focus.   | void                    |
| `ionRadioDidLoad`   | Emitted when the radio loads.              | void                    |
| `ionRadioDidUnload` | Emitted when the radio unloads.            | void                    |
| `ionSelect`         | Emitted when the radio button is selected. | CheckedInputChangeEvent |


## CSS Custom Properties

| Name              | Description                    |
| ----------------- | ------------------------------ |
| `--color`         | Color of the radio             |
| `--color-checked` | Color of the checked radio     |
| `--height`        | Height of the radio button     |
| `--inner-height`  | Height of the dot or checkmark |
| `--inner-width`   | Width of the dot or checkmark  |
| `--width`         | Width of the radio button      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
