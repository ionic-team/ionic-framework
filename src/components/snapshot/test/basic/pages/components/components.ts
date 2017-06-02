import {Component} from '@angular/core';
import {IonicPage} from '../../../../../../';

import {AppComponent as ActionSheetBasic} from '../../../../../action-sheet/test/basic/app/app.component';

import {AppComponent as AlertBasic} from '../../../../../alert/test/basic/app/app.component';
import {AppComponent as AlertDismiss} from '../../../../../alert/test/dismiss/app.module';

export type ComponentItem = { name: string, components: Array<{ name: string, component: Component }> };

@IonicPage()
@Component({
  templateUrl: 'components.html'
})
export class ComponentsPage {

  components: Array<ComponentItem> = [
    {
      name: 'Action Sheet',
      components: [
        {name: 'basic', component: ActionSheetBasic}
      ]
    }, {
      name: 'Alert',
      components: [
        {name: 'basic', component: AlertBasic},
        {name: 'dismiss', component: AlertDismiss},
      ]
    }
  ];

  constructor() {
  }
}
