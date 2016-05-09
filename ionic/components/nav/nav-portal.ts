import {Directive, ElementRef, Optional, NgZone, Renderer, DynamicComponentLoader, ViewContainerRef} from 'angular2/core';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Keyboard} from '../../util/keyboard';
import {NavController} from './nav-controller';
import {ViewController} from './view-controller';

/**
 * @private
 */
@Directive({
  selector: '[nav-portal]'
})
export class NavPortal extends NavController {
  constructor(
    @Optional() viewCtrl: ViewController,
    @Optional() parent: NavController,
    app: IonicApp,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    zone: NgZone,
    renderer: Renderer,
    loader: DynamicComponentLoader,
    viewPort: ViewContainerRef
  ) {
    super(parent, app, config, keyboard, elementRef, zone, renderer, loader);
    this.isPortal = true;
    this.setViewport(viewPort);
  }
}
