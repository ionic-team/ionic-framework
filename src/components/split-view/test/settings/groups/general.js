import {Component, Template} from 'angular2/angular2'
import {View} from 'ionic2/components'

@Component({
  selector: 'settings-general'
})
@Template({
  inline: `
<ion-view nav-title="General Stuff">
  General Settings
</ion-view>
  `,
  directives: [View]
})
export class GeneralPage {
}
