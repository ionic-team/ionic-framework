```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'icon-example',
  styleUrl: 'icon-example.css'
})
export class IconExample {
  render() {
    return [
      // uses "star" icon for both modes
      <ion-icon name="star"></ion-icon>,

      // explicitly set the icon for each mode
      <ion-icon ios="home" md="star"></ion-icon>,

      // use a custom svg icon
      <ion-icon src="/path/to/external/file.svg"></ion-icon>,

      // set the icon size
      <ion-icon size="small" name="heart"></ion-icon>,
      <ion-icon size="large" name="heart"></ion-icon>
    ];
  }
}
```
