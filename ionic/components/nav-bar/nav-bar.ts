import {Component, Directive, View, Host, Optional, ElementRef, TemplateRef, Query, QueryList, ViewQuery} from 'angular2/angular2';

import {Ion} from '../ion';
import {ToolbarBase, ToolbarTitle, ToolbarItem} from '../toolbar/toolbar';
import {IonicConfig} from '../../config/config';
import {IonicView} from '../../config/annotations';
import {IonicApp} from '../app/app';
import {ViewItem} from '../view/view-item';
import {ViewController} from '../view/view-controller';
import {MenuToggle} from '../menu/menu-toggle'


@Directive({
  selector: '.back-button-text'
})
class BackButtonText extends Ion {
  constructor(elementRef: ElementRef) {
    super(elementRef, null);
  }
}


@Directive({
  selector: '.back-button',
  host: {
    '(click)': 'goBack($event)'
  }
})
class BackButton extends Ion {
  constructor(
    @Optional() viewCtrl: ViewController,
    elementRef: ElementRef,
    @Query(BackButtonText) bbtQry: QueryList<BackButtonText>
  ) {
    super(elementRef, null);
    this.viewCtrl = viewCtrl;
    this.bbtQry = bbtQry;
  }

  goBack(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.viewCtrl && this.viewCtrl.pop();
  }

  getTextRef() {
    return this.bbtQry.first.elementRef;
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
    '</div>',
  directives: [BackButton, BackButtonText]
})
export class Navbar extends ToolbarBase {
  constructor(
    app: IonicApp,
    @Optional() item: ViewItem,
    elementRef: ElementRef,
    config: IonicConfig,
    @Query(ToolbarTitle) titleQry: QueryList<ToolbarTitle>,
    @Query(ToolbarItem) itemQry: QueryList<ToolbarItem>,
    @ViewQuery(BackButton) bbQry: QueryList<BackButton>
  ) {
    super(elementRef, config, titleQry, itemQry);

    this.app = app;
    item && item.navbarView(this);
    this.bbQry = bbQry;

    this.bbIcon = config.setting('backButtonIcon');
    this.bbDefault = config.setting('backButtonText');
  }

  getBackButtonRef() {
    return this.bbQry.first.getElementRef();
  }

  getBackButtonTextRef() {
    return this.bbQry.first.getTextRef();
  }

  didEnter() {
    // const titleEle = this._ttEle || (this._ttEle = this.getNativeElement().querySelector('ion-title'));
    // titleEle && this.app.title(titleEle.textContent);
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
    @Optional() item: ViewItem,
    @Optional() templateRef: TemplateRef
  ) {
    item && item.addTemplateRef('navbar', templateRef);
  }
}
