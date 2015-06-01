import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Tabs, Tab, NavController, NavbarTemplate, Navbar, Content} from 'ionic/ionic';


@Component({
  selector: 'tabs-page'
})
@View({
  templateUrl: './pages/tabs.html',
  directives: [Tabs, Tab, Content, NavbarTemplate, Navbar]
})

export class TabsPage {
  constructor(nav: NavController) {
    this.tab1Initial = Tab1Page1
    //this.tab2Initial = Tab2Page1
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
      '<p><button class="button" (click)="push()">Go to Tab 1, Page 2</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, Content]
})
export class Tab1Page1 {
  constructor(nav: NavController) {
    this.nav = nav;
    console.log('Tab1Page1 onInit')
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
      '<p><button class="button" (click)="pop()">Back to Tab 1, Page 1</button></p>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
      '<f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>' +
    '</ion-content>',
  directives: [NavbarTemplate, Navbar, Content]
})
export class Tab1Page2 {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  pop() {
    this.nav.push()
  }
}


//
// tab 2
//
@Component({ selector: 't2p1' })
@View({
  template: `
    <ion-content class="padding">
      <p>Tab 2 Page 1.</p>
      <button class="button button-primary" (click)="next()">
        Go to Tab 2 Page 2 (push)
      </button>
      <br/><span style="color:red">I have got an aside on the left.</span>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
    </ion-content>
  `,
  directives: [Content]
})
class Tab2Page1 {
  // TODO change to 'Nav' injection when we're allowed to inject a tab as a nav.
  constructor(nav: NavController) {
    this.nav = nav
  }
  next() {
    this.nav.push(Tab2Page2)
  }
}

@Component({ selector: 't2p2' })
@View({
  template: `
    <ion-tabs #view class="view-cover">
      <ion-tab tab-title="Nested Tab 1">
        <ion-content class="padding">
          Nested Tab 1, static content
          <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
        </ion-content>
      </ion-tab>
      <ion-tab tab-title="Nested Tab 2">
        <ion-content class="padding">
          Nested Tab 2, static content
          <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
        </ion-content>
      </ion-tab>
    </ion-tabs>
  `,
  directives: [Tabs, Tab, Content]
})
class Tab2Page2 {
  // TODO change to 'Nav' injection when we're allowed to inject a tab as a nav.
  constructor(nav: NavController) {
    this.nav = nav
  }
  pop() { this.nav.pop() }
}
