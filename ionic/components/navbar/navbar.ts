import {Component, Directive, Optional, ElementRef, Renderer, TemplateRef, forwardRef, Inject, ViewContainerRef} from 'angular2/core';

import {Ion} from '../ion';
import {Icon} from '../icon/icon';
import {ToolbarBase} from '../toolbar/toolbar';
import {Config} from '../../config/config';
import {IonicApp} from '../app/app';
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
    @Optional() navCtrl: NavController,
    elementRef: ElementRef,
    @Optional() @Inject(forwardRef(() => Navbar)) navbar: Navbar
  ) {
    super(elementRef, null);
    this.navCtrl = navCtrl;
    navbar && navbar.setBackButtonRef(elementRef);
  }

  goBack(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.navCtrl && this.navCtrl.pop();
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
 * loaded. You can pass the navbar a `ion-title` or any number of buttons.
 *
 * @usage
 * ```html
 * <ion-navbar *navbar>
 *
 *   <ion-buttons>
 *     <button (click)="toggleItems()">
 *       toggle
 *     </button>
 *   </ion-buttons>
 *
 *   <ion-title>
 *     Page Title
 *   </ion-title>
 *
 *   <ion-buttons>
 *     <button (click)="openModal()">
 *       Modal
 *     </button>
 *   </ion-buttons>
 * </ion-navbar>
 * ```
 *
 * @see {@link ../../toolbar/Toolbar/ Toolbar API Docs}
 */
@Component({
  selector: 'ion-navbar',
  template:
    '<div class="toolbar-background"></div>' +
    '<button class="back-button bar-button bar-button-default" [hidden]="hideBackButton">' +
      '<icon class="back-button-icon" [name]="bbIcon"></icon>' +
      '<span class="back-button-text">' +
        '<span class="back-default">{{bbText}}</span>' +
      '</span>' +
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
  inputs: [
    'hideBackButton'
  ],
  directives: [BackButton, BackButtonText, Icon, ToolbarBackground]
})
export class Navbar extends ToolbarBase {

  constructor(
    app: IonicApp,
    @Optional() viewCtrl: ViewController,
    elementRef: ElementRef,
    config: Config,
    renderer: Renderer
  ) {
    super(elementRef, config);
    this.app = app;
    this.renderer = renderer;

    viewCtrl && viewCtrl.setNavbar(this);

    this.bbIcon = config.get('backButtonIcon');
    this.bbText = config.get('backButtonText');
  }

  /**
   * @private
   */
  ngOnInit() {
    super.ngOnInit();
    let hideBackButton = this.hideBackButton;
    if (typeof hideBackButton === 'string') {
      this.hideBackButton = (hideBackButton === '' || hideBackButton === 'true');
    }
  }

  /**
   * @private
   */
  getBackButtonRef() {
    return this.bbRef;
  }

  /**
   * @private
   */
  setBackButtonRef(backButtonElementRef) {
    this.bbRef = backButtonElementRef;
  }

  /**
   * @private
   */
  getBackButtonTextRef() {
    return this.bbtRef;
  }

  /**
   * @private
   */
  setBackButtonTextRef(backButtonTextElementRef) {
    this.bbtRef = backButtonTextElementRef;
  }

  /**
   * @private
   */
  setBackgroundRef(backgrouneElementRef) {
    this.bgRef = backgrouneElementRef;
  }

  /**
   * @private
   */
  getBackgroundRef() {
    return this.bgRef;
  }

  /**
   * @private
   */
  didEnter() {
    try {
      this.app.setTitle(this.getTitleText());
    } catch(e) {
      console.error(e);
    }
  }

  /**
   * @private
   */
  setHidden(isHidden) {
    this._hidden = isHidden
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
