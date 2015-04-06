import {Component, Template, Parent} from 'angular2/angular2'
import {View, Tabs, Tab} from 'ionic2/components'
import {NavViewport} from 'ionic2/components'

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
  constructor(@Parent() tab: Tab) {
    this.tab = tab
  }
  next() {
    this.tab.push(Tab1Page2)
  }
}

@Component({ selector: 't1p2' })
@Template({
  inline: '<ion-view nav-title="Tab 1 Page 2">Tab 1<br/>Page 2.<br/></br><button (click)="pop()">Pop</button></ion-view>',
  directives: [View]
})
class Tab1Page2 {
  constructor(@Parent() tab: Tab) { this.tab = tab }
  pop() { this.tab.pop() }
}


//
// tab 2
//
@Component({ selector: 't2p1' })
@Template({
  inline: '<ion-view nav-title="Tab 2 Page 1"><br/><br/>Tab 2 Page 1. <button (click)="next()">Next</button></ion-view>',
  directives: [View]
})
class Tab2Page1 {
  constructor(@Parent() tab: Tab) {
    this.tab = tab
  }
  next() {
    this.tab.push(Tab2Page2)
  }
}

@Component({ selector: 't2p2' })
@Template({
  inline: '<ion-view nav-title="Tab 2 Page 2"><br/><br/>Tab 2<br/>Page 2. <button (click)="pop()">Pop</button></ion-view>',
  directives: [View]
})
class Tab2Page2 {
  constructor(@Parent() tab: Tab) { this.tab = tab }
  pop() { this.tab.pop() }
}
