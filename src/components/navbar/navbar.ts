import { Component, Directive, ElementRef, forwardRef, Inject, Input, Optional } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { isTrueProperty, noop } from '../../util/util';
import { NavController } from '../nav/nav-controller';
import { ToolbarBase } from '../toolbar/toolbar';
import { ViewController } from '../nav/view-controller';


/**
 * @name Navbar
 * @description
 * Navbar acts as the navigational toolbar, which also comes with a back
 * button. A navbar can contain a `ion-title`, any number of buttons,
 * a segment, or a searchbar. Navbars must be placed within an
 * `<ion-header>` in order for them to be placed above the content.
 * It's important to note that navbar's are part of the dynamica navigation
 * stack. If you need a static toolbar, use ion-toolbar.
 *
 * @usage
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <button menuToggle>
 *       <ion-icon name="menu"></ion-icon>
 *     </button>
 *
 *     <ion-title>
 *       Page Title
 *     </ion-title>
 *
 *     <ion-buttons end>
 *       <button (click)="openModal()">
 *         <ion-icon name="options"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-navbar>
 *
 * </ion-header>
 * ```
 *
 * @demo /docs/v2/demos/navbar/
 * @see {@link ../../toolbar/Toolbar/ Toolbar API Docs}
 */
@Component({
  selector: 'ion-navbar',
  template: `
    <div class="toolbar-background"></div>
    <button (click)="backButtonClick($event)" category="bar-button" class="back-button" [hidden]="_hideBb">
      <span class="button-inner">
        <ion-icon class="back-button-icon" [name]="_bbIcon"></ion-icon>
        <span class="back-button-text">
          <span class="back-default">{{_bbText}}</span>
        </span>
      </span>
    </button>
    <ng-content select="[menuToggle],ion-buttons[left]"></ng-content>
    <ng-content select="ion-buttons[start]"></ng-content>
    <ng-content select="ion-buttons[end],ion-buttons[right]"></ng-content>
    <div class="toolbar-content">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[hidden]': '_hidden',
    'class': 'toolbar',
    '[class.statusbar-padding]': '_sbPadding'
  }
})
export class Navbar extends ToolbarBase {
  private _bbIcon: string;
  private _bbText: string;
  private _hidden: boolean = false;
  private _hideBb: boolean = false;
  private _sbPadding: boolean;

  /**
   * @input {boolean} whether the back button should be shown or not
   */
  @Input()
  get hideBackButton(): boolean {
    return this._hideBb;
  }
  set hideBackButton(val: boolean) {
    this._hideBb = isTrueProperty(val);
  }

  constructor(
    private _app: App,
    @Optional() viewCtrl: ViewController,
    @Optional() private navCtrl: NavController,
    elementRef: ElementRef,
    config: Config
  ) {
    super(elementRef);

    viewCtrl && viewCtrl.setNavbar(this);

    this._bbIcon = config.get('backButtonIcon');
    this._bbText = config.get('backButtonText');
    this._sbPadding = config.getBoolean('statusbarPadding');
  }

  backButtonClick(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    this.navCtrl && this.navCtrl.pop(null, noop);
  }

  /**
   * @private
   */
  setBackButtonText(text: string) {
    this._bbText = text;
  }

  /**
   * @private
   */
  didEnter() {
    try {
      this._app.setTitle(this.getTitleText());
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * @private
   */
  setHidden(isHidden: boolean) {
    // used to display none/block the navbar
    this._hidden = isHidden;
  }

}


/**
 * @private
*/
@Directive({
  selector: 'template[navbar]'
})
export class NavbarTemplate {
  constructor() {
    // deprecated warning: added 2016-06-14, beta.10
    console.warn('ion-navbar no longer requires *navbar attribute. Please restructure header to:\n' +
                 '<ion-header>\n' +
                 '  <ion-navbar>\n' +
                 '    ...\n' +
                 '  </ion-navbar>\n' +
                 '</ion-header>');
  }
}
