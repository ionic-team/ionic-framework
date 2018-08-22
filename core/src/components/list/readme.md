# ion-list

Lists are made up of multiple rows of items which can contain text, buttons, toggles,
icons, thumbnails, and much more. Lists generally contain items with similar data content, such as images and text.

Lists support several interactions including swiping items to reveal options, dragging to reorder items within the list, and deleting items.


<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                                                               | Type                          |
| -------- | --------- | --------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `inset`  | `inset`   | If true, the list will have margin around it and rounded corners. Defaults to `false`.                    | `boolean`                     |
| `lines`  | `lines`   | How the bottom border should be displayed on all items. Available options: `"full"`, `"inset"`, `"none"`. | `"full"`, `"inset"`, `"none"` |


## Methods

| Method              | Description                                                                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `closeSlidingItems` | Close the sliding items. Items can also be closed from the [Item Sliding](../../item-sliding/ItemSliding). Returns a boolean value of whether it closed an item or not. |
| `getOpenItem`       | Get the [Item Sliding](../../item-sliding/ItemSliding) that is currently open.                                                                                          |
| `setOpenItem`       | Set an [Item Sliding](../../item-sliding/ItemSliding) as the open item.                                                                                                 |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
