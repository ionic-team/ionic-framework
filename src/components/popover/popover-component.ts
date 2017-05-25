import { Component, ComponentFactoryResolver, ElementRef, HostListener, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { Config } from '../../config/config';
import { KEY_ESCAPE } from '../../platform/key';
import { NavParams } from '../../navigation/nav-params';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';
import { GestureController, BlockerDelegate, BLOCK_ALL } from '../../gestures/gesture-controller';
import { ModuleLoader } from '../../util/module-loader';
import { assert } from '../../util/util';

/**
 * @hidden
 */
@Component({
  selector: 'ion-popover',
  template:
    '<ion-backdrop (click)="_bdClick()" [hidden]="!d.showBackdrop"></ion-backdrop>' +
    '<div class="popover-wrapper" id="{{_wrpId}}" tabindex="-1" role="dialog" [attr.aria-label]="_label">' +
      '<button class="popover-dismiss" (click)="_bdClick()" *ngIf="d.enableBackdropDismiss" [attr.aria-label]="_dismissLabel"></button>' +
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
    ariaLabel?: string;
  };

  _enabled: boolean;
  _gestureBlocker: BlockerDelegate;
  _wrpId: string;
  _label: string;
  _dismissLabel: string;
  _activeElement: HTMLElement;

  id: number;

  constructor(
    public _cfr: ComponentFactoryResolver,
    public _elementRef: ElementRef,
    public _renderer: Renderer,
    public _config: Config,
    private _plt: Platform,
    public _navParams: NavParams,
    public _viewCtrl: ViewController,
    gestureCtrl: GestureController,
    public moduleLoader: ModuleLoader
  ) {
    let opts = _navParams.get('opts');
    assert(opts, 'popover data must be valid');

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
    this._wrpId = 'popover-wrap-' + this.id;

    if (opts.ariaLabel) {
      this._label = opts.ariaLabel;
    } else {
      // May be worth considering trying to pull something out of the popover page
      this._label = '';
    }

    if (opts.dismissLabel) {
      this._dismissLabel = opts.dismissLabel;
    } else {
      this._dismissLabel = 'Tap to dismiss';
    }
  }

  ionViewPreLoad() {
    this._load(this._navParams.data.component);
  }

  ionViewDidLeave() {
    this._plt.untrapVirtualCursor(this._elementRef.nativeElement);
    this._activeElement.focus();
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
      this._viewCtrl.didEnter.subscribe(this._viewDidEnter.bind(this));
    }
  }

  _viewWillEnter() {
    this._gestureBlocker.block();
  }

  _viewDidEnter() {
    // remember the focused element so we can restore it later
    this._activeElement = <HTMLElement>document.activeElement;
    if (this._activeElement) {
      this._activeElement.blur();
    }

    // trap focus and virtual cursor within the alert box
    // only the virtual cursor trap needs to be removed when the alert is dismissed
    // as the focus trap is destroyed with the element
    this._plt.trapFocus(this._elementRef.nativeElement);
    this._plt.trapVirtualCursor(this._elementRef.nativeElement);

    // set focus to the wrapper element
    document.getElementById(this._wrpId).focus();

    // allow dismissing dialog with hardware back button (android and win only)
    var backButtonAction = this._plt.registerBackButtonAction(() => {
      backButtonAction();
      this._bdClick();
    });
  }

  _viewDidLeave() {
    this._plt.untrapVirtualCursor(this._elementRef.nativeElement);
    this._activeElement.focus();
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
