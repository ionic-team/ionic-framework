import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';

@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  homeIcon = 'home';
  isActive = false;
  iconIndex = 0;
  icons = [
    'home',
    'star',
    'ios-alert',
    'ios-alert-outline',
    'md-alert',
    'logo-apple'
  ];
  btnIcon: string;
  dynamicColor: string = 'danger';

  constructor() {
    this.btnIcon = this.icons[0];
  }

  updateIcon() {
    this.iconIndex++;
    if (this.iconIndex >= this.icons.length) {
      this.iconIndex = 0;
    }
    this.btnIcon = this.icons[this.iconIndex];
  }
}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class E2EApp {
  rootPage = E2EPage;
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
    E2EPage
  ]
})
export class AppModule {}
