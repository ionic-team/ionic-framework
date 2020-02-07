```typescript
import { Component, OnInit } from '@angular/core';
import { IonDrawer } from '@ionic/angular';

@Component({
  selector: 'drawer-example',
  template: `
    <ion-drawer #pane [options]="drawerOpts" presentDefault="true">
      <h1>Header</h1>
      <div>Content</div> 
    </ion-drawer>
  `
})
export class DrawerExample implements OnInit {
  @ViewChild('pane', {read: IonDrawer, static: false}) drawer: IonDrawer;

  // Optional parameters to pass to the drawer instance. See https://github.com/roman-rr/cupertino-pane/ for valid options.
  public drawerOpts = {
    showDraggable: true,
    breaks: {
      top: { enabled: false, offset: 0 },
      middle: { enabled: true, offset: 0 },
      bottom: { enabled: true, offset: 0 },
    }
  };

  constructor() {}

  hideDrawer() {
    drawer.hide();
  }
}
```
