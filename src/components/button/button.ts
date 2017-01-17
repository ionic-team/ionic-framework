import { Attribute, ChangeDetectionStrategy, Component, ElementRef, Input, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';


/**
  * @name Button
  * @module ionic
  * @description
  * Buttons are simple components that are optimized to handle touch
  * events on mobile. Buttons can contain text and icons, and can 
  * be customized with one or more input properties. For a complete list of
  * input properties, see [Input Properties](#input-properties) below.
  * 
  * To use the Button component, add the `ion-button` directive to an
  * HTML `<button>`.
  *
  * @usage
  *
  * ```html
  *  <!-- Basic button -->
  *  <button ion-button>Default</button>
  *  
  *  <!-- Custom Color -->
  *  <button ion-button ion-color color="secondary">Secondary</button>
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
  *  <!-- Sizes -->
  *  <button ion-button large>Large</button>
  *
  *  <button ion-button>Default</button>
  *
  *  <button ion-button small>Small</button>
  * ```
  *
  * ### Styling Buttons Dynamically
  * 
  * All of the [input properties](#input-properties) that determine a buttons appearance can be 
  * set dynamically by binding them to a value on the component's model. For example, most attributes
  * can be toggled by binding them to a `boolean` value on the model:
  *
  * ```html
  * <!-- Dynamically set rounded corners -->
  * <button ion-button [round]="isRound">Round Button</button>
  *
  * <!-- Dynamically set clear background -->
  * <button ion-button [clear]="isClear">Clear Button</button>
  * ```
  *
  * To set the color of a button, bind the `color` property to a value on the model
  * of the component. Any string that corresponds to a Sass variable defined in your 
  * [$color map](/docs/v2/theming/theming-your-app/) is valid for the `color` property.  
  * 
  * ```html
  * <!-- Bind the color to a variable -->
  * <button ion-button ion-color [color]="isDanger">
  *   Dangerous?
  * </button>
  *
  * <!-- Bind the color to a ternary expression -->
  * <button ion-button ion-color [color]="isDanger ? 'danger' : 'primary'">
  *   Also Dangerous?
  * </button>  
  * ```
  *
  * ## Common Usage Patterns
  *
  * ### Using Icons in Buttons
  * 
  * To add icons to a button, add an `ion-icon` component inside of it and either the `icon-left`
  * or `icon-right` position attribute. If you want a button with only an icon in it, you can also
  * use the `icon-only` attribute, which will increase the size of the icon to better fill the button:
  * 
  * ```html
  * <!-- Float the icon left -->
  * <button ion-button icon-left>
  *   <ion-icon name="home"></ion-icon>
  *   Left Icon
  * </button>
  * 
  * <!-- Float the icon right -->
  * <button ion-button icon-right>
  *   Right Icon
  *   <ion-icon name="home"></ion-icon>
  * </button>
  * 
  * <!-- Only icon (no text) -->
  * <button ion-button icon-only>
  *   <ion-icon name="home"></ion-icon>
  * </button>
  * ```
  *
  * ### Using Buttons In Components
  * 
  * Although buttons can be used on their own, they can easily be used within other components. 
  * For example, the following positions buttons on the left and right side of the navbar:
  * 
  * ```html
  * <ion-header>
  *   <ion-navbar>
  *     <ion-buttons start>
  *       <button ion-button icon-only>
  *         <ion-icon name="contact"></ion-icon>
  *       </button>
  *     </ion-buttons>
  * 
  *     <ion-buttons end>
  *       <button ion-button icon-only>
  *         <ion-icon name="search"></ion-icon>
  *       </button>
  *     </ion-buttons>
  *   </ion-navbar>
  * </ion-header>
  *```
  *
  * Similarly, the following positions a button on the right side of a list item:
  *```html
  * <ion-list>
  *   <ion-item>
  *     Left Icon Button
  *     <button ion-button outline item-right icon-left>
  *       <ion-icon name="star"></ion-icon>
  *       Left Icon
  *     </button>
  *   </ion-item>
  * </ion-list>
  * ```
  * @demo /docs/v2/demos/src/button/basic
  * @see {@link /docs/v2/components#buttons Button Component Docs}
  * @see {@link /docs/v2/components#fabs FabButton Docs}
  * @see {@link ../../fab/FabButton FabButton API Docs}
  * @see {@link ../../fab/FabContainer FabContainer API Docs}
 */
@Component({
  selector: '[ion-button]',
  template:
    '<span class="button-inner">' +
      '<ng-content></ng-content>' +
    '</span>' +
    '<div class="button-effect"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Button extends Ion {
  /** @private */
  _role: string = 'button'; // bar-button

  /** @private */
  _size: string; // large/small/default

  /** @private */
  _style: string = 'default'; // outline/clear/solid

  /** @private */
  _shape: string; // round/fab

  /** @private */
  _display: string; // block/full

  /** @private */
  _decorator: string; // strong

  /** @private */
  _init: boolean;

  /**
   * @input {boolean} Whether the button should be larger.
   */
  @Input()
  set large(val: boolean) {
    this._attr('_size', 'large', val);
  }

  /**
   * @input {boolean} Whether the button should be smaller.
   */
  @Input()
  set small(val: boolean) {
    this._attr('_size', 'small', val);
  }

  /**
   * @input {boolean} Whether the button should be the default size.
   */
  @Input()
  set default(val: boolean) {
    this._attr('_size', 'default', val);
  }

  /**
   * @input {boolean} Whether the button should be button transparent with a border.
   */
  @Input()
  set outline(val: boolean) {
    this._attr('_style', 'outline', val);
  }

  /**
   * @input {boolean} Whether the button should be transparent without a border.
   */
  @Input()
  set clear(val: boolean) {
    this._attr('_style', 'clear', val);
  }

  /**
   * @input {boolean} Whether the button should be solid. Useful for buttons within an item.
   */
  @Input()
  set solid(val: boolean) {
    this._attr('_style', 'solid', val);
  }

  /**
   * @input {boolean} Whether the button should have rounded corners.
   */
  @Input()
  set round(val: boolean) {
    this._attr('_shape', 'round', val);
  }

  /**
   * @input {boolean} Whether the button should fill its parent container with a border-radius.
   */
  @Input()
  set block(val: boolean) {
    this._attr('_display', 'block', val);
  }

  /**
   * @input {boolean} Whether the button should fill its parent container. Button will have no border-radius or left/right borders.
   */
  @Input()
  set full(val: boolean) {
    this._attr('_display', 'full', val);
  }

  /**
   * @input {boolean} Whether the button should have a strong visual appearance, ie. it represents an important action.
   */
  @Input()
  set strong(val: boolean) {
    this._attr('_decorator', 'strong', val);
  }

  /**
   * @input {string} The mode to apply to this component. Mode can be `ios`, `wp`, or `md`.
   */
  @Input()
  set mode(val: string) {
    this._assignCss(false);
    this._mode = val;
    this._assignCss(true);
  }

  /** @private */
  _attr(type: string, attrName: string, attrValue: boolean) {
    if (type === '_style') {
      this._updateColor(this._color, false);
    }
    this._setClass((<any>this)[type], false);
    if (isTrueProperty(attrValue)) {
      (<any>this)[type] = attrName;
      this._setClass(attrName, true);

    } else {
      // Special handling for '_style' which defaults to 'default'.
      (<any>this)[type] = (type === '_style' ? 'default' : null);
      this._setClass((<any>this)[type], true);
    }
    if (type === '_style') {
      this._updateColor(this._color, true);
    }

  }

  /**
   * @input {string} The default color to use. For most buttons this will set the background color,
   * for outline buttons it will set the border color. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._updateColor(this._color, false);
    this._updateColor(val, true);
    this._color = val;

  }

  constructor(
    @Attribute('ion-button') ionButton: string,
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    super(config, elementRef, renderer);
    this._mode = config.get('mode');

    if (config.get('hoverCSS') === false) {
      this.setElementClass('disable-hover', true);
    }

    if (ionButton.trim().length > 0) {
      this.setRole(ionButton);
    }
  }

  /** @private */
  ngAfterContentInit() {
    this._init = true;
    this._assignCss(true);
  }

  /**
   * @private
   */
  setRole(val: string) {
    this._assignCss(false);
    this._role = val;
    this._assignCss(true);
  }

  /**
   * @private
   */
  _assignCss(assignCssClass: boolean) {
    let role = this._role;
    if (role) {
      this.setElementClass(role, assignCssClass); // button
      this.setElementClass(`${role}-${this._mode}`, assignCssClass); // button

      this._setClass(this._style, assignCssClass); // button-clear
      this._setClass(this._shape, assignCssClass); // button-round
      this._setClass(this._display, assignCssClass); // button-full
      this._setClass(this._size, assignCssClass); // button-small
      this._setClass(this._decorator, assignCssClass); // button-strong
      this._updateColor(this._color, assignCssClass); // button-secondary, bar-button-secondary
    }
  }

  /**
   * @private
   */
  _setClass(type: string, assignCssClass: boolean) {
    if (type && this._init) {
      type = type.toLocaleLowerCase();
      this.setElementClass(`${this._role}-${type}`, assignCssClass);
      this.setElementClass(`${this._role}-${type}-${this._mode}`, assignCssClass);
    }
  }

  /**
   * @private
   */
  _updateColor(color: string, isAdd: boolean) {
    if (color && this._init) {
      // The class should begin with the button role
      // button, bar-button
      let className = this._role;

      // If the role is not a bar-button, don't apply the solid style
      let style = this._style;
      style = (this._role !== 'bar-button' && style === 'solid' ? 'default' : style);

      className += (style !== null && style !== '' && style !== 'default' ? '-' + style.toLowerCase() : '');

      if (color !== null && color !== '') {
        this.setElementClass(`${className}-${this._mode}-${color}`, isAdd);
      }
    }
  }
}
