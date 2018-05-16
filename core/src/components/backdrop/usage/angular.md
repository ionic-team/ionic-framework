```html
<!-- Default backdrop -->
<ion-backdrop></ion-backdrop>

<!-- Backdrop that is not tappable -->
<ion-backdrop tappable="false"></ion-backdrop>

<!-- Backdrop that is not visible -->
<ion-backdrop visible="false"></ion-backdrop>

<!-- Backdrop with propagation -->
<ion-backdrop stopPropagation="false"></ion-backdrop>

<!-- Backdrop that sets dynamic properties -->
<ion-backdrop [tappable]="enableBackdropDismiss" [visible]="showBackdrop" [stopPropagation]="shouldPropagate"></ion-backdrop>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'backdrop-example',
  templateUrl: 'backdrop-example.html',
  styleUrls: ['./backdrop-example.css'],
})
export class BackdropExample {
  enableBackdropDismiss = false;
  showBackdrop = false;
  shouldPropagate = false;
}
```
