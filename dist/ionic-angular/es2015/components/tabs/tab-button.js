import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * @hidden
 */
export class TabButton extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer);
        this.ionSelect = new EventEmitter();
        this.disHover = (config.get('hoverCSS') === false);
        this.layout = config.get('tabsLayout');
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.tab.btn = this;
        this.layout = this.tab.parent.tabsLayout || this.layout;
        this.hasTitle = !!this.tab.tabTitle;
        this.hasIcon = !!this.tab.tabIcon && this.layout !== 'icon-hide';
        this.hasTitleOnly = (this.hasTitle && !this.hasIcon);
        this.hasIconOnly = (this.hasIcon && !this.hasTitle);
        this.hasBadge = !!this.tab.tabBadge;
    }
    /**
     * @return {?}
     */
    onClick() {
        this.ionSelect.emit(this.tab);
        return false;
    }
    /**
     * @param {?} href
     * @return {?}
     */
    updateHref(href) {
        this.setElementAttribute('href', href);
    }
}
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
TabButton.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
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