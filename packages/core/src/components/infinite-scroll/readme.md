# ion-infinite-scroll

The Infinite Scroll allows you to perform an action when the user
scrolls a specified distance from the bottom or top of the page.

The expression assigned to the `infinite` event is called when
the user scrolls to the specified distance. When this expression
has finished its tasks, it should call the `complete()` method
on the infinite scroll instance.

```html
<ion-content>

<ion-list>
  <ion-itemngFor="let i of items">{% raw %}{{i}}{% endraw %}</ion-item>
</ion-list>

<ion-infinite-scroll (ionInfinite)="doInfinite($event)">
  <ion-infinite-scroll-content></ion-infinite-scroll-content>
</ion-infinite-scroll>

</ion-content>
```

```ts
@Component({...})
export class NewsFeedPage {
items = [];

constructor() {
  for (let i = 0; i < 30; i++) {
    this.items.push( this.items.length );
  }
}

doInfinite(infiniteScroll) {
  console.log('Begin async operation');

  setTimeout(() => {
    for (let i = 0; i < 30; i++) {
      this.items.push( this.items.length );
    }

    console.log('Async operation has ended');
    infiniteScroll.complete();
  }, 500);
}

}
```


## `waitFor` method of InfiniteScroll

In case if your async operation returns promise you can utilize
`waitFor` method inside your template.

```html
<ion-content>

<ion-list>
  <ion-itemngFor="let item of items">{{item}}</ion-item>
</ion-list>

<ion-infinite-scroll (ionInfinite)="$event.waitFor(doInfinite())">
  <ion-infinite-scroll-content></ion-infinite-scroll-content>
</ion-infinite-scroll>

</ion-content>
```

```ts
@Component({...})
export class NewsFeedPage {
items = [];

constructor() {
  for (var i = 0; i < 30; i++) {
    this.items.push( this.items.length );
  }
}

doInfinite(): Promise<any> {
  console.log('Begin async operation');

  return new Promise((resolve) => {
    setTimeout(() => {
      for (var i = 0; i < 30; i++) {
        this.items.push( this.items.length );
      }

      console.log('Async operation has ended');
      resolve();
    }, 500);
  })
}
}
```


## Infinite Scroll Content

By default, Ionic uses the infinite scroll spinner that looks
best for the platform the user is on. However, you can change the
default spinner or add text by adding properties to the
`ion-infinite-scroll-content` component.

```html
<ion-content>

  <ion-infinite-scroll (ionInfinite)="doInfinite($event)">
    <ion-infinite-scroll-content
      loadingSpinner="bubbles"
      loadingText="Loading more data...">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>

</ion-content>
```


## Further Customizing Infinite Scroll Content

The `ion-infinite-scroll` component holds the infinite scroll logic.
It requires a child component in order to display the content.
Ionic uses `ion-infinite-scroll-content` by default. This component
displays the infinite scroll and changes the look depending
on the infinite scroll's state. Separating these components allows
developers to create their own infinite scroll content components.
You could replace our default content with custom SVG or CSS animations.


<!-- Auto Generated Below -->


## Properties

#### disabled

boolean

If true, whether or not the infinite scroll should be
disabled or not. Setting to `true` will remove scroll event listeners
and hide the display.

Call `enable(false)` to disable the infinite scroll from actively
trying to receive new data while scrolling. This method is useful
when it is known that there is no more data that can be added, and
the infinite scroll is no longer needed.


#### position

string

The position of the infinite scroll element.
The value can be either `top` or `bottom`.
Defaults to `bottom`.


#### threshold

string

The threshold distance from the bottom
of the content to call the `infinite` output event when scrolled.
The threshold value can be either a percent, or
in pixels. For example, use the value of `10%` for the `infinite`
output event to get called when the user has scrolled 10%
from the bottom of the page. Use the value `100px` when the
scroll is within 100 pixels from the bottom of the page.
Defaults to `15%`.


## Attributes

#### disabled

boolean

If true, whether or not the infinite scroll should be
disabled or not. Setting to `true` will remove scroll event listeners
and hide the display.

Call `enable(false)` to disable the infinite scroll from actively
trying to receive new data while scrolling. This method is useful
when it is known that there is no more data that can be added, and
the infinite scroll is no longer needed.


#### position

string

The position of the infinite scroll element.
The value can be either `top` or `bottom`.
Defaults to `bottom`.


#### threshold

string

The threshold distance from the bottom
of the content to call the `infinite` output event when scrolled.
The threshold value can be either a percent, or
in pixels. For example, use the value of `10%` for the `infinite`
output event to get called when the user has scrolled 10%
from the bottom of the page. Use the value `100px` when the
scroll is within 100 pixels from the bottom of the page.
Defaults to `15%`.


## Events

#### ionInfinite

Emitted when the scroll reaches
the threshold distance. From within your infinite handler,
you must call the infinite scroll's `complete()` method when
your async operation has completed.


## Methods

#### complete()

Call `complete()` within the `infinite` output event handler when
your async operation has completed. For example, the `loading`
state is while the app is performing an asynchronous operation,
such as receiving more data from an AJAX request to add more items
to a data list. Once the data has been received and UI updated, you
then call this method to signify that the loading has completed.
This method will change the infinite scroll's state from `loading`
to `enabled`.


#### waitFor()

Pass a promise inside `waitFor()` within the `infinite` output event handler in order to
change state of infiniteScroll to "complete"



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
