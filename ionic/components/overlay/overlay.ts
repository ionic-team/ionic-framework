import {ChangeDetectorRef, Component, ElementRef, Compiler, AppViewManager, NgZone, Renderer} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Keyboard} from '../../util/keyboard';
import {OverlayController} from './overlay-controller';
import {NavController} from '../nav/nav-controller';


@Component({
  selector: 'ion-overlay',
  template: '<template #contents></template>'
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
    super(null, app, config, keyboard, elementRef, compiler, viewManager, zone, renderer, cd);

    if (overlayCtrl.anchor) {
      throw ('An app should only have one <ion-overlay></ion-overlay>');
    }

    overlayCtrl.nav = this;
  }

}
