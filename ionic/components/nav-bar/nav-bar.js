import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {ProtoViewRef} from 'angular2/src/core/compiler/view_ref';
import {NgZone} from 'angular2/src/core/zone/ng_zone';

import * as dom from '../../util/dom';
import {Platform} from 'ionic/platform/platform';
import {NavItem} from '../nav/nav-item';
import {BackButton} from './back-button';


@Component({
  selector: 'ion-navbar'
})
@View({
  template: `
    <div class="navbar-inner">
      <back-button class="button navbar-item" [hidden]="!navItem.enableBack"></back-button>
      <div class="navbar-title">
        <div class="navbar-inner-title navbar-title-hide">
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
  directives: [BackButton],
  lifecycle: [onInit]
})
export class Navbar {
  constructor(navItem:NavItem, elementRef:ElementRef, ngZone:NgZone) {
    this.navItem = navItem;
    this.domElement = elementRef.domElement;
    this.zone = ngZone;
  }

  onInit() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.alignTitle();
      }, 32);
    });
  }

  alignTitle() {
    const navbarEle = this.domElement;
    const innerTitleEle = this._innerTitleEle || (this._innerTitleEle = navbarEle.querySelector('.navbar-inner-title'));
    const titleEle = this._titleEle || (this._titleEle = innerTitleEle.querySelector('ion-title'));
    const style = this._style || (this._style = window.getComputedStyle(titleEle));

    const titleOffsetWidth = titleEle.offsetWidth;
    const titleOffsetLeft = titleEle.offsetLeft;
    const titleScrollWidth = titleEle.scrollWidth;
    const navbarOffsetWidth = navbarEle.offsetWidth;

    // TODO!!! When an element is being reused by angular2, it'll sometimes keep the
    // styles from the original element's use, causing these calculations to be wrong
    if (window.getComputedStyle(innerTitleEle).margin !== '0px') {
      this._showTitle();
      return;
    }

    // only align if the title is center and if it isn't already overflowing
    if (style.textAlign !== 'center' || titleOffsetWidth < titleScrollWidth) {
      this._showTitle();

    } else {
      let rightMargin = navbarOffsetWidth - (titleOffsetLeft + titleOffsetWidth);
      let centerMargin = titleOffsetLeft - rightMargin;

      innerTitleEle.style.margin = `0 ${centerMargin}px 0 0`;

      dom.raf(() => {
        if (titleEle.offsetWidth < titleEle.scrollWidth) {
          // not enough room yet, just left align title
          innerTitleEle.style.margin = '';
          innerTitleEle.style.textAlign = 'left';
        }
        this._showTitle();
      })
    }
  }

  _showTitle() {
    if (!this._shown) {
      this._shown = true;
      this._innerTitleEle.classList.remove('navbar-title-hide');
    }
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
  constructor(navItem: NavItem, protoViewRef: ProtoViewRef) {
    console.log('NavbarTemplate', protoViewRef)
    navItem.navbarProto(protoViewRef);
  }
}
