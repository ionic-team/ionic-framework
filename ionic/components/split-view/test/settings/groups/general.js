import {Component, View} from 'angular2/angular2'
import {View} from 'ionic/components'

@Component({
  selector: 'settings-general'
})
@View({
  template: `
<ion-view nav-title="General Stuff">
  General Settings
</ion-view>
  `,
  directives: [View]
})
export class GeneralPage {
}
