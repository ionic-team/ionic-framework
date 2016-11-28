import { Component, ComponentFactoryResolver, HostListener, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { Key } from '../../util/key';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
import { GestureController, BlockerDelegate, GESTURE_MENU_SWIPE, GESTURE_GO_BACK_SWIPE } from '../../gestures/gesture-controller';
import { assert } from '../../util/util';

/**
 * @private
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
    public _navParams: NavParams,
    public _viewCtrl: ViewController,
    gestureCtrl: GestureController
  ) {
    let opts = _navParams.get('opts');
    assert(opts, 'modal data must be valid');

    this._gestureBlocker = gestureCtrl.createBlocker({
      disable: [GESTURE_MENU_SWIPE, GESTURE_GO_BACK_SWIPE]
    });
    this._bdDismiss = opts.enableBackdropDismiss;
  }

  ionViewPreLoad() {
    this._load(this._navParams.data.component);
  }

  /** @private */
  _load(component: any) {
    if (component) {
      const componentFactory = this._cfr.resolveComponentFactory(component);

      // ******** DOM WRITE ****************
      const componentRef = this._viewport.createComponent(componentFactory, this._viewport.length, this._viewport.parentInjector, []);
      this._viewCtrl._setInstance(componentRef.instance);

      this._setCssClass(componentRef, 'ion-page');
      this._setCssClass(componentRef, 'show-page');
      this._enabled = true;

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

  /** @private */
  _setCssClass(componentRef: any, className: string) {
    this._renderer.setElementClass(componentRef.location.nativeElement, className, true);
  }

  _bdClick() {
    if (this._enabled && this._bdDismiss) {
      return this._viewCtrl.dismiss(null, 'backdrop').catch(() => {
        console.debug('Dismiss modal by clicking backdrop was cancelled');
      });
    }
  }

  @HostListener('body:keyup', ['$event'])
  _keyUp(ev: KeyboardEvent) {
    if (this._enabled && this._viewCtrl.isLast() && ev.keyCode === Key.ESCAPE) {
      this._bdClick();
    }
  }

  ngOnDestroy() {
    assert(this._gestureBlocker.blocked === false, 'gesture blocker must be already unblocked');
    this._gestureBlocker.destroy();
  }
}
