```html
<ion-tabs>

  <ion-tab tab="tab-schedule">
    <ion-nav></ion-nav>
  </ion-tab>

  <ion-tab tab="tab-speaker">
    <ion-nav></ion-nav>
  </ion-tab>

  <ion-tab tab="tab-map" component="page-map">
    <ion-nav></ion-nav>
  </ion-tab>

  <ion-tab tab="tab-about" component="page-about">
    <ion-nav></ion-nav>
  </ion-tab>

  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="tab-schedule">
      <ion-icon name="calendar"></ion-icon>
      <ion-label>Schedule</ion-label>
      <ion-badge>6</ion-badge>
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


## Activating Tabs

Each `ion-tab-button` will activate one of the tabs when pressed. In order to link the `ion-tab-button` to the `ion-tab` container, a matching `tab` property should be set on each component.

```html
<ion-tab tab="settings">
  ...
</ion-tab>

<ion-tab-button tab="settings">
  ...
</ion-tab-button>
```

The `ion-tab-button` and `ion-tab` above are linked by the common `tab` property.

The `tab` property identifies each tab, and it has to be unique within the `ion-tabs`. It's important to always set the `tab` property on the `ion-tab` and `ion-tab-button`, even if one component is not used.


### Router integration

When used with Ionic's router (`ion-router`) the `tab` property of the `ion-tab` matches the `component` property of an `ion-route`.

The following route within the scope of an `ion-tabs` outlet:

```html
<ion-route url="/settings-page" component="settings"></ion-route>
```

will match the following tab:

```html
<ion-tab tab="settings" component="settings-component"></ion-tab>
```