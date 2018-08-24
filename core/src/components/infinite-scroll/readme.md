# ion-infinite-scroll

The Infinite Scroll component calls an action to be performed when the user scrolls a specified distance from the bottom or top of the page.

The expression assigned to the `ionInfinite` event is called when the user reaches that defined distance. When this expression has finished any and all tasks, it should call the `complete()` method on the infinite scroll instance.

## Infinite Scroll Content

The `ion-infinite-scroll` component has the infinite scroll logic. It requires a child component in order to display content. Ionic uses its `ion-infinite-scroll-content` component by default. This component displays the infinite scroll and changes the look depending on the infinite scroll's state. It displays a spinner that looks best based on the platform the user is on. However, the default spinner can be changed and text can be added by setting properties on the `ion-infinite-scroll-content` component.

## Custom Content

Separating the `ion-infinite-scroll` and `ion-infinite-scroll-content` components allows developers to create their own content components, if desired. This content can contain anything, from an SVG element to elements with unique CSS animations.

<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                                                                                                                                                                                                                                                                                                                                                                                                  | Type                |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `disabled`  | `disabled`  | If true, the infinite scroll will be hidden and scroll event listeners will be removed.  Set this to true to disable the infinite scroll from actively trying to receive new data while scrolling. This is useful when it is known that there is no more data that can be added, and the infinite scroll is no longer needed.                                                                                                | `boolean`           |
| `position`  | `position`  | The position of the infinite scroll element. The value can be either `top` or `bottom`. Defaults to `bottom`.                                                                                                                                                                                                                                                                                                                | `"top"`, `"bottom"` |
| `threshold` | `threshold` | The threshold distance from the bottom of the content to call the `infinite` output event when scrolled. The threshold value can be either a percent, or in pixels. For example, use the value of `10%` for the `infinite` output event to get called when the user has scrolled 10% from the bottom of the page. Use the value `100px` when the scroll is within 100 pixels from the bottom of the page. Defaults to `15%`. | `string`            |


## Events

| Event         | Description                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ionInfinite` | Emitted when the scroll reaches the threshold distance. From within your infinite handler, you must call the infinite scroll's `complete()` method when your async operation has completed. |


## Methods

| Method     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `complete` | Call `complete()` within the `infinite` output event handler when your async operation has completed. For example, the `loading` state is while the app is performing an asynchronous operation, such as receiving more data from an AJAX request to add more items to a data list. Once the data has been received and UI updated, you then call this method to signify that the loading has completed. This method will change the infinite scroll's state from `loading` to `enabled`. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
