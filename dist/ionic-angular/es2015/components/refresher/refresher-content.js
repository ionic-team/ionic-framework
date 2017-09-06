import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Config } from '../../config/config';
import { Refresher } from './refresher';
/**
 * @hidden
 */
export class RefresherContent {
    /**
     * @param {?} r
     * @param {?} _config
     */
    constructor(r, _config) {
        this.r = r;
        this._config = _config;
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnInit() {
        if (!this.pullingIcon) {
            this.pullingIcon = this._config.get('ionPullIcon', 'arrow-down');
        }
        if (!this.refreshingSpinner) {
            this.refreshingSpinner = this._config.get('ionRefreshingSpinner', this._config.get('spinner', 'ios'));
        }
    }
}
RefresherContent.decorators = [
    { type: Component, args: [{
                selector: 'ion-refresher-content',
                template: '<div class="refresher-pulling">' +
                    '<div class="refresher-pulling-icon" *ngIf="pullingIcon">' +
                    '<ion-icon [name]="pullingIcon"></ion-icon>' +
                    '</div>' +
                    '<div class="refresher-pulling-text" [innerHTML]="pullingText" *ngIf="pullingText"></div>' +
                    '</div>' +
                    '<div class="refresher-refreshing">' +
                    '<div class="refresher-refreshing-icon">' +
                    '<ion-spinner [name]="refreshingSpinner"></ion-spinner>' +
                    '</div>' +
                    '<div class="refresher-refreshing-text" [innerHTML]="refreshingText" *ngIf="refreshingText"></div>' +
                    '</div>',
                host: {
                    '[attr.state]': 'r.state'
                },
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
RefresherContent.ctorParameters = () => [
    { type: Refresher, },
    { type: Config, },
];
RefresherContent.propDecorators = {
    'pullingIcon': [{ type: Input },],
    'pullingText': [{ type: Input },],
    'refreshingSpinner': [{ type: Input },],
    'refreshingText': [{ type: Input },],
};
function RefresherContent_tsickle_Closure_declarations() {
    /** @type {?} */
    RefresherContent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    RefresherContent.ctorParameters;
    /** @type {?} */
    RefresherContent.propDecorators;
    /**
     * \@input {string} a static icon to display when you begin to pull down
     * @type {?}
     */
    RefresherContent.prototype.pullingIcon;
    /**
     * \@input {string} the text you want to display when you begin to pull down
     * @type {?}
     */
    RefresherContent.prototype.pullingText;
    /**
     * \@input {string} An animated SVG spinner that shows when refreshing begins
     * @type {?}
     */
    RefresherContent.prototype.refreshingSpinner;
    /**
     * \@input {string} the text you want to display when performing a refresh
     * @type {?}
     */
    RefresherContent.prototype.refreshingText;
    /** @type {?} */
    RefresherContent.prototype.r;
    /** @type {?} */
    RefresherContent.prototype._config;
}
//# sourceMappingURL=refresher-content.js.map