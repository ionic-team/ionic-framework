import {Component} from '@angular/core';
import {IonicPage} from '../../../../../../';

import {AppComponent as ActionSheetBasic} from '../../../../../action-sheet/test/basic/app/app.component';

import {AppComponent as AlertBasic} from '../../../../../alert/test/basic/app/app.component';
import {AppComponent as AlertDismiss} from '../../../../../alert/test/dismiss/app.module';

import {AppComponent as AppAnimations} from '../../../../../app/test/animations/app.module';
import {AppComponent as AppCordova} from '../../../../../app/test/cordova/app/app.component';
import {AppComponent as AppGestureCollision} from '../../../../../app/test/gesture-collision/app/app.component';
import {AppComponent as AppGestures} from '../../../../../app/test/gestures/app.module';
import {AppComponent as AppTypography} from '../../../../../app/test/typography/app/app.component';
import {AppComponent as AppUtilities} from '../../../../../app/test/utilities/app/app.component';

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
    }, {
      name: 'App',
      components: [
        {name: 'animations', component: AppAnimations},
        {name: 'cordova', component: AppCordova},
        {name: 'gesture-collision', component: AppGestureCollision},
        {name: 'gestures', component: AppGestures},
        {name: 'typography', component: AppTypography},
        {name: 'utilities', component: AppUtilities},
      ]
    }
  ];

  constructor() {
  }
}
