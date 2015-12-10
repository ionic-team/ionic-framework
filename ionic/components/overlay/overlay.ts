import {ChangeDetectorRef, Component, ElementRef, Compiler, AppViewManager, NgZone, Renderer} from 'angular2/core';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Keyboard} from '../../util/keyboard';
import {OverlayController} from './overlay-controller';
import {NavController} from '../nav/nav-controller';


/**
 * @private
 */
@Component({
  selector: 'ion-overlay',
  template: ''
})
export class OverlayNav extends NavController {

  constructor(
    overlayCtrl: OverlayController,
    app: IonicApp,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    compiler: Compiler,
    viewManager: AppViewManager,
    zone: NgZone,
    renderer: Renderer,
    cd: ChangeDetectorRef
  ) {
    super(null, app, config, keyboard, elementRef, null, compiler, viewManager, zone, renderer, cd);

    if (overlayCtrl.anchor) {
      throw ('An app should only have one <ion-overlay></ion-overlay>');
    }

    this.initZIndex = 1000;
    overlayCtrl.nav = this;
  }

}
