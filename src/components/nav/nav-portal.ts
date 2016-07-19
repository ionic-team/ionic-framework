import { ComponentResolver, Directive, ElementRef, forwardRef, Inject, NgZone, Optional, Renderer, ViewContainerRef } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { Keyboard } from '../../util/keyboard';
import { MenuController } from '../menu/menu-controller';
import { NavController } from '../nav/nav-controller';

/**
 * @private
 */
@Directive({
  selector: '[nav-portal]'
})
export class NavPortal extends NavController {
  constructor(
    @Inject(forwardRef(() => App)) app: App,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    zone: NgZone,
    renderer: Renderer,
    compiler: ComponentResolver,
    menuCtrl: MenuController,
    viewPort: ViewContainerRef
  ) {
    super(null, app, config, keyboard, elementRef, zone, renderer, compiler, menuCtrl);
    this.isPortal = true;
    this.setViewport(viewPort);
    app.setPortal(this);

    // on every page change make sure the portal has
    // dismissed any views that should be auto dismissed on page change
    app.viewDidLeave.subscribe(this.dismissPageChangeViews.bind(this));
  }

}
