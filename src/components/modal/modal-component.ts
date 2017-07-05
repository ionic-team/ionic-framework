import { Component, ComponentFactoryResolver, ElementRef, HostListener, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { KEY_ESCAPE } from '../../platform/key';
import { NavParams } from '../../navigation/nav-params';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';
import { BlockerDelegate, GESTURE_GO_BACK_SWIPE, GESTURE_MENU_SWIPE,  GestureController } from '../../gestures/gesture-controller';
import { ModuleLoader } from '../../util/module-loader';
import { assert } from '../../util/util';

/**
 * @hidden
 */
@Component({
  selector: 'ion-modal',
  template:
    '<ion-backdrop (click)="_bdClick()" [class.backdrop-no-tappable]="!_bdDismiss"></ion-backdrop>' +
    '<div class="modal-wrapper">' +
      '<div #viewport nav-viewport></div>' +
    '</div>'
})
export class ModalCmp {

  @ViewChild('viewport', { read: ViewContainerRef }) _viewport: ViewContainerRef;

  _bdDismiss: boolean;
  _enabled: boolean;
  _gestureBlocker: BlockerDelegate;

  constructor(
    public _cfr: ComponentFactoryResolver,
    public _renderer: Renderer,
    public _elementRef: ElementRef,
    public _navParams: NavParams,
    public _viewCtrl: ViewController,
    gestureCtrl: GestureController,
    public moduleLoader: ModuleLoader

  ) {
    let opts = _navParams.get('opts');
    assert(opts, 'modal data must be valid');

    this._gestureBlocker = gestureCtrl.createBlocker({
      disable: [GESTURE_MENU_SWIPE, GESTURE_GO_BACK_SWIPE]
    });
    this._bdDismiss = opts.enableBackdropDismiss;

    if (opts.cssClass) {
      opts.cssClass.split(' ').forEach((cssClass: string) => {
        // Make sure the class isn't whitespace, otherwise it throws exceptions
        if (cssClass.trim() !== '') _renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }
  }

  ionViewPreLoad() {
    const component = this._navParams.data.component;
    if (!component) {
      console.warn('modal\'s page was not defined');
      return;
    }

    let cfr = this.moduleLoader.getComponentFactoryResolver(component);
    if (!cfr) {
      cfr = this._cfr;
    }
    const componentFactory = cfr.resolveComponentFactory(component);

    // ******** DOM WRITE ****************
    const componentRef = this._viewport.createComponent(componentFactory, this._viewport.length, this._viewport.parentInjector, []);

    this._setCssClass(componentRef, 'ion-page');
    this._setCssClass(componentRef, 'show-page');

    // Change the viewcontroller's instance to point the user provided page
    // Lifecycle events will be sent to the new instance, instead of the modal's component
    // we need to manually subscribe to them
    this._viewCtrl._setInstance(componentRef.instance);
    this._viewCtrl.willEnter.subscribe(this._viewWillEnter.bind(this));
    this._viewCtrl.didLeave.subscribe(this._viewDidLeave.bind(this));

    this._enabled = true;
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
    if (this._enabled && this._bdDismiss) {
      const opts: NavOptions = {
        minClickBlockDuration: 400
      };
      return this._viewCtrl.dismiss(null, 'backdrop', opts);
    }
  }

  @HostListener('body:keyup', ['$event'])
  _keyUp(ev: KeyboardEvent) {
    if (this._enabled && this._viewCtrl.isLast() && ev.keyCode === KEY_ESCAPE) {
      this._bdClick();
    }
  }

  ngOnDestroy() {
    assert(this._gestureBlocker.blocked === false, 'gesture blocker must be already unblocked');
    this._gestureBlocker.destroy();
  }
}
