# ion-infinite-scroll

The Infinite Scroll allows you to perform an action when the user
scrolls a specified distance from the bottom or top of the page.

The expression assigned to the `ionInfinite` event is called when
the user scrolls to the specified distance. When this expression
has finished its tasks, it should call the `complete()` method
on the infinite scroll instance.

## Infinite Scroll Content

By default, Ionic uses the infinite scroll spinner that looks
best for the platform the user is on. However, you can change the
default spinner or add text by adding properties to the
`ion-infinite-scroll-content` component.

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

If true, the infinite scroll will be hidden and scroll event listeners
will be removed.

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

If true, the infinite scroll will be hidden and scroll event listeners
will be removed.

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

*Built with [StencilJS](https://stenciljs.com/)*
