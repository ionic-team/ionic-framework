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

import {AppModule as BadgeBasic} from '../../../../../badge/test/basic/app/app.module';

import {AppModule as ButtonAnchors} from '../../../../../button/test/anchors/app/app.module';
import {AppModule as ButtonAttributes} from '../../../../../button/test/attributes/app/app.module';
import {AppModule as ButtonBasic} from '../../../../../button/test/basic/app/app.module';
import {AppModule as ButtonBlock} from '../../../../../button/test/block/app/app.module';
import {AppModule as ButtonClear} from '../../../../../button/test/clear/app/app.module';
import {AppModule as ButtonDecorator} from '../../../../../button/test/decorator/app/app.module';
import {AppModule as ButtonDynamic} from '../../../../../button/test/dynamic/app/app.module';
import {AppModule as ButtonFull} from '../../../../../button/test/full/app/app.module';
import {AppModule as ButtonIcons} from '../../../../../button/test/icons/app/app.module';
import {AppModule as ButtonOutline} from '../../../../../button/test/outline/app/app.module';
import {AppModule as ButtonRaised} from '../../../../../button/test/raised/app.module';
import {AppModule as ButtonRound} from '../../../../../button/test/round/app/app.module';
import {AppModule as ButtonSizes} from '../../../../../button/test/sizes/app/app.module';

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
    AppUtilities,

    BadgeBasic,

    ButtonAnchors,
    ButtonAttributes,
    ButtonBasic,
    ButtonBlock,
    ButtonClear,
    ButtonDecorator,
    ButtonDynamic,
    ButtonFull,
    ButtonIcons,
    ButtonOutline,
    ButtonRaised,
    ButtonRound,
    ButtonSizes,
  ],
  entryComponents: [
    ComponentsPage
  ]
})
export class ComponentsModule {
}
