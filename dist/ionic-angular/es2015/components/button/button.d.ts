import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
  * @name Button
  * @module ionic
  * @description
  * Buttons are simple components in Ionic. They can consist of text and icons
  * and be enhanced by a wide range of attributes.
  *
  * @usage
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
  * @advanced
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
  * @Component({
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
  * @demo /docs/demos/src/button/
  * @see {@link /docs/components#buttons Button Component Docs}
  * @see {@link /docs/components#fabs FabButton Docs}
  * @see {@link ../../fab/FabButton FabButton API Docs}
  * @see {@link ../../fab/FabContainer FabContainer API Docs}
 */
export declare class Button extends Ion {
    /** @hidden */
    _role: string;
    /** @hidden */
    _size: string;
    /** @hidden */
    _style: string;
    /** @hidden */
    _shape: string;
    /** @hidden */
    _display: string;
    /** @hidden */
    _decorator: string;
    /** @hidden */
    _init: boolean;
    /**
     * @input {boolean} If true, activates the large button size.
     */
    large: boolean;
    /**
     * @input {boolean} If true, activates the small button size.
     */
    small: boolean;
    /**
     * @input {boolean} If true, activates the default button size. Normally the default, useful for buttons in an item.
     */
    default: boolean;
    /**
     * @input {boolean} If true, activates a transparent button style with a border.
     */
    outline: boolean;
    /**
     * @input {boolean} If true, activates a transparent button style without a border.
     */
    clear: boolean;
    /**
     * @input {boolean} If true, activates a solid button style. Normally the default, useful for buttons in a toolbar.
     */
    solid: boolean;
    /**
     * @input {boolean} If true, activates a button with rounded corners.
     */
    round: boolean;
    /**
     * @input {boolean} If true, activates a button style that fills the available width.
     */
    block: boolean;
    /**
     * @input {boolean} If true, activates a button style that fills the available width without
     * a left and right border.
     */
    full: boolean;
    /**
     * @input {boolean} If true, activates a button with a heavier font weight.
     */
    strong: boolean;
    /**
     * @input {string} The mode determines which platform styles to use.
     * Possible values are: `"ios"`, `"md"`, or `"wp"`.
     * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
     */
    mode: string;
    /** @hidden */
    _attr(type: string, attrName: string, attrValue: boolean): void;
    /**
     * @input {string} The color to use from your Sass `$colors` map.
     * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
     * For more information, see [Theming your App](/docs/theming/theming-your-app).
     */
    color: string;
    constructor(ionButton: string, config: Config, elementRef: ElementRef, renderer: Renderer);
    /** @hidden */
    ngAfterContentInit(): void;
    /**
     * @hidden
     */
    setRole(val: string): void;
    /**
     * @hidden
     */
    _assignCss(assignCssClass: boolean): void;
    /**
     * @hidden
     */
    _setClass(type: string, assignCssClass: boolean): void;
    /**
     * @hidden
     */
    _updateColor(color: string, isAdd: boolean): void;
}
