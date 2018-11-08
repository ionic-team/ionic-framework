# ion-radio-group

A radio group is a group of [radio buttons](../radio). It allows
a user to select at most one radio button from a set. Checking one radio
button that belongs to a radio group unchecks any previous checked
radio button within the same group.




<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description                                                     | Type      | Default        |
| --------------------- | ----------------------- | --------------------------------------------------------------- | --------- | -------------- |
| `allowEmptySelection` | `allow-empty-selection` | If `true`, the radios can be deselected.                        | `boolean` | `false`        |
| `name`                | `name`                  | The name of the control, which is submitted with the form data. | `string`  | `this.inputId` |
| `value`               | --                      | the value of the radio group.                                   | `any`     | `undefined`    |


## Events

| Event       | Description                         | Detail           |
| ----------- | ----------------------------------- | ---------------- |
| `ionChange` | Emitted when the value has changed. | InputChangeEvent |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
