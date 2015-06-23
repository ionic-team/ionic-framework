import {Component} from 'angular2/src/core/annotations_impl/annotations';

import {IonicView, NavController} from 'ionic/ionic';


@Component({selector: 'ion-view'})
@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Sign In</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to tabs</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class SignIn {
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
@IonicView({
  templateUrl: './pages/tabs.html'
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
@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 1</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to Tab 1, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
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
@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 2</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to Tab 1, Page 3</button></p>' +
      '<p><button primary (click)="nav.pop()">Back to Tab 1, Page 1</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
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
@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 1 Page 3</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="nav.pop()">Back to Tab 1, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
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
@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 1</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to Tab 2, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
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
@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 2</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="push()">Go to Tab 2, Page 3</button></p>' +
      '<p><button primary (click)="nav.pop()">Back to Tab 2, Page 1</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
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
@IonicView({
  template: '' +
    '<ion-navbar *navbar>' +
      '<ion-title>Tabs 2 Page 3</ion-title>' +
    '</ion-navbar>' +
    '<ion-content class="padding">' +
      '<p><button primary (click)="nav.pop()">Back to Tab 2, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>'
})
class Tab2Page3 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}


@Component({
  selector: 'ion-app'
})
@IonicView({
  template: '<ion-nav [root]="rootView"></ion-nav>'
})
class IonicApp {
  constructor() {
    this.rootView = SignIn;
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
