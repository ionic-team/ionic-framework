import { Component, ComponentFactoryResolver, HostListener, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { Key } from '../../util/key';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';


/**
 * @private
 */
@Component({
  selector: 'ion-modal',
  template:
    '<ion-backdrop disableScroll="false" (click)="_bdClick()"></ion-backdrop>' +
    '<div class="modal-wrapper">' +
      '<div #viewport nav-viewport></div>' +
    '</div>'
})
export class ModalCmp {

  @ViewChild('viewport', { read: ViewContainerRef }) _viewport: ViewContainerRef;

  /** @private  */
  _bdDismiss: boolean;

  /** @private */
  _enabled: boolean;

  constructor(public _cfr: ComponentFactoryResolver, public _renderer: Renderer, public _navParams: NavParams, public _viewCtrl: ViewController) {
    this._bdDismiss = _navParams.data.opts.enableBackdropDismiss;
  }

  ngAfterViewInit() {
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
    }
  }

  /** @private */
  _setCssClass(componentRef: any, className: string) {
    this._renderer.setElementClass(componentRef.location.nativeElement, className, true);
  }

  _bdClick() {
    if (this._enabled && this._bdDismiss) {
      return this._viewCtrl.dismiss(null, 'backdrop');
    }
  }

  @HostListener('body:keyup', ['$event'])
  _keyUp(ev: KeyboardEvent) {
    if (this._enabled && this._viewCtrl.isLast() && ev.keyCode === Key.ESCAPE) {
      this._bdClick();
    }
  }
}
