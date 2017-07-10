import { Component, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { App, IonicApp, IonicModule, MenuController, Nav } from '../../../..';


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
export class AppComponent {
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
  }
  menu2Active() {
    this.menuCtrl.enable(true, 'menu2');
  }
  menu3Active() {
    this.menuCtrl.enable(true, 'menu3');
  }
}

@NgModule({
  declarations: [
    AppComponent,
    Page1,
    Page2
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    Page1,
    Page2
  ]
})
export class AppModule {}
