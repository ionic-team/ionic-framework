import { Component, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  template: `
    <ion-content padding text-center>
      Page be loaded!
    </ion-content>
  `
})
export class AsyncPage {}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class AppComponent {
  root: AsyncPage;

  constructor() {
    setTimeout(() => {
      this.root = AsyncPage;
    }, 1000);

  }
}

@NgModule({
  declarations: [
    AppComponent,
    AsyncPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    AsyncPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
