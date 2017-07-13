import { Component, ComponentFactoryResolver, ElementRef, HostListener, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { Config } from '../../config/config';
import { KEY_ESCAPE } from '../../platform/key';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
import { BLOCK_ALL, BlockerDelegate, GestureController } from '../../gestures/gesture-controller';
import { ModuleLoader } from '../../util/module-loader';
import { assert } from '../../util/util';

/**
 * @hidden
 */
@Component({
  selector: 'ion-popover',
  template:
    '<ion-backdrop (click)="_bdClick()" [hidden]="!d.showBackdrop"></ion-backdrop>' +
    '<div class="popover-wrapper">' +
      '<div class="popover-arrow"></div>' +
      '<div class="popover-content">' +
        '<div class="popover-viewport">' +
          '<div #viewport nav-viewport></div>' +
        '</div>' +
      '</div>' +
    '</div>'
})
export class PopoverCmp {

  @ViewChild('viewport', {read: ViewContainerRef}) _viewport: ViewContainerRef;

  d: {
    cssClass?: string;
    showBackdrop?: boolean;
    enableBackdropDismiss?: boolean;
  };

  _enabled: boolean;
  _gestureBlocker: BlockerDelegate;

  id: number;

  constructor(
    public _cfr: ComponentFactoryResolver,
    public _elementRef: ElementRef,
    public _renderer: Renderer,
    public _config: Config,
    public _navParams: NavParams,
    public _viewCtrl: ViewController,
    gestureCtrl: GestureController,
    public moduleLoader: ModuleLoader
  ) {
    this._gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
    this.d = _navParams.data.opts;

    _renderer.setElementClass(_elementRef.nativeElement, `popover-${_config.get('mode')}`, true);

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        // Make sure the class isn't whitespace, otherwise it throws exceptions
        if (cssClass.trim() !== '') _renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++popoverIds);
  }

  ionViewPreLoad() {
    this._load(this._navParams.data.component);
  }

  _load(component: any) {
    if (component) {
      let cfr = this.moduleLoader.getComponentFactoryResolver(component);
      if (!cfr) {
        cfr = this._cfr;
      }
      const componentFactory = cfr.resolveComponentFactory(component);

      // ******** DOM WRITE ****************
      const componentRef = this._viewport.createComponent(componentFactory, this._viewport.length, this._viewport.parentInjector, []);
      this._viewCtrl._setInstance(componentRef.instance);
      this._enabled = true;

      // Subscribe to events in order to block gestures
      // TODO, should we unsubscribe? memory leak?
      this._viewCtrl.willEnter.subscribe(this._viewWillEnter.bind(this));
      this._viewCtrl.didLeave.subscribe(this._viewDidLeave.bind(this));
    }
  }

  _viewWillEnter() {
    this._gestureBlocker.block();
  }

  _viewDidLeave() {
    this._gestureBlocker.unblock();
  }

  _setCssClass(componentRef: any, className: string) {
    this._renderer.setElementClass(componentRef.location.nativeElement, className, true);
  }

  _bdClick() {
    if (this._enabled && this.d.enableBackdropDismiss) {
      return this._viewCtrl.dismiss(null, 'backdrop');
    }
  }

  @HostListener('body:keyup', ['$event'])
  _keyUp(ev: KeyboardEvent) {
    if (this._enabled && ev.keyCode === KEY_ESCAPE && this._viewCtrl.isLast()) {
      this._bdClick();
    }
  }

  ngOnDestroy() {
    assert(this._gestureBlocker.blocked === false, 'gesture blocker must be already unblocked');
    this._gestureBlocker.destroy();
  }
}

let popoverIds = -1;
