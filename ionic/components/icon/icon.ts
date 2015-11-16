import {Directive, ElementRef, Attribute, Renderer} from 'angular2/angular2';

import {Config} from '../../config/config';


@Directive({
  selector: 'icon',
  inputs: [
    'name',
    'ios',
    'md',
    'isActive'
  ],
  host: {
    'role': 'img'
  }
})
export class Icon {

  constructor(
    private elementRef: ElementRef,
    config: Config,
    private renderer: Renderer
  ) {
    this.config = config;
    this.mode = config.get('iconMode');
  }

  /**
   * @private
   */
  onInit() {
    let ele = this.elementRef.nativeElement;

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

  /**
   * @private
   */
  set isActive(val) {
    this._isActive = val;
    this.update();
  }

  /**
   * @private
   */
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

      this.renderer.setElementAttribute(this.elementRef, 'aria-label',
          this.name.replace('ion-', '').replace('ios-', '').replace('md-', '').replace('-', ' '));
    }
  }

}
