import { ComponentResolver, Directive, ElementRef, forwardRef, Inject, NgZone, Optional, Renderer, ViewContainerRef } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { GestureController } from '../../gestures/gesture-controller';
import { Keyboard } from '../../util/keyboard';
import { NavControllerBase } from '../nav/nav-controller-base';

/**
 * @private
 */
@Directive({
  selector: '[nav-portal]'
})
export class NavPortal extends NavControllerBase {
  constructor(
    @Inject(forwardRef(() => App)) app: App,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    zone: NgZone,
    renderer: Renderer,
    compiler: ComponentResolver,
    gestureCtrl: GestureController,
    viewPort: ViewContainerRef
  ) {
    super(null, app, config, keyboard, elementRef, zone, renderer, compiler, gestureCtrl);
    this._isPortal = true;
    this._init = true;
    this.setViewport(viewPort);
    app.setPortal(this);

    // on every page change make sure the portal has
    // dismissed any views that should be auto dismissed on page change
    app.viewDidLeave.subscribe(this.dismissPageChangeViews.bind(this));
  }

}
