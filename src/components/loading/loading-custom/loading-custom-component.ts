import { LoadingCmp } from './../loading-component';
import { Component, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../../config/config';
import { BlockerDelegate, GestureController } from '../../../gestures/gesture-controller';
import { LoadingOptions } from '../loading-options';
import { NavParams } from '../../../navigation/nav-params';
import { ViewController } from '../../../navigation/view-controller';

/**
* @hidden
*/
@Component({
  selector: 'ion-loading',
  template:
    '<ion-backdrop [hidden]="!d.showBackdrop" (click)="bdClick()" [class.backdrop-no-tappable]="!d.enableBackdropDismiss"></ion-backdrop>' +
    '<div class="loading-wrapper">' +
      '<div *ngIf="showSpinner" class="loading-spinner">' +
        '<ion-spinner [name]="d.spinner"></ion-spinner>' +
      '</div>' +
      '<div class="loading-custom-text">My custom Loading</div>' +
      '<div *ngIf="d.content" [innerHTML]="d.content" class="loading-content"></div>' +
    '</div>',
  host: {
    'role': 'dialog'
  },
  encapsulation: ViewEncapsulation.None,
})
export class LoadingCustomCmp extends LoadingCmp {
  d: LoadingOptions;
  id: number;
  showSpinner: boolean;
  durationTimeout: any;
  gestureBlocker: BlockerDelegate;

  constructor(
    _viewCtrl: ViewController,
    _config: Config,
    _elementRef: ElementRef,
    gestureCtrl: GestureController,
    params: NavParams,
    renderer: Renderer
  ) {
    super(
        _viewCtrl,
        _config,
        _elementRef,
        gestureCtrl,
        params,
        renderer
    );
  }
}
