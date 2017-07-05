import { Component, ElementRef, HostListener, QueryList, Renderer, ViewChildren, ViewEncapsulation } from '@angular/core';

import { assert, isNumber, isPresent, isString } from '../../util/util';
import { Config } from '../../config/config';
import { BLOCK_ALL, BlockerDelegate, GestureController, } from '../../gestures/gesture-controller';
import { KEY_ENTER, KEY_ESCAPE } from '../../platform/key';
import { NavParams } from '../../navigation/nav-params';
import { Picker } from './picker';
import { PickerColumnOption, PickerOptions } from './picker-options';
import { ViewController } from '../../navigation/view-controller';

import { PickerColumnCmp } from './picker-column';

/**
 * @hidden
 */
@Component({
  selector: 'ion-picker-cmp',
  template: `
    <ion-backdrop (click)="bdClick()"></ion-backdrop>
    <div class="picker-wrapper">
      <div class="picker-toolbar">
        <div *ngFor="let b of d.buttons" class="picker-toolbar-button" [ngClass]="b.cssRole">
          <button ion-button (click)="btnClick(b)" [ngClass]="b.cssClass" class="picker-button" clear>
            {{b.text}}
          </button>
        </div>
      </div>
      <div class="picker-columns">
        <div class="picker-above-highlight"></div>
        <div *ngFor="let c of d.columns" [col]="c" class="picker-col" (ionChange)="_colChange($event)"></div>
        <div class="picker-below-highlight"></div>
      </div>
    </div>
  `,
  host: {
    'role': 'dialog'
  },
  encapsulation: ViewEncapsulation.None,
})
export class PickerCmp {

  @ViewChildren(PickerColumnCmp) _cols: QueryList<PickerColumnCmp>;
  d: PickerOptions;
  enabled: boolean;
  lastClick: number;
  id: number;
  mode: string;
  _gestureBlocker: BlockerDelegate;

  constructor(
    private _viewCtrl: ViewController,
    private _elementRef: ElementRef,
    config: Config,
    gestureCtrl: GestureController,
    params: NavParams,
    renderer: Renderer
  ) {
    this._gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
    this.d = params.data;
    this.mode = config.get('mode');
    renderer.setElementClass(_elementRef.nativeElement, `picker-${this.mode}`, true);

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++pickerIds);
    this.lastClick = 0;
  }

  ionViewWillLoad() {
    // normalize the data
    let data = this.d;

    data.buttons = data.buttons.map(button => {
      if (isString(button)) {
        return { text: button };
      }
      if (button.role) {
        button.cssRole = `picker-toolbar-${button.role}`;
      }
      return button;
    });

    // clean up dat data
    data.columns = data.columns.map(column => {
      if (!isPresent(column.options)) {
        column.options = [];
      }
      column.selectedIndex = column.selectedIndex || 0;
      column.options = column.options.map(inputOpt => {
        let opt: PickerColumnOption = {
          text: '',
          value: '',
          disabled: inputOpt.disabled,
        };

        if (isPresent(inputOpt)) {
          if (isString(inputOpt) || isNumber(inputOpt)) {
            opt.text = inputOpt.toString();
            opt.value = inputOpt;

          } else {
            opt.text = isPresent(inputOpt.text) ? inputOpt.text : inputOpt.value;
            opt.value = isPresent(inputOpt.value) ? inputOpt.value : inputOpt.text;
          }
        }

        return opt;
      });
      return column;
    });
  }

  ionViewDidLoad() {
    this.refresh();
  }

  ionViewWillEnter() {
    this._gestureBlocker.block();
  }

  ionViewDidLeave() {
    this._gestureBlocker.unblock();
  }

  refresh() {
    this._cols.forEach(column => column.refresh());
  }

  _colChange() {
    // one of the columns has changed its selected index
    var picker = <Picker>this._viewCtrl;
    picker.ionChange.emit(this.getSelected());
  }

  @HostListener('body:keyup', ['$event'])
  _keyUp(ev: KeyboardEvent) {
    if (this.enabled && this._viewCtrl.isLast()) {
      if (ev.keyCode === KEY_ENTER) {
        if (this.lastClick + 1000 < Date.now()) {
          // do not fire this click if there recently was already a click
          // this can happen when the button has focus and used the enter
          // key to click the button. However, both the click handler and
          // this keyup event will fire, so only allow one of them to go.
          console.debug('picker, enter button');
          let button = this.d.buttons[this.d.buttons.length - 1];
          this.btnClick(button);
        }

      } else if (ev.keyCode === KEY_ESCAPE) {
        console.debug('picker, escape button');
        this.bdClick();
      }
    }
  }

  ionViewDidEnter() {
    let focusableEle = this._elementRef.nativeElement.querySelector('button');
    if (focusableEle) {
      focusableEle.focus();
    }
    this.enabled = true;
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
      if (button.handler(this.getSelected()) === false) {
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
      let cancelBtn = this.d.buttons.find(b => b.role === 'cancel');
      if (cancelBtn) {
        this.btnClick(cancelBtn);
      } else {
        this.dismiss('backdrop');
      }
    }
  }

  dismiss(role: string): Promise<any> {
    return this._viewCtrl.dismiss(this.getSelected(), role);
  }

  getSelected(): any {
    let selected: {[k: string]: any} = {};
    this.d.columns.forEach((col, index) => {
      let selectedColumn = col.options[col.selectedIndex];
      selected[col.name] = {
        text: selectedColumn ? selectedColumn.text : null,
        value: selectedColumn ? selectedColumn.value : null,
        columnIndex: index,
      };
    });
    return selected;
  }

  ngOnDestroy() {
    assert(this._gestureBlocker.blocked === false, 'gesture blocker must be already unblocked');
    this._gestureBlocker.destroy();

  }
}

let pickerIds = -1;

