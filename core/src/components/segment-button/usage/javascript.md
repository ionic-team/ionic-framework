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

```javascript
// Listen for ionClick on all segment buttons
const segmentButtons = document.querySelectorAll('ion-segment-button')
for (let i = 0; i < segmentButtons.length; i++) {
  segmentButtons[i].addEventListener('ionSelect', (ev) => {
    console.log('Segment button clicked', ev);
  })
}
```