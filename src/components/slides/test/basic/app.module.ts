import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {

  onSlideWillChange(s: any) {
    console.log(`onSlideWillChange: ${s}`);
  }

  onSlideDidChange(s: any) {
    console.log(`onSlideDidChange: ${s}`);
  }

  onSlideDrag(s: any) {
    console.log(`onSlideDrag: ${s}`);
  }

}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class AppComponent {
  root = E2EPage;
}

@NgModule({
  declarations: [
    AppComponent,
    E2EPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    E2EPage
  ]
})
export class AppModule {}
