import { AfterViewInit, Component, ElementRef, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { NavParams } from '../../navigation/nav-params';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';


/**
 * @hidden
 */
@Component({
  selector: 'ion-toast',
  template:
    '<div class="toast-wrapper" ' +
      '[class.toast-bottom]="d.position === \'bottom\'" ' +
      '[class.toast-middle]="d.position === \'middle\'" ' +
      '[class.toast-top]="d.position === \'top\'" ' +
      'id="{{wrpId}}" tabindex="-1" [attr.role]="role" [attr.aria-labelledby]="hdrId">' +
      '<div class="toast-container"> ' +
        '<div class="toast-message" id="{{hdrId}}" *ngIf="d.message">{{d.message}}</div> ' +
        '<button ion-button clear class="toast-button" *ngIf="d.showCloseButton" (click)="cbClick()"> ' +
          '{{ d.closeButtonText || \'Close\' }} ' +
         '</button> ' +
      '</div> ' +
    '</div>',
  host: {
  },
})
export class ToastCmp implements AfterViewInit {
  d: {
    message?: string;
    cssClass?: string;
    duration?: number;
    showCloseButton?: boolean;
    closeButtonText?: string;
    dismissOnPageChange?: boolean;
    position?: string;
    silent?: boolean;
  };
  dismissTimeout: number = undefined;
  enabled: boolean;
  hdrId: string;
  wrpId: string;
  id: number;
  role: string;
  activeElement: HTMLElement;

  constructor(
    public _viewCtrl: ViewController,
    public _config: Config,
    public _elementRef: ElementRef,
    params: NavParams,
    renderer: Renderer,
    private _plt: Platform
  ) {
    renderer.setElementClass(_elementRef.nativeElement, `toast-${_config.get('mode')}`, true);
    this.d = params.data;

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        // Make sure the class isn't whitespace, otherwise it throws exceptions
        if (cssClass.trim() !== '') renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++toastIds);
    if (this.d.message) {
      this.hdrId = 'toast-hdr-' + this.id;
    }
    this.wrpId = 'toast-wrp-' + this.id;

    // If there is a close button, the toast cannot be silent
    if (this.d.showCloseButton) {
      this.d.silent = false;
      this.role = 'alertdialog';
    } else if (this.d.silent) {
      this.role = '';
    } else {
      this.role = 'alert';
    }
  }

  ngAfterViewInit() {
    // if there's a `duration` set, automatically dismiss.
    if (this.d.duration) {
      this.dismissTimeout = (<any>setTimeout(() => {
          this.dismiss('backdrop');
        }, this.d.duration));
    }
  }

  ionViewDidEnter() {
    // only touch focus if the toast has a button
    if (this.d.showCloseButton) {
      // remember the focused element so we can restore it later
      this.activeElement = <HTMLElement>document.activeElement;
      if (this.activeElement) {
        this.activeElement.blur();
      }

      // trap focus and virtual cursor within the toast
      // only the virtual cursor trap needs to be removed when the toast is dismissed
      // as the focus trap is destroyed with the element
      this._plt.trapFocus(this._elementRef.nativeElement);
      this._plt.trapVirtualCursor(this._elementRef.nativeElement);

      // set focus to the close button
      const focusableEle = this._elementRef.nativeElement.querySelector('button');
      // the line below is a workaround since for some reason the close button won't
      // react to a screen reader tap when initially focused.
      document.getElementById(this.wrpId).focus();
      if (focusableEle) {
        focusableEle.focus();
      }
      this.enabled = true;

      // allow dismissing toast with hardware back button (android and win only)
      var backButtonAction = this._plt.registerBackButtonAction(() => {
        this.cbClick();
        backButtonAction();
      });
    }
  }

  ionViewDidLeave() {
    // cleanup is only required if the toast had a button as otherwise focus was not touched
    if (this.d.showCloseButton) {
      this._plt.untrapVirtualCursor(this._elementRef.nativeElement);
      this.activeElement.focus();
    }
  }

  cbClick() {
    if (this.enabled) {
      this.dismiss('close');
    }
  }

  dismiss(role: string): Promise<any> {
    clearTimeout(this.dismissTimeout);
    this.dismissTimeout = undefined;
    return this._viewCtrl.dismiss(null, role, {disableApp: false});
  }

}

let toastIds = -1;
