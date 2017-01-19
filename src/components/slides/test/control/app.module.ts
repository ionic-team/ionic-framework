import { Component, ViewChild, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Slides } from '../../../../../ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class MyPage {
  @ViewChild('firstSlider') slider1: Slides;
  @ViewChild('secondSlider') slider2: Slides;
}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class E2EApp {
  root: any = MyPage;
}

@NgModule({
  declarations: [
    E2EApp,
    MyPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    MyPage
  ]
})
export class AppModule {}
