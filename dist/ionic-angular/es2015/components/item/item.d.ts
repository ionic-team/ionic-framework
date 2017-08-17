import { ElementRef, QueryList, Renderer } from '@angular/core';
import { Button } from '../button/button';
import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { Icon } from '../icon/icon';
import { Ion } from '../ion';
import { Label } from '../label/label';
import { ItemReorder } from './item-reorder';
/**
 * @name Item
 * @description
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
 * @usage
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
 * @advanced
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
 * @demo /docs/demos/src/item/
 * @see {@link /docs/components#lists List Component Docs}
 * @see {@link ../../list/List List API Docs}
 * @see {@link ../ItemSliding ItemSliding API Docs}
 */
export declare class Item extends Ion {
    _ids: number;
    _inputs: Array<string>;
    _label: Label;
    _viewLabel: boolean;
    _name: string;
    _hasReorder: boolean;
    /**
     * @hidden
     */
    id: string;
    /**
     * @hidden
     */
    labelId: string;
    constructor(form: Form, config: Config, elementRef: ElementRef, renderer: Renderer, reorder: ItemReorder);
    /**
     * @hidden
     */
    registerInput(type: string): string;
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    /**
     * @hidden
     */
    _updateColor(newColor: string, componentName?: string): void;
    /**
     * @hidden
     */
    _setName(elementRef: ElementRef): void;
    /**
     * @hidden
     */
    getLabelText(): string;
    /**
     * @hidden
     */
    contentLabel: Label;
    /**
     * @hidden
     */
    viewLabel: Label;
    /**
     * @hidden
     */
    _buttons: QueryList<Button>;
    /**
     * @hidden
     */
    _icons: QueryList<Icon>;
}
