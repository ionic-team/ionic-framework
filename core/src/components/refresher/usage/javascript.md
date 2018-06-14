```html
<ion-content>
  <ion-refresher slot="fixed">
    <ion-refresher-content>
    </ion-refresher-content>
  </ion-refresher>
</ion-content>

<!-- or for custom content -->

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
