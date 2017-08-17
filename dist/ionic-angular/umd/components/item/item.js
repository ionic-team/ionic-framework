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
        define(["require", "exports", "@angular/core", "../button/button", "../../config/config", "../../util/form", "../icon/icon", "../ion", "../label/label", "./item-reorder"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var button_1 = require("../button/button");
    var config_1 = require("../../config/config");
    var form_1 = require("../../util/form");
    var icon_1 = require("../icon/icon");
    var ion_1 = require("../ion");
    var label_1 = require("../label/label");
    var item_reorder_1 = require("./item-reorder");
    /**
     * \@name Item
     * \@description
     * An item can contain text, images, and anything else. Generally it is placed in a list with other
     * items. It can easily be swiped, deleted, reordered, edited, and more. An item is only required to
     * be in a [List](../../list/List) if manipulating the item via gestures is required. It requires an
     * [ItemSliding](../ItemSliding) wrapper element in order to be swiped.
     *
     *
     * ## Common Usage
     * There are a few elements that are considered items, but not all of them are styled to look the same.
     * The basic item can be written as an `<ion-item>` element or it can be added to any element by adding
     * `ion-item` as an attribute. List headers and item dividers, although styled differently, are also items
     * and can be written as `<ion-list-header>` and `<ion-item-divider>`, respectively.
     *
     * ### As an Element
     * A basic item should be written as a `<ion-item>` element when it is not clickable.
     *
     * ```html
     * <ion-item>
     *   Item
     * </ion-item>
     * ```
     *
     * A list header should be written as `<ion-list-header>`.
     *
     * ```html
     * <ion-list-header>
     *   List Header
     * </ion-list-header>
     * ```
     *
     * An item divider should be written as `<ion-item-divider>`.
     *
     * ```html
     * <ion-item-divider>
     *   Item Divider
     * </ion-item-divider>
     * ```
     *
     * ### As an Attribute
     * The attribute `ion-item` should be added to a `<button>` when the item can be clicked or tapped. It
     * should be added to an `<a>` element when the item needs to contain a `href`. It can be added as an
     * attribute to any element to take on the item styling.
     *
     * ```html
     * <button ion-item (click)="buttonClick()">
     *   Button Item
     * </button>
     *
     * <a ion-item href="https://www.ionicframework.com">
     *   Anchor Item
     * </a>
     * ```
     *
     * Note: do not add `ion-item` as an attribute to an `<ion-list-header>` or `<ion-item-divider>` element
     * as they are already items and their styling will be changed to look like a basic item.
     *
     * ## Detail Arrows
     * By default, `<button>` and `<a>` elements with the `ion-item` attribute will display a right arrow icon
     * on `ios` mode. To hide the right arrow icon on either of these elements, add the `detail-none` attribute
     * to the item. To show the right arrow icon on an element that doesn't display it naturally, add the
     * `detail-push` attribute to the item.
     *
     * ```html
     * <ion-item detail-push>
     *   Item with Detail Arrow
     * </ion-item>
     *
     * <button ion-item (click)="buttonClick()">
     *   Button Item with Detail Arrow
     * </button>
     *
     * <a ion-item detail-none href="https://www.ionicframework.com">
     *   Anchor Item with no Detail Arrow
     * </a>
     * ```
     *
     * This feature is not enabled by default for `md` and `wp` modes, but it can be enabled by setting the
     * Sass variables `$item-md-detail-push-show` and `$item-wp-detail-push-show`, respectively, to `true`.
     * It can also be disabled for ios by setting `$item-ios-detail-push-show` to `false`. See the
     * [theming documentation](http://ionicframework.com/docs/theming/overriding-ionic-variables/) for
     * more information on overriding Sass variables.
     *
     *
     * ## Item Placement
     * Items rely heavily on content projection to position content. The item grabs content based on the
     * element or attribute and positions it that way. This logic makes it possible to write a complex
     * item with simple, understandable markup without having to worry about styling and positioning
     * the elements.
     *
     * The below chart details the attributes item looks for and where it will place the element with
     * that attribute inside of the item:
     *
     *  | Attribute      | Description                                                                                          |
     *  |----------------|----------------------------------------------------------------------------------------------------- |
     *  | `item-start`   | Placed to the left of all other elements, outside of the inner item.                                 |
     *  | `item-end`     | Placed to the right of all other elements, inside of the inner item, outside of the input wrapper.   |
     *  | `item-content` | Placed to the right of any `ion-label`, inside of the input wrapper.                                 |
     *
     * ### Checkboxes, Radios and Toggles
     * [Checkboxes](../../checkbox/Checkbox) are positioned in the same place as the `item-start` attribute.
     * [Radios](../../radio/RadioButton) and [Toggles](../../toggle/Toggle) are positioned in the same place
     * as the `item-end` attribute. All of these components can be positioned differently by adding the
     * `item-start` or `item-end` attribute.
     *
     * ### Content and Inputs
     * A [Label](../../label/Label) is placed inside of the item to the left of all content and inputs. The
     * following components are all placed in the same position as the `item-content` attribute: [Select](../../select/Select),
     * [Input](../../input/Input), [TextArea](../../input/TextArea), [DateTime](../../datetime/DateTime), and
     * [Range](../../range/Range).
     *
     * Any element directly placed inside of an `<ion-item>` that does not have one of the previously mentioned
     * attributes and isn't one of the above elements will be placed inside of a [Label](../../label/Label).
     *
     * ### Text Alignment
     * By default, Items will align text to the left and add an ellipsis when the text is wider than the item.
     * See the [Utility Attributes Documentation](../../../../theming/css-utilities/) for attributes that can
     * be added to `ion-item` to transform the text.
     *
     * \@usage
     *
     * ```html
     * <ion-list>
     *
     *   <ion-list-header>
     *     Header
     *   </ion-list-header>
     *
     *   <ion-item>
     *     Item
     *   </ion-item>
     *
     *   <ion-item detail-push>
     *     Item with Detail Arrow
     *   </ion-item>
     *
     *   <button ion-item (click)="buttonClick()">
     *     Button Item
     *   </button>
     *
     *   <ion-item-divider>
     *     Item Divider
     *   </ion-item-divider>
     *
     *   <button ion-item detail-none (click)="buttonClick()">
     *     Button Item with no Detail Arrow
     *   </button>
     *
     *   <a ion-item href="https://www.ionicframework.com">
     *     Anchor Item
     *   </a>
     *
     *   <ion-item no-lines>
     *     Item with no border
     *   </ion-item>
     *
     *   <ion-item text-wrap>
     *     Multiline text that should wrap when it is too long
     *     to fit on one line in the item.
     *   </ion-item>
     *
     * </ion-list>
     * ```
     *
     *
     * \@advanced
     *
     * ```html
     * <ion-list>
     *
     *   <!-- List header with buttons on each side -->
     *   <ion-list-header>
     *     <button ion-button item-start (click)="buttonClick()">Button</button>
     *     List Header
     *     <button ion-button outline item-end (click)="buttonClick()">Outline</button>
     *   </ion-list-header>
     *
     *   <!-- Loops through and creates multiple items -->
     *   <ion-item *ngFor="let item of items">
     *     Item {% raw %}{{item}}{% endraw %}
     *   </ion-item>
     *
     *   <!-- Button item with an icon on the left -->
     *   <button ion-item>
     *     <ion-icon name="star" item-start></ion-icon>
     *     Button Item
     *   </button>
     *
     *   <!-- Item with a label and content -->
     *   <ion-item>
     *     <ion-label>
     *       Item Label
     *     </ion-label>
     *     <div item-content>
     *       Item Content next to the label
     *     </div>
     *   </ion-item>
     *
     *   <!-- Item with left and right buttons -->
     *   <ion-item>
     *     <button ion-button item-start (click)="buttonClick()">Button</button>
     *     Item
     *     <button ion-button outline item-end (click)="buttonClick()">Outline</button>
     *   </ion-item>
     *
     *   <!-- Item divider with a right button -->
     *   <ion-item-divider>
     *     Item Divider
     *     <button ion-button item-end>Button</button>
     *   </ion-item-divider>
     *
     *   <!-- Disabled button item with left and right buttons -->
     *   <button ion-item disabled>
     *     <button ion-button item-start (click)="buttonClick()">
     *       <ion-icon name="home"></ion-icon>
     *       Left Icon
     *     </button>
     *     Disabled Button Item
     *     <button ion-button outline item-end (click)="buttonClick()">
     *       <ion-icon name="star"></ion-icon>
     *       Left Icon
     *     </button>
     *   </button>
     *
     *   <!-- Item with an avatar on the left and button on the right -->
     *   <ion-item>
     *     <ion-avatar item-start>
     *       <img src="img/my-avatar.png">
     *     </ion-avatar>
     *     Avatar Item
     *     <button ion-button outline item-end>View</button>
     *   </ion-item>
     *
     *   <!-- Item with a thumbnail on the right -->
     *   <ion-item>
     *     <h2>Item</h2>
     *     <p>Item Paragraph</p>
     *     <ion-thumbnail item-end>
     *       <img src="img/my-thumbnail.png">
     *     </ion-thumbnail>
     *   </ion-item>
     *
     *   <!-- Sliding item -->
     *   <ion-item-sliding>
     *     <ion-item>
     *       Item
     *     </ion-item>
     *     <ion-item-options>
     *       <button ion-button color="primary" (click)="archive()">Archive</button>
     *     </ion-item-options>
     *   </ion-item-sliding>
     *
     * </ion-list>
     * ```
     *
     *
     * \@demo /docs/demos/src/item/
     * @see {\@link /docs/components#lists List Component Docs}
     * @see {\@link ../../list/List List API Docs}
     * @see {\@link ../ItemSliding ItemSliding API Docs}
     */
    var Item = (function (_super) {
        __extends(Item, _super);
        /**
         * @param {?} form
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} reorder
         */
        function Item(form, config, elementRef, renderer, reorder) {
            var _this = _super.call(this, config, elementRef, renderer, 'item') || this;
            _this._ids = -1;
            _this._inputs = [];
            _this._viewLabel = true;
            _this._name = 'item';
            /**
             * @hidden
             */
            _this.labelId = null;
            _this._setName(elementRef);
            _this._hasReorder = !!reorder;
            _this.id = form.nextId().toString();
            _this.labelId = 'lbl-' + _this.id;
            // auto add "tappable" attribute to ion-item components that have a click listener
            if (!renderer.orgListen) {
                renderer.orgListen = renderer.listen;
                renderer.listen = function (renderElement, name, callback) {
                    if (name === 'click' && renderElement.setAttribute) {
                        renderElement.setAttribute('tappable', '');
                    }
                    return renderer.orgListen(renderElement, name, callback);
                };
            }
            return _this;
        }
        /**
         * @hidden
         * @param {?} type
         * @return {?}
         */
        Item.prototype.registerInput = function (type) {
            this._inputs.push(type);
            return this.id + '-' + (++this._ids);
        };
        /**
         * @hidden
         * @return {?}
         */
        Item.prototype.ngAfterContentInit = function () {
            if (this._viewLabel && this._inputs.length) {
                var /** @type {?} */ labelText = this.getLabelText().trim();
                this._viewLabel = (labelText.length > 0);
            }
            if (this._inputs.length > 1) {
                this.setElementClass('item-multiple-inputs', true);
            }
        };
        /**
         * @hidden
         * @param {?} newColor
         * @param {?=} componentName
         * @return {?}
         */
        Item.prototype._updateColor = function (newColor, componentName) {
            componentName = componentName || 'item'; // item-radio
            this._setColor(newColor, componentName);
        };
        /**
         * @hidden
         * @param {?} elementRef
         * @return {?}
         */
        Item.prototype._setName = function (elementRef) {
            var /** @type {?} */ nodeName = elementRef.nativeElement.nodeName.replace('ION-', '');
            if (nodeName === 'LIST-HEADER' || nodeName === 'ITEM-DIVIDER') {
                this._name = nodeName;
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        Item.prototype.getLabelText = function () {
            return this._label ? this._label.text : '';
        };
        Object.defineProperty(Item.prototype, "contentLabel", {
            /**
             * @hidden
             * @param {?} label
             * @return {?}
             */
            set: function (label) {
                if (label) {
                    this._label = label;
                    label.id = this.labelId;
                    if (label.type) {
                        this.setElementClass('item-label-' + label.type, true);
                    }
                    this._viewLabel = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "viewLabel", {
            /**
             * @hidden
             * @param {?} label
             * @return {?}
             */
            set: function (label) {
                if (!this._label) {
                    this._label = label;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "_buttons", {
            /**
             * @hidden
             * @param {?} buttons
             * @return {?}
             */
            set: function (buttons) {
                buttons.forEach(function (button) {
                    if (!button._size) {
                        button.setElementClass('item-button', true);
                    }
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Item.prototype, "_icons", {
            /**
             * @hidden
             * @param {?} icons
             * @return {?}
             */
            set: function (icons) {
                icons.forEach(function (icon) {
                    icon.setElementClass('item-icon', true);
                });
            },
            enumerable: true,
            configurable: true
        });
        return Item;
    }(ion_1.Ion));
    Item.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-list-header,ion-item,[ion-item],ion-item-divider',
                    template: '<ng-content select="[item-start],[item-left],ion-checkbox:not([item-end]):not([item-right])"></ng-content>' +
                        '<div class="item-inner">' +
                        '<div class="input-wrapper">' +
                        '<ng-content select="ion-label"></ng-content>' +
                        '<ion-label *ngIf="_viewLabel">' +
                        '<ng-content></ng-content>' +
                        '</ion-label>' +
                        '<ng-content select="ion-select,ion-input,ion-textarea,ion-datetime,ion-range,[item-content]"></ng-content>' +
                        '</div>' +
                        '<ng-content select="[item-end],[item-right],ion-radio,ion-toggle"></ng-content>' +
                        '<ion-reorder *ngIf="_hasReorder"></ion-reorder>' +
                        '</div>' +
                        '<div class="button-effect"></div>',
                    host: {
                        'class': 'item'
                    },
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    Item.ctorParameters = function () { return [
        { type: form_1.Form, },
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: item_reorder_1.ItemReorder, decorators: [{ type: core_1.Optional },] },
    ]; };
    Item.propDecorators = {
        'contentLabel': [{ type: core_1.ContentChild, args: [label_1.Label,] },],
        'viewLabel': [{ type: core_1.ViewChild, args: [label_1.Label,] },],
        '_buttons': [{ type: core_1.ContentChildren, args: [button_1.Button,] },],
        '_icons': [{ type: core_1.ContentChildren, args: [icon_1.Icon,] },],
    };
    exports.Item = Item;
    function Item_tsickle_Closure_declarations() {
        /** @type {?} */
        Item.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Item.ctorParameters;
        /** @type {?} */
        Item.propDecorators;
        /** @type {?} */
        Item.prototype._ids;
        /** @type {?} */
        Item.prototype._inputs;
        /** @type {?} */
        Item.prototype._label;
        /** @type {?} */
        Item.prototype._viewLabel;
        /** @type {?} */
        Item.prototype._name;
        /** @type {?} */
        Item.prototype._hasReorder;
        /**
         * @hidden
         * @type {?}
         */
        Item.prototype.id;
        /**
         * @hidden
         * @type {?}
         */
        Item.prototype.labelId;
    }
});
//# sourceMappingURL=item.js.map