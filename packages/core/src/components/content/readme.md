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

#### fullscreen

boolean

If true, the content will scroll behind the headers
and footers. This effect can easily be seen by setting the toolbar
to transparent.


## Attributes

#### fullscreen

boolean

If true, the content will scroll behind the headers
and footers. This effect can easily be seen by setting the toolbar
to transparent.


## Methods

#### scrollToBottom()

Scroll to the bottom of the content component.

Duration of the scroll animation in milliseconds. Defaults to `300`.
Returns a promise which is resolved when the scroll has completed.


#### scrollToTop()

Scroll to the top of the content component.

Duration of the scroll animation in milliseconds. Defaults to `300`.
Returns a promise which is resolved when the scroll has completed.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
