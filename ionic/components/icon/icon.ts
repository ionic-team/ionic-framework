import {Directive, ElementRef, Attribute, Renderer} from 'angular2/core';

import {Config} from '../../config/config';


/**
 * @name Icon
 * @description
 * Icons can be used on their own, or inside of a number of Ionic components. For a full list of available icons,
 * check out the [Ionicons resource docs](../../../../resources/ionicons).
 *
 * @usage
 * ```html
 * <!-- use the appropriate home icon for ios and md -->
 * <icon home></icon>
 *
 * <!-- explicity set the icon for each platform -->
 * <icon ios="ion-ios-home" md="ion-md-home"></icon>
 * ```
 *
 * @property {boolean} [isActive] - Whether or not the icon is active. Icons that are not active will use an outlined version of the icon.
 * If there is not an outlined version for the particular icon, it will use the default (full) version.
 * @property {string} [ios] - Explicitly set the icon to use on iOS.
 * @property {string} [md] - Explicitly set the icon to use on Android.
 * @see {@link /docs/v2/components#icons Icon Component Docs}
 *
 */
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
    private _elementRef: ElementRef,
    config: Config,
    private _renderer: Renderer
  ) {
    this.config = config;
    this.mode = config.get('iconMode');
  }

  /**
   * @private
   */
  addClass(className) {
    this._renderer.setElementClass(this._elementRef, className, true);
  }

  /**
   * @private
   */
  ngOnInit() {
    let ele = this._elementRef.nativeElement;

    if (this.mode == 'ios' && this.ios) {
      this.name = this.ios;

    } else if (this.mode == 'md' && this.md) {
      this.name = this.md;

    } else if (!this.name) {
      // looping through native dom attributes, eww
      // https://github.com/angular/angular/issues/1818
      for (let i = 0, l = ele.attributes.length; i < l; i++) {
        if (ele.attributes[i].value === '' && /_|item-|isActive|large|small|class/.test(ele.attributes[i].name) !== true) {
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
        this._renderer.setElementClass(this._elementRef, this._name, false);
      }
      this._name = this.name;
      this._renderer.setElementClass(this._elementRef, this.name, true);

      this._renderer.setElementAttribute(this._elementRef, 'aria-label',
          this.name.replace('ion-', '').replace('ios-', '').replace('md-', '').replace('-', ' '));
    }
  }

}
