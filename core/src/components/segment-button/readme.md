# ion-segment-button

Segment buttons are groups of related buttons inside of a [Segment](../../segment/Segment). They are displayed in a horizontal row. A segment button can be checked by default by adding the `checked` attribute or by setting the `value` of the segment to the `value` of the segment button. Only one segment button should be selected at a time.

```html
<!-- Segment buttons with text -->
<ion-segment>
  <ion-segment-button>
    Friends
  </ion-segment-button>
  <ion-segment-button>
    Enemies
  </ion-segment-button>
</ion-segment>

<!-- Segment buttons with the first checked and the last disabled -->
<ion-segment>
  <ion-segment-button checked>
    Paid
  </ion-segment-button>
  <ion-segment-button>
    Free
  </ion-segment-button>
  <ion-segment-button disabled>
    Top
  </ion-segment-button>
</ion-segment>

<!-- Segment buttons with values and icons -->
<ion-segment>
  <ion-segment-button value="camera">
    <ion-icon name="camera"></ion-icon>
  </ion-segment-button>
  <ion-segment-button value="bookmark">
    <ion-icon name="bookmark"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Segment with a value that checks the last button -->
<ion-segment value="shared">
  <ion-segment-button value="bookmarks">
    Bookmarks
  </ion-segment-button>
  <ion-segment-button value="reading">
    Reading List
  </ion-segment-button>
  <ion-segment-button value="shared">
    Shared Links
  </ion-segment-button>
</ion-segment>
```

<!-- Auto Generated Below -->


## Properties

#### activated

boolean


#### checked

boolean

If true, the segment button is selected. Defaults to `false`.


#### color

string

The color to use for the text color.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.


#### disabled

boolean


#### href

string

Contains a URL or a URL fragment that the hyperlink points to.
If this property is set, an anchor tag will be rendered.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.


#### value

string

The value of the segment button.


## Attributes

#### activated

boolean


#### checked

boolean

If true, the segment button is selected. Defaults to `false`.


#### color

string

The color to use for the text color.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.


#### disabled

boolean


#### href

string

Contains a URL or a URL fragment that the hyperlink points to.
If this property is set, an anchor tag will be rendered.


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.


#### value

string

The value of the segment button.


## Events

#### ionClick

Emitted when the segment button is clicked.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
