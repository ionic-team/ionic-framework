(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../util/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("../../util/util");
    /**
     * \@name SegmentButton
     * \@description
     * The child buttons of the `ion-segment` component. Each `ion-segment-button` must have a value.
     *
     * \@usage
     *
     * ```html
     * <ion-content>
     *   <!-- Segment buttons with icons -->
     *   <ion-segment [(ngModel)]="icons" color="secondary">
     *     <ion-segment-button value="camera">
     *       <ion-icon name="camera"></ion-icon>
     *     </ion-segment-button>
     *     <ion-segment-button value="bookmark">
     *       <ion-icon name="bookmark"></ion-icon>
     *     </ion-segment-button>
     *   </ion-segment>
     *
     *   <!-- Segment buttons with text -->
     *   <ion-segment [(ngModel)]="relationship" color="primary">
     *     <ion-segment-button value="friends" (ionSelect)="selectedFriends()">
     *       Friends
     *     </ion-segment-button>
     *     <ion-segment-button value="enemies" (ionSelect)="selectedEnemies()">
     *       Enemies
     *     </ion-segment-button>
     *   </ion-segment>
     * </ion-content>
     * ```
     *
     *
     * \@demo /docs/demos/src/segment/
     * @see {\@link /docs/components#segment Segment Component Docs}
     * @see {\@link /docs/api/components/segment/Segment/ Segment API Docs}
     */
    var SegmentButton = (function () {
        function SegmentButton() {
            this.isActive = false;
            this._disabled = false;
            /**
             * \@output {SegmentButton} Emitted when a segment button has been clicked.
             */
            this.ionSelect = new core_1.EventEmitter();
        }
        Object.defineProperty(SegmentButton.prototype, "disabled", {
            /**
             * \@input {boolean} If true, the user cannot interact with this element.
             * @return {?}
             */
            get: function () {
                return this._disabled;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._disabled = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * On click of a SegmentButton
         * @return {?}
         */
        SegmentButton.prototype.onClick = function () {
            (void 0) /* console.debug */;
            this.ionSelect.emit(this);
        };
        /**
         * @hidden
         * @return {?}
         */
        SegmentButton.prototype.ngOnInit = function () {
            if (!util_1.isPresent(this.value)) {
                console.warn('<ion-segment-button> requires a "value" attribute');
            }
        };
        return SegmentButton;
    }());
    SegmentButton.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-segment-button',
                    template: '<ng-content></ng-content>' +
                        '<div class="button-effect"></div>',
                    host: {
                        'tappable': '',
                        'class': 'segment-button',
                        'role': 'button',
                        '[class.segment-button-disabled]': '_disabled',
                        '[class.segment-activated]': 'isActive',
                        '[attr.aria-pressed]': 'isActive'
                    },
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    SegmentButton.ctorParameters = function () { return []; };
    SegmentButton.propDecorators = {
        'value': [{ type: core_1.Input },],
        'ionSelect': [{ type: core_1.Output },],
        'disabled': [{ type: core_1.Input },],
        'onClick': [{ type: core_1.HostListener, args: ['click',] },],
    };
    exports.SegmentButton = SegmentButton;
    function SegmentButton_tsickle_Closure_declarations() {
        /** @type {?} */
        SegmentButton.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        SegmentButton.ctorParameters;
        /** @type {?} */
        SegmentButton.propDecorators;
        /** @type {?} */
        SegmentButton.prototype.isActive;
        /** @type {?} */
        SegmentButton.prototype._disabled;
        /**
         * \@input {string} the value of the segment button. Required.
         * @type {?}
         */
        SegmentButton.prototype.value;
        /**
         * \@output {SegmentButton} Emitted when a segment button has been clicked.
         * @type {?}
         */
        SegmentButton.prototype.ionSelect;
    }
});
//# sourceMappingURL=segment-button.js.map