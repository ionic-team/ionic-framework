import { Directive, Host, Optional } from '@angular/core';
import { DeepLinker } from '../../navigation/deep-linker';
import { NavPush } from './nav-push';
/**
 * @hidden
 */
var NavPushAnchor = (function () {
    /**
     * @param {?} host
     * @param {?} linker
     */
    function NavPushAnchor(host, linker) {
        this.host = host;
        this.linker = linker;
    }
    /**
     * @return {?}
     */
    NavPushAnchor.prototype.updateHref = function () {
        if (this.host && this.linker) {
            this._href = this.linker.createUrl(this.host._nav, this.host.navPush, this.host.navParams) || '#';
        }
        else {
            this._href = '#';
        }
    };
    /**
     * @return {?}
     */
    NavPushAnchor.prototype.ngAfterContentInit = function () {
        this.updateHref();
    };
    return NavPushAnchor;
}());
export { NavPushAnchor };
NavPushAnchor.decorators = [
    { type: Directive, args: [{
                selector: 'a[navPush]',
                host: {
                    '[attr.href]': '_href'
                }
            },] },
];
/**
 * @nocollapse
 */
NavPushAnchor.ctorParameters = function () { return [
    { type: NavPush, decorators: [{ type: Host },] },
    { type: DeepLinker, decorators: [{ type: Optional },] },
]; };
function NavPushAnchor_tsickle_Closure_declarations() {
    /** @type {?} */
    NavPushAnchor.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NavPushAnchor.ctorParameters;
    /** @type {?} */
    NavPushAnchor.prototype._href;
    /** @type {?} */
    NavPushAnchor.prototype.host;
    /** @type {?} */
    NavPushAnchor.prototype.linker;
}
//# sourceMappingURL=nav-push-anchor.js.map