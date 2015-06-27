import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {ProtoViewRef} from 'angular2/src/core/compiler/view_ref';
import {NgZone} from 'angular2/src/core/zone/ng_zone';

import {ViewItem} from '../view/view-item';
import * as dom from '../../util/dom';


@Component({
  selector: 'ion-navbar'
})
@View({
  template: `
    <div class="navbar-inner">
      <button class="back-button button">
        <icon class="back-button-icon ion-ios-arrow-back"></icon>
        <span class="back-button-text">
          <span class="back-default" [inner-text]="bbDefault"></span>
          <span class="back-title" [inner-text]="bbText"></span>
        </span>
      </button>
      <div class="navbar-title">
        <div class="navbar-inner-title">
          <content select="ion-title"></content>
        </div>
      </div>
      <div class="navbar-item navbar-primary-item">
        <content select="[primary]"></content>
      </div>
      <div class="navbar-item navbar-secondary-item">
        <content select="[secondary]"></content>
      </div>
    </div>
  `,
  directives: [BackButton, BackButtonText, Title, NavbarItem]
})
export class Navbar {
  constructor(item: ViewItem, elementRef: ElementRef) {
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
    const navbarEle = this.eleRef.nativeElement;
    const titleEle = this._ttEle || (this._ttEle = navbarEle.querySelector('ion-title'));

    // don't bother if there's no title element
    if (!titleEle) return;

    // get the computed style of the title element
    const titleStyle = this._ttStyle || (this._ttStyle = window.getComputedStyle(titleEle));

    // don't bother if we're not trying to center align the title
    if (titleStyle.textAlign !== 'center') return;

    // get all the dimensions
    const titleOffsetLeft = titleEle.offsetLeft;
    const titleOffsetRight = navbarEle.offsetWidth - (titleOffsetLeft + titleEle.offsetWidth);

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
      const innerTitleEle = this._innerTtEle || (this._innerTtEle = navbarEle.querySelector('.navbar-inner-title'));
      innerTitleEle.style.margin = this._ttMargin = margin;
    }
  }

  didEnter() {
    setTimeout(() => {
      const titleEle = this._ttEle || (this._ttEle = this.eleRef.nativeElement.querySelector('ion-title'));
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
  selector: '.navbar-title'
})
class Title {
  constructor(@Parent() navbar: Navbar, elementRef: ElementRef) {
    navbar.titleElement(elementRef);
  }
}

@Directive({
  selector: '.navbar-item'
})
class NavbarItem {
  constructor(@Parent() navbar: Navbar, elementRef: ElementRef) {
    navbar.itemElements(elementRef);
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
