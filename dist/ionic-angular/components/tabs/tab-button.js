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
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * @hidden
 */
var TabButton = (function (_super) {
    __extends(TabButton, _super);
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    function TabButton(config, elementRef, renderer) {
        var _this = _super.call(this, config, elementRef, renderer) || this;
        _this.ionSelect = new EventEmitter();
        _this.disHover = (config.get('hoverCSS') === false);
        _this.layout = config.get('tabsLayout');
        return _this;
    }
    /**
     * @return {?}
     */
    TabButton.prototype.ngOnInit = function () {
        this.tab.btn = this;
        this.layout = this.tab.parent.tabsLayout || this.layout;
        this.hasTitle = !!this.tab.tabTitle;
        this.hasIcon = !!this.tab.tabIcon && this.layout !== 'icon-hide';
        this.hasTitleOnly = (this.hasTitle && !this.hasIcon);
        this.hasIconOnly = (this.hasIcon && !this.hasTitle);
        this.hasBadge = !!this.tab.tabBadge;
    };
    /**
     * @return {?}
     */
    TabButton.prototype.onClick = function () {
        this.ionSelect.emit(this.tab);
        return false;
    };
    /**
     * @param {?} href
     * @return {?}
     */
    TabButton.prototype.updateHref = function (href) {
        this.setElementAttribute('href', href);
    };
    return TabButton;
}(Ion));
export { TabButton };
TabButton.decorators = [
    { type: Component, args: [{
                selector: '.tab-button',
                template: '<ion-icon *ngIf="tab.tabIcon" [name]="tab.tabIcon" [isActive]="tab.isSelected" class="tab-button-icon"></ion-icon>' +
                    '<span *ngIf="tab.tabTitle" class="tab-button-text">{{tab.tabTitle}}</span>' +
                    '<ion-badge *ngIf="tab.tabBadge" class="tab-badge" [color]="tab.tabBadgeStyle">{{tab.tabBadge}}</ion-badge>' +
                    '<div class="button-effect"></div>',
                host: {
                    '[attr.id]': 'tab._btnId',
                    '[attr.aria-controls]': 'tab._tabId',
                    '[attr.aria-selected]': 'tab.isSelected',
                    '[class.has-title]': 'hasTitle',
                    '[class.has-icon]': 'hasIcon',
                    '[class.has-title-only]': 'hasTitleOnly',
                    '[class.icon-only]': 'hasIconOnly',
                    '[class.has-badge]': 'hasBadge',
                    '[class.disable-hover]': 'disHover',
                    '[class.tab-disabled]': '!tab.enabled',
                    '[class.tab-hidden]': '!tab.show',
                }
            },] },
];
/**
 * @nocollapse
 */
TabButton.ctorParameters = function () { return [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
]; };
TabButton.propDecorators = {
    'tab': [{ type: Input },],
    'ionSelect': [{ type: Output },],
    'onClick': [{ type: HostListener, args: ['click',] },],
};
function TabButton_tsickle_Closure_declarations() {
    /** @type {?} */
    TabButton.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    TabButton.ctorParameters;
    /** @type {?} */
    TabButton.propDecorators;
    /** @type {?} */
    TabButton.prototype.disHover;
    /** @type {?} */
    TabButton.prototype.hasTitle;
    /** @type {?} */
    TabButton.prototype.hasIcon;
    /** @type {?} */
    TabButton.prototype.hasTitleOnly;
    /** @type {?} */
    TabButton.prototype.hasIconOnly;
    /** @type {?} */
    TabButton.prototype.hasBadge;
    /** @type {?} */
    TabButton.prototype.layout;
    /** @type {?} */
    TabButton.prototype.tab;
    /** @type {?} */
    TabButton.prototype.ionSelect;
}
//# sourceMappingURL=tab-button.js.map