import {Component, View} from 'angular2/angular2'
import {View, NavPane} from 'ionic/components'

@Component({ selector: 'privacy-settings' })
@View({
  template: `
<ion-view nav-title="Privacy">
  Privacy
<button class="button button-primary" (click)="next()">
  Next
</button>
</ion-view>`,
  directives: [View]
})
export class PrivacyPage {
  constructor(navPane: NavPane) {
    this.navPane = navPane
  }
  next() {
    this.navPane.push(PrivacyP1)
  }
}

@Component({ selector: 'privp1' })
@View({
  template: `
<ion-view nav-title="Privacy Page 1">
This is page 1
<br/>
<button class="button button-primary" (click)="next()">
  Next
</button>
<br/>
<button class="button" (click)="pop()">
  Back
</button>
</ion-view>
`,
  directives: [View]
})
class PrivacyP1 {
  constructor(navPane: NavPane) {
    this.navPane = navPane
  }
  next() {
    this.navPane.push(PrivacyP2)
  }
  pop() {
    this.navPane.pop()
  }
}

@Component({ selector: 'privp2' })
@View({
  template: `
<ion-view nav-title="Privacy Page 2">
Page 2 here
<br/>
<button class="button" (click)="pop()">
  Back
</button>
<br/>
</ion-view>
`,
  directives: [View]
})
class PrivacyP2 {
  constructor(navPane: NavPane) {
    this.navPane = navPane
  }
  pop() {
    this.navPane.pop()
  }
}
