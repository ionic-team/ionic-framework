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
import { Attribute, ChangeDetectionStrategy, Component, ElementRef, Input, Renderer, ViewEncapsulation } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
/**
 * \@name Button
 * \@module ionic
 * \@description
 * Buttons are simple components in Ionic. They can consist of text and icons
 * and be enhanced by a wide range of attributes.
 *
 * \@usage
 *
 * ```html
 *
 *  <!-- Colors -->
 *  <button ion-button>Default</button>
 *
 *  <button ion-button color="secondary">Secondary</button>
 *
 *  <button ion-button color="danger">Danger</button>
 *
 *  <button ion-button color="light">Light</button>
 *
 *  <button ion-button color="dark">Dark</button>
 *
 *  <!-- Shapes -->
 *  <button ion-button full>Full Button</button>
 *
 *  <button ion-button block>Block Button</button>
 *
 *  <button ion-button round>Round Button</button>
 *
 *  <!-- Outline -->
 *  <button ion-button full outline>Outline + Full</button>
 *
 *  <button ion-button block outline>Outline + Block</button>
 *
 *  <button ion-button round outline>Outline + Round</button>
 *
 *  <!-- Icons -->
 *  <button ion-button icon-start>
 *    <ion-icon name="star"></ion-icon>
 *    Left Icon
 *  </button>
 *
 *  <button ion-button icon-end>
 *    Right Icon
 *    <ion-icon name="star"></ion-icon>
 *  </button>
 *
 *  <button ion-button icon-only>
 *    <ion-icon name="star"></ion-icon>
 *  </button>
 *
 *  <!-- Sizes -->
 *  <button ion-button large>Large</button>
 *
 *  <button ion-button>Default</button>
 *
 *  <button ion-button small>Small</button>
 * ```
 *
 * \@advanced
 *
 * ```html
 *
 * <!-- Bind the color and outline inputs to an expression -->
 * <button ion-button [color]="isDanger ? 'danger' : 'primary'" [outline]="isOutline">
 *   Danger (Solid)
 * </button>
 *
 * <!-- Bind the color and round inputs to an expression -->
 * <button ion-button [color]="myColor" [round]="isRound">
 *   Secondary (Round)
 * </button>
 *
 * <!-- Bind the color and clear inputs to an expression -->
 * <button ion-button [color]="isSecondary ? 'secondary' : 'primary'"  [clear]="isClear">
 *   Primary (Clear)
 * </button>
 *
 * <!-- Bind the color, outline and round inputs to an expression -->
 * <button ion-button [color]="myColor2" [outline]="isOutline" [round]="isRound">
 *   Dark (Solid + Round)
 * </button>
 *
 * <!-- Bind the click event to a method -->
 * <button ion-button (click)="logEvent($event)">
 *   Click me!
 * </button>
 * ```
 *
 * ```ts
 * \@Component({
 *   templateUrl: 'main.html'
 * })
 * class E2EPage {
 *   isDanger: boolean = true;
 *   isSecondary: boolean = false;
 *   isRound: boolean = true;
 *   isOutline: boolean = false;
 *   isClear: boolean = true;
 *   myColor: string = 'secondary';
 *   myColor2: string = 'dark';
 *
 *   logEvent(event) {
 *     console.log(event)
 *   }
 * }
 *
 * ```
 *
 * \@demo /docs/demos/src/button/
 * @see {\@link /docs/components#buttons Button Component Docs}
 * @see {\@link /docs/components#fabs FabButton Docs}
 * @see {\@link ../../fab/FabButton FabButton API Docs}
 * @see {\@link ../../fab/FabContainer FabContainer API Docs}
 */
var Button = (function (_super) {
    __extends(Button, _super);
    /**
     * @param {?} ionButton
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     */
    function Button(ionButton, config, elementRef, renderer) {
        var _this = _super.call(this, config, elementRef, renderer) || this;
        /**
         * @hidden
         */
        _this._role = 'button';
        /**
         * @hidden
         */
        _this._style = 'default';
        _this._mode = config.get('mode');
        if (config.get('hoverCSS') === false) {
            _this.setElementClass('disable-hover', true);
        }
        if (ionButton.trim().length > 0) {
            _this.setRole(ionButton);
        }
        return _this;
    }
    Object.defineProperty(Button.prototype, "large", {
        /**
         * \@input {boolean} If true, activates the large button size.
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._attr('_size', 'large', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "small", {
        /**
         * \@input {boolean} If true, activates the small button size.
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._attr('_size', 'small', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "default", {
        /**
         * \@input {boolean} If true, activates the default button size. Normally the default, useful for buttons in an item.
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._attr('_size', 'default', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "outline", {
        /**
         * \@input {boolean} If true, activates a transparent button style with a border.
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._attr('_style', 'outline', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "clear", {
        /**
         * \@input {boolean} If true, activates a transparent button style without a border.
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._attr('_style', 'clear', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "solid", {
        /**
         * \@input {boolean} If true, activates a solid button style. Normally the default, useful for buttons in a toolbar.
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._attr('_style', 'solid', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "round", {
        /**
         * \@input {boolean} If true, activates a button with rounded corners.
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._attr('_shape', 'round', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "block", {
        /**
         * \@input {boolean} If true, activates a button style that fills the available width.
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._attr('_display', 'block', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "full", {
        /**
         * \@input {boolean} If true, activates a button style that fills the available width without
         * a left and right border.
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._attr('_display', 'full', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "strong", {
        /**
         * \@input {boolean} If true, activates a button with a heavier font weight.
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._attr('_decorator', 'strong', val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "mode", {
        /**
         * \@input {string} The mode determines which platform styles to use.
         * Possible values are: `"ios"`, `"md"`, or `"wp"`.
         * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._assignCss(false);
            this._mode = val;
            this._assignCss(true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     * @param {?} type
     * @param {?} attrName
     * @param {?} attrValue
     * @return {?}
     */
    Button.prototype._attr = function (type, attrName, attrValue) {
        if (type === '_style') {
            this._updateColor(this._color, false);
        }
        this._setClass(((this))[type], false);
        if (isTrueProperty(attrValue)) {
            ((this))[type] = attrName;
            this._setClass(attrName, true);
        }
        else {
            // Special handling for '_style' which defaults to 'default'.
            ((this))[type] = (type === '_style' ? 'default' : null);
            this._setClass(((this))[type], true);
        }
        if (type === '_style') {
            this._updateColor(this._color, true);
        }
    };
    Object.defineProperty(Button.prototype, "color", {
        /**
         * \@input {string} The color to use from your Sass `$colors` map.
         * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
         * For more information, see [Theming your App](/docs/theming/theming-your-app).
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._updateColor(this._color, false);
            this._updateColor(val, true);
            this._color = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     * @return {?}
     */
    Button.prototype.ngAfterContentInit = function () {
        this._init = true;
        this._assignCss(true);
    };
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    Button.prototype.setRole = function (val) {
        this._assignCss(false);
        this._role = val;
        this._assignCss(true);
    };
    /**
     * @hidden
     * @param {?} assignCssClass
     * @return {?}
     */
    Button.prototype._assignCss = function (assignCssClass) {
        var /** @type {?} */ role = this._role;
        if (role) {
            this.setElementClass(role, assignCssClass); // button
            this.setElementClass(role + "-" + this._mode, assignCssClass); // button
            this._setClass(this._style, assignCssClass); // button-clear
            this._setClass(this._shape, assignCssClass); // button-round
            this._setClass(this._display, assignCssClass); // button-full
            this._setClass(this._size, assignCssClass); // button-small
            this._setClass(this._decorator, assignCssClass); // button-strong
            this._updateColor(this._color, assignCssClass); // button-secondary, bar-button-secondary
        }
    };
    /**
     * @hidden
     * @param {?} type
     * @param {?} assignCssClass
     * @return {?}
     */
    Button.prototype._setClass = function (type, assignCssClass) {
        if (type && this._init) {
            type = type.toLocaleLowerCase();
            this.setElementClass(this._role + "-" + type, assignCssClass);
            this.setElementClass(this._role + "-" + type + "-" + this._mode, assignCssClass);
        }
    };
    /**
     * @hidden
     * @param {?} color
     * @param {?} isAdd
     * @return {?}
     */
    Button.prototype._updateColor = function (color, isAdd) {
        if (color && this._init) {
            // The class should begin with the button role
            // button, bar-button
            var /** @type {?} */ className = this._role;
            // If the role is not a bar-button, don't apply the solid style
            var /** @type {?} */ style = this._style;
            style = (this._role !== 'bar-button' && style === 'solid' ? 'default' : style);
            className += (style !== null && style !== '' && style !== 'default' ? '-' + style.toLowerCase() : '');
            if (color !== null && color !== '') {
                this.setElementClass(className + "-" + this._mode + "-" + color, isAdd);
            }
        }
    };
    return Button;
}(Ion));
export { Button };
Button.decorators = [
    { type: Component, args: [{
                selector: '[ion-button]',
                template: '<span class="button-inner">' +
                    '<ng-content></ng-content>' +
                    '</span>' +
                    '<div class="button-effect"></div>',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
Button.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Attribute, args: ['ion-button',] },] },
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
]; };
Button.propDecorators = {
    'large': [{ type: Input },],
    'small': [{ type: Input },],
    'default': [{ type: Input },],
    'outline': [{ type: Input },],
    'clear': [{ type: Input },],
    'solid': [{ type: Input },],
    'round': [{ type: Input },],
    'block': [{ type: Input },],
    'full': [{ type: Input },],
    'strong': [{ type: Input },],
    'mode': [{ type: Input },],
    'color': [{ type: Input },],
};
function Button_tsickle_Closure_declarations() {
    /** @type {?} */
    Button.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Button.ctorParameters;
    /** @type {?} */
    Button.propDecorators;
    /**
     * @hidden
     * @type {?}
     */
    Button.prototype._role;
    /**
     * @hidden
     * @type {?}
     */
    Button.prototype._size;
    /**
     * @hidden
     * @type {?}
     */
    Button.prototype._style;
    /**
     * @hidden
     * @type {?}
     */
    Button.prototype._shape;
    /**
     * @hidden
     * @type {?}
     */
    Button.prototype._display;
    /**
     * @hidden
     * @type {?}
     */
    Button.prototype._decorator;
    /**
     * @hidden
     * @type {?}
     */
    Button.prototype._init;
}
//# sourceMappingURL=button.js.map