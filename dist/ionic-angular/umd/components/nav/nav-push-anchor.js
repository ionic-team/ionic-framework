(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../navigation/deep-linker", "./nav-push"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var deep_linker_1 = require("../../navigation/deep-linker");
    var nav_push_1 = require("./nav-push");
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
    NavPushAnchor.decorators = [
        { type: core_1.Directive, args: [{
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
        { type: nav_push_1.NavPush, decorators: [{ type: core_1.Host },] },
        { type: deep_linker_1.DeepLinker, decorators: [{ type: core_1.Optional },] },
    ]; };
    exports.NavPushAnchor = NavPushAnchor;
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
});
//# sourceMappingURL=nav-push-anchor.js.map