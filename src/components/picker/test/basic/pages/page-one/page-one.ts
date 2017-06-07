import { Component, ViewEncapsulation } from '@angular/core';

import { IonicPage, NavController, PickerController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'page-one.html',
  encapsulation: ViewEncapsulation.None,
})
export class PageOne {
  smoothie: string;
  timer: string;

  constructor(
    public navCtrl: NavController,
    private pickerCtrl: PickerController
  ) { }

  push() {
    this.navCtrl.push(PageOne);
  }

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
      optionsWidth: '50px',
      align: 'right',
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
      optionsWidth: '80px',
      align: 'left',
      options: minuteOptions
    });

    picker.present();
  }
}
