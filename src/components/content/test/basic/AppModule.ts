import { Component, NgModule, ViewChild } from '@angular/core';
import { IonicApp, IonicModule, Content } from '../../../..';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  main = E2EPage;
  page1 = Page1;
  page2 = Page2;
  page3 = Page3;
  page4 = Page4;
}


@Component({
  templateUrl: 'page4.html'
})
export class Page4 {
  tabsPage = TabsPage;
}


@Component({
  templateUrl: 'page3.html'
})
export class Page3 {
  page4 = Page4;
}


@Component({
  templateUrl: 'page2.html'
})
export class Page2 {
  page3 = Page3;
}


@Component({
  templateUrl: 'page1.html'
})
export class Page1 {
  page2 = Page2;
}


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  @ViewChild(Content) content: Content;
  page1 = Page1;
  showToolbar: boolean = false;

  toggleToolbar() {
    this.showToolbar = !this.showToolbar;
    this.content.resize();
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage,
    TabsPage,
    Page1,
    Page2,
    Page3,
    Page4
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage,
    TabsPage,
    Page1,
    Page2,
    Page3,
    Page4
  ]
})
export class AppModule {}
