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

import {AppModule as CardAdvanced} from '../../../../../card/test/advanced/app/app.module';
import {AppModule as CardBasic} from '../../../../../card/test/basic/app/app.module';
import {AppModule as CardColors} from '../../../../../card/test/colors/app/app.module';
import {AppModule as CardImages} from '../../../../../card/test/images/app/app.module';
import {AppModule as CardList} from '../../../../../card/test/list/app/app.module';
import {AppModule as CardMap} from '../../../../../card/test/map/app.module';
import {AppModule as CardSocial} from '../../../../../card/test/social/app.module';

import {AppModule as CheckboxBasic} from '../../../../../checkbox/test/basic/app/app.module';

import {AppModule as ChipBasic} from '../../../../../chip/test/basic/app/app.module';

import {AppModule as ContentBasic} from '../../../../../content/test/basic/app/app.module';
import {AppModule as ContentFullscreen} from '../../../../../content/test/fullscreen/app/app.module';
import {AppModule as ContentHeaderScroll} from '../../../../../content/test/header-scroll/app.module';
import {AppModule as ContentNoBounce} from '../../../../../content/test/no-bounce/app/app.module';
import {AppModule as ContentScrollDownOnLoad} from '../../../../../content/test/scroll-down-on-load/app/app.module';

import {AppModule as DatetimeBasic} from '../../../../../datetime/test/basic/app/app.module';
import {AppModule as DatetimeForm} from '../../../../../datetime/test/form/app.module';
import {AppModule as DatetimeIssues} from '../../../../../datetime/test/issues/app/app.module';
import {AppModule as DatetimeLabels} from '../../../../../datetime/test/labels/app/app.module';

import {AppModule as FabBasic} from '../../../../../fab/test/basic/app/app.module';

import {AppModule as GridAlignment} from '../../../../../grid/test/alignment/app.module';
import {AppModule as GridBasic} from '../../../../../grid/test/basic/app/app.module';
import {AppModule as GridCard} from '../../../../../grid/test/card/app.module';
import {AppModule as GridFull} from '../../../../../grid/test/full/app.module';
import {AppModule as GridResponsive} from '../../../../../grid/test/responsive/app.module';

import {AppModule as IconBasic} from '../../../../../icon/test/basic/app/app.module';

import {AppModule as ImgBasic} from '../../../../../img/test/basic/app/app.module';
import {AppModule as ImgCards} from '../../../../../img/test/cards/app.module';
import {AppModule as ImgLazyLoad} from '../../../../../img/test/lazy-load/app.module';
import {AppModule as ImgList} from '../../../../../img/test/list/app.module';

import {AppModule as InfiniteScrollBasic} from '../../../../../infinite-scroll/test/basic/app.module';
import {AppModule as InfiniteScrollPositionTop} from '../../../../../infinite-scroll/test/position-top/app/app.module';
import {AppModule as InfiniteScrollShortList} from '../../../../../infinite-scroll/test/short-list/app.module';


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

    CardAdvanced,
    CardBasic,
    CardColors,
    CardImages,
    CardList,
    CardMap,
    CardSocial,

    CheckboxBasic,

    ChipBasic,

    ContentBasic,
    ContentFullscreen,
    ContentHeaderScroll,
    ContentNoBounce,
    ContentScrollDownOnLoad,

    DatetimeBasic,
    DatetimeForm,
    DatetimeIssues,
    DatetimeLabels,

    FabBasic,

    GridAlignment,
    GridBasic,
    GridCard,
    GridFull,
    GridResponsive,

    IconBasic,

    ImgBasic,
    ImgCards,
    ImgLazyLoad,
    ImgList,

    InfiniteScrollBasic,
    InfiniteScrollPositionTop,
    InfiniteScrollShortList,
  ],
  entryComponents: [
    ComponentsPage
  ]
})
export class ComponentsModule {
}
