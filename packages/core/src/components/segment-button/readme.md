# ion-segment-button

Segment buttons are a group of related buttons inside of a [Segment](../../segment/Segment). They are displayed in a horizontal row. Only one segment button can be selected at a time.

```html
<ion-content>
  <!-- Segment buttons with icons -->
  <ion-segment>
    <ion-segment-button value="camera">
      <ion-icon name="camera"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="bookmark">
      <ion-icon name="bookmark"></ion-icon>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment buttons with text -->
  <ion-segment>
    <ion-segment-button value="friends">
      Friends
    </ion-segment-button>
    <ion-segment-button value="enemies">
      Enemies
    </ion-segment-button>
  </ion-segment>
</ion-content>
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
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.


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
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.


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

*Built by [StencilJS](https://stenciljs.com/)*
