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
import { Component, ElementRef, Input, Optional, Renderer } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { isTrueProperty } from '../../util/util';
import { NavController } from '../../navigation/nav-controller';
import { ToolbarBase } from './toolbar-base';
import { ViewController } from '../../navigation/view-controller';
/**
 * \@name Navbar
 * \@description
 * Navbar acts as the navigational toolbar, which also comes with a back
 * button. A navbar can contain a `ion-title`, any number of buttons,
 * a segment, or a searchbar. Navbars must be placed within an
 * `<ion-header>` in order for them to be placed above the content.
 * It's important to note that navbar's are part of the dynamic navigation
 * stack. If you need a static toolbar, use ion-toolbar.
 *
 * \@usage
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <button ion-button icon-only menuToggle>
 *       <ion-icon name="menu"></ion-icon>
 *     </button>
 *
 *     <ion-title>
 *       Page Title
 *     </ion-title>
 *
 *     <ion-buttons end>
 *       <button ion-button icon-only (click)="openModal()">
 *         <ion-icon name="options"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-navbar>
 *
 * </ion-header>
 * ```
 *
 * \@demo /docs/demos/src/navbar/
 * @see {\@link ../../toolbar/Toolbar/ Toolbar API Docs}
 */
var Navbar = (function (_super) {
    __extends(Navbar, _super);
    /**
     * @param {?} _app
     * @param {?} viewCtrl
     * @param {?} navCtrl
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    function Navbar(_app, viewCtrl, navCtrl, config, elementRef, renderer) {
        var _this = _super.call(this, config, elementRef, renderer) || this;
        _this._app = _app;
        _this.navCtrl = navCtrl;
        /**
         * @hidden
         */
        _this._hidden = false;
        /**
         * @hidden
         */
        _this._hideBb = false;
        viewCtrl && viewCtrl._setNavbar(_this);
        _this._bbIcon = config.get('backButtonIcon');
        _this._sbPadding = config.getBoolean('statusbarPadding');
        _this._backText = config.get('backButtonText', 'Back');
        return _this;
    }
    Object.defineProperty(Navbar.prototype, "hideBackButton", {
        /**
         * \@input {boolean} If true, the back button will be hidden.
         * @return {?}
         */
        get: function () {
            return this._hideBb;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._hideBb = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} ev
     * @return {?}
     */
    Navbar.prototype.backButtonClick = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.navCtrl && this.navCtrl.pop(null, null);
    };
    /**
     * Set the text of the Back Button in the Nav Bar. Defaults to "Back".
     * @param {?} text
     * @return {?}
     */
    Navbar.prototype.setBackButtonText = function (text) {
        this._backText = text;
    };
    /**
     * @hidden
     * @return {?}
     */
    Navbar.prototype.didEnter = function () {
        try {
            this._app.setTitle(this.getTitleText());
        }
        catch (e) {
            console.error(e);
        }
    };
    /**
     * @hidden
     * @param {?} isHidden
     * @return {?}
     */
    Navbar.prototype.setHidden = function (isHidden) {
        // used to display none/block the navbar
        this._hidden = isHidden;
    };
    return Navbar;
}(ToolbarBase));
export { Navbar };
Navbar.decorators = [
    { type: Component, args: [{
                selector: 'ion-navbar',
                template: '<div class="toolbar-background" [ngClass]="\'toolbar-background-\' + _mode"></div>' +
                    '<button (click)="backButtonClick($event)" ion-button="bar-button" class="back-button" [ngClass]="\'back-button-\' + _mode" [hidden]="_hideBb">' +
                    '<ion-icon class="back-button-icon" [ngClass]="\'back-button-icon-\' + _mode" [name]="_bbIcon"></ion-icon>' +
                    '<span class="back-button-text" [ngClass]="\'back-button-text-\' + _mode">{{_backText}}</span>' +
                    '</button>' +
                    '<ng-content select="[menuToggle],ion-buttons[left]"></ng-content>' +
                    '<ng-content select="ion-buttons[start]"></ng-content>' +
                    '<ng-content select="ion-buttons[end],ion-buttons[right]"></ng-content>' +
                    '<div class="toolbar-content" [ngClass]="\'toolbar-content-\' + _mode">' +
                    '<ng-content></ng-content>' +
                    '</div>',
                host: {
                    '[hidden]': '_hidden',
                    'class': 'toolbar',
                    '[class.statusbar-padding]': '_sbPadding'
                }
            },] },
];
/**
 * @nocollapse
 */
Navbar.ctorParameters = function () { return [
    { type: App, },
    { type: ViewController, decorators: [{ type: Optional },] },
    { type: NavController, decorators: [{ type: Optional },] },
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
]; };
Navbar.propDecorators = {
    'hideBackButton': [{ type: Input },],
};
function Navbar_tsickle_Closure_declarations() {
    /** @type {?} */
    Navbar.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Navbar.ctorParameters;
    /** @type {?} */
    Navbar.propDecorators;
    /**
     * @hidden
     * @type {?}
     */
    Navbar.prototype._backText;
    /**
     * @hidden
     * @type {?}
     */
    Navbar.prototype._bbIcon;
    /**
     * @hidden
     * @type {?}
     */
    Navbar.prototype._hidden;
    /**
     * @hidden
     * @type {?}
     */
    Navbar.prototype._hideBb;
    /**
     * @hidden
     * @type {?}
     */
    Navbar.prototype._sbPadding;
    /** @type {?} */
    Navbar.prototype._app;
    /** @type {?} */
    Navbar.prototype.navCtrl;
}
//# sourceMappingURL=navbar.js.map