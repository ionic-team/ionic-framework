import {Component, Directive, Optional, ElementRef, Renderer, TemplateRef, forwardRef, Inject, ViewContainerRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {Icon} from '../icon/icon';
import {ToolbarBase} from '../toolbar/toolbar';
import {Config} from '../../config/config';
import {Page} from '../../config/decorators';
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
class BackButtonText extends Ion {
  constructor(
    elementRef: ElementRef,
    @Optional() @Inject(forwardRef(() => Navbar)) navbar: Navbar
  ) {
    super(elementRef, null);
    navbar && navbar.setBackButtonTextRef(elementRef);
  }
}


@Component({
  selector: 'ion-navbar',
  template:
    '<div class="toolbar-inner">' +
      '<button class="back-button" [hidden]="hideBackButton">' +
        '<icon class="back-button-icon" [name]="bbIcon"></icon>' +
        '<span class="back-button-text">' +
          '<span class="back-default">{{bbDefault}}</span>' +
        '</span>' +
      '</button>' +
      '<ng-content select="[menu-toggle]"></ng-content>' +
      '<ng-content select="ion-title"></ng-content>' +
      '<ng-content select="ion-nav-items[primary]"></ng-content>' +
      '<ng-content select="ion-nav-items[secondary]"></ng-content>' +
    '</div>' +
    '<div class="toolbar-background"></div>',
  host: {
    '[hidden]': '_hidden'
  },
  inputs: [
    'hideBackButton',
    'navbarStyle'
  ],
  directives: [BackButton, BackButtonText, Icon]
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

    renderer.setElementClass(elementRef, 'toolbar', true);

    let navbarStyle = config.get('navbarStyle');
    if (navbarStyle) {
      renderer.setElementAttribute(elementRef, navbarStyle, '');
    }

    viewCtrl && viewCtrl.setNavbar(this);

    this.bbIcon = config.get('backButtonIcon');
    this.bbDefault = config.get('backButtonText');
  }

  onInit() {
    super.onInit();
    let hideBackButton = this.hideBackButton;
    if (typeof hideBackButton === 'string') {
      this.hideBackButton = (hideBackButton === '' || hideBackButton === 'true');
    }
    
    if (this.navbarStyle) {
      this.renderer.setElementAttribute(this.elementRef, this.navbarStyle, '');
    }
  }

  getBackButtonRef() {
    return this.bbRef;
  }

  setBackButtonRef(backButtonElementRef) {
    this.bbRef = backButtonElementRef;
  }

  getBackButtonTextRef() {
    return this.bbtRef;
  }

  setBackButtonTextRef(backButtonTextElementRef) {
    this.bbtRef = backButtonTextElementRef;
  }

  didEnter() {
    this.app.setTitle(this.getTitleText());
  }

  setHidden(isHidden) {
    this._hidden = isHidden
  }

}


/*
  Used to find and register headers in a view, and this directive's
  content will be moved up to the common navbar location, and created
  using the same context as the view's content area.
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
