import { Component, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, Slides } from '../../../..';


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
export class AppComponent {
  root: any = MyPage;
}

@NgModule({
  declarations: [
    AppComponent,
    MyPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    MyPage
  ]
})
export class AppModule {}
