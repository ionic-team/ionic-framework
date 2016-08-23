import { Component, ViewChild, NgModule } from '@angular/core';
import { IonicApp, IonicModule, App, MenuController, Nav } from '../../../..';


@Component({
  templateUrl: 'page1.html'
})
export class Page1 {
}

@Component({
  templateUrl: 'page2.html'
})
export class Page2 {
}


@Component({
  templateUrl: 'main.html'
})
export class E2EApp {
  @ViewChild(Nav) nav: Nav;

  activeMenu: string;
  page1 = Page1;
  page2 = Page2;
  rootPage = Page1;

  constructor(public app: App, public menuCtrl: MenuController) {
    this.menu1Active();
  }

  openPage(p: any) {
    // Get the <ion-nav> by id
    this.nav.setRoot(p);
  }

  menu1Active() {
    this.menuCtrl.enable(true, 'menu1');
    this.menuCtrl.enable(false, 'menu2');
    this.menuCtrl.enable(false, 'menu3');
  }
  menu2Active() {
    this.menuCtrl.enable(false, 'menu1');
    this.menuCtrl.enable(true, 'menu2');
    this.menuCtrl.enable(false, 'menu3');
  }
  menu3Active() {
    this.menuCtrl.enable(false, 'menu1');
    this.menuCtrl.enable(false, 'menu2');
    this.menuCtrl.enable(true, 'menu3');
  }
}

@NgModule({
  declarations: [
    E2EApp,
    Page1,
    Page2
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    Page1,
    Page2
  ]
})
export class AppModule {}
