# ion-infinite-scroll

The Infinite Scroll component calls an action to be performed when the user scrolls a specified distance from the bottom or top of the page.

The expression assigned to the `ionInfinite` event is called when the user reaches that defined distance. When this expression has finished any and all tasks, it should call the `complete()` method on the infinite scroll instance.

## Infinite Scroll Content

The `ion-infinite-scroll` component has the infinite scroll logic. It requires a child component in order to display content. Ionic uses its `ion-infinite-scroll-content` component by default. This component displays the infinite scroll and changes the look depending on the infinite scroll's state. It displays a spinner that looks best based on the platform the user is on. However, the default spinner can be changed and text can be added by setting properties on the `ion-infinite-scroll-content` component.

## Custom Content

Separating the `ion-infinite-scroll` and `ion-infinite-scroll-content` components allows developers to create their own content components, if desired. This content can contain anything, from an SVG element to elements with unique CSS animations.

## React

The Infinite Scroll component is not supported in React.

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-content>
  <ion-button (click)="toggleInfiniteScroll()" expand="block">
    Toggle Infinite Scroll
  </ion-button>

  <ion-list></ion-list>

  <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event)">
    <ion-infinite-scroll-content
      loadingSpinner="bubbles"
      loadingText="Loading more data...">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</ion-content>
```

```typescript
import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'infinite-scroll-example',
  templateUrl: 'infinite-scroll-example.html',
  styleUrls: ['./infinite-scroll-example.css']
})
export class InfiniteScrollExample {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor() {}

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (data.length == 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
}
```


### Javascript

```html
<ion-content>
  <ion-button onClick="toggleInfiniteScroll()" expand="block">
    Toggle Infinite Scroll
  </ion-button>

  <ion-list></ion-list>

  <ion-infinite-scroll threshold="100px" id="infinite-scroll">
    <ion-infinite-scroll-content
      loading-spinner="bubbles"
      loading-text="Loading more data...">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</ion-content>
```

```javascript
const infiniteScroll = document.getElementById('infinite-scroll');

infiniteScroll.addEventListener('ionInfinite', function(event) {
  setTimeout(function() {
    console.log('Done');
    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (data.length == 1000) {
      event.target.disabled = true;
    }
  }, 500);
});

function toggleInfiniteScroll() {
  infiniteScroll.disabled = !infiniteScroll.disabled;
}
```



## Properties

| Property    | Attribute   | Description                                                                                                                                                                                                                                                                                                                                                                                               | Type                | Default    |
| ----------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| `disabled`  | `disabled`  | If `true`, the infinite scroll will be hidden and scroll event listeners will be removed.  Set this to true to disable the infinite scroll from actively trying to receive new data while scrolling. This is useful when it is known that there is no more data that can be added, and the infinite scroll is no longer needed.                                                                           | `boolean`           | `false`    |
| `position`  | `position`  | The position of the infinite scroll element. The value can be either `top` or `bottom`.                                                                                                                                                                                                                                                                                                                   | `"bottom" \| "top"` | `'bottom'` |
| `threshold` | `threshold` | The threshold distance from the bottom of the content to call the `infinite` output event when scrolled. The threshold value can be either a percent, or in pixels. For example, use the value of `10%` for the `infinite` output event to get called when the user has scrolled 10% from the bottom of the page. Use the value `100px` when the scroll is within 100 pixels from the bottom of the page. | `string`            | `'15%'`    |


## Events

| Event         | Description                                                                                                                                                                                 | Type                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `ionInfinite` | Emitted when the scroll reaches the threshold distance. From within your infinite handler, you must call the infinite scroll's `complete()` method when your async operation has completed. | `CustomEvent<void>` |


## Methods

### `complete() => Promise<void>`

Call `complete()` within the `ionInfinite` output event handler when
your async operation has completed. For example, the `loading`
state is while the app is performing an asynchronous operation,
such as receiving more data from an AJAX request to add more items
to a data list. Once the data has been received and UI updated, you
then call this method to signify that the loading has completed.
This method will change the infinite scroll's state from `loading`
to `enabled`.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
