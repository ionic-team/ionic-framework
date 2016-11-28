import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, MenuController } from '../../../..';


@Component({
  templateUrl: 'page1.html'
})
export class Page1 {
  activeMenu: string;

  constructor(private menu: MenuController) {
    this.menu1Active();
  }
  menu1Active() {
    this.activeMenu = 'menu1';
    this.menu.enable(true, 'menu1');
    this.menu.enable(false, 'menu2');
  }
  menu2Active() {
    this.activeMenu = 'menu2';
    this.menu.enable(false, 'menu1');
    this.menu.enable(true, 'menu2');
  }
}


@Component({
  templateUrl: 'main.html'
})
export class E2EApp {
  rootPage = Page1;
}

@NgModule({
  declarations: [
    E2EApp,
    Page1
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    Page1
  ]
})
export class AppModule {}
