import {Component} from '@angular/core';
import {IonicPage} from '../../../../../../';

import {AssistiveTouchProvider} from '../../providers/assistive-touch/assistive-touch';
import {NavController} from '../../../../../../navigation/nav-controller';

import {AppComponent as ActionSheetBasic} from '../../../../../action-sheet/test/basic/app/app.component';

import {AppComponent as AlertBasic} from '../../../../../alert/test/basic/app/app.component';
import {AppComponent as AlertDismiss} from '../../../../../alert/test/dismiss/app.module';

import {AppComponent as AppAnimations} from '../../../../../app/test/animations/app.module';
import {AppComponent as AppCordova} from '../../../../../app/test/cordova/app/app.component';
import {AppComponent as AppGestureCollision} from '../../../../../app/test/gesture-collision/app/app.component';
import {AppComponent as AppGestures} from '../../../../../app/test/gestures/app.module';
import {AppComponent as AppTypography} from '../../../../../app/test/typography/app/app.component';
import {AppComponent as AppUtilities} from '../../../../../app/test/utilities/app/app.component';

import {AppComponent as BadgeBasic} from '../../../../../badge/test/basic/app/app.component';

import {AppComponent as ButtonAnchors} from '../../../../../button/test/anchors/app/app.component';
import {AppComponent as ButtonAttributes} from '../../../../../button/test/attributes/app/app.component';
import {AppComponent as ButtonBasic} from '../../../../../button/test/basic/app/app.component';
import {AppComponent as ButtonBlock} from '../../../../../button/test/block/app/app.component';
import {AppComponent as ButtonClear} from '../../../../../button/test/clear/app/app.component';
import {AppComponent as ButtonDecorator} from '../../../../../button/test/decorator/app/app.component';
import {AppComponent as ButtonDynamic} from '../../../../../button/test/dynamic/app/app.component';
import {AppComponent as ButtonFull} from '../../../../../button/test/full/app/app.component';
import {AppComponent as ButtonIcons} from '../../../../../button/test/icons/app/app.component';
import {AppComponent as ButtonOutline} from '../../../../../button/test/outline/app/app.component';
import {AppComponent as ButtonRaised} from '../../../../../button/test/raised/app.module';
import {AppComponent as ButtonRound} from '../../../../../button/test/round/app/app.component';
import {AppComponent as ButtonSizes} from '../../../../../button/test/sizes/app/app.component';

import {AppComponent as CardAdvanced} from '../../../../../card/test/advanced/app/app.component';
import {AppComponent as CardBasic} from '../../../../../card/test/basic/app/app.component';
import {AppComponent as CardColors} from '../../../../../card/test/colors/app/app.component';
import {AppComponent as CardImages} from '../../../../../card/test/images/app/app.component';
import {AppComponent as CardList} from '../../../../../card/test/list/app/app.component';
import {AppComponent as CardMap} from '../../../../../card/test/map/app.module';
import {AppComponent as CardSocial} from '../../../../../card/test/social/app.module';

import {AppComponent as CheckboxBasic} from '../../../../../checkbox/test/basic/app/app.component';

import {AppComponent as ChipBasic} from '../../../../../chip/test/basic/app/app.component';

import {AppComponent as ContentBasic} from '../../../../../content/test/basic/app/app.component';
import {AppComponent as ContentFullscreen} from '../../../../../content/test/fullscreen/app/app.component';
import {AppComponent as ContentHeaderScroll} from '../../../../../content/test/header-scroll/app.module';
import {AppComponent as ContentNoBounce} from '../../../../../content/test/no-bounce/app/app.component';
import {AppComponent as ContentScrollDownOnLoad} from '../../../../../content/test/scroll-down-on-load/app/app.component';

import {AppComponent as DatetimeBasic} from '../../../../../datetime/test/basic/app/app.component';
import {AppComponent as DatetimeForm} from '../../../../../datetime/test/form/app.module';
import {AppComponent as DatetimeIssues} from '../../../../../datetime/test/issues/app/app.component';
import {AppComponent as DatetimeLabels} from '../../../../../datetime/test/labels/app/app.component';

import {AppComponent as FabBasic} from '../../../../../fab/test/basic/app/app.component';

import {AppComponent as GridAlignment} from '../../../../../grid/test/alignment/app.module';
import {AppComponent as GridBasic} from '../../../../../grid/test/basic/app/app.component';
import {AppComponent as GridCard} from '../../../../../grid/test/card/app.module';
import {AppComponent as GridFull} from '../../../../../grid/test/full/app.module';
import {AppComponent as GridResponsive} from '../../../../../grid/test/responsive/app.module';

import {AppComponent as IconBasic} from '../../../../../icon/test/basic/app/app.component';

import {AppComponent as ImgBasic} from '../../../../../img/test/basic/app/app.component';
import {AppComponent as ImgCards} from '../../../../../img/test/cards/app.module';
import {AppComponent as ImgLazyLoad} from '../../../../../img/test/lazy-load/app.module';
import {AppComponent as ImgList} from '../../../../../img/test/list/app.module';

import {AppComponent as InfiniteScrollBasic} from '../../../../../infinite-scroll/test/basic/app.module';
import {AppComponent as InfiniteScrollPositionTop} from '../../../../../infinite-scroll/test/position-top/app/app.component';
import {AppComponent as InfiniteScrollShortList} from '../../../../../infinite-scroll/test/short-list/app.module';


export type ComponentItem = { name: string, components: Array<{ name: string, component: any }> };

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
        {name: 'dismiss', component: AlertDismiss}
      ]
    }, {
      name: 'App',
      components: [
        {name: 'animations', component: AppAnimations},
        {name: 'cordova', component: AppCordova},
        {name: 'gesture-collision', component: AppGestureCollision},
        {name: 'gestures', component: AppGestures},
        {name: 'typography', component: AppTypography},
        {name: 'utilities', component: AppUtilities}
      ]
    }, {
      name: 'Avatar',
      components: []
    }, {
      name: 'Backdrop',
      components: []
    }, {
      name: 'Badge',
      components: [
        {name: 'basic', component: BadgeBasic}
      ]
    }, {
      name: 'Button',
      components: [
        {name: 'anchors', component: ButtonAnchors},
        {name: 'attributes', component: ButtonAttributes},
        {name: 'basic', component: ButtonBasic},
        {name: 'block', component: ButtonBlock},
        {name: 'clear', component: ButtonClear},
        {name: 'decorator', component: ButtonDecorator},
        {name: 'dynamic', component: ButtonDynamic},
        {name: 'full', component: ButtonFull},
        {name: 'icons', component: ButtonIcons},
        {name: 'outline', component: ButtonOutline},
        {name: 'raised', component: ButtonRaised},
        {name: 'round', component: ButtonRound},
        {name: 'sizes', component: ButtonSizes}
      ]
    }, {
      name: 'Card',
      components: [
        {name: 'advanced', component: CardAdvanced},
        {name: 'basic', component: CardBasic},
        {name: 'colors', component: CardColors},
        {name: 'images', component: CardImages},
        {name: 'list', component: CardList},
        {name: 'map', component: CardMap},
        {name: 'social', component: CardSocial}
      ]
    }, {
      name: 'Checkbox',
      components: [
        {name: 'basic', component: CheckboxBasic}
      ]
    }, {
      name: 'Chip',
      components: [
        {name: 'basic', component: ChipBasic}
      ]
    }, {
      name: 'Content',
      components: [
        {name: 'basic', component: ContentBasic},
        {name: 'fullscreen', component: ContentFullscreen},
        {name: 'header-scroll', component: ContentHeaderScroll},
        {name: 'no-bounce', component: ContentNoBounce},
        {name: 'scroll-down-on-load', component: ContentScrollDownOnLoad}
      ]
    }, {
      name: 'Datetime',
      components: [
        {name: 'basic', component: DatetimeBasic},
        {name: 'form', component: DatetimeForm},
        {name: 'issues', component: DatetimeIssues},
        {name: 'labels', component: DatetimeLabels}
      ]
    }, {
      name: 'Fab',
      components: [
        {name: 'basic', component: FabBasic}
      ]
    }, {
      name: 'Grid',
      components: [
        {name: 'alignment', component: GridAlignment},
        {name: 'basic', component: GridBasic},
        {name: 'card', component: GridCard},
        {name: 'full', component: GridFull},
        {name: 'responsive', component: GridResponsive}
      ]
    }, {
      name: 'Icon',
      components: [
        {name: 'basic', component: IconBasic}
      ]
    }, {
      name: 'Img',
      components: [
        {name: 'basic', component: ImgBasic},
        {name: 'cards', component: ImgCards},
        {name: 'lazy-load', component: ImgLazyLoad},
        {name: 'list', component: ImgList}
      ]
    }, {
      name: 'Infinite Scroll',
      components: [
        {name: 'basic', component: InfiniteScrollBasic},
        {name: 'position-top', component: InfiniteScrollPositionTop},
        {name: 'short-list', component: InfiniteScrollShortList}
      ]
    }
  ];

  constructor(private navCtrl: NavController, private assistive: AssistiveTouchProvider) {
    assistive.closeButton.subscribe(this.close.bind(this));
  }

  open(component: any) {
    this.navCtrl.push(component);
  }

  close() {
    this.navCtrl.popToRoot();
  }
}
