# ion-scroll



<!-- Auto Generated Below -->


## Properties

#### forceOverscroll

boolean

If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
If the content exceeds the bounds of ionScroll, nothing will change.
Note, the does not disable the system bounce on iOS. That is an OS level setting.


#### mode

string


#### scrollEvents

boolean

Because of performance reasons, ionScroll events are disabled by default, in order to enable them
and start listening from (ionScroll), set this property to `true`.


## Attributes

#### force-overscroll

boolean

If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
If the content exceeds the bounds of ionScroll, nothing will change.
Note, the does not disable the system bounce on iOS. That is an OS level setting.


#### mode

string


#### scroll-events

boolean

Because of performance reasons, ionScroll events are disabled by default, in order to enable them
and start listening from (ionScroll), set this property to `true`.


## Events

#### ionScroll

Emitted while scrolling. This event is disabled by default.
Look at the property: `scrollEvents`


#### ionScrollEnd

Emitted when the scroll has ended.


#### ionScrollStart

Emitted when the scroll has started.


## Methods

#### scrollByPoint()


#### scrollToBottom()


#### scrollToPoint()


#### scrollToTop()



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
