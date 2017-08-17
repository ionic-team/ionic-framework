import { Ion } from '../ion';
/**
 * @hidden
 */
export class ToolbarBase extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'toolbar');
    }
    /**
     * @hidden
     * @param {?} titleCmp
     * @return {?}
     */
    _setTitle(titleCmp) {
        this._title = titleCmp;
    }
    /**
     * @hidden
     * Returns the toolbar title text if it exists or an empty string
     * @return {?}
     */
    getTitleText() {
        return (this._title && this._title.getTitleText()) || '';
    }
}
function ToolbarBase_tsickle_Closure_declarations() {
    /** @type {?} */
    ToolbarBase.prototype._title;
}
//# sourceMappingURL=toolbar-base.js.map