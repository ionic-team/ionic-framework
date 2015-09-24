import {Directive, ElementRef} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';


/**
 * TODO
 */
@Directive({
  selector: 'button,[button]'
})
export class Button {

  constructor(
    config: IonicConfig,
    elementRef: ElementRef
  ) {
    let element = elementRef.nativeElement;

    if (config.setting('hoverCSS') === false) {
      element.classList.add('disable-hover');
    }

    if (element.hasAttribute('ion-item')) {
      // no need to put on these icon classes for an ion-item
      return;
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
        element.classList.add('icon-left');

      } else if (nodes[0] === TEXT && nodes[1] === ICON) {
        element.classList.add('icon-right');
      }
    } else if (nodes.length === 1 && nodes[0] === ICON) {
      element.classList.add('icon-only');
    }

  }

}

const TEXT = 1;
const ICON = 2;
