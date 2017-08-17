import { Component, ElementRef, HostListener, Renderer, ViewChildren, ViewEncapsulation } from '@angular/core';
import { isNumber, isPresent, isString } from '../../util/util';
import { Config } from '../../config/config';
import { BLOCK_ALL, GestureController, } from '../../gestures/gesture-controller';
import { KEY_ENTER, KEY_ESCAPE } from '../../platform/key';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
import { PickerColumnCmp } from './picker-column';
/**
 * @hidden
 */
export class PickerCmp {
    /**
     * @param {?} _viewCtrl
     * @param {?} _elementRef
     * @param {?} config
     * @param {?} gestureCtrl
     * @param {?} params
     * @param {?} renderer
     */
    constructor(_viewCtrl, _elementRef, config, gestureCtrl, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._elementRef = _elementRef;
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
    /**
     * @return {?}
     */
    ionViewWillLoad() {
        // normalize the data
        let /** @type {?} */ data = this.d;
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
                let /** @type {?} */ opt = {
                    text: '',
                    value: '',
                    disabled: inputOpt.disabled,
                };
                if (isPresent(inputOpt)) {
                    if (isString(inputOpt) || isNumber(inputOpt)) {
                        opt.text = inputOpt.toString();
                        opt.value = inputOpt;
                    }
                    else {
                        opt.text = isPresent(inputOpt.text) ? inputOpt.text : inputOpt.value;
                        opt.value = isPresent(inputOpt.value) ? inputOpt.value : inputOpt.text;
                    }
                }
                return opt;
            });
            return column;
        });
    }
    /**
     * @return {?}
     */
    ionViewDidLoad() {
        this.refresh();
    }
    /**
     * @return {?}
     */
    ionViewWillEnter() {
        this._gestureBlocker.block();
    }
    /**
     * @return {?}
     */
    ionViewDidLeave() {
        this._gestureBlocker.unblock();
    }
    /**
     * @return {?}
     */
    refresh() {
        this._cols.forEach(column => column.refresh());
    }
    /**
     * @return {?}
     */
    _colChange() {
        // one of the columns has changed its selected index
        var /** @type {?} */ picker = (this._viewCtrl);
        picker.ionChange.emit(this.getSelected());
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    _keyUp(ev) {
        if (this.enabled && this._viewCtrl.isLast()) {
            if (ev.keyCode === KEY_ENTER) {
                if (this.lastClick + 1000 < Date.now()) {
                    // do not fire this click if there recently was already a click
                    // this can happen when the button has focus and used the enter
                    // key to click the button. However, both the click handler and
                    // this keyup event will fire, so only allow one of them to go.
                    (void 0) /* console.debug */;
                    let /** @type {?} */ button = this.d.buttons[this.d.buttons.length - 1];
                    this.btnClick(button);
                }
            }
            else if (ev.keyCode === KEY_ESCAPE) {
                (void 0) /* console.debug */;
                this.bdClick();
            }
        }
    }
    /**
     * @return {?}
     */
    ionViewDidEnter() {
        let /** @type {?} */ focusableEle = this._elementRef.nativeElement.querySelector('button');
        if (focusableEle) {
            focusableEle.focus();
        }
        this.enabled = true;
    }
    /**
     * @param {?} button
     * @return {?}
     */
    btnClick(button) {
        if (!this.enabled) {
            return;
        }
        // keep the time of the most recent button click
        this.lastClick = Date.now();
        let /** @type {?} */ shouldDismiss = true;
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
    /**
     * @return {?}
     */
    bdClick() {
        if (this.enabled && this.d.enableBackdropDismiss) {
            let /** @type {?} */ cancelBtn = this.d.buttons.find(b => b.role === 'cancel');
            if (cancelBtn) {
                this.btnClick(cancelBtn);
            }
            else {
                this.dismiss('backdrop');
            }
        }
    }
    /**
     * @param {?} role
     * @return {?}
     */
    dismiss(role) {
        return this._viewCtrl.dismiss(this.getSelected(), role);
    }
    /**
     * @return {?}
     */
    getSelected() {
        let /** @type {?} */ selected = {};
        this.d.columns.forEach((col, index) => {
            let /** @type {?} */ selectedColumn = col.options[col.selectedIndex];
            selected[col.name] = {
                text: selectedColumn ? selectedColumn.text : null,
                value: selectedColumn ? selectedColumn.value : null,
                columnIndex: index,
            };
        });
        return selected;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        (void 0) /* assert */;
        this._gestureBlocker.destroy();
    }
}
PickerCmp.decorators = [
    { type: Component, args: [{
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
            },] },
];
/**
 * @nocollapse
 */
PickerCmp.ctorParameters = () => [
    { type: ViewController, },
    { type: ElementRef, },
    { type: Config, },
    { type: GestureController, },
    { type: NavParams, },
    { type: Renderer, },
];
PickerCmp.propDecorators = {
    '_cols': [{ type: ViewChildren, args: [PickerColumnCmp,] },],
    '_keyUp': [{ type: HostListener, args: ['body:keyup', ['$event'],] },],
};
function PickerCmp_tsickle_Closure_declarations() {
    /** @type {?} */
    PickerCmp.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    PickerCmp.ctorParameters;
    /** @type {?} */
    PickerCmp.propDecorators;
    /** @type {?} */
    PickerCmp.prototype._cols;
    /** @type {?} */
    PickerCmp.prototype.d;
    /** @type {?} */
    PickerCmp.prototype.enabled;
    /** @type {?} */
    PickerCmp.prototype.lastClick;
    /** @type {?} */
    PickerCmp.prototype.id;
    /** @type {?} */
    PickerCmp.prototype.mode;
    /** @type {?} */
    PickerCmp.prototype._gestureBlocker;
    /** @type {?} */
    PickerCmp.prototype._viewCtrl;
    /** @type {?} */
    PickerCmp.prototype._elementRef;
}
let /** @type {?} */ pickerIds = -1;
//# sourceMappingURL=picker-component.js.map