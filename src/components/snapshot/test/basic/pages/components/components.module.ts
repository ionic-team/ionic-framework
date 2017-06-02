import {NgModule} from '@angular/core';
import {IonicPageModule} from '../../../../../../';

import {ComponentsPage} from './components';

import {AppModule as ActionSheetBasic} from '../../../../../action-sheet/test/basic/app/app.module';

import {AppModule as AlertBasic} from '../../../../../alert/test/basic/app/app.module';
import {AppModule as AlertDismiss} from '../../../../../alert/test/dismiss/app.module';

@NgModule({
  declarations: [
    ComponentsPage
  ],
  imports: [
    IonicPageModule.forChild(ComponentsPage),

    ActionSheetBasic,

    AlertBasic,
    AlertDismiss
  ],
  entryComponents: [
    ComponentsPage
  ]
})
export class ComponentsModule {
}
