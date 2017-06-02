import {Component} from "@angular/core";
import {IonicPage} from "../../../../../../";

import {AppComponent as ActionSheetBasic} from "../../../../../action-sheet/test/basic/app/app.component";

import {AppComponent as AlertBasic} from "../../../../../alert/test/basic/app/app.component";
import {AppComponent as AlertDismiss} from "../../../../../alert/test/dismiss/app.module";

import {AppComponent as AppAnimations} from "../../../../../app/test/animations/app.module";
import {AppComponent as AppCordova} from "../../../../../app/test/cordova/app/app.component";
import {AppComponent as AppGestureCollision} from "../../../../../app/test/gesture-collision/app/app.component";
import {AppComponent as AppGestures} from "../../../../../app/test/gestures/app.module";
import {AppComponent as AppTypography} from "../../../../../app/test/typography/app/app.component";
import {AppComponent as AppUtilities} from "../../../../../app/test/utilities/app/app.component";

import {AppComponent as BadgeBasic} from "../../../../../badge/test/basic/app/app.component";

import {AppComponent as ButtonAnchors} from "../../../../../button/test/anchors/app/app.component";
import {AppComponent as ButtonAttributes} from "../../../../../button/test/attributes/app/app.component";
import {AppComponent as ButtonBasic} from "../../../../../button/test/basic/app/app.component";
import {AppComponent as ButtonBlock} from "../../../../../button/test/block/app/app.component";
import {AppComponent as ButtonClear} from "../../../../../button/test/clear/app/app.component";
import {AppComponent as ButtonDecorator} from "../../../../../button/test/decorator/app/app.component";
import {AppComponent as ButtonDynamic} from "../../../../../button/test/dynamic/app/app.component";
import {AppComponent as ButtonFull} from "../../../../../button/test/full/app/app.component";
import {AppComponent as ButtonIcons} from "../../../../../button/test/icons/app/app.component";
import {AppComponent as ButtonOutline} from "../../../../../button/test/outline/app/app.component";
import {AppComponent as ButtonRaised} from "../../../../../button/test/raised/app.module";
import {AppComponent as ButtonRound} from "../../../../../button/test/round/app/app.component";
import {AppComponent as ButtonSizes} from "../../../../../button/test/sizes/app/app.component";
import {ModalController} from "../../../../../modal/modal-controller";
import {Modal} from "../../../../../modal/modal";
import {AssistiveTouchProvider} from "../../providers/assistive-touch/assistive-touch";

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
        {name: 'sizes', component: ButtonSizes},
      ]
    }
  ];

  modal: Modal = null;

  constructor(private modalCtrl: ModalController, private assistive: AssistiveTouchProvider) {
    assistive.closeButton.subscribe(this.close.bind(this));
  }

  open(component: Component) {
    this.modal = this.modalCtrl.create(component);
    this.modal.present();
  }

  close() {
    if (this.modal !== null)
      this.modal.dismiss().then(() => this.modal = null);
  }
}
