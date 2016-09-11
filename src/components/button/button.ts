import { Attribute, ChangeDetectionStrategy, Component, ElementRef, Input, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { isTrueProperty } from '../../util/util';


/**
  * @name Button
  * @module ionic
  *
  * @description
  * Buttons are simple components in Ionic. They can consist of text and icons
  * and be enhanced by a wide range of attributes.
  *
  * @property [outline] - A transparent button with a border.
  * @property [clear] - A transparent button without a border.
  * @property [round] - A button with rounded corners.
  * @property [block] - A button that fills its parent container with a border-radius.
  * @property [full] - A button that fills its parent container without a border-radius or borders on the left/right.
  * @property [small] - A button with size small.
  * @property [large] - A button with size large.
  * @property [disabled] - A disabled button.
  * @property [fab] - A floating action button.
  * @property [fab-left] - Position a fab button to the left.
  * @property [fab-right] - Position a fab button to the right.
  * @property [fab-center] - Position a fab button towards the center.
  * @property [fab-top] - Position a fab button towards the top.
  * @property [fab-bottom] - Position a fab button towards the bottom.
  * @property [fab-fixed] - Makes a fab button have a fixed position.
  * @property [color] - Dynamically set which predefined color this button should use (e.g. primary, secondary, danger, etc).
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
  *  <button ion-button fab>FAB</button>
  *
  *  <!-- Outline -->
  *  <button ion-button full outline>Outline + Full</button>
  *
  *  <button ion-button block outline>Outline + Block</button>
  *
  *  <button ion-button round outline>Outline + Round</button>
  *
  *  <button ion-button fab outline>FAB</button>
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
  * @demo /docs/v2/demos/button/
  * @see {@link /docs/v2/components#buttons Button Component Docs}
 */
@Component({
  selector: '[ion-button]',
  // NOTE: template must not contain spaces between elements
  template: '<span class="button-inner"><ng-content></ng-content></span><ion-button-effect></ion-button-effect>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Button {
  /** @internal */
  _role: string = 'button'; // bar-button

  /** @internal */
  _mt: boolean = false; // menutoggle

  /** @internal */
  _size: string = null; // large/small/default

  /** @internal */
  _style: string = 'default'; // outline/clear/solid

  /** @internal */
  _shape: string = null; // round/fab

  /** @internal */
  _display: string = null; // block/full

  /** @internal */
  _color: string = null; // primary/secondary

  /** @internal */
  _disabled: boolean = false; // disabled

  /** @internal */
  _init: boolean;

  /**
   * @input {string} Large button.
   */
  @Input()
  set large(val: boolean) {
    this._attr('_size', 'large', val);
  }

  /**
   * @input {string} Small button.
   */
  @Input()
  set small(val: boolean) {
    this._attr('_size', 'small', val);
  }

  /**
   * @input {string} Default button.
   */
  @Input()
  set default(val: boolean) {
    this._attr('_size', 'default', val);
  }

  /**
   * @input {string} A transparent button with a border.
   */
  @Input()
  set outline(val: boolean) {
    this._attr('_style', 'outline', val);
  }

  /**
   * @input {string} A transparent button without a border.
   */
  @Input()
  set clear(val: boolean) {
    this._attr('_style', 'clear', val);
  }

  /**
   * @input {string} Force a solid button. Useful for buttons within an item.
   */
  @Input()
  set solid(val: boolean) {
    this._attr('_style', 'solid', val);
  }

  /**
   * @input {string} A button with rounded corners.
   */
  @Input()
  set round(val: boolean) {
    this._attr('_shape', 'round', val);
  }

  /**
   * @input {string} A floating action button.
   */
  @Input()
  set fab(val: boolean) {
    this._attr('_shape', 'fab', val);
  }

  /**
   * @input {string} A button that fills its parent container with a border-radius.
   */
  @Input()
  set block(val: boolean) {
    this._attr('_display', 'block', val);
  }

  /**
   * @input {string} A button that fills its parent container without a border-radius or borders on the left/right.
   */
  @Input()
  set full(val: boolean) {
    this._attr('_display', 'full', val);
  }

  _attr(type: string, attrName: string, attrValue: boolean) {
    if (type === '_style') {
      this._setColor(this._color, isTrueProperty(attrValue));
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
  }

  /**
   * @input {string} Dynamically set which predefined color this button should use (e.g. primary, secondary, danger, etc).
   */
  @Input()
  set color(val: string) {
    this._updateColor(val);
  }

  constructor(
    @Attribute('menuToggle') menuToggle: string,
    @Attribute('ion-button') ionButton: string,
    config: Config,
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) {
    let element = _elementRef.nativeElement;

    if (config.get('hoverCSS') === false) {
      _renderer.setElementClass(element, 'disable-hover', true);
    }

    if (element.hasAttribute('disabled')) {
      this._disabled = true;
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

  /**
   * @private
   */
  ngAfterContentInit() {
    this._init = true;
    this._assignCss(true);
  }

  /**
   * @internal
   */
  _updateColor(newColor: string) {
    this._setColor(this._color, false);
    this._setColor(newColor, true);
    this._color = newColor;
  }

  /**
   * @private
   */
  addClass(className: string) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, true);
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
   * @internal
   */
  _assignCss(assignCssClass: boolean) {
    let role = this._role;
    if (role) {
      this._renderer.setElementClass(this._elementRef.nativeElement, role, assignCssClass); // button

      this._setClass('menutoggle', this._mt); // menutoggle

      this._setClass(this._style, assignCssClass); // button-clear
      this._setClass(this._shape, assignCssClass); // button-round
      this._setClass(this._display, assignCssClass); // button-full
      this._setClass(this._size, assignCssClass); // button-small
      this._setColor(this._color, assignCssClass); // button-secondary, bar-button-secondary
    }
  }

  /**
   * @internal
   */
  _setClass(type: string, assignCssClass: boolean) {
    if (type && this._init) {
      this._renderer.setElementClass(this._elementRef.nativeElement, this._role + '-' + type.toLowerCase(), assignCssClass);
    }
  }

  /**
   * @internal
   */
  _setColor(color: string, isAdd: boolean) {
    if (color && this._init) {
      // The class should begin with the button role
      // button, bar-button
      let className = this._role;

      // If the role is not a bar-button, don't apply the solid style
      let style = this._style;
      style = (this._role !== 'bar-button' && style === 'solid' ? 'default' : style);

      className += (style !== null && style !== '' && style !== 'default' ? '-' + style.toLowerCase() : '');

      if (color !== null && color !== '') {
        this._renderer.setElementClass(this._elementRef.nativeElement, `${className}-${color}`, isAdd);
      }
    }
  }
}
