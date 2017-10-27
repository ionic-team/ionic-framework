import { Component, ElementRef, HostListener, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { NON_TEXT_INPUT_REGEX } from '../../util/dom';
import { BLOCK_ALL, BlockerDelegate, GestureController } from '../../gestures/gesture-controller';
import { assert, isPresent } from '../../util/util';
import { KEY_ENTER, KEY_ESCAPE } from '../../platform/key';
import { NavParams } from '../../navigation/nav-params';
import { NavOptions } from '../../navigation/nav-util';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';
import { AlertButton, AlertInputOptions, AlertOptions } from './alert-options';


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
              '<input [placeholder]="i.placeholder" [(ngModel)]="i.value" [type]="i.type" dir="auto" [min]="i.min" [max]="i.max" [attr.id]="i.id" class="alert-input">' +
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
export class AlertCmp {

  activeId: string;
  descId: string;
  d: AlertOptions;
  enabled: boolean;
  hdrId: string;
  id: number;
  inputType: string;
  lastClick: number;
  msgId: string;
  subHdrId: string;
  mode: string;
  keyboardResizes: boolean;
  gestureBlocker: BlockerDelegate;

  constructor(
    public _viewCtrl: ViewController,
    public _elementRef: ElementRef,
    config: Config,
    gestureCtrl: GestureController,
    params: NavParams,
    private _renderer: Renderer,
    private _plt: Platform
  ) {
    // gesture blocker is used to disable gestures dynamically
    this.gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
    this.d = params.data;
    this.mode = this.d.mode || config.get('mode');
    this.keyboardResizes = config.getBoolean('keyboardResizes', false);
    _renderer.setElementClass(_elementRef.nativeElement, `alert-${this.mode}`, true);

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        // Make sure the class isn't whitespace, otherwise it throws exceptions
        if (cssClass.trim() !== '') _renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++alertIds);
    this.descId = '';
    this.hdrId = 'alert-hdr-' + this.id;
    this.subHdrId = 'alert-subhdr-' + this.id;
    this.msgId = 'alert-msg-' + this.id;
    this.activeId = '';
    this.lastClick = 0;

    if (this.d.message) {
      this.descId = this.msgId;

    } else if (this.d.subTitle) {
      this.descId = this.subHdrId;
    }

    if (!this.d.message) {
      this.d.message = '';
    }
  }

  ionViewDidLoad() {
    // normalize the data
    const data = this.d;

    data.buttons = data.buttons.map(button => {
      if (typeof button === 'string') {
        return { text: button };
      }
      return button;
    });

    data.inputs = data.inputs.map((input, index) => {
      let r: AlertInputOptions = {
        type: input.type || 'text',
        name: isPresent(input.name) ? input.name : index + '',
        placeholder: isPresent(input.placeholder) ? input.placeholder : '',
        value: isPresent(input.value) ? input.value : '',
        label: input.label,
        checked: !!input.checked,
        disabled: !!input.disabled,
        id: isPresent(input.id) ? input.id : `alert-input-${this.id}-${index}`,
        handler: isPresent(input.handler) ? input.handler : null,
        min: isPresent(input.min) ? input.min : null,
        max: isPresent(input.max) ? input.max : null
      };
      return r;
    });


    // An alert can be created with several different inputs. Radios,
    // checkboxes and inputs are all accepted, but they cannot be mixed.
    const inputTypes: string[] = [];
    data.inputs.forEach(input => {
      if (inputTypes.indexOf(input.type) < 0) {
        inputTypes.push(input.type);
      }
    });

    if (inputTypes.length > 1 && (inputTypes.indexOf('checkbox') > -1 || inputTypes.indexOf('radio') > -1)) {
      console.warn(`Alert cannot mix input types: ${(inputTypes.join('/'))}. Please see alert docs for more info.`);
    }

    this.inputType = inputTypes.length ? inputTypes[0] : null;

    const checkedInput = this.d.inputs.find(input => input.checked);
    if (checkedInput) {
      this.activeId = checkedInput.id;
    }

    const hasTextInput = (this.d.inputs.length && this.d.inputs.some(i => !(NON_TEXT_INPUT_REGEX.test(i.type))));
    if (!this.keyboardResizes && hasTextInput && this._plt.is('mobile')) {
      // this alert has a text input and it's on a mobile device so we should align
      // the alert up high because we need to leave space for the virtual keboard
      // this also helps prevent the layout getting all messed up from
      // the browser trying to scroll the input into a safe area
      this._renderer.setElementClass(this._elementRef.nativeElement, 'alert-top', true);
    }
  }

  ionViewWillEnter() {
    this.gestureBlocker.block();
  }

  ionViewDidLeave() {
    this.gestureBlocker.unblock();
  }

  ionViewDidEnter() {
    // set focus on the first input or button in the alert
    // note that this does not always work and bring up the keyboard on
    // devices since the focus command must come from the user's touch event
    // and ionViewDidEnter is not in the same callstack as the touch event :(
    const focusableEle = this._elementRef.nativeElement.querySelector('input,button');
    if (focusableEle) {
      setTimeout(() => focusableEle.focus());
    }
    this.enabled = true;
  }

  @HostListener('body:keyup', ['$event'])
  keyUp(ev: KeyboardEvent) {
    if (this.enabled && this._viewCtrl.isLast()) {
      if (ev.keyCode === KEY_ENTER) {
        if (this.lastClick + 1000 < Date.now()) {
          // do not fire this click if there recently was already a click
          // this can happen when the button has focus and used the enter
          // key to click the button. However, both the click handler and
          // this keyup event will fire, so only allow one of them to go.
          console.debug(`alert, enter button`);
          let button = this.d.buttons[this.d.buttons.length - 1];
          this.btnClick(button);
        }

      } else if (ev.keyCode === KEY_ESCAPE) {
        console.debug(`alert, escape button`);
        this.bdClick();
      }
    }
  }

  btnClick(button: any) {
    if (!this.enabled) {
      return;
    }

    // keep the time of the most recent button click
    this.lastClick = Date.now();

    let shouldDismiss = true;

    if (button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      if (button.handler(this.getValues()) === false) {
        // if the return value of the handler is false then do not dismiss
        shouldDismiss = false;
      }
    }

    if (shouldDismiss) {
      this.dismiss(button.role);
    }
  }

  rbClick(checkedInput: any) {
    if (this.enabled) {
      this.d.inputs.forEach(input => {
        input.checked = (checkedInput === input);
      });
      this.activeId = checkedInput.id;

      if (checkedInput.handler) {
        checkedInput.handler(checkedInput);
      }
    }
  }

  cbClick(checkedInput: any) {
    if (this.enabled) {
      checkedInput.checked = !checkedInput.checked;

      if (checkedInput.handler) {
        checkedInput.handler(checkedInput);
      }
    }
  }

  bdClick() {
    if (this.enabled && this.d.enableBackdropDismiss) {
      var cancelBtn = this.d.buttons.find(b => (<AlertButton>b).role === 'cancel');
      if (cancelBtn) {
        this.btnClick(cancelBtn);

      } else {
        this.dismiss('backdrop');
      }
    }
  }

  dismiss(role: string): Promise<any> {
    const opts: NavOptions = {
      minClickBlockDuration: 400
    };
    return this._viewCtrl.dismiss(this.getValues(), role, opts);
  }

  getValues(): any {
    if (this.inputType === 'radio') {
      // this is an alert with radio buttons (single value select)
      // return the one value which is checked, otherwise undefined
      const checkedInput = this.d.inputs.find(i => i.checked);
      return checkedInput ? checkedInput.value : undefined;
    }

    if (this.inputType === 'checkbox') {
      // this is an alert with checkboxes (multiple value select)
      // return an array of all the checked values
      return this.d.inputs.filter(i => i.checked).map(i => i.value);
    }

    if (this.d.inputs.length === 0) {
      // this is an alert without any options/inputs at all
      return undefined;
    }

    // this is an alert with text inputs
    // return an object of all the values with the input name as the key
    const values: {[k: string]: string} = {};
    this.d.inputs.forEach(i => {
      values[i.name] = i.value;
    });
    return values;
  }

  ngOnDestroy() {
    assert(this.gestureBlocker.blocked === false, 'gesture blocker must be already unblocked');
    this.gestureBlocker.destroy();
  }
}

let alertIds = -1;
