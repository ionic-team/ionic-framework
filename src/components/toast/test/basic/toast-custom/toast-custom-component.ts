import { NavParams } from './../../../../../navigation/nav-params';
import { Config } from './../../../../../config/config';
import { ViewController } from './../../../../../navigation/view-controller';
import { ToastCmp } from './../../../toast-component';
import { Component, ElementRef, Renderer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'custom-toast',
  template:
  '<div class="toast-wrapper" ' +
  '[class.toast-bottom]="d.position === \'bottom\'" ' +
    '[class.toast-middle]="d.position === \'middle\'" ' +
    '[class.toast-top]="d.position === \'top\'"> ' +
    '<div class="toast-container"> ' +
      '<div class="toast-message" id="{{hdrId}}" *ngIf="d.message">{{d.message}}</div> ' +
      '<button ion-button clear class="toast-button" *ngIf="d.showCloseButton" (click)="cbClick()"> ' +
        '{{ d.closeButtonText || \'Close\' }} ' +
      '</button> ' +
      '<!--Custom Button only this component --> ' +
      '<button ion-button clear class="toast-button" (click)="cbClickOther()"> ' +
        'OTHER' +
      '</button> ' +
    '</div> ' +
  '</div>',
    host: {
    'role': 'dialog',
    '[attr.aria-labelledby]': 'hdrId',
    '[attr.aria-describedby]': 'descId',
  }
})
export class ToastCustomCmp extends ToastCmp {

    constructor(
        public _viewCtrl: ViewController,
        public _config: Config,
        public _elementRef: ElementRef,
        public _sanitize: DomSanitizer,
        params: NavParams,
        renderer: Renderer
    ) {
        super(
            _viewCtrl,
            _config,
            _elementRef,
            _sanitize,
            params,
            renderer
        );
    }

}