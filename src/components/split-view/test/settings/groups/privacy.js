import {Component, Template} from 'angular2/angular2'
import {View, NavView} from 'ionic2/components'

@Component({ selector: 'privacy-settings' })
@Template({
  inline: `
<ion-view nav-title="Privacy">
  Privacy
<button class="button button-primary" (click)="next()">
  Next
</button>
</ion-view>`,
  directives: [View]
})
export class SettingsPrivacy {
  constructor(navView: NavView) {
    this.navView = navView
  }
  next() {
    this.navView.push(PrivacyP1)
  }
}

@Component({ selector: 'privp1' })
@Template({
  inline: `
<ion-view view-title="Privacy Page 1">
This is page 1
<button class="button button-primary" (click)="next()">
  Next
</button>
<button class="button" (click)="pop()">
  Back
</button>
</ion-view>
`,
  directives: [View]
})
class PrivacyP1 {
  constructor(navView: NavView) {
    this.navView = navView
  }
  next() {
    this.navView.push(PrivacyP2)
  }
  pop() {
    this.navView.pop()
  }
}

@Component({ selector: 'privp2' })
@Template({
  inline: `
<ion-view view-title="Privacy Page 2">
Page 2 here
<button class="button" (click)="pop()">
  Back
</button>
</ion-view>
`,
  directives: [View]
})
class PrivacyP2 {
  constructor(navView: NavView) {
    this.navView = navView
  }
  pop() {
    this.navView.pop()
  }
}
