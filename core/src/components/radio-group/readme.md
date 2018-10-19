# ion-radio-group

A radio group is a group of [radio buttons](../radio). It allows
a user to select at most one radio button from a set. Checking one radio
button that belongs to a radio group unchecks any previous checked
radio button within the same group.




<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description                                                              | Type      |
| --------------------- | ----------------------- | ------------------------------------------------------------------------ | --------- |
| `allowEmptySelection` | `allow-empty-selection` | If `true`, the radios can be deselected. Default false.                  | `boolean` |
| `disabled`            | `disabled`              | If `true`, the user cannot interact with the radio group. Default false. | `boolean` |
| `name`                | `name`                  | The name of the control, which is submitted with the form data.          | `string`  |
| `value`               | --                      | the value of the radio group.                                            | `any`     |


## Events

| Event       | Description                         |
| ----------- | ----------------------------------- |
| `ionChange` | Emitted when the value has changed. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
