import { ChangeDetectionStrategy, Component, Directive, ElementRef, Input, Optional, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { ToolbarTitle } from './toolbar-title';
import { ViewController } from '../../navigation/view-controller';


/**
 * @name Header
 * @description
 * Header is a parent component that holds the navbar and toolbar component.
 * It's important to note that `ion-header` needs to be the one of the three root elements of a page
 *
 * @usage
 *
 * ```ts
 * @Component({
 *   template: `
 *      <ion-header>
 *        <ion-navbar>
 *          <ion-title>Page1</ion-title>
 *        </ion-navbar>
 *
 *        <ion-toolbar>
 *          <ion-title>Subheader</ion-title>
 *        </ion-toolbar>
 *      </ion-header>
 *
 *      <ion-content></ion-content>
 *   `
 * })
 * ```
 *
 */
@Directive({
  selector: 'ion-header'
})
export class Header extends Ion {

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer, @Optional() viewCtrl: ViewController) {
    super(config, elementRef, renderer);
    this._setMode('header', config.get('mode'));
    viewCtrl && viewCtrl._setHeader(this);
  }

}


/**
 * @name Footer
 * @description
 * Footer is a root component of a page that sits at the bottom of the page.
 * Footer can be a wrapper for `ion-toolbar` to make sure the content area is sized correctly.
 *
 * @usage
 *
 * ```ts
 * @Component({
 *   template: `
 *      <ion-content></ion-content>
 *      <ion-footer>
 *        <ion-toolbar>
 *          <ion-title>Footer</ion-title>
 *        </ion-toolbar>
 *      </ion-footer>
 *   `
 * })
 * ```
 *
 */
@Directive({
  selector: 'ion-footer'
})
export class Footer extends Ion {

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer, @Optional() viewCtrl: ViewController) {
    super(config, elementRef, renderer);
    this._setMode('footer', config.get('mode'));
    viewCtrl && viewCtrl._setFooter(this);
  }

}


/**
 * @private
 */
export class ToolbarBase extends Ion {
  private _title: ToolbarTitle;

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer);
  }

  /**
   * @private
   */
  _setTitle(titleCmp: ToolbarTitle) {
    this._title = titleCmp;
  }

  /**
   * @private
   * Returns the toolbar title text if it exists or an empty string
   */
  getTitleText() {
    return (this._title && this._title.getTitleText()) || '';
  }

}

/**
 * @name Toolbar
 * @description
 * A Toolbar is a generic bar that is positioned above or below content.
 * Unlike a [Navbar](../../navbar/Navbar), a toolbar can be used as a subheader.
 * When toolbars are placed within an `<ion-header>` or `<ion-footer>`,
 * the toolbars stay fixed in their respective location. When placed within
 * `<ion-content>`, toolbars will scroll with the content.
 *
 *
 * ### Buttons in a Toolbar
 * Buttons placed in a toolbar should be placed inside of the `<ion-buttons>`
 * element. An exception to this is a [menuToggle](../../menu/MenuToggle) button.
 * It should not be placed inside of the `<ion-buttons>` element. Both the
 * `<ion-buttons>` element and the `menuToggle` can be positioned inside of the
 * toolbar using different properties. The below chart has a description of each
 * property.
 *
 * | Property    | Description                                                                                                           |
 * |-------------|-----------------------------------------------------------------------------------------------------------------------|
 * | `start`     | Positions element to the left of the content in `ios` mode, and directly to the right in `md` and `wp` mode.    |
 * | `end`       | Positions element to the right of the content in `ios` mode, and to the far right in `md` and `wp` mode.        |
 * | `left`      | Positions element to the left of all other elements.                                                            |
 * | `right`     | Positions element to the right of all other elements.                                                           |
 *
 *
 * ### Header / Footer Box Shadow
 * In `md` mode, the `ion-header` will receive a box-shadow on the bottom, and the
 * `ion-footer` will receive a box-shadow on the top. This can be removed by adding
 * the `no-shadow` attribute to the element.
 *
 * ```html
 * <ion-header no-shadow>
 *   <ion-toolbar>
 *     <ion-title>Header</ion-title>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content>
 * </ion-content>
 *
 * <ion-footer no-shadow>
 *   <ion-toolbar>
 *     <ion-title>Footer</ion-title>
 *   </ion-toolbar>
 * </ion-footer>
 * ```
 *
 * ### Toolbar Borders
 * Toolbars can be stacked up vertically in `<ion-header>`, `<ion-content>`, and
 * `<ion-footer>` elements. In `ios` mode, toolbars have borders on the top and
 * bottom. To hide both borders, the `no-border` attribute should be used on the
 * `ion-toolbar`. To hide the top or bottom border, the `no-border-top` and
 * `no-border-bottom` attribute should be used.
 *
 * ```html
 * <ion-header no-shadow>
 *   <ion-toolbar no-border-bottom>
 *     <ion-title>Header</ion-title>
 *   </ion-toolbar>
 *   <ion-toolbar no-border>
 *     <ion-title>Subheader</ion-title>
 *   </ion-toolbar>
 *   <ion-toolbar no-border-top>
 *     <ion-title>Another Header</ion-title>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content>
 * </ion-content>
 * ```
 *
 *
 * @usage
 * ```html
 * <ion-header no-shadow>
 *
 *   <ion-toolbar no-border-bottom>
 *     <ion-buttons start>
 *       <button ion-button>
 *         <ion-icon name="contact"></ion-icon>
 *       </button>
 *       <button ion-button>
 *         <ion-icon name="search"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *     <ion-title>My Toolbar Title</ion-title>
 *   </ion-toolbar>
 *
 *   <ion-toolbar no-border-top>
 *     <ion-title>I'm a subheader</ion-title>
 *   </ion-toolbar>
 *
 * <ion-header>
 *
 *
 * <ion-content>
 *
 *   <ion-toolbar>
 *     <ion-title>Scrolls with the content</ion-title>
 *   </ion-toolbar>
 *
 * </ion-content>
 *
 *
 * <ion-footer>
 *
 *   <ion-toolbar no-border>
 *     <ion-title>I'm a subfooter</ion-title>
 *     <ion-buttons right>
 *       <button ion-button>
 *         <ion-icon name="menu"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-toolbar>
 *
 *   <ion-toolbar no-border-top>
 *     <ion-title>I'm a footer</ion-title>
 *     <ion-buttons end>
 *       <button ion-button>
 *         <ion-icon name="more"></ion-icon>
 *       </button>
 *       <button ion-button>
 *         <ion-icon name="options"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-toolbar>
 *
 * </ion-footer>
 *  ```
 *
 * @demo /docs/v2/demos/src/toolbar/
 * @see {@link ../../navbar/Navbar/ Navbar API Docs}
 */
@Component({
  selector: 'ion-toolbar',
  template:
    '<div class="toolbar-background" [ngClass]="\'toolbar-background-\' + _mode"></div>' +
    '<ng-content select="[menuToggle],ion-buttons[left]"></ng-content>' +
    '<ng-content select="ion-buttons[start]"></ng-content>' +
    '<ng-content select="ion-buttons[end],ion-buttons[right]"></ng-content>' +
    '<div class="toolbar-content" [ngClass]="\'toolbar-content-\' + _mode">' +
      '<ng-content></ng-content>' +
    '</div>',
  host: {
    'class': 'toolbar',
    '[class.statusbar-padding]': '_sbPadding'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar extends ToolbarBase {
  /** @private */
  _sbPadding: boolean;

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  set color(val: string) {
    this._setColor('toolbar', val);
  }

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('toolbar', val);
  }

  constructor(
    @Optional() viewCtrl: ViewController,
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    super(config, elementRef, renderer);

    this.mode = config.get('mode');
    this._sbPadding = config.getBoolean('statusbarPadding');
  }

}
