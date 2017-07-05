import { Component, ElementRef, HostListener, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { BLOCK_ALL, BlockerDelegate, GestureController } from '../../gestures/gesture-controller';
import { assert, isDefined, isUndefined } from '../../util/util';
import { KEY_ESCAPE } from '../../platform/key';
import { LoadingOptions } from './loading-options';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';

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
      '<div *ngIf="d.content" [innerHTML]="d.content" class="loading-content"></div>' +
    '</div>',
  host: {
    'role': 'dialog'
  },
  encapsulation: ViewEncapsulation.None,
})
export class LoadingCmp {
  d: LoadingOptions;
  id: number;
  showSpinner: boolean;
  durationTimeout: any;
  gestureBlocker: BlockerDelegate;

  constructor(
    private _viewCtrl: ViewController,
    private _config: Config,
    _elementRef: ElementRef,
    gestureCtrl: GestureController,
    params: NavParams,
    renderer: Renderer
  ) {
    assert(params.data, 'params data must be valid');
    this.gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
    this.d = params.data;

    renderer.setElementClass(_elementRef.nativeElement, `loading-${_config.get('mode')}`, true);

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        // Make sure the class isn't whitespace, otherwise it throws exceptions
        if (cssClass.trim() !== '') renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++loadingIds);
  }

  ngOnInit() {
    // If no spinner was passed in loading options we need to fall back
    // to the loadingSpinner in the app's config, then the mode spinner
    if (isUndefined(this.d.spinner)) {
      this.d.spinner = this._config.get('loadingSpinner', this._config.get('spinner', 'ios'));
    }

    // If the user passed hide to the spinner we don't want to show it
    this.showSpinner = isDefined(this.d.spinner) && this.d.spinner !== 'hide';
  }

  ionViewWillEnter() {
    this.gestureBlocker.block();
  }

  ionViewDidLeave() {
    this.gestureBlocker.unblock();
  }

  ionViewDidEnter() {
    // If there is a duration, dismiss after that amount of time
    if ( this.d && this.d.duration ) {
      this.durationTimeout = setTimeout(() => this.dismiss('backdrop'), this.d.duration);
    }

  }

  @HostListener('body:keyup', ['$event'])
  keyUp(ev: KeyboardEvent) {
    if (this._viewCtrl.isLast() && ev.keyCode === KEY_ESCAPE) {
      this.bdClick();
    }
  }

  bdClick() {
    if (this.d.enableBackdropDismiss) {
      this.dismiss('backdrop');
    }
  }

  dismiss(role: string): Promise<any> {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }
    return this._viewCtrl.dismiss(null, role);
  }

  ngOnDestroy() {
    assert(this.gestureBlocker.blocked === false, 'gesture blocker must be already unblocked');
    this.gestureBlocker.destroy();
  }
}

let loadingIds = -1;
