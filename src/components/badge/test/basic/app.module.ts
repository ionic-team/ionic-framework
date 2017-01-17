import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Config } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  dynamicColor = 'primary';
  dynamicMode: string;

  constructor(config: Config) {
    this.dynamicMode = config.get('mode');
  }

  toggleColor() {
    if (this.dynamicColor === 'primary') {
      this.dynamicColor = 'secondary';
    } else if (this.dynamicColor === 'secondary') {
      this.dynamicColor = 'danger';
    } else {
      this.dynamicColor = 'primary';
    }
  }

  toggleMode() {
    if (this.dynamicMode === 'ios') {
      this.dynamicMode = 'md';
    } else if (this.dynamicMode === 'md') {
      this.dynamicMode = 'wp';
    } else {
      this.dynamicMode = 'ios';
    }
  }

  toggleBoth() {
    this.toggleColor();
    this.toggleMode();
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
