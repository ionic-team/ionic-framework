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
import { Ion } from '../ion';
/**
 * @hidden
 */
var ToolbarBase = (function (_super) {
    __extends(ToolbarBase, _super);
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    function ToolbarBase(config, elementRef, renderer) {
        return _super.call(this, config, elementRef, renderer, 'toolbar') || this;
    }
    /**
     * @hidden
     * @param {?} titleCmp
     * @return {?}
     */
    ToolbarBase.prototype._setTitle = function (titleCmp) {
        this._title = titleCmp;
    };
    /**
     * @hidden
     * Returns the toolbar title text if it exists or an empty string
     * @return {?}
     */
    ToolbarBase.prototype.getTitleText = function () {
        return (this._title && this._title.getTitleText()) || '';
    };
    return ToolbarBase;
}(Ion));
export { ToolbarBase };
function ToolbarBase_tsickle_Closure_declarations() {
    /** @type {?} */
    ToolbarBase.prototype._title;
}
//# sourceMappingURL=toolbar-base.js.map