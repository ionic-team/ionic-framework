import {Component, Directive, View, Optional, ElementRef, TemplateRef, forwardRef, Inject} from 'angular2/angular2';

import {Ion} from '../ion';
import {ToolbarBase} from '../toolbar/toolbar';
import {IonicConfig} from '../../config/config';
import {IonicView} from '../../config/decorators';
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
  host: {
    'class': 'toolbar'
  }
})
@IonicView({
  template:
    '<div class="toolbar-inner">' +
      '<button class="back-button">' +
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
  directives: [BackButton, BackButtonText]
})
export class Navbar extends ToolbarBase {
  constructor(
    app: IonicApp,
    @Optional() viewCtrl: ViewController,
    elementRef: ElementRef,
    config: IonicConfig
  ) {
    super(elementRef, config);

    this.app = app;
    viewCtrl && viewCtrl.navbarView(this);

    this.bbIcon = config.setting('backButtonIcon');
    this.bbDefault = config.setting('backButtonText');
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
    this.app.title(this.getTitleText());
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
    @Optional() viewCtrl: ViewController,
    @Optional() templateRef: TemplateRef
  ) {
    viewCtrl && viewCtrl.addTemplateRef('navbar', templateRef);
  }
}
