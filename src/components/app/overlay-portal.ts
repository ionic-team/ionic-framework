import { ComponentFactoryResolver, Directive, ElementRef, ErrorHandler, forwardRef, Inject, Input, NgZone, Optional, Renderer, ViewContainerRef } from '@angular/core';

import { App } from './app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { Keyboard } from '../../platform/keyboard';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { Platform } from '../../platform/platform';
import { TransitionController } from '../../transitions/transition-controller';
import { ViewController } from '../../navigation/view-controller';

/**
 * @hidden
 */
@Directive({
  selector: '[overlay-portal]',
})
export class OverlayPortal extends NavControllerBase {
  constructor(
    @Inject(forwardRef(() => App)) app: App,
    config: Config,
    plt: Platform,
    keyboard: Keyboard,
    elementRef: ElementRef,
    zone: NgZone,
    renderer: Renderer,
    cfr: ComponentFactoryResolver,
    gestureCtrl: GestureController,
    transCtrl: TransitionController,
    @Optional() linker: DeepLinker,
    viewPort: ViewContainerRef,
    domCtrl: DomController,
    errHandler: ErrorHandler
  ) {
    super(null, app, config, plt, keyboard, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl, errHandler);
    this._isPortal = true;
    this._init = true;
    this.setViewport(viewPort);

    // on every page change make sure the portal has
    // dismissed any views that should be auto dismissed on page change
    app.viewDidLeave.subscribe((view: ViewController) => {
      if (!view.isOverlay) {
        this.dismissPageChangeViews();
      }
    });
  }

  @Input('overlay-portal')
  set _overlayPortal(val: number) {
    this._zIndexOffset = (val || 0);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
