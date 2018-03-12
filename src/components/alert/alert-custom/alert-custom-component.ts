import { Component, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';
import { Config } from '../../../config/config';
import { AlertCmp } from '../alert-component';
import { ViewController } from '../../../navigation/view-controller';
import { NavParams } from '../../../navigation/nav-params';
import { GestureController } from '../../../gestures/gesture-controller';
import { Platform } from '../../../platform/platform';

/**
 * @hidden
 */
@Component({
  selector: 'ion-alert',
  template:
    '<ion-backdrop (click)="bdClick()" [class.backdrop-no-tappable]="!d.enableBackdropDismiss"></ion-backdrop>' +
    '<div class="alert-wrapper">' +
      '<div class="alert-head">' +
        '<h2 id="{{hdrId}}" class="alert-title" *ngIf="d.title" [innerHTML]="d.title"></h2>' +
        '<h3 id="{{subHdrId}}" class="alert-sub-title" *ngIf="d.subTitle" [innerHTML]="d.subTitle"></h3>' +
      '</div>' +
      '<div id="{{msgId}}" class="alert-message" [innerHTML]="d.message"></div>' +
      '<div class="custom-alert">My custom alert</div>' +
      '<div *ngIf="d.inputs.length" [ngSwitch]="inputType">' +

        '<ng-template ngSwitchCase="radio">' +
          '<div class="alert-radio-group" role="radiogroup" [attr.aria-labelledby]="hdrId" [attr.aria-activedescendant]="activeId">' +
            '<button ion-button="alert-radio-button" *ngFor="let i of d.inputs" (click)="rbClick(i)" [attr.aria-checked]="i.checked" [disabled]="i.disabled" [attr.id]="i.id" class="alert-tappable alert-radio" role="radio">' +
              '<div class="alert-radio-icon"><div class="alert-radio-inner"></div></div>' +
              '<div class="alert-radio-label">' +
                '{{i.label}}' +
              '</div>' +
            '</button>' +
          '</div>' +
        '</ng-template>' +

        '<ng-template ngSwitchCase="checkbox">' +
          '<div class="alert-checkbox-group">' +
            '<button ion-button="alert-checkbox-button" *ngFor="let i of d.inputs" (click)="cbClick(i)" [attr.aria-checked]="i.checked" [attr.id]="i.id" [disabled]="i.disabled" class="alert-tappable alert-checkbox" role="checkbox">' +
              '<div class="alert-checkbox-icon"><div class="alert-checkbox-inner"></div></div>' +
              '<div class="alert-checkbox-label">' +
                '{{i.label}}' +
              '</div>' +
            '</button>' +
          '</div>' +
        '</ng-template>' +

        '<ng-template ngSwitchDefault>' +
          '<div class="alert-input-group">' +
            '<div *ngFor="let i of d.inputs" class="alert-input-wrapper">' +
              '<input [placeholder]="i.placeholder" [(ngModel)]="i.value" [type]="i.type" [min]="i.min" [max]="i.max" [attr.id]="i.id" class="alert-input">' +
            '</div>' +
          '</div>' +
        '</ng-template>' +

      '</div>' +
      '<div class="alert-button-group" [ngClass]="{\'alert-button-group-vertical\':d.buttons.length>2}">' +
        '<button ion-button="alert-button" *ngFor="let b of d.buttons" (click)="btnClick(b)" [ngClass]="b.cssClass">' +
          '{{b.text}}' +
        '</button>' +
      '</div>' +
    '</div>',
  host: {
    'role': 'dialog',
    '[attr.aria-labelledby]': 'hdrId',
    '[attr.aria-describedby]': 'descId'
  },
  encapsulation: ViewEncapsulation.None,
})
export class AlertCustomCmp extends AlertCmp {

  constructor(
    public _viewCtrl: ViewController,
    public _elementRef: ElementRef,
    config: Config,
    gestureCtrl: GestureController,
    params: NavParams,
    _renderer: Renderer,
    _plt: Platform
  ) {
      super(
        _viewCtrl,
        _elementRef,
        config,
        gestureCtrl,
        params,
        _renderer,
        _plt
      );
  }
}
