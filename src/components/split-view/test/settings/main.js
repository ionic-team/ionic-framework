import {Component, Template, bootstrap} from 'angular2/angular2'
import {SplitView, NavViewport} from 'ionic2/components'
import {SettingsGeneral} from 'app/groups/general'

@Component({
  selector: 'settings-split'
})
@Template({
  inline: `
<ion-split-view view-title="Settings" [default-view]="default">
  Hello, split
</ion-split-view>
  `,
  directives: [SplitView]
})
class SettingsSplit {
  constructor() {
    this.default = SettingsGeneral
  }
}

@Component({
  selector: '[ion-app]'
})
@Template({
  inline: `
<ion-nav-viewport [initial]="initial">
</ion-nav-viewport>
  `,
  directives: [NavViewport]
})
class App {
  constructor() {
    this.initial = SettingsSplit
  }
}

bootstrap(App)
