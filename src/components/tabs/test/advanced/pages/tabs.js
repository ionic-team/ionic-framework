import {Component, Template, Parent} from 'angular2/angular2'
import {View, Tabs, Tab, Aside} from 'ionic2/components'
import {NavView} from 'ionic2/components'

@Component({
  selector: 'tabs-page'
})
@Template({
  url: 'pages/tabs.html',
  directives: [Tabs, Tab]
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
  inline: '<ion-view nav-title="Tab 1 Page 1">Tab 1 Page 1.<br/><br/><button (click)="next()">Next</button></ion-view>',
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
  inline: '<ion-view nav-title="Tab 1 Page 2">Tab 1<br/>Page 2.<br/></br><button (click)="pop()">Pop</button></ion-view>',
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
    <ion-aside side="left" [content]="view">Hello, I'm a deeper aside.</ion-aside>
    <ion-view nav-title="Tab 2 Page 1" #view>
      <br/><br/>Tab 2 Page 1.
      <button (click)="next()">Next</button>
      <br/><span style="color:red">I've got an aside on the left.</span>
    </ion-view>
  `,
  directives: [View, Aside]
})
class Tab2Page1 {
  constructor(navView: NavView) {
    this.navView = navView
  }
  next() {
    this.navView.push(Tab1Page2)
  }
}

@Component({ selector: 't2p2' })
@Template({
  inline: '<ion-view nav-title="Tab 2 Page 2"><br/><br/>Tab 2<br/>Page 2. <button (click)="pop()">Pop</button></ion-view>',
  directives: [View]
})
class Tab2Page2 {
  constructor(navView: NavView) {
    this.navView = navView
  }
  pop() { this.navView.pop() }
}
