import { Component, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, Slides } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  @ViewChild(Slides) slider: Slides;

  onSlideWillChange(s: Slides) {
    console.log(`onSlideWillChange: ${s}`);
  }

  onSlideDidChange(s: Slides) {
    console.log(`onSlideDidChange: ${s}`);
  }

  onSlideDrag(s: Slides) {
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
