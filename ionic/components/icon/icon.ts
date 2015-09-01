import {Directive, View, NgClass, ElementRef, Optional, Host, Attribute, Renderer} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import {Ion} from '../ion';
import {Button} from '../button/button';


/**
 * TODO
 */
@Directive({
  selector: 'icon',
  properties: [
    'name',
    'ios',
    'md',
    'isActive'
  ],
  host: {
    '[attr.aria-label]': 'label',
    '[attr.aria-hidden]': 'ariaHidden',
    'role': 'img'
  }
})
export class Icon {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {Button} hostButton  TODO
   * @param {IonicConfig} config  TODO
   * @param {Renderer} renderer  TODO
   */
  constructor(
    private elementRef: ElementRef,
    @Optional() @Host() hostButton: Button,
    config: IonicConfig,
    private renderer: Renderer
  ) {
    this.eleRef = elementRef;
    this.hostButton = hostButton;
    this.config = config;

    this.mode = config.setting('iconMode');

    this.iconLeft = this.iconRight = this.iconOnly = false;
    this.ariaHidden = true;
  }

  /**
   * TODO
   */
  onInit() {
    let ele = this.eleRef.nativeElement;

    if (ele.hasAttribute('forward')) {
      this.name = this.config.setting('forwardIcon');

    } else if (this.mode == 'ios' && this.ios) {
      this.name = this.ios;

    } else if (this.mode == 'md' && this.md) {
      this.name = this.md;

    } else if (!this.name) {
      for (let i = 0, l = ele.attributes.length; i < l; i++) {
        if (ele.attributes[i].value === '' && /_|item-|is-active|class/.test(ele.attributes[i].name) !== true) {
          this.name = ele.attributes[i].name;
          break;
        }
      }
    }

    if (!this.name) return;

    if (!(/^ion-/.test(this.name))) {
      // not an exact icon being used
      // add mode specific prefix
      this.name = 'ion-' + this.mode + '-' + this.name;
    }

    if (this.hostButton) {
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
      this.hostButton.registerIcon(this);
    }


    // hide the icon when it's within a button
    // and the button isn't an icon only button
    this.ariaHidden = (this.hostButton && !this.iconOnly);

    this.update();
  }

  get isActive() {
    return (this._isActive === undefined || this._isActive === true || this._isActive === 'true');
  }

  set isActive(val) {
    this._isActive = val;
    this.update();
  }


  update() {
    if (this.name && this.mode == 'ios') {

      if (this.isActive) {
        if (/-outline/.test(this.name)) {
          this.name = this.name.replace('-outline', '');
        }

      } else if (!(/-outline/.test(this.name))) {
        this.name += '-outline';
      }

    }

    if (this._name !== this.name) {
      if (this._name) {
        this.renderer.setElementClass(this.elementRef, this._name, false);
      }
      this._name = this.name;
      this.renderer.setElementClass(this.elementRef, this.name, true);

      if (!this.ariaHidden) {
        // the icon is either not within a button
        // or the icon is within a button, and its an icon only button
        this.label = this.name.replace('ion-', '').replace('ios-', '').replace('md-', '').replace('-', ' ');
      }
    }
  }

}
