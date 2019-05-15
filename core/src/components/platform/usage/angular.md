```typescript
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'platform-example',
  templateUrl: 'platform-example.html',
  styleUrls: ['./platform-example.css']
})
export class PlatformExample {
  constructor(public plt: Platform) {
    if (this.plt.is('ios')) {
      // This will only print when on iOS
      console.log('I am an iOS device!');
    }
  }
}
```
