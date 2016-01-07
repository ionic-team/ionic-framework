import {Directive, Input, ElementRef, Renderer} from 'angular2/core';

import {Config} from '../../config/config';


/**
 * @name Icon
 * @description
 * Icons can be used on their own, or inside of a number of Ionic components.
 * For a full list of available icons, check out the
 * [Ionicons resource docs](../../../../resources/ionicons).
 *
 * @usage
 * ```html
 * <!-- use the appropriate star icon for ios and md -->
 * <ion-icon name="star"></ion-icon>
 *
 * <!-- explicity set the icon for each platform -->
 * <ion-icon ios="ios-home" md="md-home"></ion-icon>
 * ```
 *
 * @property {string} [name] - Use the appropriate icon for the mode.
 * @property {boolean} [isActive] - Whether or not the icon is active. Icons that are not active will use an outlined version of the icon.
 * If there is not an outlined version for the particular icon, it will use the default (full) version.
 * @property {string} [ios] - Explicitly set the icon to use on iOS.
 * @property {string} [md] - Explicitly set the icon to use on Android.
 * @see {@link /docs/v2/components#icons Icon Component Docs}
 *
 */
@Directive({
  selector: 'ion-icon,icon',
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
    config: Config,
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) {
    this.mode = config.get('iconMode');
    this._name = '';
    this._ios = '';
    this._md = '';
    this._css = '';

    if (_elementRef.nativeElement.tagName === 'ICON') {
      // deprecated warning
      console.warn('<icon> has been renamed to <ion-icon>');
      console.warn('<ion-icon> requires the "name" attribute w/ a value');
      console.warn('<ion-icon name="home"></ion-icon> should now be <ion-icon name="home"></ion-icon>');
    }
  }

  /**
   * @private
   */
  get name() {
    return this._name;
  }

  /**
   * @private
   */
  set name(val) {
    if (!(/md-|ios-|-logo/.test(val))) {
      // this does not have one of the defaults
      // so lets auto add in the mode prefix for them
      val = this.mode + '-' + val;
    }
    this._name = val;
    this.update();
  }

  /**
   * @private
   */
  get ios() {
    return this._ios;
  }

  /**
   * @private
   */
  set ios(val) {
    this._ios = val;
    this.update();
  }

  /**
   * @private
   */
  get md() {
    return this._md;
  }

  /**
   * @private
   */
  set md(val) {
    this._md = val;
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
    let css = 'ion-';

    if (this._ios && this.mode === 'ios') {
      css += this._ios;

    } else if (this._md && this.mode === 'md') {
      css += this._md;

    } else {
      css += this._name;
    }

    if (this.mode == 'ios' && !this.isActive) {
      css += '-outline';
    }

    if (this._css !== css) {
      if (this._css) {
        this._renderer.setElementClass(this._elementRef, this._css, false);
      }
      this._css = css;
      this._renderer.setElementClass(this._elementRef, css, true);

      this._renderer.setElementAttribute(this._elementRef, 'aria-label',
          css.replace('ion-', '').replace('ios-', '').replace('md-', '').replace('-', ' '));
    }
  }

  /**
   * @private
   */
  addClass(className) {
    this._renderer.setElementClass(this._elementRef, className, true);
  }

}
