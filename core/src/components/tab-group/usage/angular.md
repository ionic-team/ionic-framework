```html
<ion-tabs>
  <ion-tab label="Schedule" icon="calendar" href="/app/tabs/(schedule:schedule)">
    <ion-router-outlet stack name="schedule"></ion-router-outlet>
  </ion-tab>
  <ion-tab label="Speakers" icon="contacts" href="/app/tabs/(speakers:speakers)">
    <ion-router-outlet stack name="speakers"></ion-router-outlet>
  </ion-tab>
  <ion-tab label="Map" icon="map" href="/app/tabs/(map:map)">
    <ion-router-outlet stack name="map"></ion-router-outlet>
  </ion-tab>
  <ion-tab label="About" icon="information-circle" href="/app/tabs/(about:about)">
    <ion-router-outlet stack name="about"></ion-router-outlet>
  </ion-tab>
</ion-tabs>
```
