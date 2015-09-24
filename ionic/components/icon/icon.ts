import {Directive, ElementRef, Attribute, Renderer} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';


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
    'role': 'img'
  }
})
export class Icon {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   * @param {Renderer} renderer  TODO
   */
  constructor(
    private elementRef: ElementRef,
    config: IonicConfig,
    private renderer: Renderer
  ) {
    this.eleRef = elementRef;
    this.config = config;

    this.mode = config.setting('iconMode');
  }

  /**
   * TODO
   */
  onInit() {
    let ele = this.eleRef.nativeElement;

    if (this.mode == 'ios' && this.ios) {
      this.name = this.ios;

    } else if (this.mode == 'md' && this.md) {
      this.name = this.md;

    } else if (!this.name) {
      // looping through native dom attributes, eww
      // https://github.com/angular/angular/issues/3961
      for (let i = 0, l = ele.attributes.length; i < l; i++) {
        if (ele.attributes[i].value === '' && /_|item-|is-active|large|small|class/.test(ele.attributes[i].name) !== true) {
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

      this.label = this.name.replace('ion-', '').replace('ios-', '').replace('md-', '').replace('-', ' ');
    }
  }

}
