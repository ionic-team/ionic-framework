```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'list-header-example',
  styleUrl: 'list-header-example.css'
})
export class ListHeaderExample {
  render() {
    return [
      // Default List Header
      <ion-list-header>
        <ion-label>List Header</ion-label>
      </ion-list-header>,

      // List Header with Button
      <ion-list-header>
        <ion-label>New This Week</ion-label>
        <ion-button>See All</ion-button>
      </ion-list-header>,

      // List Header with Outline Button
      <ion-list-header>
        <ion-label>New This Week</ion-label>
        <ion-button fill="outline">See All</ion-button>
      </ion-list-header>,

      // List Header Full Lines
      <ion-list-header lines="full">
        <ion-label>New This Week</ion-label>
        <ion-button>See All</ion-button>
      </ion-list-header>,

      // List Header Inset Lines
      <ion-list-header lines="inset">
        <ion-label>New This Week</ion-label>
        <ion-button>See All</ion-button>
      </ion-list-header>,

      // List Headers in Lists
      <ion-list>
        <ion-list-header lines="inset">
          <ion-label>Recent</ion-label>
          <ion-button>Clear</ion-button>
        </ion-list-header>
        <ion-item lines="none">
          <ion-label color="primary">
            <h1>I got you babe</h1>
          </ion-label>
        </ion-item>
      </ion-list>,

      <ion-list>
        <ion-list-header lines="inset">
          <ion-label>Trending</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label color="primary">
            <h1>harry styles</h1>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label color="primary">
            <h1>christmas</h1>
          </ion-label>
        </ion-item>
        <ion-item lines="none">
          <ion-label color="primary">
            <h1>falling</h1>
          </ion-label>
        </ion-item>
      </ion-list>
    ];
  }
}
```
