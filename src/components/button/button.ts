import { Attribute, ChangeDetectionStrategy, Component, ElementRef, Input, Optional, Renderer, ViewEncapsulation } from '@angular/core';

import { Config } from '../../config/config';
import { isTrueProperty } from '../../util/util';
import { Toolbar } from '../toolbar/toolbar';


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
  *  <button ion-button secondary>Secondary</button>
  *
  *  <button ion-button danger>Danger</button>
  *
  *  <button ion-button light>Light</button>
  *
  *  <button ion-button dark>Dark</button>
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
  private _role: string = 'button'; // bar-button
  private _size: string = null; // large/small/default
  private _style: string = 'default'; // outline/clear/solid
  private _shape: string = null; // round/fab
  private _display: string = null; // block/full
  private _colors: Array<string> = []; // primary/secondary
  private _icon: string = null; // left/right/only
  private _disabled: boolean = false; // disabled
  private _init: boolean;

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
    this._setClass(this[type], false);
    if (isTrueProperty(attrValue)) {
      this[type] = attrName;
      this._setClass(attrName, true);
    } else {
      // Special handling for '_style' which defaults to 'default'.
      this[type] = (type === '_style' ? 'default' : null);
    }
    if (type === '_style') {
      this._setColor(attrName, isTrueProperty(attrValue));
    }
  }

  /**
   * @input {string} Dynamically set which predefined color this button should use (e.g. primary, secondary, danger, etc).
   */
  @Input()
  set color(val: string|string[]) {
    // Clear the colors for all styles including the default one.
    this._setColor(BUTTON_STYLE_ATTRS.concat(['default']), false);
    // Support array input which is also supported via multiple attributes (e.g. primary, secondary, etc).
    this._colors = (val instanceof Array ? val : [val]);
    // Set the colors for the currently effective style.
    this._setColor(this._style, true);
  }

  constructor(
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

    this._readAttrs(element);
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    this._init = true;
    this._assignCss(true);
  }

  /**
   * @private
   */
  ngAfterContentChecked() {
    this._assignCss(true);
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
   * @private
   */
  private _readAttrs(element: HTMLElement) {
    let elementAttrs = element.attributes;
    let attrName: string;
    for (let i = 0, l = elementAttrs.length; i < l; i++) {
      if (elementAttrs[i].value !== '') continue;

      attrName = elementAttrs[i].name;

      if (BUTTON_STYLE_ATTRS.indexOf(attrName) > -1) {
        this._style = attrName;

      } else if (BUTTON_DISPLAY_ATTRS.indexOf(attrName) > -1) {
        this._display = attrName;

      } else if (BUTTON_SHAPE_ATTRS.indexOf(attrName) > -1) {
        this._shape = attrName;

      } else if (BUTTON_SIZE_ATTRS.indexOf(attrName) > -1) {
        this._size = attrName;

      } else if (!(IGNORE_ATTRS.test(attrName))) {
        this._colors.push(attrName);
      }
    }
  }

  /**
   * @private
   */
  private _assignCss(assignCssClass: boolean) {
    let role = this._role;
    if (role) {
      this._renderer.setElementClass(this._elementRef.nativeElement, role, assignCssClass); // button

      this._setClass(this._style, assignCssClass); // button-clear
      this._setClass(this._shape, assignCssClass); // button-round
      this._setClass(this._display, assignCssClass); // button-full
      this._setClass(this._size, assignCssClass); // button-small
      this._setClass(this._icon, assignCssClass); // button-icon-left
      this._setColor(this._style, assignCssClass); // button-secondary, button-clear-secondary
    }
  }

  /**
   * @private
   */
  private _setClass(type: string, assignCssClass: boolean) {
    if (type && this._init) {
      this._renderer.setElementClass(this._elementRef.nativeElement, this._role + '-' + type.toLowerCase(), assignCssClass);
    }
  }

  /**
   * @private
   */
  private _setColor(type: string|string[], assignCssClass: boolean) {
    if (type && this._init) {
      // Support array to allow removal of many styles at once.
      let styles = (type instanceof Array ? type : [type]);
      styles.forEach(styleName => {
        // If the role is not a bar-button, don't apply the solid style
        styleName = (this._role !== 'bar-button' && styleName === 'solid' ? 'default' : styleName);
        let colorStyle = (styleName !== null && styleName !== 'default' ? styleName.toLowerCase() + '-' : '');
        this._colors.forEach(colorName => {
          this._setClass(colorStyle + colorName, assignCssClass); // button-secondary, button-clear-secondary
        });
      });
    }
  }

}

const BUTTON_SIZE_ATTRS = ['large', 'small', 'default'];
const BUTTON_STYLE_ATTRS = ['clear', 'outline', 'solid'];
const BUTTON_SHAPE_ATTRS = ['round', 'fab'];
const BUTTON_DISPLAY_ATTRS = ['block', 'full'];
const IGNORE_ATTRS = /_ng|button|left|right/;

const TEXT = 1;
const ICON = 2;
