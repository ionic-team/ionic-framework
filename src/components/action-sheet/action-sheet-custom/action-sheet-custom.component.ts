import { ActionSheetCmp } from './../action-sheet-component';
import { Component, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';

import { ActionSheetButton, ActionSheetOptions } from '../action-sheet-options';
import { BlockerDelegate, GestureController } from '../../../gestures/gesture-controller';
import { Config } from '../../../config/config';
import { NavParams } from '../../../navigation/nav-params';
import { ViewController } from '../../../navigation/view-controller';

/**
 * @hidden
 */
@Component({
  selector: 'ion-action-sheet',
  template:
    '<ion-backdrop (click)="bdClick()" [class.backdrop-no-tappable]="!d.enableBackdropDismiss"></ion-backdrop>' +
    '<div class="action-sheet-wrapper">' +
      '<div class="action-sheet-container">' +
        '<div class="action-sheet-group">' +
          '<div class="action-sheet-title" id="{{hdrId}}" *ngIf="d.title">{{d.title}}</div>' +
          '<div class="action-sheet-sub-title" id="{{descId}}" *ngIf="d.subTitle">{{d.subTitle}}</div>' +
          '<div class="action-sheet-custom-text">My custom action sheet</div>' +
          '<button ion-button="action-sheet-button" (click)="click(b)" *ngFor="let b of d.buttons" class="disable-hover" [attr.icon-start]="b.icon ? \'\' : null" [ngClass]="b.cssClass">' +
            '<ion-icon [name]="b.icon" *ngIf="b.icon" class="action-sheet-icon"></ion-icon>' +
            '{{b.text}}' +
          '</button>' +
        '</div>' +
        '<div class="action-sheet-group" *ngIf="cancelButton">' +
          '<button ion-button="action-sheet-button" (click)="click(cancelButton)" class="action-sheet-cancel disable-hover" [attr.icon-start]="cancelButton.icon ? \'\' : null" [ngClass]="cancelButton.cssClass">' +
            '<ion-icon [name]="cancelButton.icon" *ngIf="cancelButton.icon" class="action-sheet-icon"></ion-icon>' +
            '{{cancelButton.text}}' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>',
  host: {
    'role': 'dialog',
    '[attr.aria-labelledby]': 'hdrId',
    '[attr.aria-describedby]': 'descId'
  },
  encapsulation: ViewEncapsulation.None,
})

export class ActionSheetCustomCmp extends ActionSheetCmp {

  d: ActionSheetOptions;
  cancelButton: ActionSheetButton;
  descId: string;
  enabled: boolean;
  hdrId: string;
  id: number;
  mode: string;
  gestureBlocker: BlockerDelegate;

  constructor(
    _viewCtrl: ViewController,
    config: Config,
    _elementRef: ElementRef,
    gestureCtrl: GestureController,
    params: NavParams,
    renderer: Renderer
  ) {
    super(
        _viewCtrl,
        config,
        _elementRef,
        gestureCtrl,
        params,
        renderer
    );
  }
}
