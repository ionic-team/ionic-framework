import {ViewEncapsulation} from 'angular2/core';
import {App, Page, Picker, NavController} from 'ionic-angular';


@Page({
  templateUrl: 'main.html',
  encapsulation: ViewEncapsulation.None,
})
class E2EPage {
  smoothie: string;
  timer: string;

  constructor(private nav: NavController) {}

  twoColumns() {
    let picker = Picker.create({
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Done',
          handler: (data) => {
            this.smoothie = `${data.flavor1} ${data.flavor2}`;
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

    this.nav.present(picker);
  }

  prefixLabel() {
    let picker = Picker.create({
      buttons: [
        {
          text: 'Nerp',
          role: 'cancel'
        },
        {
          text: 'Woot!',
          handler: (data) => {
            this.smoothie = `${data.flavor1}`;
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

    this.nav.present(picker);
  }

  suffixLabel() {
    let picker = Picker.create({
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Si',
          handler: (data) => {
            this.smoothie = `${data.flavor1}`;
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

    this.nav.present(picker);
  }

  columnSizes() {
    let picker = Picker.create();

    picker.addButton({
      text: 'Cancel',
      role: 'cancel'
    });

    picker.addButton({
      text: 'Set Timer',
      handler: (data) => {
        this.timer = `${data.hour}:${data.min}`;
      }
    });

    picker.addColumn({
      name: 'hour',
      suffix: 'hour',
      columnWidth: '30%',
      optionsWidth: '50px',
      options: Array.apply(null, {length: 23}).map(Number.call, Number)
    });

    var minuteOptions = [];

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

    this.nav.present(picker);
  }
}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root;
  constructor() {
    this.root = E2EPage;
  }
}
