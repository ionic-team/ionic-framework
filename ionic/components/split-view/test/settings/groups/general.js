import {Component, View as NgView} from 'angular2/angular2'
import {View} from 'ionic/ionic'

@Component({
  selector: 'settings-general'
})
@NgView({
  template: `
<ion-view nav-title="General Stuff">
  General Settings
</ion-view>
  `,
  directives: [View]
})
export class GeneralPage {
}
