import { Component, ElementRef, HostListener, Renderer, ViewEncapsulation } from '@angular/core';

import { assert } from '../../util/util';
import { BlockerDelegate, GestureController, BLOCK_ALL } from '../../gestures/gesture-controller';
import { Config } from '../../config/config';
import { Key } from '../../platform/key';
import { Platform } from '../../platform/platform';
import { NavParams } from '../../navigation/nav-params';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';

/**
 * @private
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
          '<button ion-button="action-sheet-button" (click)="click(b)" *ngFor="let b of d.buttons" class="disable-hover" [attr.icon-left]="b.icon ? \'\' : null" [ngClass]="b.cssClass">' +
            '<ion-icon [name]="b.icon" *ngIf="b.icon" class="action-sheet-icon"></ion-icon>' +
            '{{b.text}}' +
          '</button>' +
        '</div>' +
        '<div class="action-sheet-group" *ngIf="d.cancelButton">' +
          '<button ion-button="action-sheet-button" (click)="click(d.cancelButton)" class="action-sheet-cancel disable-hover" [attr.icon-left]="d.cancelButton.icon ? \'\' : null" [ngClass]="d.cancelButton.cssClass">' +
            '<ion-icon [name]="d.cancelButton.icon" *ngIf="d.cancelButton.icon" class="action-sheet-icon"></ion-icon>' +
            '{{d.cancelButton.text}}' +
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
export class ActionSheetCmp {
  d: {
    title?: string;
    subTitle?: string;
    cssClass?: string;
    buttons?: Array<any>;
    enableBackdropDismiss?: boolean;
    cancelButton: any;
  };
  descId: string;
  enabled: boolean;
  hdrId: string;
  id: number;
  mode: string;
  gestureBlocker: BlockerDelegate;

  constructor(
    private _viewCtrl: ViewController,
    config: Config,
    private _plt: Platform,
    private _elementRef: ElementRef,
    gestureCtrl: GestureController,
    params: NavParams,
    renderer: Renderer
  ) {
    this.gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
    this.d = params.data;
    this.mode = config.get('mode');
    renderer.setElementClass(_elementRef.nativeElement, `action-sheet-${this.mode}`, true);

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        // Make sure the class isn't whitespace, otherwise it throws exceptions
        if (cssClass.trim() !== '') renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++actionSheetIds);
    if (this.d.title) {
      this.hdrId = 'acst-hdr-' + this.id;
    }
    if (this.d.subTitle) {
      this.descId = 'acst-subhdr-' + this.id;
    }
  }

  ionViewDidLoad() {
    // normalize the data
    let buttons: any[] = [];

    this.d.buttons.forEach((button: any) => {
      if (typeof button === 'string') {
        button = { text: button };
      }
      if (!button.cssClass) {
        button.cssClass = '';
      }

      if (button.role === 'cancel') {
        this.d.cancelButton = button;

      } else {
        if (button.role === 'destructive') {
          button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-destructive';
        } else if (button.role === 'selected') {
          button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-selected';
        }
        buttons.push(button);
      }
    });

    this.d.buttons = buttons;
  }

  ionViewWillEnter() {
    this.gestureBlocker.block();
  }

  ionViewDidLeave() {
    this.gestureBlocker.unblock();
  }

  ionViewDidEnter() {
    this._plt.focusOutActiveElement();

    const focusableEle = this._elementRef.nativeElement.querySelector('button');
    if (focusableEle) {
      focusableEle.focus();
    }
    this.enabled = true;
  }

  @HostListener('body:keyup', ['$event'])
  keyUp(ev: KeyboardEvent) {
    if (this.enabled && this._viewCtrl.isLast()) {
      if (ev.keyCode === Key.ESCAPE) {
        console.debug('actionsheet, escape button');
        this.bdClick();
      }
    }
  }

  click(button: any) {
    if (!this.enabled) {
      return;
    }

    let shouldDismiss = true;

    if (button.handler) {
      // a handler has been provided, execute it
      if (button.handler() === false) {
        // if the return value of the handler is false then do not dismiss
        shouldDismiss = false;
      }
    }

    if (shouldDismiss) {
      this.dismiss(button.role);
    }
  }

  bdClick() {
    if (this.enabled && this.d.enableBackdropDismiss) {
      if (this.d.cancelButton) {
        this.click(this.d.cancelButton);

      } else {
        this.dismiss('backdrop');
      }
    }
  }

  dismiss(role: any): Promise<any> {
    const opts: NavOptions = {
      minClickBlockDuration: 400
    };
    return this._viewCtrl.dismiss(null, role, opts);
  }

  ngOnDestroy() {
    assert(this.gestureBlocker.blocked === false, 'gesture blocker must be already unblocked');
    this.gestureBlocker.destroy();
  }
}

let actionSheetIds = -1;
