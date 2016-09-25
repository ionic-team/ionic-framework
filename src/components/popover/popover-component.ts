import { Component, ComponentFactoryResolver, ElementRef, HostListener, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { Config } from '../../config/config';
import { Key } from '../../util/key';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';


/**
 * @private
 */
@Component({
  selector: 'ion-popover',
  template:
    '<ion-backdrop (click)="_bdClick()" [class.hide-backdrop]="!d.showBackdrop"></ion-backdrop>' +
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

  /** @private */
  _enabled: boolean;

  /** @private */
  id: number;

  constructor(
    public _cfr: ComponentFactoryResolver,
    public _elementRef: ElementRef,
    public _renderer: Renderer,
    public _config: Config,
    public _navParams: NavParams,
    public _viewCtrl: ViewController
  ) {
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

  ngAfterViewInit() {
    let activeElement: any = document.activeElement;
    if (document.activeElement) {
      activeElement.blur();
    }
    this._load(this._navParams.data.component);
  }

  /** @private */
  _load(component: any) {
    if (component) {
      const componentFactory = this._cfr.resolveComponentFactory(component);

      // ******** DOM WRITE ****************
      const componentRef = this._viewport.createComponent(componentFactory, this._viewport.length, this._viewport.parentInjector, []);
      this._viewCtrl._setInstance(componentRef.instance);

      this._enabled = true;
    }
  }

  /** @private */
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
    if (this._enabled && ev.keyCode === Key.ESCAPE && this._viewCtrl.isLast()) {
      this._bdClick();
    }
  }
}

let popoverIds = -1;
