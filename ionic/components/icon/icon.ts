import {Directive, View, NgClass, ElementRef, Optional, Host, Attribute, Renderer} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import {Ion} from '../ion';
import {Button} from '../button/button';


@Directive({
  selector: 'icon',
  properties: [
    'name',
    'ios',
    'md'
  ],
  host: {
    '[attr.aria-label]': 'label',
    '[attr.aria-hidden]': 'ariaHidden',
    'role': 'img'
  }
})
export class Icon {
  constructor(
    private elementRef: ElementRef,
    @Optional() @Host() hostButton: Button,
    config: IonicConfig,
    private renderer: Renderer
  ) {
    let ele = elementRef.nativeElement;

    this.mode = config.setting('mode');
    this.iconLeft = this.iconRight = this.iconOnly = false;
    this.ariaHidden = true;

    this.iconAttr = null;
    for (let i = 0, l = ele.attributes.length; i < l; i++) {
      if (ele.attributes[i].value === '') {
        this.iconAttr = ele.attributes[i].name;
      }
    }

    if (hostButton) {
      // this icon is within a button
      this.withinButton = true;

      // check if there is a sibling element (that's not aria hidden)
      let hasPreviousSiblingElement = !!ele.previousElementSibling;
      let hasNextSiblingElement = ele.nextElementSibling && ele.nextElementSibling.getAttribute('aria-hidden') !== 'true';

      if (!hasPreviousSiblingElement && !hasNextSiblingElement) {
        // this icon is within a button, and doesn't have a sibling element
        // check for text nodes to the right and left of this icon element
        this.iconLeft = (ele.nextSibling && ele.nextSibling.textContent || '').trim() !== '';
        this.iconRight = (ele.previousSibling && ele.previousSibling.textContent || '').trim() !== '';
        this.iconOnly = !this.iconLeft && !this.iconRight;
      }

      // tell the button there's a child icon
      // the button will set the correct css classes on itself
      hostButton.registerIcon(this);
    }
  }

  onInit() {
    if (this.mode == 'ios' && this.ios) {
      this.name = this.ios;

    } else if (this.mode == 'md' && this.md) {
      this.name = this.md;

    } else if (!this.name && this.iconAttr) {
      this.name = this.iconAttr;
    }

    if (!this.name) return;

    // add the css class to show the icon font
    this.renderer.setElementClass(this.elementRef, this.name, true);

    // hide the icon when it's within a button
    // and the button isn't an icon only button
    this.ariaHidden = (this.withinButton && !this.iconOnly);

    if (!this.ariaHidden) {
      // the icon is either not within a button
      // or the icon is within a button, and its an icon only button
      this.label = this.name.replace('ion-', '').replace('ios-', '').replace('md-', '').replace('-', ' ');
    }

  }

}
