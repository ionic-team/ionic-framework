import {Component, View as NgView, Parent} from 'angular2/angular2'
import {View, Tabs, Tab, Aside, Content, NavPane} from 'ionic/ionic'


@Component({
  selector: 'tabs-page'
})
@NgView({
  templateUrl: 'pages/tabs.html',
  directives: [Tabs, Tab, View, Content]
})
export class TabsPage {
  constructor() {
    this.tab1Initial = Tab1Page1
    this.tab2Initial = Tab2Page1
  }
}


//
// tab 1
//
@Component({ selector: 't1p1' })
@NgView({
  template: `<ion-view nav-title="Tab 1 Page 1">
              <ion-content class="padding">
                <p>Tab 1 Page 1.</p>
                <button class="button button-primary" (click)="next()">
                  Go to Tab 1, Page 2 (push)
                </button>
                <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
              </ion-content>
            </ion-view>`,
  directives: [View, Content]
})
class Tab1Page1 {
  constructor(navPane: NavPane) {
    this.navPane = navPane
  }
  next() {
    this.navPane.push(Tab1Page2)
  }
}

@Component({ selector: 't1p2' })
@NgView({
  template: `<ion-view nav-title="Tab 1 Page 2">
              <ion-content class="padding">
                <p>Tab 1 Page 2.</p>
                <button class="button button-primary" (click)="pop()">
                  Back to Tab 1, Page 1 (pop)
                </button>
                <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
              </ion-content>
            </ion-view>`,
  directives: [View, Content]
})
class Tab1Page2 {
  constructor(navPane: NavPane) {
    this.navPane = navPane
  }
  pop() { this.navPane.pop() }
}


//
// tab 2
//
@Component({ selector: 't2p1' })
@NgView({
  template: `
    <ion-aside side="left" [content]="view">
      Left aside for Tab 2 Page 1
    </ion-aside>
    <ion-view nav-title="Tab 2 Page 1" #view>
      <ion-content class="padding">
        <p>Tab 2 Page 1.</p>
        <button class="button button-primary" (click)="next()">
          Go to Tab 2 Page 2 (push)
        </button>
        <br/><span style="color:red">I have got an aside on the left.</span>
        <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      </ion-content>
    </ion-view>
  `,
  directives: [View, Aside, Content]
})
class Tab2Page1 {
  constructor(navPane: NavPane) {
    this.navPane = navPane
  }
  next() {
    this.navPane.push(Tab2Page2)
  }
}

@Component({ selector: 't2p2' })
@NgView({
  template: `
    <ion-aside side="left" [content]="view">
      Left aside for Tab 2 Page 2
    </ion-aside>
    <ion-tabs #view class="view-cover">
      <ion-tab tab-title="Nested Tab 1">
        <ion-view nav-title="Nested Tab 1">
          <ion-content class="padding">
            Nested Tab 1, static content
            <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
          </ion-content>
        </ion-view>
      </ion-tab>
      <ion-tab tab-title="Nested Tab 2">
        <ion-view nav-title="Nested Tab 2">
          <ion-content class="padding">
            Nested Tab 2, static content
            <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
          </ion-content>
        </ion-view>
      </ion-tab>
    </ion-tabs>
  `,
  directives: [View, Aside, Tabs, Tab, Content]
})
class Tab2Page2 {
  constructor(navPane: NavPane) {
    this.navPane = navPane
  }
  pop() { this.navPane.pop() }
}
