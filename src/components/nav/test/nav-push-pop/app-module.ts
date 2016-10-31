import { Component, NgModule } from '@angular/core';

import { IonicApp, IonicModule, NavParams } from '../../../..';



@Component({
  template: `
<ion-header>
  <ion-navbar>
    <ion-title>Second Page</ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding>{{msg}}</ion-content>
`
})
export class SecondPage {
  msg: string = '';
  constructor(params: NavParams) {
    this.msg = params.get('msg');
  }
}



@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  pushPage: any = SecondPage;
  visible: boolean = false;
  buttons: number[] = [1, 2, 3, 4, 5];

  ionViewDidEnter() {
    this.visible = true;
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
    E2EPage,
    SecondPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage,
    SecondPage
  ]
})
export class AppModule {}

