# ion-content

Content component provides an easy to use content area with some useful methods
to control the scrollable area. There should only be one content in a single
view component.

```html
<ion-content>
  Add your content here!
</ion-content>

```

<!-- Auto Generated Below -->


## Properties

#### forceOverscroll

boolean

If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
If the content exceeds the bounds of ionContent, nothing will change.
Note, the does not disable the system bounce on iOS. That is an OS level setting.


#### fullscreen

boolean

If true, the content will scroll behind the headers
and footers. This effect can easily be seen by setting the toolbar
to transparent.


#### scrollEnabled

boolean


#### scrollEvents

boolean


## Attributes

#### force-overscroll

boolean

If true and the content does not cause an overflow scroll, the scroll interaction will cause a bounce.
If the content exceeds the bounds of ionContent, nothing will change.
Note, the does not disable the system bounce on iOS. That is an OS level setting.


#### fullscreen

boolean

If true, the content will scroll behind the headers
and footers. This effect can easily be seen by setting the toolbar
to transparent.


#### scroll-enabled

boolean


#### scroll-events

boolean


## Methods

#### scrollByPoint()


#### scrollToBottom()

Scroll to the bottom of the content component.

Duration of the scroll animation in milliseconds. Defaults to `300`.
Returns a promise which is resolved when the scroll has completed.


#### scrollToPoint()


#### scrollToTop()

Scroll to the top of the content component.

Duration of the scroll animation in milliseconds. Defaults to `300`.
Returns a promise which is resolved when the scroll has completed.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
