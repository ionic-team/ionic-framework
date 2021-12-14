# ion-tabs

Tabs are a top level navigation component to implement a tab-based navigation.
The component is a container of individual [Tab](../tab/) components.

The `ion-tabs` component does not have any styling and works as a router outlet in order to handle navigation. It does not provide any UI feedback or mechanism to switch between tabs. In order to do so, an `ion-tab-bar` should be provided as a direct child of `ion-tabs`.

Both `ion-tabs` and `ion-tab-bar` can be used as standalone elements. They don’t depend on each other to work, but they are usually used together in order to implement a tab-based navigation that behaves like a native app.

The `ion-tab-bar` needs a slot defined in order to be projected to the right place in an `ion-tabs` component.

## Interfaces

### TabsCustomEvent

While not required, this interface can be used in place of the `CustomEvent` interface for stronger typing with Ionic events emitted from this component.

```typescript
interface TabsCustomEvent extends CustomEvent {
  detail: { tab: string };
  target: HTMLIonTabsElement;
}
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
      <ion-icon name="person-circle"></ion-icon>
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


### Router integration

When used with Angular's router the `tab` property of the `ion-tab-button` should be a reference to the route path.

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

```typescript
import { Routes } from '@angular/router';
import { TabsPage } from './tabs-page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'schedule',
        children: [
          {
            path: '',
            loadChildren: '../schedule/schedule.module#ScheduleModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/schedule',
        pathMatch: 'full'
      }
    ]
  }
];
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
      <ion-icon name="person-circle"></ion-icon>
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


### Activating Tabs

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


### React

```tsx
import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/react';
import { calendar, personCircle, map, informationCircle } from 'ionicons/icons';


export const TabsExample: React.FC = () => (
  <IonTabs>
    <IonTabBar slot="bottom">
      <IonTabButton tab="schedule">
        <IonIcon icon={calendar} />
        <IonLabel>Schedule</IonLabel>
        <IonBadge>6</IonBadge>
      </IonTabButton>

      <IonTabButton tab="speakers">
        <IonIcon icon={personCircle} />
        <IonLabel>Speakers</IonLabel>
      </IonTabButton>

      <IonTabButton tab="map">
        <IonIcon icon={map} />
        <IonLabel>Map</IonLabel>
      </IonTabButton>

      <IonTabButton tab="about">
        <IonIcon icon={informationCircle} />
        <IonLabel>About</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'tabs-example',
  styleUrl: 'tabs-example.css'
})
export class TabsExample {
  render() {
    return [
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
          <ion-icon name="person-circle"></ion-icon>
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
    ];
  }
}
```


### Activating Tabs

Each `ion-tab-button` will activate one of the tabs when pressed. In order to link the `ion-tab-button` to the `ion-tab` container, a matching `tab` property should be set on each component.

```jsx
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

```tsx
<ion-route url="/settings-page" component="settings"></ion-route>
```

will match the following tab:

```tsx
<ion-tab tab="settings" component="settings-component"></ion-tab>
```


### Vue

**Tabs.vue**
```html
<template>
  <ion-page>
    <ion-tabs @ionTabsWillChange="beforeTabChange" @ionTabsDidChange="afterTabChange">
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="schedule" href="/tabs/schedule">
          <ion-icon :icon="calendar"></ion-icon>
          <ion-label>Schedule</ion-label>
          <ion-badge>6</ion-badge>
        </ion-tab-button>
  
        <ion-tab-button tab="speakers" href="/tabs/speakers">
          <ion-icon :icon="personCircle"></ion-icon>
          <ion-label>Speakers</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { 
  IonIcon, 
  IonLabel, 
  IonPage,
  IonTabBar, 
  IonTabButton, 
  IonTabs
} from '@ionic/vue';
import { calendar, personCircle } from 'ionicons/icons';

export default defineComponent({
  components: { IonIcon, IonLabel, IonPage, IonTabBar, IonTabButton, IonTabs },
  setup() {
    const beforeTabChange = () => {
      // do something before tab change
    }
    const afterTabChange = () => {
      // do something after tab change
    }
    return {
      calendar,
      personCircle,
      beforeTabChange,
      afterTabChange
    }
  }
});
</script>
```

**Schedule.vue**
```html
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Schedule</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">Schedule Tab</ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';

export default defineComponent({
  components: { IonContent, IonHeader, IonPage, IonTitle, IonToolbar }
});
</script>
```

**Speakers.vue**
```html
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Speakers</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">Speakers Tab</ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';

export default defineComponent({
  components: { IonContent, IonHeader, IonPage, IonTitle, IonToolbar }
});
</script>
```



## Events

| Event               | Description                                                                | Type                            |
| ------------------- | -------------------------------------------------------------------------- | ------------------------------- |
| `ionTabsDidChange`  | Emitted when the navigation has finished transitioning to a new component. | `CustomEvent<{ tab: string; }>` |
| `ionTabsWillChange` | Emitted when the navigation is about to transition to a new component.     | `CustomEvent<{ tab: string; }>` |


## Methods

### `getSelected() => Promise<string | undefined>`

Get the currently selected tab.

#### Returns

Type: `Promise<string | undefined>`



### `getTab(tab: string | HTMLIonTabElement) => Promise<HTMLIonTabElement | undefined>`

Get a specific tab by the value of its `tab` property or an element reference.

#### Returns

Type: `Promise<HTMLIonTabElement | undefined>`



### `select(tab: string | HTMLIonTabElement) => Promise<boolean>`

Select a tab by the value of its `tab` property or an element reference.

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
