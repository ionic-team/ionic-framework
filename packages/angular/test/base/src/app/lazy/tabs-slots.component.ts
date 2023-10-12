import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";

/**
 * Test purpose: Validates that the tab bar is relocated to the
 * correct location when the slot attribute changes or is bound
 * to a variable.
 */
@Component({
  selector: 'app-tabs-slots',
  template: `
    <ion-tabs>
      <ion-tab-bar [slot]="slot"></ion-tab-bar>
    </ion-tabs>
    <ion-fab vertical="bottom" horizontal="end">
      <button id="set-slot-top" (click)="setSlot('top')">Slot - top</button>
      <br />
      <button id="set-slot-bottom"(click)="setSlot('bottom')">Slot - bottom</button>
    </ion-fab>
  `,
  imports: [IonicModule],
  standalone: true
})
export class TabsSlotsComponent {

  slot?: string;

  setSlot(newSlot: string) {
    this.slot = newSlot;
  }

}
