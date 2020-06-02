```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'backdrop-example',
  styleUrl: 'backdrop-example.css'
})
export class BackdropExample {
  render() {
    const enableBackdropDismiss = false;
    const showBackdrop = false;
    const shouldPropagate = false;

    return [
      // Default backdrop
      <ion-backdrop></ion-backdrop>,

      // Backdrop that is not tappable
      <ion-backdrop tappable={false}></ion-backdrop>,

      // Backdrop that is not visible
      <ion-backdrop visible={false}></ion-backdrop>,

      // Backdrop with propagation
      <ion-backdrop stopPropagation={false}></ion-backdrop>,

      // Backdrop that sets dynamic properties
      <ion-backdrop
        tappable={enableBackdropDismiss}
        visible={showBackdrop}
        stopPropagation={shouldPropagate}>
      </ion-backdrop>
    ];
  }
}
```