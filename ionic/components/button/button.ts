import {Directive, ElementRef, Renderer, Attribute} from 'angular2/angular2';

import {Config} from '../../config/config';


/**
  * @name Button
  * @module ionic
  * @property [primary] - sets button color to default primary
  * @property [secondary] - sets button color to default secondary
  * @property [danger] - sets button color to default danger
  * @property [light] - sets button color to default light
  * @property [dark] - sets button color to default dark
  * @property [outline] - for an unfilled outline button
  * @property [clear] - for a transparent button that only shows text and icons
  * @property [round] - for a button with rounded corners
  * @property [block] - for a block button that fills it's parent container
  * @property [full] - for a full width button
  * @property [small] - sets button size to small
  * @property [large] - sets button size to large
  * @property [fab] - for a floating action button
  * @property [fab-left] - position a fab button to the left
  * @property [fab-right] - position a fab button to the right
  * @property [fab-center] - position a fab button towards the center
  * @property [fab-top] - position a fab button towards the top
  * @property [fab-bottom] - position a fab button towards the bottom
  * @description
  * Buttons are simple components in Ionic, can consist of text, an icon, or both, and can be enhanced with a wide range of attributes.
  * @see {@link /docs/v2/components#buttons Button Component Docs}

 */
@Directive({
  selector: 'button,[button]'
})
export class Button {

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    @Attribute('type') type: string
  ) {

    let element = elementRef.nativeElement;

    if (config.get('hoverCSS') === false) {
      renderer.setElementClass(elementRef, 'disable-hover', true);
    }

    if (element.hasAttribute('ion-item')) {
      // no need to put on these classes for an ion-item
      return;
    }

    renderer.setElementClass(elementRef, 'button', true);

    this.attrToClass(renderer, elementRef);

    if (type) {
      renderer.setElementAttribute(elementRef, type, '');
    }

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
        renderer.setElementClass(elementRef, 'icon-left', true);

      } else if (nodes[0] === TEXT && nodes[1] === ICON) {
        renderer.setElementClass(elementRef, 'icon-right', true);
      }
    } else if (nodes.length === 1 && nodes[0] === ICON) {
      renderer.setElementClass(elementRef, 'icon-only', true);
    }

  }

  attrToClass(renderer, elementRef) {
    // looping through native dom attributes, eww
    // https://github.com/angular/angular/issues/1818

    let element = elementRef.nativeElement;
    let attrs = element.attributes;
    let btnAttrs = [];

    BUTTON_SIZE_ATTRS.forEach(buttonAttr => {
      if (element.hasAttribute(buttonAttr)) {
        renderer.setElementClass(elementRef, 'button-' + buttonAttr, true);
      }
    });

    BUTTON_TYPE_ATTRS.forEach(buttonAttr => {
      if (element.hasAttribute(buttonAttr)) {
        renderer.setElementClass(elementRef, 'button-' + buttonAttr, true);
        btnAttrs.push(buttonAttr);
      }
    });

    let attrName;
    for (let i = 0, l = attrs.length; i < l; i++) {
      attrName = attrs[i].name;
      if (attrs[i].value === '' && COMMON_HTML_ATTR.test(attrName) !== true && BUTTON_TYPE_ATTRS.indexOf(attrName) < 0 && BUTTON_SIZE_ATTRS.indexOf(attrName) < 0) {
        if (btnAttrs.length) {
          btnAttrs.forEach(buttonAttr => {
            renderer.setElementClass(elementRef, 'button-' + buttonAttr + '-' + attrName, true);
          });
        } else {
          renderer.setElementClass(elementRef, 'button-' + attrName, true);
        }
      }
    }
  }

}

const COMMON_HTML_ATTR = /id|class|type|href|ng-/;
const BUTTON_TYPE_ATTRS = ['block', 'full', 'round', 'clear', 'outline'];
const BUTTON_SIZE_ATTRS = ['large', 'small'];

const TEXT = 1;
const ICON = 2;
