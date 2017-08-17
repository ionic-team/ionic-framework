import { Directive, Optional } from '@angular/core';
import { DeepLinker } from '../../navigation/deep-linker';
import { ViewController } from '../../navigation/view-controller';
import { NavPop } from './nav-pop';
/**
 * @hidden
 */
var NavPopAnchor = (function () {
    /**
     * @param {?} host
     * @param {?} linker
     * @param {?} viewCtrl
     */
    function NavPopAnchor(host, linker, viewCtrl) {
        this.host = host;
        this.linker = linker;
        this.viewCtrl = viewCtrl;
    }
    /**
     * @return {?}
     */
    NavPopAnchor.prototype.updateHref = function () {
        if (this.host && this.viewCtrl) {
            var /** @type {?} */ previousView = this.host._nav.getPrevious(this.viewCtrl);
            this._href = (previousView && this.linker.createUrl(this.host._nav, this.viewCtrl.component, this.viewCtrl.data)) || '#';
        }
        else {
            this._href = '#';
        }
    };
    /**
     * @return {?}
     */
    NavPopAnchor.prototype.ngAfterContentInit = function () {
        this.updateHref();
    };
    return NavPopAnchor;
}());
export { NavPopAnchor };
NavPopAnchor.decorators = [
    { type: Directive, args: [{
                selector: 'a[navPop]',
                host: {
                    '[attr.href]': '_href'
                }
            },] },
];
/**
 * @nocollapse
 */
NavPopAnchor.ctorParameters = function () { return [
    { type: NavPop, decorators: [{ type: Optional },] },
    { type: DeepLinker, },
    { type: ViewController, decorators: [{ type: Optional },] },
]; };
function NavPopAnchor_tsickle_Closure_declarations() {
    /** @type {?} */
    NavPopAnchor.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NavPopAnchor.ctorParameters;
    /** @type {?} */
    NavPopAnchor.prototype._href;
    /** @type {?} */
    NavPopAnchor.prototype.host;
    /** @type {?} */
    NavPopAnchor.prototype.linker;
    /** @type {?} */
    NavPopAnchor.prototype.viewCtrl;
}
//# sourceMappingURL=nav-pop-anchor.js.map