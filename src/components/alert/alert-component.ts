import { Component, ElementRef, HostListener, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { isPresent } from '../../util/util';
import { Key } from '../../util/key';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';


/**
 * @private
 */
@Component({
  selector: 'ion-alert',
  template:
    '<ion-backdrop (click)="bdClick()"></ion-backdrop>' +
    '<div class="alert-wrapper">' +
      '<div class="alert-head">' +
        '<h2 id="{{hdrId}}" class="alert-title" *ngIf="d.title" [innerHTML]="d.title"></h2>' +
        '<h3 id="{{subHdrId}}" class="alert-sub-title" *ngIf="d.subTitle" [innerHTML]="d.subTitle"></h3>' +
      '</div>' +
      '<div id="{{msgId}}" class="alert-message" [innerHTML]="d.message"></div>' +
      '<div *ngIf="d.inputs.length" [ngSwitch]="inputType">' +

        '<template ngSwitchCase="radio">' +
          '<div class="alert-radio-group" role="radiogroup" [attr.aria-labelledby]="hdrId" [attr.aria-activedescendant]="activeId">' +
            '<button ion-button="alert-radio-button" *ngFor="let i of d.inputs" (click)="rbClick(i)" [attr.aria-checked]="i.checked" [disabled]="i.disabled" [attr.id]="i.id" class="alert-tappable alert-radio" role="radio">' +
              '<div class="alert-radio-icon"><div class="alert-radio-inner"></div></div>' +
              '<div class="alert-radio-label">' +
                '{{i.label}}' +
              '</div>' +
            '</button>' +
          '</div>' +
        '</template>' +

        '<template ngSwitchCase="checkbox">' +
          '<div class="alert-checkbox-group">' +
            '<button ion-button="alert-checkbox-button" *ngFor="let i of d.inputs" (click)="cbClick(i)" [attr.aria-checked]="i.checked" [disabled]="i.disabled" class="alert-tappable alert-checkbox" role="checkbox">' +
              '<div class="alert-checkbox-icon"><div class="alert-checkbox-inner"></div></div>' +
              '<div class="alert-checkbox-label">' +
                '{{i.label}}' +
              '</div>' +
            '</button>' +
          '</div>' +
        '</template>' +

        '<template ngSwitchDefault>' +
          '<div class="alert-input-group">' +
            '<div *ngFor="let i of d.inputs" class="alert-input-wrapper">' +
              '<input [placeholder]="i.placeholder" [(ngModel)]="i.value" [type]="i.type" class="alert-input">' +
            '</div>' +
          '</div>' +
        '</template>' +

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
  d: {
    cssClass?: string;
    message?: string;
    title?: string;
    subTitle?: string;
    buttons?: any[];
    inputs?: any[];
    enableBackdropDismiss?: boolean;
  };
  enabled: boolean;
  hdrId: string;
  id: number;
  inputType: string;
  lastClick: number;
  msgId: string;
  subHdrId: string;
  mode: string;

  constructor(
    public _viewCtrl: ViewController,
    public _elementRef: ElementRef,
    public _config: Config,
    params: NavParams,
    renderer: Renderer
  ) {
    this.d = params.data;
    this.mode = _config.get('mode');
    renderer.setElementClass(_elementRef.nativeElement, `alert-${this.mode}`, true);

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        // Make sure the class isn't whitespace, otherwise it throws exceptions
        if (cssClass.trim() !== '') renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
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
    let data = this.d;

    data.buttons = data.buttons.map(button => {
      if (typeof button === 'string') {
        return { text: button };
      }
      return button;
    });

    data.inputs = data.inputs.map((input, index) => {
      return {
        type: input.type || 'text',
        name: isPresent(input.name) ? input.name : index,
        placeholder: isPresent(input.placeholder) ? input.placeholder : '',
        value: isPresent(input.value) ? input.value : '',
        label: input.label,
        checked: !!input.checked,
        disabled: !!input.disabled,
        id: 'alert-input-' + this.id + '-' + index
      };
    });


    // An alert can be created with several different inputs. Radios,
    // checkboxes and inputs are all accepted, but they cannot be mixed.
    let inputTypes: any[] = [];
    data.inputs.forEach(input => {
      if (inputTypes.indexOf(input.type) < 0) {
        inputTypes.push(input.type);
      }
    });

    if (inputTypes.length > 1 && (inputTypes.indexOf('checkbox') > -1 || inputTypes.indexOf('radio') > -1)) {
      console.warn('Alert cannot mix input types: ' + (inputTypes.join('/')) + '. Please see alert docs for more info.');
    }

    this.inputType = inputTypes.length ? inputTypes[0] : null;

    let checkedInput = this.d.inputs.find(input => input.checked);
    if (checkedInput) {
      this.activeId = checkedInput.id;
    }
  }

  @HostListener('body:keyup', ['$event'])
  keyUp(ev: KeyboardEvent) {
    if (this.enabled && this._viewCtrl.isLast()) {
      if (ev.keyCode === Key.ENTER) {
        if (this.lastClick + 1000 < Date.now()) {
          // do not fire this click if there recently was already a click
          // this can happen when the button has focus and used the enter
          // key to click the button. However, both the click handler and
          // this keyup event will fire, so only allow one of them to go.
          console.debug('alert, enter button');
          let button = this.d.buttons[this.d.buttons.length - 1];
          this.btnClick(button);
        }

      } else if (ev.keyCode === Key.ESCAPE) {
        console.debug('alert, escape button');
        this.bdClick();
      }
    }
  }

  ionViewDidEnter() {
    let activeElement: any = document.activeElement;
    if (document.activeElement) {
      activeElement.blur();
    }

    let focusableEle = this._elementRef.nativeElement.querySelector('input,button');
    if (focusableEle) {
      focusableEle.focus();
    }
    this.enabled = true;
  }

  btnClick(button: any, dismissDelay?: number) {
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
      setTimeout(() => {
        this.dismiss(button.role);
      }, dismissDelay || this._config.get('pageTransitionDelay'));
    }
  }

  rbClick(checkedInput: any) {
    if (this.enabled) {
      this.d.inputs.forEach(input => {
        input.checked = (checkedInput === input);
      });
      this.activeId = checkedInput.id;
    }
  }

  cbClick(checkedInput: any) {
    if (this.enabled) {
      checkedInput.checked = !checkedInput.checked;
    }
  }

  bdClick() {
    if (this.enabled && this.d.enableBackdropDismiss) {
      let cancelBtn = this.d.buttons.find(b => b.role === 'cancel');
      if (cancelBtn) {
        this.btnClick(cancelBtn, 1);

      } else {
        this.dismiss('backdrop');
      }
    }
  }

  dismiss(role: any): Promise<any> {
    return this._viewCtrl.dismiss(this.getValues(), role);
  }

  getValues() {
    if (this.inputType === 'radio') {
      // this is an alert with radio buttons (single value select)
      // return the one value which is checked, otherwise undefined
      let checkedInput = this.d.inputs.find(i => i.checked);
      return checkedInput ? checkedInput.value : undefined;
    }

    if (this.inputType === 'checkbox') {
      // this is an alert with checkboxes (multiple value select)
      // return an array of all the checked values
      return this.d.inputs.filter(i => i.checked).map(i => i.value);
    }

    // this is an alert with text inputs
    // return an object of all the values with the input name as the key
    let values: {[k: string]: string} = {};
    this.d.inputs.forEach(i => {
      values[i.name] = i.value;
    });
    return values;
  }
}

let alertIds = -1;
