import {Component, Directive, Optional, ElementRef, Renderer, TemplateRef, forwardRef, Inject, ViewContainerRef, Input} from 'angular2/core';

import {Ion} from '../ion';
import {Icon} from '../icon/icon';
import {ToolbarBase} from '../toolbar/toolbar';
import {Config} from '../../config/config';
import {IonicApp} from '../app/app';
import {isTrueProperty} from '../../util/util';
import {ViewController} from '../nav/view-controller';
import {NavController} from '../nav/nav-controller';


@Directive({
  selector: '.back-button',
  host: {
    '(click)': 'goBack($event)'
  }
})
class BackButton extends Ion {
  constructor(
    @Optional() private _nav: NavController,
    elementRef: ElementRef,
    @Optional() @Inject(forwardRef(() => Navbar)) navbar: Navbar
  ) {
    super(elementRef);
    navbar && navbar.setBackButtonRef(elementRef);
  }

  goBack(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this._nav && this._nav.pop();
  }
}


@Directive({
  selector: '.back-button-text'
})
class BackButtonText {
  constructor(
    elementRef: ElementRef,
    @Inject(forwardRef(() => Navbar)) navbar: Navbar
  ) {
    navbar.setBackButtonTextRef(elementRef);
  }
}


@Directive({
  selector: '.toolbar-background'
})
class ToolbarBackground {
  constructor(
    elementRef: ElementRef,
    @Inject(forwardRef(() => Navbar)) navbar: Navbar
  ) {
    navbar.setBackgroundRef(elementRef);
  }
}

/**
 * @name Navbar
 * @description
 * Navbar is a global level toolbar that gets updated every time a page gets
 * loaded. You can pass the navbar an `ion-title`, any number of buttons, a segment, or a searchbar.
 *
 * @usage
 * ```html
 * <ion-navbar *navbar>
 *   <button menuToggle>
 *     <ion-icon name="menu"></ion-icon>
 *   </button>
 *
 *   <ion-title>
 *     Page Title
 *   </ion-title>
 *
 *   <ion-buttons end>
 *     <button (click)="openModal()">
 *       <ion-icon name="options"></ion-icon>
 *     </button>
 *   </ion-buttons>
 * </ion-navbar>
 * ```
 *
 * @demo /docs/v2/demos/navbar/
 * @see {@link ../../toolbar/Toolbar/ Toolbar API Docs}
 */
@Component({
  selector: 'ion-navbar',
  template:
    '<div class="toolbar-background"></div>' +
    '<button class="back-button bar-button bar-button-default" [hidden]="_hideBb">' +
      '<span class="button-inner">' +
        '<ion-icon class="back-button-icon" [name]="_bbIcon"></ion-icon>' +
        '<span class="back-button-text">' +
          '<span class="back-default">{{_bbText}}</span>' +
        '</span>' +
      '</span>' +
      '<ion-button-effect></ion-button-effect>' +
    '</button>' +
    '<ng-content select="[menuToggle],ion-buttons[left]"></ng-content>' +
    '<ng-content select="ion-buttons[start]"></ng-content>' +
    '<ng-content select="ion-buttons[end],ion-buttons[right]"></ng-content>' +
    '<div class="toolbar-content">' +
      '<ng-content></ng-content>' +
    '</div>',
  host: {
    '[hidden]': '_hidden',
    'class': 'toolbar'
  },
  directives: [BackButton, BackButtonText, Icon, ToolbarBackground]
})
export class Navbar extends ToolbarBase {
  private _bbIcon: string;
  private _bbText: string;
  private _hidden: boolean = false;
  private _hideBb: boolean = false;
  private _bbRef: ElementRef;
  private _bbtRef: ElementRef;
  private _bgRef: ElementRef;

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
    private _app: IonicApp,
    @Optional() viewCtrl: ViewController,
    elementRef: ElementRef,
    config: Config,
    private _renderer: Renderer
  ) {
    super(elementRef);

    viewCtrl && viewCtrl.setNavbar(this);

    this._bbIcon = config.get('backButtonIcon');
    this._bbText = config.get('backButtonText');
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
  getBackButtonRef() {
    return this._bbRef;
  }

  /**
   * @private
   */
  setBackButtonRef(backButtonElementRef: ElementRef) {
    this._bbRef = backButtonElementRef;
  }

  /**
   * @private
   */
  getBackButtonTextRef() {
    return this._bbtRef;
  }

  /**
   * @private
   */
  setBackButtonTextRef(backButtonTextElementRef: ElementRef) {
    this._bbtRef = backButtonTextElementRef;
  }

  /**
   * @private
   */
  setBackgroundRef(backgrouneElementRef: ElementRef) {
    this._bgRef = backgrouneElementRef;
  }

  /**
   * @private
   */
  getBackgroundRef() {
    return this._bgRef;
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
 * Used to find and register headers in a view, and this directive's
 * content will be moved up to the common navbar location, and created
 * using the same context as the view's content area.
*/
@Directive({
  selector: 'template[navbar]'
})
export class NavbarTemplate {
  constructor(
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef,
    @Optional() viewCtrl: ViewController
  ) {
    if (viewCtrl) {
      viewCtrl.setNavbarTemplateRef(templateRef);
      viewCtrl.setNavbarViewRef(viewContainerRef);
    }
  }
}
