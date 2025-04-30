import { Component } from "@angular/core";
import { IonItem, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup } from '@ionic/angular/standalone';

@Component({
  selector: 'app-radio-group',
  template: `
    <ion-list>
      <ion-list-header>
        <ion-label>Static Radio Group</ion-label>
      </ion-list-header>
      <ion-radio-group>
        <ion-item>
          <ion-radio (ionBlur)="onBlur($event)" (ionFocus)="onFocus($event)" value="one">Item 1</ion-radio>
        </ion-item>
        <ion-item>
          <ion-radio (ionBlur)="onBlur($event)" (ionFocus)="onFocus($event)" value="two">Item 2</ion-radio>
        </ion-item>
        <ion-item>
          <ion-radio (ionBlur)="onBlur($event)" (ionFocus)="onFocus($event)" value="three">Item 3</ion-radio>
        </ion-item>
      </ion-radio-group>

      <ion-list-header>
        <ion-label>Dynamic Radio Group</ion-label>
      </ion-list-header>
      <ion-radio-group>
        @for (item of items; track item.value) {
          <ion-item>
            <ion-radio (ionBlur)="onBlur($event)" (ionFocus)="onFocus($event)" [value]="item.value">{{item.text}}</ion-radio>
          </ion-item>
        }
      </ion-radio-group>
    </ion-list>`,
  standalone: true,
  imports: [IonItem, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup]
})
export class RadioGroupComponent {
  items: { text: string; value: string }[] = [];

  ionViewWillEnter() {
    this.items = [
      {
        text: 'Item 1',
        value: 'item-1'
      },
      {
        text: 'Item 2',
        value: 'item-2'
      },
      {
        text: 'Item 3',
        value: 'item-3'
      }
    ];
  }

  onBlur(event: any) {
    console.log('ionBlur', event);
  }

  onFocus(event: any) {
    console.log('ionFocus', event);
  }
}
