import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class MyPage {
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
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
