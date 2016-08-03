import { Component, ViewChild } from '@angular/core';
import { Content, ionicBootstrap } from '../../../../../src';


@Component({
  templateUrl: 'tabs.html'
})
class TabsPage {
  main = E2EPage;
  page1 = Page1;
  page2 = Page2;
  page3 = Page3;
  page4 = Page4;
}


@Component({
  templateUrl: 'page4.html'
})
class Page4 {
  tabsPage = TabsPage;
}


@Component({
  templateUrl: 'page3.html'
})
class Page3 {
  page4 = Page4;
}


@Component({
  templateUrl: 'page2.html'
})
class Page2 {
  page3 = Page3;
}


@Component({
  templateUrl: 'page1.html'
})
class Page1 {
  page2 = Page2;
}


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
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
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);
