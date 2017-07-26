import { AfterViewInit, Component, ElementRef, Renderer, Output, EventEmitter, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

import { Config } from '../../config/config';
import { NavParams } from '../../navigation/nav-params';
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
    '[class.toast-top]="d.position === \'top\'"> ' +
    '<div class="toast-container"> ' +
      '<div *ngIf="d.messageHtml" [innerHTML]="d.message" class="toast-message" id="{{hdrId}}"></div> ' +
      '<div *ngIf="d.message && !d.messageHtml" class="toast-message" id="{{hdrId}}">{{d.message}}</div> ' +
      '<button ion-button clear class="danger toast-button" *ngIf="showCloseButton" (click)="cbClick()"> ' +
          '{{ d.closeButtonText || \'Close\' }} ' +
      '</button> ' +
    '</div> ' +
  '</div>',
  host: {
    'role': 'dialog',
    '[attr.aria-labelledby]': 'hdrId',
    '[attr.aria-describedby]': 'descId',
  },
})
export class ToastCmp implements OnInit, AfterViewInit {

  /**
   * @output {ToastCmp} Emitted when click on `closeButton` and `d.closeClick` calllback is defined.
   */
  @Output() ionCloseClick = new EventEmitter<ToastCmp>();

  d: {
    autoFocus: boolean;
    message?: string | SafeHtml;
    messageHtml?: SafeHtml;
    cssClass?: string;
    duration?: number;
    showCloseButton?: boolean;
    closeButtonText?: string;
    dismissOnPageChange?: boolean;
    position?: string;
    closeClick?: () => void;
  };
  descId: string;
  dismissTimeout: number = undefined;
  enabled: boolean;
  hdrId: string;
  id: number;

  constructor(
    public _viewCtrl: ViewController,
    public _config: Config,
    public _elementRef: ElementRef,
    public _sanitizer: DomSanitizer,
    params: NavParams,
    renderer: Renderer
  ) {
    renderer.setElementClass(_elementRef.nativeElement, `toast-${_config.get('mode')}`, true);
    this.d = params.data;
    this.d.autoFocus = 'autoFocus' in this.d ? this.d.autoFocus : true;

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        // Make sure the class isn't whitespace, otherwise it throws exceptions
        if (cssClass.trim() !== '') renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++toastIds);
    if (this.d.message || this.d.messageHtml) {
      this.hdrId = 'toast-hdr-' + this.id;
    }
  }

  ngOnInit() {

    if (this.d.messageHtml) {
      this.d.message = this._sanitizer.bypassSecurityTrustHtml(<string>this.d.messageHtml);
    }
  }

  ngAfterViewInit() {
    // if there's a `duration` set, automatically dismiss.
    if (this.d.duration) {
      this.dismissTimeout = (<any>setTimeout(() => {
        this.dismiss('backdrop');
      }, this.d.duration));
    }
    this.enabled = true;

    if (this.d.closeClick) {
      this.ionCloseClick.subscribe(this.d.closeClick);
    }
  }

  ionViewDidEnter() {
    const { activeElement }: any = document;
    if (activeElement) {
      activeElement.blur();
    }

    if (this.d.autoFocus) {
      let focusableEle = this._elementRef.nativeElement.querySelector('button');

      if (focusableEle) {
        focusableEle.focus();
      }
    }
  }

  get showCloseButton(): boolean {
    return (this.d.showCloseButton || typeof this.d.closeButtonText == 'string');
  }

  cbClick() {
    this.ionCloseClick.emit(this);

    if (this.enabled) {
      this.dismiss('close');
    }
  }

  dismiss(role: string): Promise<any> {
    clearTimeout(this.dismissTimeout);
    this.dismissTimeout = undefined;
    return this._viewCtrl.dismiss(null, role, { disableApp: false });
  }

}

let toastIds = -1;
