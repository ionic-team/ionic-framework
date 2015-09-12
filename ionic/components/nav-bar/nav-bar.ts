import {Directive, View, Host, Optional, ElementRef, forwardRef} from 'angular2/angular2';
import {ProtoViewRef} from 'angular2/src/core/compiler/view_ref';

import {TemplateRef} from 'angular2/angular2';

import {ToolbarBase} from '../toolbar/toolbar';
import {IonicConfig} from '../../config/config';
import {IonicComponent, IonicView} from '../../config/annotations';
import {IonicApp} from '../app/app';
import {ViewItem} from '../view/view-item';


@IonicComponent({
  selector: 'ion-navbar',
  host: {
    'class': 'toolbar'
  }
})
@IonicView({
  template: `
    <div class="toolbar-inner">
      <button class="back-button">
        <icon class="back-button-icon" [name]="bbClass"></icon>
        <span class="back-button-text">
          <span class="back-default" [text-content]="bbDefault"></span>
          <span class="back-title" [text-content]="bbText"></span>
        </span>
      </button>
      <ng-content select="[aside-toggle]"></ng-content>
      <div class="toolbar-title">
        <div class="toolbar-inner-title">
          <ng-content select="ion-title"></ng-content>
        </div>
      </div>
      <div class="toolbar-item toolbar-primary-item">
        <ng-content select="[primary]"></ng-content>
      </div>
      <div class="toolbar-item toolbar-secondary-item">
        <ng-content select="[secondary]"></ng-content>
      </div>
    </div>
  `,
  directives: [
    forwardRef(() => BackButton),
    forwardRef(() => BackButtonText),
    forwardRef(() => Title),
    forwardRef(() => NavbarItem)
  ]
})
export class Navbar extends ToolbarBase {
  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    app: IonicApp,
    @Optional() item: ViewItem
  ) {
    super(elementRef, config);

    this.app = app;
    item && item.navbarView(this);

    this.bbClass = config.setting('backButtonIcon');
    this.bbDefault = config.setting('backButtonText');
    this.bbText = '';
  }

  backButtonElement(eleRef) {
    if (arguments.length) {
      this._bbEle = eleRef;
    }
    return this._bbEle;
  }

  backButtonTextElement(eleRef) {
    if (arguments.length) {
      this._bbTxEle = eleRef;
    }
    return this._bbTxEle;
  }

  didEnter() {
    const titleEle = this._ttEle || (this._ttEle = this.getNativeElement().querySelector('ion-title'));
    titleEle && this.app.title(titleEle.textContent);
  }

}

@Directive({
  selector: '.back-button',
  host: {
    '(click)': 'goBack($event)'
  }
})
class BackButton {
  constructor(@Host() navbar: Navbar, @Optional() item: ViewItem, elementRef: ElementRef) {
    this.item = item;
    navbar.backButtonElement(elementRef);
  }

  goBack(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.item && this.item.viewCtrl.pop();
  }
}

@Directive({
  selector: '.back-button-text'
})
class BackButtonText {
  constructor(@Host() navbar: Navbar, elementRef: ElementRef) {
    navbar.backButtonTextElement(elementRef);
  }
}

@Directive({
  selector: '.toolbar-title'
})
class Title {
  constructor(@Host() toolbar: Navbar, elementRef: ElementRef) {
    toolbar.titleElement(elementRef);
  }
}

@Directive({
  selector: '.toolbar-item'
})
class NavbarItem {
  constructor(@Host() toolbar: Navbar, elementRef: ElementRef) {
    toolbar.itemElements(elementRef);
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
