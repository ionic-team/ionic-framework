import {Directive, ElementRef, Renderer} from 'angular2/angular2';

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
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    this.iconLeft = this.iconRight = this.iconOnly = false;

    if (config.setting('hoverCSS') === false) {
      renderer.setElementClass(elementRef, 'disable-hover', true);
    }

    // figure out if and where the icon lives in the button
    let childNodes = elementRef.nativeElement.childNodes;
    let childNode;
    let nodes = [];
    for (let i = 0, l = childNodes.length; i < l; i++) {
      childNode = childNodes[i];
      if (childNode.nodeType === 3) {
        // text node
        if (childNode.textContent.trim() !== '') {
          nodes.push(TEXT);
        }

      } else if (childNode.nodeName === 'ICON') {
        // element node
        nodes.push(ICON);

      } else {
        // element other than an <icon>
        nodes.push(TEXT);

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

}

const TEXT = 1;
const ICON = 2;
