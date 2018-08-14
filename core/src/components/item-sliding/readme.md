# ion-item-sliding

A sliding item contains an item that can be dragged to reveal buttons. It requires an [item](../item) component as a child. All options to reveal should be placed in the [item options](../item-options) element.


### Swipe Direction

By default, the buttons are placed on the `"end"` side. This means that options are revealed when the sliding item is swiped from end to start, i.e. from right to left in LTR, but from left to right in RTL. To place them on the opposite side, so that they are revealed when swiping in the opposite direction, set the `side` attribute to `"start"` on the [`ion-item-options`]((../item-options) element. Up to two `ion-item-options` can be used at the same time in order to reveal two different sets of options depending on the swiping direction.


### Options Layout

By default if an icon is placed with text in the [item option](../item-option), it will display the icon on top of the text, but the icon slot can be changed to any of the following to position it in the option.

| Slot        | description                                                              |
| ----------- | ------------------------------------------------------------------------ |
| `start`     | In LTR, start is the left side of the button, and in RTL it is the right |
| `top`       | The icon is above the text                                               |
| `icon-only` | The icon is the only content of the button                               |
| `bottom`    | The icon is below the text                                               |
| `end`       | In LTR, end is the right side of the button, and in RTL it is the left   |


### Expandable Options

Options can be expanded to take up the full width of the item if you swipe past a certain point. This can be combined with the `ionSwipe` event to call methods on the class.


<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                   | Type      |
| ---------- | ---------- | ----------------------------------------------------------------------------- | --------- |
| `disabled` | `disabled` | If true, the user cannot interact with the sliding-item. Defaults to `false`. | `boolean` |


## Events

| Event     | Description                                |
| --------- | ------------------------------------------ |
| `ionDrag` | Emitted when the sliding position changes. |


## Methods

| Method            | Description                                                                                                                                                                                                                                                                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `close`           | Close the sliding item. Items can also be closed from the [List](../../list/List).                                                                                                                                                                                                                                                                              |
| `closeOpened`     | Close all of the sliding items in the list. Items can also be closed from the [List](../../list/List).                                                                                                                                                                                                                                                          |
| `getOpenAmount`   | Get the amount the item is open in pixels.                                                                                                                                                                                                                                                                                                                      |
| `getSlidingRatio` | Get the ratio of the open amount of the item compared to the width of the options. If the number returned is positive, then the options on the right side are open. If the number returned is negative, then the options on the left side are open. If the absolute value of the number is greater than 1, the item is open more than the width of the options. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
