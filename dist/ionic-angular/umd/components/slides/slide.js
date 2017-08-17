(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./slides"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var slides_1 = require("./slides");
    /**
     * \@name Slide
     * \@description
     * The Slide component is a child component of [Slides](../Slides). The template
     * should be written as `ion-slide`. Any slide content should be written
     * in this component and it should be used in conjunction with [Slides](../Slides).
     *
     * See the [Slides API Docs](../Slides) for more usage information.
     *
     * \@demo /docs/demos/src/slides/
     * @see {\@link /docs/api/components/slides/Slides/ Slides API Docs}
     */
    var Slide = (function () {
        /**
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} _slides
         */
        function Slide(elementRef, renderer, _slides) {
            this._slides = _slides;
            renderer.setElementClass(elementRef.nativeElement, 'swiper-slide', true);
            _slides.update(10);
        }
        /**
         * @hidden
         * @return {?}
         */
        Slide.prototype.ngOnDestroy = function () {
            this._slides.update(10);
        };
        return Slide;
    }());
    Slide.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-slide',
                    template: '<div class="slide-zoom">' +
                        '<ng-content></ng-content>' +
                        '</div>',
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    Slide.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: slides_1.Slides, },
    ]; };
    exports.Slide = Slide;
    function Slide_tsickle_Closure_declarations() {
        /** @type {?} */
        Slide.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Slide.ctorParameters;
        /** @type {?} */
        Slide.prototype._slides;
    }
});
//# sourceMappingURL=slide.js.map