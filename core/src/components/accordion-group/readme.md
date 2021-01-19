# ion-accordion-group



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                          | Type                                      | Default       |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------- |
| `disabled` | `disabled` | If `true`, the accordion group cannot be interacted with.                                                                                            | `boolean`                                 | `false`       |
| `expand`   | `expand`   | Describes the expansion behavior for each accordion. Possible values are `"float"`, `"inset"`, `"accordion"`, and `"popout"`. Defaults to `"float"`. | `"accordion" \| "inset" \| "popout"`      | `'accordion'` |
| `mode`     | `mode`     | The mode determines which platform styles to use.                                                                                                    | `"ios" \| "md"`                           | `undefined`   |
| `multiple` | `multiple` | If `true`, the accordion group can have multiple accordion components expanded at the same time.                                                     | `boolean \| undefined`                    | `undefined`   |
| `readonly` | `readonly` | If `true`, the accordion group cannot be interacted with, but does not alter the opacity.                                                            | `boolean`                                 | `false`       |
| `value`    | `value`    | The value of the accordion group.                                                                                                                    | `null \| string \| string[] \| undefined` | `undefined`   |


## Events

| Event       | Description                                  | Type                                                |
| ----------- | -------------------------------------------- | --------------------------------------------------- |
| `ionChange` | Emitted when the value property has changed. | `CustomEvent<AccordionGroupChangeEventDetail<any>>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
