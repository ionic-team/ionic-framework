import {
  Component,
  View,
  Parent,
} from 'angular2/angular2';
import {
  Tabs,
  Tab,
  Aside,
  Content,
  NavController,
} from 'ionic/ionic';
import {Toolbar, ToolbarTitle} from 'ionic/components/toolbar/toolbar';

@Component({
  selector: 'tabs-page'
})
@View({
  templateUrl: './pages/tabs.html',
  directives: [Tabs, Tab, Content]
})

export class TabsPage {
  constructor(
    nav: NavController
  ) {
    this.tab1Initial = Tab1Page1
    this.tab2Initial = Tab2Page1
  }
}


//
// tab 1
//
@Component({ selector: 't1p1' })
@View({
  template: `
  <header *ion-toolbar>
    <h1 class="toolbar-title">Tabs 1 Page 1</h1>
  </header>
  <ion-content class="padding">
    <p>Tab 1 Page 1.</p>
    <button class="button button-primary" (click)="next()">
      Go to Tab 1, Page 2 (push)
    </button>
    <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
  </ion-content>`,
  directives: [Content, Toolbar, ToolbarTitle]
})
class Tab1Page1 {
  // TODO change to 'Nav' injection when we're allowed to inject a tab as a nav.
  constructor(nav: NavController) {
    this.nav = nav;
  }
  next() {
    this.nav.push(Tab1Page2)
  }
}

@Component({ selector: 't1p2' })
@View({
  template: `
  <header *ion-toolbar>
    <h1 class="toolbar-title">Tabs 1 Page 2</h1>
  </header>
  <ion-content class="padding">
    <p>Tab 1 Page 2.</p>
    <button class="button button-primary" (click)="pop()">
      Back to Tab 1, Page 1 (pop)
    </button>
    <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
  </ion-content>`,
  directives: [Content]
})
class Tab1Page2 {
  // TODO change to 'Nav' injection when we're allowed to inject a tab as a nav.
  constructor(nav: NavController) {
    this.nav = nav;
  }
  pop() { this.nav.pop(); }
}


//
// tab 2
//
@Component({ selector: 't2p1' })
@View({
  template: `
    <ion-aside side="left" [content]="view">
      Left aside for Tab 2 Page 1
    </ion-aside>
    <ion-content class="padding">
      <p>Tab 2 Page 1.</p>
      <button class="button button-primary" (click)="next()">
        Go to Tab 2 Page 2 (push)
      </button>
      <br/><span style="color:red">I have got an aside on the left.</span>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
    </ion-content>
  `,
  directives: [Aside, Content]
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
    <ion-aside side="left" [content]="view">
      Left aside for Tab 2 Page 2
    </ion-aside>
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
  directives: [Aside, Tabs, Tab, Content]
})
class Tab2Page2 {
  // TODO change to 'Nav' injection when we're allowed to inject a tab as a nav.
  constructor(nav: NavController) {
    this.nav = nav
  }
  pop() { this.nav.pop() }
}
