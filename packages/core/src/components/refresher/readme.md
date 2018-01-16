# ion-refresher-content
The Refresher provides pull-to-refresh functionality on a content component.
Place the `ion-refresher` as the first child of your `ion-content` element.

Pages can then listen to the refresher's various output events. The `refresh`
output event is fired when the user has pulled down far enough to kick off the
refreshing process. Once the async operation has completed and the refreshing
should end, call `complete()`.




<!-- Auto Generated Below -->


## Properties

#### closeDuration

string

Time it takes to close the refresher. Default is `280ms`.


#### enabled

boolean

If the refresher is enabled or not. This should be used in place of an `ngIf`. Default is `true`.


#### pullDelta

number

The maximum distance of the pull until the refresher
will automatically go into the `refreshing` state. By default, the pull
maximum will be the result of `pullMin + 60`.


#### pullMin

number

The min distance the user must pull down until the
refresher can go into the `refreshing` state. Default is `60`.


#### snapbackDuration

string

Time it takes the refresher to to snap back to the `refreshing` state. Default is `280ms`.


## Attributes

#### closeDuration

string

Time it takes to close the refresher. Default is `280ms`.


#### enabled

boolean

If the refresher is enabled or not. This should be used in place of an `ngIf`. Default is `true`.


#### pullDelta

number

The maximum distance of the pull until the refresher
will automatically go into the `refreshing` state. By default, the pull
maximum will be the result of `pullMin + 60`.


#### pullMin

number

The min distance the user must pull down until the
refresher can go into the `refreshing` state. Default is `60`.


#### snapbackDuration

string

Time it takes the refresher to to snap back to the `refreshing` state. Default is `280ms`.


## Events

#### ionPull

Emitted while the user is pulling down the content and exposing the refresher.


#### ionRefresh

Emitted when the user lets go and has pulled down
far enough, which would be farther than the `pullMin`, then your refresh hander if
fired and the state is updated to `refreshing`. From within your refresh handler,
you must call the `complete()` method when your async operation has completed.


#### ionStart

Emitted when the user begins to start pulling down.


## Methods

#### cancel()

Changes the refresher's state from `refreshing` to `cancelling`.


#### complete()

Call `complete()` when your async operation has completed.
For example, the `refreshing` state is while the app is performing
an asynchronous operation, such as receiving more data from an
AJAX request. Once the data has been received, you then call this
method to signify that the refreshing has completed and to close
the refresher. This method also changes the refresher's state from
`refreshing` to `completing`.


#### getProgress()

A number representing how far down the user has pulled.
The number `0` represents the user hasn't pulled down at all. The
number `1`, and anything greater than `1`, represents that the user
has pulled far enough down that when they let go then the refresh will
happen. If they let go and the number is less than `1`, then the
refresh will not happen, and the content will return to it's original
position.



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
