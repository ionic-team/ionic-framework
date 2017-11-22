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

#### checked

boolean


#### color

string


#### disabled

boolean


#### mode

any


#### value

string


## Attributes

#### checked

boolean


#### color

string


#### disabled

boolean


#### mode

any


#### value

string


## Events

#### ionClick



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
