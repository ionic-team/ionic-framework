# ion-segment

Segments display a group of related buttons, sometimes known as segmented controls, in a horizontal row. They can be displayed inside of a toolbar or the main content.

Their functionality is similar to tabs, where selecting one will deselect all others. Segments are useful for toggling between different views inside of the content. Tabs should be used instead of a segment when clicking on a control should navigate between pages.

```html
<!-- Default Segment -->
<ion-segment>
  <ion-segment-button value="friends">
    Friends
  </ion-segment-button>
  <ion-segment-button value="enemies">
    Enemies
  </ion-segment-button>
</ion-segment>

<!-- Disabled Segment -->
<ion-segment disabled>
  <ion-segment-button value="sunny" checked>
    Sunny
  </ion-segment-button>
  <ion-segment-button value="rainy">
    Rainy
  </ion-segment-button>
</ion-segment>

<!-- Segment with anchors -->
<ion-segment>
  <ion-segment-button href="#dogs" value="dogs">
    Dogs
  </ion-segment-button>
  <ion-segment-button href="#cats" value="cats">
    Cats
  </ion-segment-button>
</ion-segment>

<!-- Segment with secondary color -->
<ion-segment color="secondary">
  <ion-segment-button value="standard">
    Standard
  </ion-segment-button>
  <ion-segment-button value="hybrid">
    Hybrid
  </ion-segment-button>
  <ion-segment-button value="sat">
    Satellite
  </ion-segment-button>
</ion-segment>

<!-- Segment in a toolbar -->
<ion-toolbar>
  <ion-segment>
    <ion-segment-button value="camera">
      <ion-icon name="camera"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="bookmark">
      <ion-icon name="bookmark"></ion-icon>
    </ion-segment-button>
  </ion-segment>
</ion-toolbar>
```


<!-- Auto Generated Below -->


## Properties

#### color

string

The color to use for the text color.
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.


#### disabled

boolean


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.


#### value

string

the value of the segment.


## Attributes

#### color

string

The color to use for the text color.
Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.


#### disabled

boolean


#### mode



The mode determines which platform styles to use.
Possible values are: `"ios"` or `"md"`.


#### value

string

the value of the segment.


## Events

#### ionChange

Emitted when the value property has changed.



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
