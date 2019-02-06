# ion-reorder

Reorder is a component that allows an item to be dragged to change its order. It must be used within an `ion-reorder-group` to provide a visual drag and drop interface.

`ion-reorder` is the anchor users will use to drag and drop items inside the `ion-reorder-group`.

```html
<ion-item>
  <ion-label>
    Item
  </ion-label>
  <ion-reorder slot="end"></ion-reorder>
</ion-item>
```

## Properties

| Property   | Attribute  | Description                            | Type      |
| ---------- | ---------- | -------------------------------------- | --------- |
| `slot`     | `slot`     | If `start`, the reorder icon will be shown at before the label. If `end`, the reorder icon will be show after the label | `string` |
| `name`     | `name`     | The name of the icon to use for the reorder handle. | `string` ||

<!-- Auto Generated Below -->


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
