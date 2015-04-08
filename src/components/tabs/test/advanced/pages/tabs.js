import {Component, Template, Parent} from 'angular2/angular2'
import {View, Tabs, Tab, Aside} from 'ionic2/components'
import {NavView} from 'ionic2/components'

@Component({
  selector: 'tabs-page'
})
@Template({
  url: 'pages/tabs.html',
  directives: [Tabs, Tab, View]
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
@Template({
  inline: `<ion-view nav-title="Tab 1 Page 1">
              <ion-content class="padding">
                <p>Tab 1 Page 1.</p>
                <button class="button button-primary" (click)="next()">
                  Go to Tab 1, Page 2 (push)
                </button>
              </ion-content>
            </ion-view>`,
  directives: [View]
})
class Tab1Page1 {
  constructor(navView: NavView) {
    this.navView = navView
  }
  next() {
    this.navView.push(Tab1Page2)
  }
}

@Component({ selector: 't1p2' })
@Template({
  inline: `<ion-view nav-title="Tab 1 Page 2">
              <ion-content class="padding">
                <p>Tab 1 Page 2.</p>
                <button class="button button-primary" (click)="pop()">
                  Back to Tab 1, Page 1 (pop)
                </button>
              </ion-content>
            </ion-view>`,
  directives: [View]
})
class Tab1Page2 {
  constructor(navView: NavView) {
    this.navView = navView
  }
  pop() { this.navView.pop() }
}


//
// tab 2
//
@Component({ selector: 't2p1' })
@Template({
  inline: `
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
      </ion-content>
    </ion-view>
  `,
  directives: [View, Aside]
})
class Tab2Page1 {
  constructor(navView: NavView) {
    this.navView = navView
  }
  next() {
    this.navView.push(Tab2Page2)
  }
}

@Component({ selector: 't2p2' })
@Template({
  inline: `
    <ion-aside side="left" [content]="view">
      Left aside for Tab 2 Page 2
    </ion-aside>
    <ion-tabs #view>
      <ion-tab tab-title="Nested Tab 1">
        <ion-view nav-title="Nested Tab 1">
          <ion-content class="padding">
            Nested Tab 1, static content
          </ion-content>
        </ion-view>
      </ion-tab>
      <ion-tab tab-title="Nested Tab 2">
        <ion-view nav-title="Nested Tab 2">
          <ion-content class="padding">
            Nested Tab 2, static content
          </ion-content>
        </ion-view>
      </ion-tab>
    </ion-tabs>
  `,
  directives: [View, Aside, Tabs, Tab]
})
class Tab2Page2 {
  constructor(navView: NavView) {
    this.navView = navView
  }
  pop() { this.navView.pop() }
}
