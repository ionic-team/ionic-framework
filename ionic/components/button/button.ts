import {Component, ElementRef, Renderer, Attribute, Optional, Input} from 'angular2/core';

import {Config} from '../../config/config';
import {Toolbar} from '../toolbar/toolbar';
import {isTrueProperty} from '../../util/util';


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
  * @property [color] - Dynamically set which color attribute this button should use.
  *
  * @demo /docs/v2/demos/button/
  * @see {@link /docs/v2/components#buttons Button Component Docs}
 */
@Component({
  selector: 'button:not([ion-item]),[button]',
  template:
    '<span class="button-inner">' +
      '<ng-content></ng-content>' +
    '</span>' +
    '<ion-button-effect></ion-button-effect>'
})
export class Button {
  private _role: string = 'button'; // bar-button/item-button
  private _size: string = null; // large/small/default
  private _style: string = 'default'; // outline/clear/solid
  private _shape: string = null; // round/fab
  private _display: string = null; // block/full
  private _colors: Array<string> = []; // primary/secondary
  private _icon: string = null; // left/right/only
  private _disabled: boolean = false; // disabled
  private _init: boolean;

  /**
   * @private
   */
  isItem: boolean;

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
      this[type] = null;
    }
  }

  /**
   * @input {string} Dynamically set which color attribute this button should use.
   */
  @Input()
  set color(val: string) {
    this._assignCss(false);
    this._colors = [val];
    this._assignCss(true);
  }

  constructor(
    config: Config,
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    @Attribute('ion-item') ionItem: string
  ) {

    this.isItem = (ionItem === '');

    let element = _elementRef.nativeElement;

    if (config.get('hoverCSS') === false) {
      _renderer.setElementClass(_elementRef.nativeElement, 'disable-hover', true);
    }

    if (element.hasAttribute('ion-item')) {
      // no need to put on these classes for an ion-item
      this._role = null;
      return;
    }

    if (element.hasAttribute('disabled')) {
      this._disabled = true;
    }

    this._readAttrs(element);
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    this._init = true;
    this._readIcon(this._elementRef.nativeElement);
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
    this._role = val;
  }

  /**
   * @private
   */
  private _readIcon(element: HTMLElement) {
    // figure out if and where the icon lives in the button
    let childNodes = element.childNodes;
    if (childNodes.length > 0) {
      childNodes = childNodes[0].childNodes;
    }
    let childNode;
    let nodes = [];
    for (let i = 0, l = childNodes.length; i < l; i++) {
      childNode = childNodes[i];

      if (childNode.nodeType === 3) {
        // text node
        if (childNode.textContent.trim() !== '') {
          nodes.push(TEXT);
        }

      } else if (childNode.nodeType === 1) {
        if (childNode.nodeName === 'ION-ICON') {
          // icon element node
          nodes.push(ICON);

        } else {
          // element other than an <ion-icon>
          nodes.push(TEXT);
        }
      }
    }

    if (nodes.length > 1) {
      if (nodes[0] === ICON && nodes[1] === TEXT) {
        this._icon = 'icon-left';

      } else if (nodes[0] === TEXT && nodes[1] === ICON) {
        this._icon = 'icon-right';
      }

    } else if (nodes.length === 1 && nodes[0] === ICON) {
      this._icon = 'icon-only';
    }
  }

  /**
   * @private
   */
  private _readAttrs(element: HTMLElement) {
    let elementAttrs = element.attributes;
    let attrName;
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

      let colorStyle = (this._style !== 'default' ? this._style + '-' : '');
      this._colors.forEach(colorName => {
        this._setClass(colorStyle + colorName, assignCssClass); // button-secondary, button-clear-secondary
      });
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
  static setRoles(contentButtonChildren, role: string) {
    let buttons = contentButtonChildren.toArray();
    buttons.forEach(button => {
      button.setRole(role);
    });
  }

}

const BUTTON_SIZE_ATTRS = ['large', 'small', 'default'];
const BUTTON_STYLE_ATTRS = ['clear', 'outline', 'solid'];
const BUTTON_SHAPE_ATTRS = ['round', 'fab'];
const BUTTON_DISPLAY_ATTRS = ['block', 'full'];
const IGNORE_ATTRS = /_ng|button|left|right/;

const TEXT = 1;
const ICON = 2;
