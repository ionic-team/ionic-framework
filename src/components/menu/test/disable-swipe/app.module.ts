import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, MenuController } from '../../../..';


@Component({
  templateUrl: 'page1.html'
})
export class Page1 {
  leftMenuSwipeEnabled: boolean = true;
  rightMenuSwipeEnabled: boolean = false;

  constructor(public menu: MenuController) {}

  toggleLeftMenuSwipeable() {
    this.leftMenuSwipeEnabled = !this.leftMenuSwipeEnabled;

    this.menu.swipeEnable(this.leftMenuSwipeEnabled, 'left');
  }

  toggleRightMenuSwipeable() {
    this.rightMenuSwipeEnabled = !this.rightMenuSwipeEnabled;

    this.menu.swipeEnable(this.rightMenuSwipeEnabled, 'right');
  }
}


@Component({
  templateUrl: 'main.html'
})
export class E2EApp {
  root = Page1;
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
