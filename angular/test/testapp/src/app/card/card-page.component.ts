import { Component } from '@angular/core';
import { DomController } from '@ionic/angular';

@Component({
  selector: 'app-card-page',
  template: `
  <ion-app>
    <ion-header>
      <ion-toolbar>
        <ion-title>Card</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Card Header</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          Keep close to Nature's heart... and break clear away, once in awhile,
          and climb a mountain or spend a week in the woods. Wash your spirit clean.
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-item>
          <ion-icon name="pin" slot="start"></ion-icon>
          ion-item in a card, icon left, button right
          <ion-button fill="outline" slot="end">View</ion-button>
        </ion-item>

        <ion-card-content>
          This is content, without any paragraph or header tags,
          within an ion-card-content element.
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-item href="#" class="activated">
          <ion-icon name="wifi" slot="start"></ion-icon>
          Card Link Item 1 .activated
        </ion-item>

        <ion-item href="#">
          <ion-icon name="wine" slot="start"></ion-icon>
          Card Link Item 2
        </ion-item>

        <ion-item class="activated">
          <ion-icon name="warning" slot="start"></ion-icon>
          Card Button Item 1 .activated
        </ion-item>

        <ion-item>
          <ion-icon name="walk" slot="start"></ion-icon>
          Card Button Item 2
        </ion-item>
      </ion-card>
    </ion-content>
</ion-app>
  `
})
export class CardPageComponent {

  constructor(public domCtrl: DomController) {
    this.domControllerTest('constructor');
  }

  ngOnInit() {
    this.domControllerTest('ngOnInit');

    setTimeout(() => {
      this.domControllerTest('setTimeout');
    }, 5000);
  }

  domControllerTest(test: string) {
    this.domCtrl.read(readTimeStamp => {
      console.log('DomController read:', test, readTimeStamp);

      this.domCtrl.write(writeTimeStamp => {
        console.log('DomController write:', test, writeTimeStamp);
      });
    });
  }

  toggleColor() {

  }
}
