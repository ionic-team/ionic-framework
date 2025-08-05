import { Component } from "@angular/core";
import { IonItem, IonLabel, IonReorder, IonReorderGroup } from '@ionic/angular/standalone';
import { ReorderEndCustomEvent } from "@ionic/angular";

@Component({
  selector: 'app-reorder-group',
  template: `
    <ion-reorder-group disabled="false" (ionReorderEnd)="onReorderEnd($event)">
      <ion-item>
        <ion-reorder slot="end"></ion-reorder>
        <ion-label>Item 1</ion-label>
      </ion-item>
      <ion-item>
        <ion-reorder slot="end"></ion-reorder>
        <ion-label>Item 2</ion-label>
      </ion-item>
      <ion-item>
        <ion-reorder slot="end"></ion-reorder>
        <ion-label>Item 3</ion-label>
      </ion-item>
    </ion-reorder-group>
  `,
  standalone: true,
  imports: [IonItem, IonLabel, IonReorder, IonReorderGroup]
})
export class ReorderGroupComponent {
  onReorderEnd(event: ReorderEndCustomEvent) {
    if (event.detail.from !== event.detail.to) {
      console.log('ionReorderEnd: Dragged from index', event.detail.from, 'to', event.detail.to);
    } else {
      console.log('ionReorderEnd: No position change occurred');
    }

    event.detail.complete();
  }
}
