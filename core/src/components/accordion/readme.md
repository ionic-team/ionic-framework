# ion-accordion



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                  | Default     |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined` |
| `disabled` | `disabled` | If `true`, the accordion cannot be interacted with.                                                                                                                                                                                                                    | `boolean`             | `false`     |
| `mode`     | `mode`     | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined` |
| `readonly` | `readonly` | If `true`, the accordion cannot be interacted with, but does not alter the opacity.                                                                                                                                                                                    | `boolean`             | `false`     |
| `value`    | `value`    | The value of the accordion.                                                                                                                                                                                                                                            | `string \| undefined` | `undefined` |


## Events

| Event      | Description                             | Type                |
| ---------- | --------------------------------------- | ------------------- |
| `ionBlur`  | Emitted when the accordion loses focus. | `CustomEvent<void>` |
| `ionFocus` | Emitted when the accordion has focus.   | `CustomEvent<void>` |


## Slots

| Slot        | Description                                                                        |
| ----------- | ---------------------------------------------------------------------------------- |
| `"content"` | Content is placed below the header and is shown or hidden based on expanded state. |
| `"header"`  | Content is placed at the top and is used to expand or collapse the accordion item. |


## Shadow Parts

| Part         | Description                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `"content"`  | The wrapper element for the content slot.                                                                                |
| `"expanded"` | The expanded element. Can be used in combination with the `header` and `content` parts (i.e. `::part(header expanded)`). |
| `"header"`   | The wrapper element for the header slot.                                                                                 |


## CSS Custom Properties

| Name                | Description                         |
| ------------------- | ----------------------------------- |
| `--content-padding` | The padding of the content wrapper; |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
