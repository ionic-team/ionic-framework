```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'fab-list-example',
  styleUrl: 'fab-list-example.css'
})
export class FabListExample {
  render() {
    return [
      <ion-fab vertical="bottom" horizontal="end">
        <ion-fab-button>Share</ion-fab-button>

        <ion-fab-list side="top">
          <ion-fab-button>Facebook</ion-fab-button>
          <ion-fab-button>Twitter</ion-fab-button>
          <ion-fab-button>Youtube</ion-fab-button>
        </ion-fab-list>

        <ion-fab-list side="start">
          <ion-fab-button>Vimeo</ion-fab-button>
        </ion-fab-list>

      </ion-fab>
    ];
  }
}
```