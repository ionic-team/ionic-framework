# ion-segment-button

The child buttons of the `ion-segment` component. Each `ion-segment-button` must have a value.

```html
<ion-content>
  <!-- Segment buttons with icons -->
  <ion-segment [(ngModel)]="icons" color="secondary">
    <ion-segment-button value="camera">
      <ion-icon name="camera"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="bookmark">
      <ion-icon name="bookmark"></ion-icon>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment buttons with text -->
  <ion-segment [(ngModel)]="relationship" color="primary">
    <ion-segment-button value="friends" (ionSelect)="selectedFriends()">
      Friends
    </ion-segment-button>
    <ion-segment-button value="enemies" (ionSelect)="selectedEnemies()">
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
