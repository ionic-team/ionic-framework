import { Directive, Host, Optional } from '@angular/core';
import { DeepLinker } from '../../navigation/deep-linker';
import { NavPush } from './nav-push';
/**
 * @hidden
 */
export class NavPushAnchor {
    /**
     * @param {?} host
     * @param {?} linker
     */
    constructor(host, linker) {
        this.host = host;
        this.linker = linker;
    }
    /**
     * @return {?}
     */
    updateHref() {
        if (this.host && this.linker) {
            this._href = this.linker.createUrl(this.host._nav, this.host.navPush, this.host.navParams) || '#';
        }
        else {
            this._href = '#';
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this.updateHref();
    }
}
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
NavPushAnchor.ctorParameters = () => [
    { type: NavPush, decorators: [{ type: Host },] },
    { type: DeepLinker, decorators: [{ type: Optional },] },
];
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