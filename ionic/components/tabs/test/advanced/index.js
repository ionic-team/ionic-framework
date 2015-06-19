import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Tabs, Tab, NavController, NavbarTemplate, Navbar, Content} from 'ionic/ionic';


@Component({selector: 'ion-view'})
@View({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Sign In</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to tabs</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, Content]
})
export default class SignInPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(TabsPage);
  }
}


@Component({
  selector: 'ion-tabs-view'
})
@View({
  templateUrl: './pages/tabs.html',
  directives: [Tabs, Tab, Content, NavbarTemplate, Navbar]
})

class TabsPage {
  constructor(nav: NavController) {
    this.tab1Initial = Tab1Page1
    this.tab2Initial = Tab2Page1
  }
}


//
// tab 1
//
@Component({selector: 'ion-view'})
@View({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 1</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to Tab 1, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, Content]
})
class Tab1Page1 {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(Tab1Page2)
  }
}

@Component({selector: 'ion-view'})
@View({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 2</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to Tab 1, Page 3</button></p>' +
      '<p><button primary (click)="nav.pop()">Back to Tab 1, Page 1</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, Content]
})
class Tab1Page2 {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(Tab1Page3)
  }
}

@Component({selector: 'ion-view'})
@View({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 3</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="nav.pop()">Back to Tab 1, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, Content]
})
class Tab1Page3 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}



//
// tab 2
//
@Component({selector: 'ion-view'})
@View({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 1</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to Tab 2, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, Content]
})
class Tab2Page1 {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(Tab2Page2)
  }
}

@Component({selector: 'ion-view'})
@View({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 2</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to Tab 2, Page 3</button></p>' +
      '<p><button primary (click)="nav.pop()">Back to Tab 2, Page 1</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, Content]
})
class Tab2Page2 {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    this.nav.push(Tab2Page3)
  }
}

@Component({selector: 'ion-view'})
@View({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 3</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="nav.pop()">Back to Tab 2, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, Content]
})
class Tab2Page3 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
