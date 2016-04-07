import {Directive, ElementRef, Renderer, Input} from 'angular2/core';

import {Config} from '../../config/config';


/**
 * @name Icon
 * @description
 * Icons can be used on their own, or inside of a number of Ionic components.
 * For a full list of available icons, check out the
 * [Ionicons resource docs](../../../../resources/ionicons).
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
 * @demo /docs/v2/demos/icon/
 * @see {@link /docs/v2/components#icons Icon Component Docs}
 *
 */
@Directive({
  selector: 'ion-icon,icon',
  host: {
    'role': 'img'
  }
})
export class Icon {
  private _isActive: any;
  private _name: string = '';
  private _ios: string = '';
  private _md: string = '';
  private _css: string = '';

  /**
   * @private
   */
  mode: string;

  constructor(
    config: Config,
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) {
    this.mode = config.get('iconMode');

    if (_elementRef.nativeElement.tagName === 'ICON') {
      // deprecated warning
      console.warn('<icon> has been renamed to <ion-icon>');
      console.warn('<ion-icon> requires the "name" attribute w/ a value');
      console.warn('<icon home></icon> should now be <ion-icon name="home"></ion-icon>');
    }
  }

  /**
   * @private
   */
  ngOnDestroy() {
    if (this._css) {
      this._renderer.setElementClass(this._elementRef.nativeElement, this._css, false);
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
      val = this.mode + '-' + val;
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
  update() {
    let css = 'ion-';

    if (this._ios && this.mode === 'ios') {
      css += this._ios;

    } else if (this._md && this.mode === 'md') {
      css += this._md;

    } else {
      css += this._name;
    }

    if (this.mode === 'ios' && !this.isActive) {
      css += '-outline';
    }

    if (this._css !== css) {
      if (this._css) {
        this._renderer.setElementClass(this._elementRef.nativeElement, this._css, false);
      }
      this._css = css;
      this._renderer.setElementClass(this._elementRef.nativeElement, css, true);

      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-label',
          css.replace('ion-', '').replace('ios-', '').replace('md-', '').replace('-', ' '));
    }
  }

  /**
   * @private
   * @param {string} add class name
   */
  addClass(className: string) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, true);
  }

}
