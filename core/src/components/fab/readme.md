# ion-fab

Fabs are container elements that contain one or more fab buttons. They should be placed in a fixed position that does not scroll with the content. Fab should have one main fab-button. Fabs can also contain fab-lists which contain related buttons that show when the main fab button is clicked. The same fab container can contain several [fab-list](../../fab-list/FabList) elements with different side values.

<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                                                                                                                                              | Type                            |
| ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| `activated`  | `activated`  |                                                                                                                                                                          | `boolean`                       |
| `edge`       | `edge`       | If true, the fab will display on the edge of the header if `vertical` is `"top"`, and on the edge of the footer if it is `"bottom"`. Should be used with a `fixed` slot. | `boolean`                       |
| `horizontal` | `horizontal` | Where to align the fab horizontally in the viewport. Possible values are: `"center"`, `"start"`, `"end"`.                                                                | `"start"`, `"end"`, `"center"`  |
| `vertical`   | `vertical`   | Where to align the fab vertically in the viewport. Possible values are: `"top"`, `"center"`, `"bottom"`.                                                                 | `"top"`, `"bottom"`, `"center"` |


## Methods

| Method  | Description                        |
| ------- | ---------------------------------- |
| `close` | Close an active FAB list container |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
