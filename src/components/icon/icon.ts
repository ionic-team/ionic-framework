import { Directive, ElementRef, HostBinding, Input, Renderer } from '@angular/core';

import { isTrueProperty } from '../../util/util';
import { Config } from '../../config/config';
import { Ion } from '../ion';


/**
 * @name Icon
 * @description
 * The Icon component is used to include Ionicons in an app. Icons can be used 
 * on their own or inside of a number of Ionic components, and are styled 
 * differently depending on the mode the app is running in (iOS, MD, WP). 
 * For example, by setting the icon name of `alarm`, on iOS the
 * icon will automatically apply `ios-alarm`, and on Material Design it will
 * automatically apply `md-alarm`.
 *
 * For a full list of available icons, check out the
 * [Ionicons docs](../../../../ionicons).
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
 * ### Active / Inactive Icons
 * 
 * All icons have both `active` and `inactive` states. Active icons are typically 
 * full and thick, where as inactive icons are outlined and thin. Set the `isActive` 
 * input property to `true` or `false` to change the state of the icon. Icons will default 
 * to active if a value is not specified.
 * 
 * ```html
 * <!-- active -->
 * <ion-icon name="heart"></ion-icon>
 *
 * <!-- inactive -->
 * <ion-icon name="heart" isActive="false"></ion-icon>
 * ```
 * 
 * ### Dynamcially Changing an Icon
 * 
 * To set an icon using a variable, bind the `name` input property to a value on the component's model:
 * 
 * ```html
 * <ion-icon [name]="myIcon"></ion-icon>
 * ```
 * 
 * ```typescript
 * export class MyFirstPage {
 *   // use the home icon
 *   myIcon: string = "home";
 * }
 * ```
 * 
 * @demo /docs/v2/demos/src/icon/basic
 * @see {@link /docs/v2/components#icons Icon Component Docs}
 * @see {@link /docs/v2/ionicons Ionicon Docs}
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
  _isActive: boolean = true;
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
    this._setColor(value);
  }

  /**
   * @input {string} The mode to apply to this component. Mode can be `ios`, `wp`, or `md`.
   */
  @Input()
  set mode(val: string) {
    this._setMode(val);
  }

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    super(config, elementRef, renderer, 'icon');
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
      this._name = this._iconMode + '-' + val;
    } else {
      this._name = val;
    }
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
    return this._isActive;
  }

  set isActive(val: boolean) {
    this._isActive = isTrueProperty(val);
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
    let iconName: string;

    if (this._ios && this._iconMode === 'ios') {
      iconName = this._ios;
    } else if (this._md && this._iconMode === 'md') {
      iconName = this._md;
    } else {
      iconName = this._name;
    }
    let hidden = this._hidden = (iconName === null);
    if (hidden) {
      return;
    }

    let iconMode = iconName.split('-', 2)[0];
    if (
      iconMode === 'ios' &&
      !this._isActive &&
      iconName.indexOf('logo-') < 0 &&
      iconName.indexOf('-outline') < 0) {
      iconName += '-outline';
    }

    let css = 'ion-' + iconName;
    if (this._css === css) {
      return;
    }
    if (this._css) {
      this.setElementClass(this._css, false);
    }
    this._css = css;
    this.setElementClass(css, true);

    let label = iconName
      .replace('ios-', '')
      .replace('md-', '')
      .replace('-', ' ');
    this.setElementAttribute('aria-label', label);
  }

}
