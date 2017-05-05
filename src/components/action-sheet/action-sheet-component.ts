import { Component, ElementRef, HostListener, Renderer, ViewEncapsulation } from '@angular/core';

import { ActionSheetOptions, ActionSheetButton } from './action-sheet-options';
import { assert } from '../../util/util';
import { BlockerDelegate, GestureController, BLOCK_ALL } from '../../gestures/gesture-controller';
import { Config } from '../../config/config';
import { KEY_ESCAPE } from '../../platform/key';
import { Platform } from '../../platform/platform';
import { NavParams } from '../../navigation/nav-params';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';

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

export class ActionSheetCmp {

  d: ActionSheetOptions;
  cancelButton: ActionSheetButton;
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
    this.d.buttons = this.d.buttons.map(button => {
      if (typeof button === 'string') {
        button = { text: button };
      }
      if (!button.cssClass) {
        button.cssClass = '';
      }
      switch (button.role) {
        case 'cancel':
          this.cancelButton = button;
          return null;
        case 'destructive':
          button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-destructive';
          break;
        case 'selected':
          button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-selected';
          break;
      }
      return button;
    }).filter(button => button !== null);
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
    if (this.enabled && ev.keyCode === KEY_ESCAPE && this._viewCtrl.isLast()) {
      console.debug('actionsheet, escape button');
      this.bdClick();
    }
  }

  click(button: ActionSheetButton) {
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
      if (this.cancelButton) {
        this.click(this.cancelButton);

      } else {
        this.dismiss('backdrop');
      }
    }
  }

  dismiss(role: string): Promise<any> {
    const opts: NavOptions = {
      minClickBlockDuration: 400
    };
    return this._viewCtrl.dismiss(null, role, opts);
  }

  ngOnDestroy() {
    assert(this.gestureBlocker.blocked === false, 'gesture blocker must be already unblocked');
    this.d = this.cancelButton = null;
    this.gestureBlocker.destroy();
  }
}

let actionSheetIds = -1;
