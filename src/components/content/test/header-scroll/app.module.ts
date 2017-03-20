import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, ScrollEvent } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {

  onScroll(ev: ScrollEvent) {
    ev.domWrite(() => {
      // DOM writes must go within domWrite()
      // to prevent any layout thrashing
      ev.headerElement.style.transform = `translateY(${-ev.scrollTop}px)`;
    });
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
    E2EPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    E2EPage,
  ]
})
export class AppModule {}
