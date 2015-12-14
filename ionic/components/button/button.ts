import {Directive, ElementRef, Renderer, Attribute, Optional} from 'angular2/core';

import {Config} from '../../config/config';
import {Toolbar} from '../toolbar/toolbar';


/**
  * @name Button
  * @module ionic
  * @property [outline] - for an unfilled outline button
  * @property [clear] - for a transparent button that only shows text and icons
  * @property [round] - for a button with rounded corners
  * @property [block] - for a block button that fills it's parent container
  * @property [full] - for a full width button
  * @property [small] - sets button size to small
  * @property [large] - sets button size to large
  * @property [disabled] - disables the button
  * @property [fab] - for a floating action button
  * @property [fab-left] - position a fab button to the left
  * @property [fab-right] - position a fab button to the right
  * @property [fab-center] - position a fab button towards the center
  * @property [fab-top] - position a fab button towards the top
  * @property [fab-bottom] - position a fab button towards the bottom
  * @description
  * Buttons are simple components in Ionic, can consist of text, an icon, or both, and can be enhanced with a wide range of attributes.
  * @demo /docs/v2/demos/buttons/
  * @see {@link /docs/v2/components#buttons Button Component Docs}

 */
@Directive({
  selector: 'button,[button]'
})
export class Button {

  constructor(
    config: Config,
    private elementRef: ElementRef,
    private renderer: Renderer
  ) {
    this._role = 'button'; // bar-button/item-button
    this._size = null; // large/small
    this._style = 'default'; // outline/clear/solid
    this._shape = null; // round/fab
    this._display = null; // block/full
    this._colors = []; // primary/secondary
    this._icon = null; // left/right/only
    this._disabled = false; // disabled

    let element = elementRef.nativeElement;

    if (config.get('hoverCSS') === false) {
      renderer.setElementClass(elementRef, 'disable-hover', true);
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
    this._readIcon(element);
  }

  ngAfterContentInit() {
    this._assignCss(true);
  }

  setRole(val) {
    this._role = val;
  }

  _readIcon(element) {
    // figure out if and where the icon lives in the button
    let childNodes = element.childNodes;
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
        if (childNode.nodeName === 'ICON') {
          // icon element node
          nodes.push(ICON);

        } else {
          // element other than an <icon>
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

  _readAttrs(element) {
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

  _assignCss(assignCssClass) {
    let role = this._role;
    if (role) {
      this.renderer.setElementClass(this.elementRef, role, assignCssClass); // button

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

  _setClass(type, assignCssClass) {
    if (type) {
      this.renderer.setElementClass(this.elementRef, this._role + '-' + type, assignCssClass);
    }
  }

  static setRoles(contentButtonChildren, role) {
    let buttons = contentButtonChildren.toArray();
    buttons.forEach(button => {
      button.setRole(role);
    });
  }

}

const BUTTON_SIZE_ATTRS = ['large', 'small'];
const BUTTON_STYLE_ATTRS = ['clear', 'outline', 'solid'];
const BUTTON_SHAPE_ATTRS = ['round', 'fab'];
const BUTTON_DISPLAY_ATTRS = ['block', 'full'];
const IGNORE_ATTRS = /_ng|button|left|right/;

const TEXT = 1;
const ICON = 2;
