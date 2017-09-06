var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * \@name Note
 * \@module ionic
 * \@description
 * A note is detailed item in an ion-item. It creates greyed out element that can be on the left or right side of an item.
 * \@usage
 *
 * ```html
 * <ion-content>
 *   <ion-list>
 *     <ion-item>
 *       <ion-note item-start>
 *         Left Note
 *       </ion-note>
 *       My Item
 *       <ion-note item-end>
 *         Right Note
 *       </ion-note>
 *     </ion-item>
 *   </ion-list>
 * </ion-content>
 * ```
 * {\@link /docs/api/components/api/components/item/item ion-item}
 */
var Note = (function (_super) {
    __extends(Note, _super);
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    function Note(config, elementRef, renderer) {
        return _super.call(this, config, elementRef, renderer, 'note') || this;
    }
    return Note;
}(Ion));
export { Note };
Note.decorators = [
    { type: Directive, args: [{
                selector: 'ion-note'
            },] },
];
/**
 * @nocollapse
 */
Note.ctorParameters = function () { return [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
]; };
function Note_tsickle_Closure_declarations() {
    /** @type {?} */
    Note.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Note.ctorParameters;
}
//# sourceMappingURL=note.js.map