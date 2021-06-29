```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'tab-bar-example',
  styleUrl: 'tab-bar-example.css'
})
export class TabBarExample {
  render() {
    return [
      <ion-tabs>
        {/* Tab views */}
        <ion-tab tab="account" component="page-account"></ion-tab>
        <ion-tab tab="contact" component="page-contact"></ion-tab>
        <ion-tab tab="settings" component="page-settings"></ion-tab>

        {/* Tab bar */}
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="account">
            <ion-icon name="person"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="contact">
            <ion-icon name="call"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="settings">
            <ion-icon name="settings"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    ];
  }
}
```
