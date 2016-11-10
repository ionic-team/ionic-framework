import { Attribute, ChangeDetectionStrategy, Component, ElementRef, Input, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';


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
  *  <button ion-button icon-left>
  *    <ion-icon name="star"></ion-icon>
  *    Left Icon
  *  </button>
  *
  *  <button ion-button icon-right>
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
  * }
  *
  * ```
  *
  * @demo /docs/v2/demos/src/button/
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
  _mt: boolean; // menutoggle

  /** @private */
  _size: string; // large/small/default

  /** @private */
  _style: string = 'default'; // outline/clear/solid

  /** @private */
  _shape: string; // round/fab

  /** @private */
  _display: string; // block/full

  /** @private */
  _init: boolean;

  /**
   * @input {boolean} Large button.
   */
  @Input()
  set large(val: boolean) {
    this._attr('_size', 'large', val);
  }

  /**
   * @input {boolean} Small button.
   */
  @Input()
  set small(val: boolean) {
    this._attr('_size', 'small', val);
  }

  /**
   * @input {boolean} Default button.
   */
  @Input()
  set default(val: boolean) {
    this._attr('_size', 'default', val);
  }

  /**
   * @input {boolean} A transparent button with a border.
   */
  @Input()
  set outline(val: boolean) {
    this._attr('_style', 'outline', val);
  }

  /**
   * @input {boolean} A transparent button without a border.
   */
  @Input()
  set clear(val: boolean) {
    this._attr('_style', 'clear', val);
  }

  /**
   * @input {boolean} Force a solid button. Useful for buttons within an item.
   */
  @Input()
  set solid(val: boolean) {
    this._attr('_style', 'solid', val);
  }

  /**
   * @input {boolean} A button with rounded corners.
   */
  @Input()
  set round(val: boolean) {
    this._attr('_shape', 'round', val);
  }

  /**
   * @input {boolean} A button that fills its parent container with a border-radius.
   */
  @Input()
  set block(val: boolean) {
    this._attr('_display', 'block', val);
  }

  /**
   * @input {boolean} A button that fills its parent container without a border-radius or borders on the left/right.
   */
  @Input()
  set full(val: boolean) {
    this._attr('_display', 'full', val);
  }

  /**
   * @input {string} The mode to apply to this component.
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
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._updateColor(this._color, false);
    this._updateColor(val, true);
    this._color = val;

  }

  constructor(
    @Attribute('menuToggle') menuToggle: string,
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

    // menuToggle can be added with or without a string
    // but if the attribute isn't added it will be null
    if (menuToggle !== null) {
      this._mt = true;
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

      this._setClass('menutoggle', this._mt); // menutoggle
      this._setClass(this._style, assignCssClass); // button-clear
      this._setClass(this._shape, assignCssClass); // button-round
      this._setClass(this._display, assignCssClass); // button-full
      this._setClass(this._size, assignCssClass); // button-small
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
