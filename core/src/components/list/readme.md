# ion-list

Lists are made up of multiple rows of items which can contain text, buttons, toggles,
icons, thumbnails, and much more. Lists generally contain items with similar data content, such as images and text.

Lists support several interactions including swiping items to reveal options, dragging to reorder items within the list, and deleting items.


<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                         | Type                                       | Default     |
| -------- | --------- | ------------------------------------------------------------------- | ------------------------------------------ | ----------- |
| `inset`  | `inset`   | If `true`, the list will have margin around it and rounded corners. | `boolean`                                  | `false`     |
| `lines`  | `lines`   | How the bottom border should be displayed on all items.             | `"full" \| "inset" \| "none" \| undefined` | `undefined` |
| `mode`   | `mode`    | The mode determines which platform styles to use.                   | `"ios" \| "md"`                            | `undefined` |


## Methods

### `closeSlidingItems() => Promise<boolean>`

If `ion-item-sliding` are used inside the list, this method closes
any open sliding item.

Returns `true` if an actual `ion-item-sliding` is closed.

#### Returns

Type: `Promise<boolean>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
