import {Directive, View, Parent, onInit, ElementRef, forwardRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicComponent} from '../../config/annotations';
import * as dom from '../../util/dom';


@IonicComponent({
  selector: 'ion-toolbar'
})
@View({
  template: `
    <div class="navbar-inner">
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
  directives: [
    forwardRef(() => Title),
    forwardRef(() => NavbarItem)
  ]
})
export class Toolbar extends Ion {
  constructor(elementRef: ElementRef) {
    super(elementRef);
    this.eleRef = elementRef;
    this.itemEles = [];
  }

  onInit() {
    Toolbar.applyConfig(this);
  }

  element() {
    return this.eleRef;
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

}


@Directive({
  selector: '.navbar-title'
})
class Title {
  constructor(@Parent() toolbar: Toolbar, elementRef: ElementRef) {
    toolbar.titleElement(elementRef);
  }
}


@Directive({
  selector: '.navbar-item'
})
class NavbarItem {
  constructor(@Parent() toolbar: Toolbar, elementRef: ElementRef) {
    toolbar.itemElements(elementRef);
  }
}
