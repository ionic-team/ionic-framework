import { Component, ViewEncapsulation, NgModule } from '@angular/core';
import { IonicApp, IonicModule, PickerController } from '../../../..';


@Component({
  templateUrl: 'main.html',
  encapsulation: ViewEncapsulation.None,
})
export class E2EPage {
  smoothie: string;
  timer: string;

  constructor(private pickerCtrl: PickerController) {}

  twoColumns() {
    let picker = this.pickerCtrl.create({
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Done',
          handler: (data: any) => {
            this.smoothie = `${data.flavor1.value} ${data.flavor2.value}`;
          }
        }
      ],
      columns: [
        {
          name: 'flavor1',
          align: 'right',
          options: [
            { text: 'Mango' },
            { text: 'Banana' },
            { text: 'Cherry' },
            { text: 'Strawberry' },
            { text: 'Raspberry' },
            { text: 'Blueberry' },
            { text: 'Peach' },
            { text: 'Coconut' },
            { text: 'Pineapple' },
            { text: 'Honeydew' },
            { text: 'Watermelon' },
            { text: 'Grape' },
            { text: 'Avocado' },
            { text: 'Kiwi' },
            { text: 'Orange' },
            { text: 'Papaya' },
          ]
        },
        {
          name: 'flavor2',
          align: 'left',
          options: [
            { text: 'Banana' },
            { text: 'Orange' },
            { text: 'Grape' },
            { text: 'Watermelon' },
            { text: 'Strawberry' },
            { text: 'Papaya' },
            { text: 'Kiwi' },
            { text: 'Cherry' },
            { text: 'Raspberry' },
            { text: 'Mango' },
            { text: 'Pineapple' },
            { text: 'Peach' },
            { text: 'Avocado' },
            { text: 'Honeydew' },
            { text: 'Blueberry' },
            { text: 'Coconut' },
          ]
        },
      ]
    });

    picker.present();
  }

  prefixLabel() {
    let picker = this.pickerCtrl.create({
      buttons: [
        {
          text: 'Nerp',
          role: 'cancel'
        },
        {
          text: 'Woot!',
          handler: (data: any) => {
            this.smoothie = `${data.flavor1.value}`;
          }
        }
      ],
      columns: [
        {
          name: 'flavor1',
          align: 'left',
          prefix: 'Flavor',
          options: [
            { text: 'Mango' },
            { text: 'Banana' },
            { text: 'Cherry' },
            { text: 'Strawberry' },
            { text: 'Raspberry' },
            { text: 'Blueberry' },
            { text: 'Peach' },
            { text: 'Coconut' },
            { text: 'Pineapple' },
            { text: 'Honeydew' },
            { text: 'Watermelon' },
            { text: 'Grape' },
            { text: 'Avocado' },
            { text: 'Kiwi' },
            { text: 'Orange' },
            { text: 'Papaya' },
          ]
        }
      ]
    });

    picker.present();
  }

  suffixLabel() {
    let picker = this.pickerCtrl.create({
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Si',
          handler: (data: any) => {
            this.smoothie = `${data.flavor1.value}`;
          }
        }
      ],
      columns: [
        {
          name: 'flavor1',
          align: 'right',
          suffix: 'flavor',
          options: [
            { text: 'Mango' },
            { text: 'Banana' },
            { text: 'Cherry' },
            { text: 'Strawberry' },
            { text: 'Raspberry' },
            { text: 'Blueberry' },
            { text: 'Peach' },
            { text: 'Coconut' },
            { text: 'Pineapple' },
            { text: 'Honeydew' },
            { text: 'Watermelon' },
            { text: 'Grape' },
            { text: 'Avocado' },
            { text: 'Kiwi' },
            { text: 'Orange' },
            { text: 'Papaya' },
          ]
        }
      ]
    });

    picker.present();
  }

  columnSizes() {
    let picker = this.pickerCtrl.create();

    picker.addButton({
      text: 'Cancel',
      role: 'cancel'
    });

    picker.addButton({
      text: 'Set Timer',
      handler: (data: any) => {
        this.timer = `${data.hour.value}:${data.min.value}`;
      }
    });

    picker.addColumn({
      name: 'hour',
      suffix: 'hour',
      columnWidth: '30%',
      optionsWidth: '50px',
      options: Array.apply(null, {length: 23}).map(Number.call, Number)
    });

    let minuteOptions: any[] = [];

    for (var i = 0; i < 60; i++) {
      minuteOptions.push({
        text: i,
        value: ('0' + i).slice(-2)
      });
    }

    picker.addColumn({
      name: 'min',
      suffix: 'min',
      columnWidth: '40%',
      optionsWidth: '80px',
      options: minuteOptions
    });

    picker.present();
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
