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
