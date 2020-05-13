```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'split-pane-example',
  styleUrl: 'split-pane-example.css'
})
export class SplitPaneExample {
  render() {
    return [
      <ion-split-pane content-id="main">
        {/*  the side menu */}
        <ion-menu content-id="main">
          <ion-header>
            <ion-toolbar>
              <ion-title>Menu</ion-title>
            </ion-toolbar>
          </ion-header>
        </ion-menu>

        {/* the main content */}
        <ion-router-outlet id="main"></ion-router-outlet>
      </ion-split-pane>
    ];
  }
}
```
