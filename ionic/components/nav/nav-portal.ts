import {Directive, ElementRef, Input, Optional, NgZone, Compiler, AppViewManager, Renderer, Type, ContentChild} from 'angular2/core';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Keyboard} from '../../util/keyboard';
import {NavController} from './nav-controller';
import {ViewController} from './view-controller';

/**
 * @private
 */
@Directive({
  selector: '[portal]'
})
export class Portal extends NavController {
  constructor(
    @Optional() hostNavCtrl: NavController,
    @Optional() viewCtrl: ViewController,
    app: IonicApp,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    compiler: Compiler,
    viewManager: AppViewManager,
    zone: NgZone,
    renderer: Renderer
  ) {
    super(hostNavCtrl, app, config, keyboard, elementRef, null, compiler, viewManager, zone, renderer);
    this.isPortal = true;
  }
}
