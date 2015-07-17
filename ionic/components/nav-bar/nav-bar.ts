import {Directive, View, Parent, ElementRef, forwardRef} from 'angular2/angular2';
import {ProtoViewRef} from 'angular2/src/core/compiler/view_ref';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent, IonicView} from '../../config/annotations';
import {IonicApp} from '../app/app';
import {ViewItem} from '../view/view-item';
import * as dom from '../../util/dom';


@IonicComponent({
  selector: 'ion-navbar'
})
@IonicView({
  template: `
    <div class="toolbar-inner">
      <button class="back-button button">
        <icon class="back-button-icon ion-ios-arrow-back"></icon>
        <span class="back-button-text">
          <span class="back-default" [inner-text]="bbDefault"></span>
          <span class="back-title" [inner-text]="bbText"></span>
        </span>
      </button>
      <div class="toolbar-title">
        <div class="toolbar-inner-title">
          <content select="ion-title"></content>
        </div>
      </div>
      <div class="toolbar-item toolbar-primary-item">
        <content select="[primary]"></content>
      </div>
      <div class="toolbar-item toolbar-secondary-item">
        <content select="[secondary]"></content>
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
export class Navbar extends Ion {
  constructor(item: ViewItem, elementRef: ElementRef, ionicConfig: IonicConfig, app: IonicApp) {
    super(elementRef, ionicConfig);

    this.app = app;
    this.eleRef = elementRef;
    this.itemEles = [];
    item.navbarView(this);

    this.bbDefault = 'Back';
    this.bbText = '';
  }

  element() {
    return this.eleRef;
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

  titleElement(eleRef) {
    if (arguments.length) {
      this._nbTlEle = eleRef;
    }
    return this._nbTlEle;
  }

  itemElements(eleRef) {
    if (arguments.length) {
      this.itemEles.push(eleRef);
    }
    return this.itemEles;
  }

  titleText(eleRef) {
    if (arguments.length) {
      this._ttTxt.push(eleRef);
    }
    return this._ttTxt;
  }

  alignTitle() {
    // called after the navbar/title has had a moment to
    // finish rendering in their correct locations
    const toolbarEle = this.eleRef.nativeElement;
    const titleEle = this._ttEle || (this._ttEle = toolbarEle.querySelector('ion-title'));

    // don't bother if there's no title element
    if (!titleEle) return;

    // get the computed style of the title element
    const titleStyle = this._ttStyle || (this._ttStyle = window.getComputedStyle(titleEle));

    // don't bother if we're not trying to center align the title
    if (titleStyle.textAlign !== 'center') return;

    // get all the dimensions
    const titleOffsetLeft = titleEle.offsetLeft;
    const titleOffsetRight = toolbarEle.offsetWidth - (titleOffsetLeft + titleEle.offsetWidth);

    let marginLeft = 0;
    let marginRight = 0;
    if (titleOffsetLeft < titleOffsetRight) {
      marginLeft = (titleOffsetRight - titleOffsetLeft) + 5;

    } else if (titleOffsetLeft > titleOffsetRight) {
      marginRight = (titleOffsetLeft - titleOffsetRight) - 5;
    }

    let margin = `0 ${marginRight}px 0 ${marginLeft}px`;

    if ((marginLeft || marginRight) && margin !== this._ttMargin) {
      // only do an update if it has to
      const innerTitleEle = this._innerTtEle || (this._innerTtEle = toolbarEle.querySelector('.toolbar-inner-title'));
      innerTitleEle.style.margin = this._ttMargin = margin;
    }
  }

  didEnter() {
    const titleEle = this._ttEle || (this._ttEle = this.eleRef.nativeElement.querySelector('ion-title'));
    this.app.title(titleEle.textContent);

    setTimeout(() => {
      //this.titleText((titleEle && titleEle.textContent) || '');
    }, 32);
  }
}

@Directive({
  selector: '.back-button',
  host: {
    '(^click)': 'goBack($event)'
  }
})
class BackButton {
  constructor(@Parent() navbar: Navbar, item: ViewItem, elementRef: ElementRef) {
    this.item = item;
    navbar.backButtonElement(elementRef);
  }

  goBack(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.item.viewCtrl.pop();
  }
}

@Directive({
  selector: '.back-button-text'
})
class BackButtonText {
  constructor(@Parent() navbar: Navbar, elementRef: ElementRef) {
    navbar.backButtonTextElement(elementRef);
  }
}

@Directive({
  selector: '.toolbar-title'
})
class Title {
  constructor(@Parent() toolbar: Navbar, elementRef: ElementRef) {
    toolbar.titleElement(elementRef);
  }
}

@Directive({
  selector: '.toolbar-item'
})
class NavbarItem {
  constructor(@Parent() toolbar: Navbar, elementRef: ElementRef) {
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
  constructor(item: ViewItem, protoViewRef: ProtoViewRef) {
    item.addProtoViewRef('navbar', protoViewRef);
  }
}
