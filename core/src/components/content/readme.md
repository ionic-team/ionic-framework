# ion-content

Content component provides an easy to use content area with some useful methods
to control the scrollable area. There should only be one content in a single
view component.

<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                    | Type      |
| ----------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `color`           | `color`            |                                                                                                                                                                                                                                                                | `Color`   |
| `forceOverscroll` | `force-overscroll` | If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce. If the content exceeds the bounds of ionContent, nothing will change. Note, the does not disable the system bounce on iOS. That is an OS level setting. | `boolean` |
| `fullscreen`      | `fullscreen`       | If true, the content will scroll behind the headers and footers. This effect can easily be seen by setting the toolbar to transparent.                                                                                                                         | `boolean` |
| `scrollEvents`    | `scroll-events`    | Because of performance reasons, ionScroll events are disabled by default, in order to enable them and start listening from (ionScroll), set this property to `true`.                                                                                           | `boolean` |
| `scrollX`         | `scroll-x`         | If you want to enable the content scrolling in the X axis, set this property to `true`.                                                                                                                                                                        | `boolean` |
| `scrollY`         | `scroll-y`         | If you want to disable the content scrolling in the Y axis, set this property to `false`.                                                                                                                                                                      | `boolean` |


## Events

| Event            | Description                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `ionScroll`      | Emitted while scrolling. This event is disabled by default. Look at the property: `scrollEvents` |
| `ionScrollEnd`   | Emitted when the scroll has ended.                                                               |
| `ionScrollStart` | Emitted when the scroll has started.                                                             |


## Methods

| Method             | Description                                         |
| ------------------ | --------------------------------------------------- |
| `getScrollElement` |                                                     |
| `scrollByPoint`    | Scroll by a specified X/Y distance in the component |
| `scrollToBottom`   | Scroll to the bottom of the component               |
| `scrollToPoint`    | Scroll to a specified X/Y location in the component |
| `scrollToTop`      | Scroll to the top of the component                  |


## CSS Custom Properties

| Name                | Description                    |
| ------------------- | ------------------------------ |
| `--background`      | Background of the Content      |
| `--color`           | Color of the Content           |
| `--keyboard-offset` | Keyboard offset of the Content |
| `--offset-bottom`   | Offset bottom of the Content   |
| `--offset-top`      | Offset top of the Content      |
| `--padding-bottom`  | Padding bottom of the Content  |
| `--padding-end`     | Padding end of the Content     |
| `--padding-start`   | Padding start of the Content   |
| `--padding-top`     | Padding top of the Content     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
