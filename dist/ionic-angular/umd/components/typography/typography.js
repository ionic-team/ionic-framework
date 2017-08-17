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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../config/config", "../ion"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var ion_1 = require("../ion");
    /**
     * \@name Typography
     * \@module ionic
     * \@description
     *
     * The Typography component is a simple component that can be used to style the text color of any element.
     * The `ion-text` attribute should be added to the element in order to pass a color from the Sass `$colors`
     * map and change the text color of that element.
     *
     * \@usage
     *
     * ```html
     * <h1 ion-text color="secondary">H1: The quick brown fox jumps over the lazy dog</h1>
     *
     * <h2 ion-text color="primary">H2: The quick brown fox jumps over the lazy dog</h2>
     *
     * <h3 ion-text color="light">H3: The quick brown fox jumps over the lazy dog</h3>
     *
     * <h4 ion-text color="danger">H4: The quick brown fox jumps over the lazy dog</h4>
     *
     * <h5 ion-text color="dark">H5: The quick brown fox jumps over the lazy dog</h5>
     *
     * <h6 ion-text [color]="dynamicColor">H6: The quick brown fox jumps over the lazy dog</h6>
     *
     * <p>
     *   I saw a werewolf with a Chinese menu in his hand.
     *   Walking through the <sub ion-text color="danger">streets</sub> of Soho in the rain.
     *   He <i ion-text color="primary">was</i> looking for a place called Lee Ho Fook's.
     *   Gonna get a <a ion-text color="secondary">big dish of beef chow mein.</a>
     * </p>
     *
     * <p>
     *   He's the hairy-handed gent who ran amuck in Kent.
     *   Lately he's <sup ion-text color="primary">been</sup> overheard in Mayfair.
     *   Better stay away from him.
     *   He'll rip your lungs out, Jim.
     *   I'd like to meet his tailor.
     * </p>
     * ```
     *
     */
    var Typography = (function (_super) {
        __extends(Typography, _super);
        /**
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         */
        function Typography(config, elementRef, renderer) {
            return _super.call(this, config, elementRef, renderer, 'text') || this;
        }
        return Typography;
    }(ion_1.Ion));
    Typography.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[ion-text]'
                },] },
    ];
    /**
     * @nocollapse
     */
    Typography.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
    ]; };
    exports.Typography = Typography;
    function Typography_tsickle_Closure_declarations() {
        /** @type {?} */
        Typography.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Typography.ctorParameters;
    }
});
//# sourceMappingURL=typography.js.map