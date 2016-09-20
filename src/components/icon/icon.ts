import { Directive, ElementRef, HostBinding, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';


/**
 * @name Icon
 * @description
 * Icons can be used on their own, or inside of a number of Ionic components.
 * For a full list of available icons, check out the
 * [Ionicons docs](../../../../ionicons).
 *
 * One feature of Ionicons in Ionic is when icon names are set, the actual icon
 * which is rendered can change slightly depending on the mode the app is
 * running from. For example, by setting the icon name of `alarm`, on iOS the
 * icon will automatically apply `ios-alarm`, and on Material Design it will
 * automatically apply `md-alarm`. This allows the developer to write the
 * markup once while Ionic applies the appropriate icon based on the mode.
 *
 * @usage
 * ```html
 * <!-- automatically uses the correct "star" icon depending on the mode -->
 * <ion-icon name="star"></ion-icon>
 *
 * <!-- explicity set the icon for each mode -->
 * <ion-icon ios="ios-home" md="md-home"></ion-icon>
 *
 * <!-- always use the same icon, no matter what the mode -->
 * <ion-icon name="ios-clock"></ion-icon>
 * <ion-icon name="logo-twitter"></ion-icon>
 * ```
 *
 * @demo /docs/v2/demos/src/icon/
 * @see {@link /docs/v2/components#icons Icon Component Docs}
 *
 */
@Directive({
  selector: 'ion-icon',
  host: {
    'role': 'img'
  }
})
export class Icon extends Ion {
  /** @private */
  _iconMode: string;
  /** @private */
  _isActive: any;
  /** @private */
  _name: string = '';
  /** @private */
  _ios: string = '';
  /** @private */
  _md: string = '';
  /** @private */
  _css: string = '';

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  get color(): string {
    return this._color;
  }
  set color(value: string) {
    this._setColor('icon', value);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('icon', val);
  }

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    super(config, elementRef, renderer);

    this.mode = config.get('mode');
    this._iconMode = config.get('iconMode');
  }

  /**
   * @private
   */
  ngOnDestroy() {
    if (this._css) {
      this.setElementClass(this._css, false);
    }
  }

  /**
   * @input {string} Icon to use. Will load the appropriate icon for each mode
   */
  @Input()
  get name(): string {
    return this._name;
  }

  set name(val: string) {
    if (!(/^md-|^ios-|^logo-/.test(val))) {
      // this does not have one of the defaults
      // so lets auto add in the mode prefix for them
      val = this._iconMode + '-' + val;
    }
    this._name = val;
    this.update();
  }

  /**
   * @input {string} Explicitly set the icon to use on iOS
   */
  @Input()
  get ios(): string {
    return this._ios;
  }

  set ios(val: string) {
    this._ios = val;
    this.update();
  }

  /**
   * @input {string} Explicitly set the icon to use on MD
   */
  @Input()
  get md(): string {
    return this._md;
  }

  set md(val: string) {
    this._md = val;
    this.update();
  }


  /**
   * @input {bool} Whether or not the icon has an "active" appearance. On iOS an active icon is filled in or full appearance, and an inactive icon on iOS will use an outlined version of the icon same icon. Material Design icons do not change appearance depending if they're active or not. The `isActive` property is largely used by the tabbar.
   */
  @Input()
  get isActive(): boolean {
    return (this._isActive === undefined || this._isActive === true || this._isActive === 'true');
  }

  set isActive(val: boolean) {
    this._isActive = val;
    this.update();
  }

  /**
   * @private
   */
  @HostBinding('class.hide') _hidden: boolean = false;

  /**
   * @private
   */
  update() {
    let css = 'ion-';

    this._hidden = (this._name === null);

    if (this._ios && this._iconMode === 'ios') {
      css += this._ios;

    } else if (this._md && this._iconMode === 'md') {
      css += this._md;

    } else {
      css += this._name;
    }

    if (this._iconMode === 'ios' && !this.isActive && css.indexOf('logo') < 0) {
      css += '-outline';
    }

    if (this._css !== css) {
      if (this._css) {
        this.setElementClass(this._css, false);
      }
      this._css = css;
      this.setElementClass(css, true);

      this.setElementAttribute('aria-label',
          css.replace('ion-', '').replace('ios-', '').replace('md-', '').replace('-', ' '));
    }
  }

}
