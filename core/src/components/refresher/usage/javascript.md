```html
<!-- Default Refresher -->
<ion-content>
  <ion-refresher slot="fixed">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
</ion-content>

<!-- Custom Refresher Properties -->
<ion-content>
  <ion-refresher slot="fixed" pull-factor="0.5" pull-min="100" pull-max="200">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
</ion-content>

<!-- Custom Refresher Content -->
<ion-content>
  <ion-refresher slot="fixed">
    <ion-refresher-content
      pulling-icon="arrow-dropdown"
      pulling-text="Pull to refresh"
      refreshing-spinner="circles"
      refreshing-text="Refreshing...">
    </ion-refresher-content>
  </ion-refresher>
</ion-content>
```
