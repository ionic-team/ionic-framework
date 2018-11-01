```html
<ion-tabs>
  <ion-tab tab="tab-schedule">
    <ion-nav></ion-nav>
  </ion-tab>
  <ion-tab tab="tab-speaker">
    <ion-nav></ion-nav>
  </ion-tab>
  <ion-tab tab="tab-map" component="page-map"></ion-tab>
  <ion-tab tab="tab-about" component="page-about"></ion-tab>

  <ion-tab-bar>
    <ion-tab-button tab="tab-schedule">
      <ion-icon name="calendar"></ion-icon>
      <ion-label>Schedule</ion-label>
    </ion-tab-button>
    <ion-tab-button tab="tab-speaker">
      <ion-icon name="contacts"></ion-icon>
      <ion-label>Speakers</ion-label>
    </ion-tab-button>
    <ion-tab-button tab="tab-map">
      <ion-icon name="map"></ion-icon>
      <ion-label>Map</ion-label>
    </ion-tab-button>
    <ion-tab-button tab="tab-about">
      <ion-icon name="information-circle"></ion-icon>
      <ion-label>About</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```
