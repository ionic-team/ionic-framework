### Inline Popover

```html
<!-- Default -->
<ion-popover [isOpen]="true">
  <ng-template>
    <ion-content>Popover Content</ion-content>
  </ng-template>
</ion-popover>

<!-- No Arrow -->
<ion-popover [isOpen]="true" [arrow]="false">
  <ng-template>
    <ion-content>Popover Content</ion-content>
  </ng-template>
</ion-popover>

<!-- Use a trigger -->
<ion-button id="trigger-button">Click to open popover</ion-button>
<ion-popover trigger="trigger-button">
  <ng-template>
    <ion-content>Popover Content</ion-content>
  </ng-template>
</ion-popover>

<!-- Hover over trigger to open -->
<ion-button id="hover-button">Hover to open popover</ion-button>
<ion-popover trigger="hover-button" triggerAction="hover">
  <ng-template>
    <ion-content>Popover Content</ion-content>
  </ng-template>
</ion-popover>

<!-- Show popover above trigger -->
<ion-button id="side-button">Click to open popover</ion-button>
<ion-popover trigger="side-button" side="top">
  <ng-template>
    <ion-content>Popover Content</ion-content>
  </ng-template>
</ion-popover>

<!-- Align popover to end of trigger -->
<ion-button id="alignment-button">Click to open popover</ion-button>
<ion-popover trigger="alignment-button" side="top" alignment="end">
  <ng-template>
    <ion-content>Popover Content</ion-content>
  </ng-template>
</ion-popover>

<!-- Make popover the same size as the trigger -->
<ion-button id="size-button">Click to open popover</ion-button>
<ion-popover trigger="size-button" size="cover">
  <ng-template>
    <ion-content>Popover Content</ion-content>
  </ng-template>
</ion-popover>

<!-- Make popover show relative to click coordinates rather than trigger -->
<ion-button id="size-button">Click to open popover</ion-button>
<ion-popover trigger="size-button" reference="event">
  <ng-template>
    <ion-content>Popover Content</ion-content>
  </ng-template>
</ion-popover>

<!-- Nested Popover -->
<ion-button id="nested-button">Click to open popover</ion-button>
<ion-popover trigger="nested-button" [dismissOnSelect]="true">
  <ng-template>
    <ion-content>
      <ion-list>
        <ion-item [button]="true" [detail]="false">
          <ion-label>Option 1</ion-label>
        </ion-item>
        <ion-item [button]="true" [detail]="false">
          <ion-label>Option 2</ion-label>
        </ion-item>
        <ion-item [button]="true" [detail]="true" id="nested-trigger">
          <ion-label>Option 3</ion-label>
        </ion-item>
        
        <ion-popover trigger="nested-trigger" [dismissOnSelect]="true" side="end">
          <ng-template>
            <ion-content>
              <ion-item [button]="true">
                <ion-label>Nested Option</ion-label>
              </ion-item>
            </ion-content>
          </ng-template>
        </ion-popover>
      </ion-list>
    </ion-content>
  </ng-template>
</ion-popover>
```

### Popover Controller

```typescript
import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../../component/popover/popover.component';

@Component({
  selector: 'popover-example',
  templateUrl: 'popover-example.html',
  styleUrls: ['./popover-example.css']
})
export class PopoverExample {
  constructor(public popoverController: PopoverController) {}

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();
  
    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
```


### Style Placement

In Angular, the CSS of a specific page is scoped only to elements of that page. Even though the Popover can be presented from within a page, the `ion-popover` element is appended outside of the current page. This means that any custom styles need to go in a global stylesheet file. In an Ionic Angular starter this can be the `src/global.scss` file or you can register a new global style file by [adding to the `styles` build option in `angular.json`](https://angular.io/guide/workspace-config#style-script-config).
