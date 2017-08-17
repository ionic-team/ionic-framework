import { Attribute, Directive, ElementRef, Input, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * \@name Label
 * \@description
 * Labels are placed inside of an `ion-item` element and can be used
 * to describe an `ion-input`, `ion-toggle`, `ion-checkbox`, and more.
 *
 * \@property [fixed] - A persistent label that sits next the input.
 * \@property [floating] - A label that will float above the input if the input is empty or loses focus.
 * \@property [stacked] - A stacked label will always appear on top of the input.
 *
 * \@usage
 * ```html
 *  <ion-item>
 *    <ion-label>Username</ion-label>
 *    <ion-input></ion-input>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label fixed>Website</ion-label>
 *    <ion-input type="url"></ion-input>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label floating>Email</ion-label>
 *    <ion-input type="email"></ion-input>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label stacked>Phone</ion-label>
 *    <ion-input type="tel"></ion-input>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label>Toggle</ion-label>
 *    <ion-toggle></ion-toggle>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label>Checkbox</ion-label>
 *    <ion-checkbox></ion-checkbox>
 *  </ion-item>
 * ```
 *
 * \@demo /docs/demos/src/label/
 * @see {\@link ../../../../components#inputs Input Component Docs}
 * @see {\@link ../../input/Input Input API Docs}
 *
 */
export class Label extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} isFloating
     * @param {?} isStacked
     * @param {?} isFixed
     * @param {?} isInset
     */
    constructor(config, elementRef, renderer, isFloating, isStacked, isFixed, isInset) {
        super(config, elementRef, renderer, 'label');
        this.type = (isFloating === '' ? 'floating' : (isStacked === '' ? 'stacked' : (isFixed === '' ? 'fixed' : (isInset === '' ? 'inset' : null))));
    }
    /**
     * @hidden
     * @return {?}
     */
    get id() {
        return this._id;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set id(val) {
        this._id = val;
        if (val) {
            this.setElementAttribute('id', val);
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    get text() {
        return this.getNativeElement().textContent || '';
    }
}
Label.decorators = [
    { type: Directive, args: [{
                selector: 'ion-label'
            },] },
];
/**
 * @nocollapse
 */
Label.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: undefined, decorators: [{ type: Attribute, args: ['floating',] },] },
    { type: undefined, decorators: [{ type: Attribute, args: ['stacked',] },] },
    { type: undefined, decorators: [{ type: Attribute, args: ['fixed',] },] },
    { type: undefined, decorators: [{ type: Attribute, args: ['inset',] },] },
];
Label.propDecorators = {
    'id': [{ type: Input },],
};
function Label_tsickle_Closure_declarations() {
    /** @type {?} */
    Label.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Label.ctorParameters;
    /** @type {?} */
    Label.propDecorators;
    /** @type {?} */
    Label.prototype._id;
    /**
     * @hidden
     * @type {?}
     */
    Label.prototype.type;
}
//# sourceMappingURL=label.js.map