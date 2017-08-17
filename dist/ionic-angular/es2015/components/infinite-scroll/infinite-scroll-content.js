import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Config } from '../../config/config';
import { InfiniteScroll } from './infinite-scroll';
/**
 * @hidden
 */
export class InfiniteScrollContent {
    /**
     * @param {?} inf
     * @param {?} _config
     */
    constructor(inf, _config) {
        this.inf = inf;
        this._config = _config;
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnInit() {
        if (!this.loadingSpinner) {
            this.loadingSpinner = this._config.get('infiniteLoadingSpinner', this._config.get('spinner', 'ios'));
        }
    }
}
InfiniteScrollContent.decorators = [
    { type: Component, args: [{
                selector: 'ion-infinite-scroll-content',
                template: '<div class="infinite-loading">' +
                    '<div class="infinite-loading-spinner" *ngIf="loadingSpinner">' +
                    '<ion-spinner [name]="loadingSpinner"></ion-spinner>' +
                    '</div>' +
                    '<div class="infinite-loading-text" [innerHTML]="loadingText" *ngIf="loadingText"></div>' +
                    '</div>',
                host: {
                    '[attr.state]': 'inf.state'
                },
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
InfiniteScrollContent.ctorParameters = () => [
    { type: InfiniteScroll, },
    { type: Config, },
];
InfiniteScrollContent.propDecorators = {
    'loadingSpinner': [{ type: Input },],
    'loadingText': [{ type: Input },],
};
function InfiniteScrollContent_tsickle_Closure_declarations() {
    /** @type {?} */
    InfiniteScrollContent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    InfiniteScrollContent.ctorParameters;
    /** @type {?} */
    InfiniteScrollContent.propDecorators;
    /**
     * \@input {string} An animated SVG spinner that shows while loading.
     * @type {?}
     */
    InfiniteScrollContent.prototype.loadingSpinner;
    /**
     * \@input {string} Optional text to display while loading.
     * @type {?}
     */
    InfiniteScrollContent.prototype.loadingText;
    /** @type {?} */
    InfiniteScrollContent.prototype.inf;
    /** @type {?} */
    InfiniteScrollContent.prototype._config;
}
//# sourceMappingURL=infinite-scroll-content.js.map