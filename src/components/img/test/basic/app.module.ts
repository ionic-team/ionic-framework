import { Component, Input, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../../../ionic-angular';


@Component({
  selector: '<my-img>',
  template: '<ion-img [width]="width" [height]="height" [src]="src"></ion-img>'
})
export class MyImg {
  @Input() width: any;
  @Input() height: any;
  @Input() src: any;
}

@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  images = [
    {
      width: '100',
      height: '44',
      src: '../img/batmobile.jpg'
    },
    {
      width: '100',
      height: '75',
      src: '../img/knight-rider.jpg'
    },
    {
      width: '100',
      height: '68',
      src: '../img/general-lee.jpg'
    }
  ];

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
    MyImg
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
