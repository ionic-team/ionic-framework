import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  people = [
    {'name': 'Burt', 'components': [ 'all the things']},
    {'name': 'Mary', 'components': [ 'checkbox', 'content', 'form']},
    {'name': 'Albert', 'components': [ 'tabs']}
  ];
}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class AppComponent {
  rootPage = E2EPage;
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
