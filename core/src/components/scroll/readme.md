# ion-scroll

Scroll is a low-level component for arbitrary scrolling areas. It's used internally by Content.


<!-- Auto Generated Below -->


## Properties

#### forceOverscroll

boolean

If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
If the content exceeds the bounds of ionScroll, nothing will change.
Note, the does not disable the system bounce on iOS. That is an OS level setting.


#### mode

string

The mode for component.


#### scrollEvents

boolean

If true, the component will emit scroll events


## Attributes

#### force-overscroll

boolean

If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
If the content exceeds the bounds of ionScroll, nothing will change.
Note, the does not disable the system bounce on iOS. That is an OS level setting.


#### mode

string

The mode for component.


#### scroll-events

boolean

If true, the component will emit scroll events


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

Scroll by a specified X/Y distance in the component


#### scrollToBottom()

Scroll to the bottom of the component


#### scrollToPoint()

Scroll to a specified X/Y location in the component


#### scrollToTop()

Scroll to the top of the component



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
