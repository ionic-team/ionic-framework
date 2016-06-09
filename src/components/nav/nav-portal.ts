import {Directive, ElementRef, Optional, NgZone, Renderer, ComponentResolver, ViewContainerRef} from '@angular/core';

import {App} from '../app/app';
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
    app: App,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    zone: NgZone,
    renderer: Renderer,
    compiler: ComponentResolver,
    viewPort: ViewContainerRef
  ) {
    super(parent, app, config, keyboard, elementRef, zone, renderer, compiler);
    this.isPortal = true;
    this.setViewport(viewPort);
  }
}
