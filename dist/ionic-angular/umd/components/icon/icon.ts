import { Directive, ElementRef, HostBinding, Input, Renderer } from '@angular/core';

import { isTrueProperty } from '../../util/util';
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
 * @demo /docs/demos/src/icon/
 * @see {@link /docs/components#icons Icon Component Docs}
 *
 */
@Directive({
  selector: 'ion-icon',
  host: {
    'role': 'img'
  }
})
export class Icon extends Ion {
  /** @hidden */
  _iconMode: string;
  /** @hidden */
  _isActive: boolean = true;
  /** @hidden */
  _name: string = '';
  /** @hidden */
  _ios: string = '';
  /** @hidden */
  _md: string = '';
  /** @hidden */
  _css: string = '';

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    super(config, elementRef, renderer, 'icon');
    this._iconMode = config.get('iconMode');
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    if (this._css) {
      this.setElementClass(this._css, false);
    }
  }

  /**
   * @input {string} Specifies which icon to use. The appropriate icon will be used based on the mode.
   * For more information, see [Ionicons](/docs/ionicons/).
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
   * @input {string} Specifies which icon to use on `ios` mode.
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
   * @input {string} Specifies which icon to use on `md` mode.
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
   * @input {boolean} If true, the icon is styled with an "active" appearance.
   * An active icon is filled in, and an inactive icon is the outline of the icon.
   * The `isActive` property is largely used by the tabbar. Only affects `ios` icons.
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
   * @hidden
   */
  @HostBinding('class.hide') _hidden: boolean = false;

  /**
   * @hidden
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
