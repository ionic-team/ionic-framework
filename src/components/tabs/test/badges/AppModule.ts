import { Component, ViewEncapsulation, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../dist';

@Component({template: 'hi'})
export class E2EPage {}


@Component({
  templateUrl: 'main.html',
  styleUrls: ['styles.css'],
  encapsulation: ViewEncapsulation.None
})
export class E2EApp {
  root = E2EPage;
  myBadge: number = 55;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage
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
