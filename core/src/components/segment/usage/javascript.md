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

<!-- Scrollable Segment -->
<ion-segment scrollable>
  <ion-segment-button>
    <ion-icon name="home"></ion-icon>
  </ion-segment-button>
  <ion-segment-button checked>
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="star"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="globe"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="basket"></ion-icon>
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

```javascript
// Listen for ionChange on all segments
const segments = document.querySelectorAll('ion-segment')
for (let i = 0; i < segments.length; i++) {
  segments[i].addEventListener('ionChange', (ev) => {
    console.log('Segment changed', ev);
  })
}
```