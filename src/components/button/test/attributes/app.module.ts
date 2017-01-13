import { NgModule, Component } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  isFull: boolean = true;
  isBlock: boolean = true;
  isBarClear: boolean = true;

  // Styles
  isSolid: boolean = true;
  isOutline: boolean = true;
  isClear: boolean = true;

  // Colors
  isSecondary: string = 'secondary';
  isDanger: string = 'danger';
  isDark: string = 'dark';

  toggleBlock() {
    this.isFull = !this.isFull;
    this.isBlock = !this.isBlock;
  }

  // Toggles solid, outline, and clear buttons
  toggleStyles() {
    this.isSolid = !this.isSolid;
    this.isOutline = !this.isOutline;
    this.isClear = !this.isClear;
  }

  // Toggles the colors on the buttons (secondary, danger, dark)
  toggleColors() {
    this.isSecondary = (this.isSecondary === 'secondary' ? '' : 'secondary');
    this.isDanger = (this.isDanger === 'danger' ? '' : 'danger');
    this.isDark = (this.isDark === 'dark' ? '' : 'dark');
  }

  toggleBarClear() {
    this.isBarClear = !this.isBarClear;
  }

  removeColors() {
    this.isSecondary = null;
    this.isDanger = null;
    this.isDark = null;
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
