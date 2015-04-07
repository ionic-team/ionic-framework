import {Component, Template} from 'angular2/angular2'
import {View} from 'ionic2/components'

@Component({
  selector: 'settings-general'
})
@Template({
  inline: `
<ion-view view-title="General">
  General Settings
</ion-view>
  `,
  directives: [View]
})
export class SettingsGeneral {
}
