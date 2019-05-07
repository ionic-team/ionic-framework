# ion-tabs

Tabs are a top level navigation component to implement a tab-based navigation.
The component is a container of individual [Tab](../tab/) components.

`ion-tabs` is a styleless component that works as a router outlet in order to handle navigation.
This component does not provide any UI feedback or mechanism to switch between tabs.
In order to do so, an `ion-tab-bar` should be provided as a direct child of `ion-tabs`:

```html
<ion-tabs>
  <ion-tab tab="home">Home Content</ion-tab>
  <ion-tab tab="settings">Settings Content</ion-tab>

  <ion-tab-bar slot="bottom">

    <ion-tab-button tab="home">
      <ion-label>Home</ion-label>
      <ion-icon name="home"></ion-icon>
      <ion-badge>6</ion-badge>
    </ion-tab-button>

    <ion-tab-button tab="settings">
      <ion-label>Settings</ion-label>
      <ion-icon name="settings"></ion-icon>
    </ion-tab-button>

  </ion-tab-bar>
</ion-tabs>
```

Note that both `ion-tabs` and `ion-tab-bar` can be used as standalone elements. They don’t depend on each other to work, but they are usually used together in order to implement a tab-based navigation that feels like a native app.

`ion-tab-bar` always needs `slot="bottom"` in order to be projected into `ion-tabs` at the right place.

## The "tab" property

Each `ion-tab-button` will activate one of the tabs when tapped.
In order to link the button to the `ion-tab` container, a matching `tab` property must be used.

```html
<ion-tab tab="settings">
[...]
<ion-tab-button tab="settings">
```

This `ion-tab-button` and `ion-tab` are now linked by the common `tab` property.

The `tab` property identifies each tab, and it has to be unique within the scope of the same `ion-tabs`. It's important to set the same property to `ion-tab` and `ion-tab-button`, even if you are only using one. e.g. You could use the `ion-tab-bar` without using `ion-tabs`. In this case you should still give each `ion-tab` the property of `tab="something"`.

### Router integration

When the ionic's router (`ion-router`) is used, the `tab` property matches the "component" of `ion-route`:

The following route within the scope of a `ion-tabs` outlet:

```html
<ion-route url="/settings-page" component="settings"></ion-route>
```

Would match the following tab:

```html
<ion-tab tab="settings" component="settings-component"></ion-tab>
```

### Angular Router integration

Using tabs with Angular's router is fairly straight forward. Here you only need to define tab which is the reference to the route.

```html

<ion-tabs>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="schedule">
      <ion-icon name="calendar"></ion-icon>
      <ion-label>Schedule</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-tabs>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="schedule">
      <ion-icon name="calendar"></ion-icon>
      <ion-label>Schedule</ion-label>
      <ion-badge>6</ion-badge>
    </ion-tab-button>

    <ion-tab-button tab="speakers">
      <ion-icon name="contacts"></ion-icon>
      <ion-label>Speakers</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="map">
      <ion-icon name="map"></ion-icon>
      <ion-label>Map</ion-label>
    </ion-tab-button>

    <ion-tab-button tab="about">
      <ion-icon name="information-circle"></ion-icon>
      <ion-label>About</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```


### Javascript

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


### React

```tsx
import React from 'react';

import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/react';

const Example: React.SFC<{}> = () => (

  <IonTabs>
    <IonTabBar slot="bottom">
      <IonTabButton tab="schedule">
        <IonIcon name="calendar" />
        <IonLabel>Schedule</IonLabel>
        <IonBadge>6</IonBadge>
      </IonTabButton>

      <IonTabButton tab="speakers">
        <IonIcon name="contacts" />
        <IonLabel>Speakers</IonLabel>
      </IonTabButton>

      <IonTabButton tab="map">
        <IonIcon name="map" />
        <IonLabel>Map</IonLabel>
      </IonTabButton>

      <IonTabButton tab="about">
        <IonIcon name="information-circle" />
        <IonLabel>About</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default Example;
```


### Vue

```html
<template>
  <!-- Listen to before and after tab change events -->
  <ion-tabs @IonTabsWillChange="beforeTabChange" @IonTabsDidChange="afterTabChange">
    <ion-tab tab="schedule">
      <Schedule />
    </ion-tab>

    <!-- Match by "app.speakers" route name -->
    <ion-tab tab="speakers" :routes="'app.speakers'">
      <Speakers />
    </ion-tab>

    <!-- Match by an array of route names -->
    <ion-tab tab="map" :routes="['app.map', 'app.other.route']">
      <Map />
    </ion-tab>

    <!-- Get matched routes with a helper method -->
    <ion-tab tab="about" :routes="getMatchedRoutes">
      <About />
    </ion-tab>

    <!-- Use v-slot:bottom with Vue ^2.6.0 -->
    <template slot="bottom">
      <ion-tab-bar>
        <ion-tab-button tab="schedule">
          <ion-icon name="calendar"></ion-icon>
          <ion-label>Schedule</ion-label>
          <ion-badge>6</ion-badge>
        </ion-tab-button>

        <!-- Provide a custom route to navigate to -->
        <ion-tab-button tab="speakers" :to="{ name: 'app.speakers' }">
          <ion-icon name="contacts"></ion-icon>
          <ion-label>Speakers</ion-label>
        </ion-tab-button>

        <!-- Provide extra data to route -->
        <ion-tab-button tab="map" :to="{ name: 'app.map', params: { mode: 'dark' } }">
          <ion-icon name="map"></ion-icon>
          <ion-label>Map</ion-label>
        </ion-tab-button>

        <!-- Provide custom click handler -->
        <ion-tab-button tab="about" @click="goToAboutTab">
          <ion-icon name="information-circle"></ion-icon>
          <ion-label>About</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </template>
  </ion-tabs>
</template>
```



## Events

| Event               | Description                                                                | Type                         |
| ------------------- | -------------------------------------------------------------------------- | ---------------------------- |
| `ionTabsDidChange`  | Emitted when the navigation has finished transitioning to a new component. | `CustomEvent<{tab: string}>` |
| `ionTabsWillChange` | Emitted when the navigation is about to transition to a new component.     | `CustomEvent<{tab: string}>` |


## Methods

### `getSelected() => Promise<string | undefined>`

Get the currently selected tab.

#### Returns

Type: `Promise<string | undefined>`



### `getTab(tab: string | HTMLIonTabElement) => Promise<HTMLIonTabElement | undefined>`

Get a specific tab by the value of its `tab` property or an element reference.

#### Parameters

| Name  | Type                          | Description                                                                                         |
| ----- | ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `tab` | `HTMLIonTabElement \| string` | The tab instance to select. If passed a string, it should be the value of the tab's `tab` property. |

#### Returns

Type: `Promise<HTMLIonTabElement | undefined>`



### `select(tab: string | HTMLIonTabElement) => Promise<boolean>`

Select a tab by the value of its `tab` property or an element reference.

#### Parameters

| Name  | Type                          | Description                                                                                         |
| ----- | ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `tab` | `HTMLIonTabElement \| string` | The tab instance to select. If passed a string, it should be the value of the tab's `tab` property. |

#### Returns

Type: `Promise<boolean>`




## Slots

| Slot       | Description                                                           |
| ---------- | --------------------------------------------------------------------- |
|            | Content is placed between the named slots if provided without a slot. |
| `"bottom"` | Content is placed at the bottom of the screen.                        |
| `"top"`    | Content is placed at the top of the screen.                           |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
