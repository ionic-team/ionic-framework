import { Component, ElementRef, Renderer, Attribute } from '@angular/core';

import { Config } from '../../config/config';

/**
  * @name Chip
  * @module ionic
  * @description
  * Chips represent complex entities in small blocks, such as a contact.
  * @see {@link /docs/v2/components/#chips Chips Component Docs}
 **/

@Component({
  selector: 'ion-chip',
  template: '<span class="hide"><ng-content></ng-content></span><ion-label></ion-label><button clear dark (click)="deleteChip()" *ngIf="deletable"><ion-icon name="close-circle"></ion-icon></button>'
})

export class Chip {
  private deletable: boolean = false;

  constructor(
    config: Config,
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) {
    let element = _elementRef.nativeElement;

    this._readAttrs(element);
  }

  /**
   * @private
   */
   ngOnInit() {
     this._fixContent(this._elementRef.nativeElement);
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

      if (attrName === 'deletable') {
        this._setDeletable();
      }
    }
  }

  /**
   * @private
   */
  private deleteChip() {
      this._elementRef.nativeElement.remove();
  }

  /**
   * @private
   */
  private _setDeletable() {
    this.deletable = true;
  }


  /**
   * @private
   */
  private _fixContent(element: HTMLElement) {
    // Take the first text node and add it to the label.
    // Take the first icon or avatar and add it to the chip.
    // Discard everything else.

    let childNodes: NodeList = element.childNodes;
    let innerNode:  Node     = childNodes[0];
    let labelNode:  Node     = childNodes[1];
    let addedNodes: NodeList = innerNode.childNodes;
    element.removeChild(innerNode);

    let missing = {image: true, text: true};
    let childNode: Node;
    let imageNode: Node;
    let text: string;
    for (let i = 0, l = addedNodes.length; i < l; i++) {
      childNode = addedNodes[i];
      if (childNode.nodeType === 3 && missing.text) {
        text = childNode.textContent.trim();
        if (text !== '') {
          labelNode.textContent = text;
          missing.text = false;
        }
      }
      if (childNode.nodeType === 1 && missing.image) {
        name = childNode.nodeName;
        if (childNode.nodeName === 'ION-ICON' || childNode.nodeName === 'ION-AVATAR') {
          missing.image = false;
          imageNode = childNode;
        }
      }
    }
    if (imageNode) {
      element.insertBefore(imageNode, element.firstChild);
    }
  }
}
