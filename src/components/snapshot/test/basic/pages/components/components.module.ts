import {NgModule} from '@angular/core';
import {IonicPageModule} from '../../../../../../';

import {ComponentsPage} from './components';

import {AppModule as ActionSheetBasic} from '../../../../../action-sheet/test/basic/app/app.module';

import {AppModule as AlertBasic} from '../../../../../alert/test/basic/app/app.module';
import {AppModule as AlertDismiss} from '../../../../../alert/test/dismiss/app.module';

import {AppModule as AppAnimations} from '../../../../../app/test/animations/app.module';
import {AppModule as AppCordova} from '../../../../../app/test/cordova/app/app.module';
import {AppModule as AppGestureCollision} from '../../../../../app/test/gesture-collision/app/app.module';
import {AppModule as AppGestures} from '../../../../../app/test/gestures/app.module';
import {AppModule as AppTypography} from '../../../../../app/test/typography/app/app.module';
import {AppModule as AppUtilities} from '../../../../../app/test/utilities/app/app.module';

@NgModule({
  declarations: [
    ComponentsPage
  ],
  imports: [
    IonicPageModule.forChild(ComponentsPage),

    ActionSheetBasic,

    AlertBasic,
    AlertDismiss,

    AppAnimations,
    AppCordova,
    AppGestureCollision,
    AppGestures,
    AppTypography,
    AppUtilities
  ],
  entryComponents: [
    ComponentsPage
  ]
})
export class ComponentsModule {
}
