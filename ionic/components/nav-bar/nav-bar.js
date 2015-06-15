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
          <span class="back-default">Back</span>
          <span class="back-title"></span>
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
  directives: [BackButton, Title, NavbarItem]
})
export class Navbar {
  constructor(item: ViewItem, elementRef: ElementRef) {
    this.element = elementRef.domElement;
    this.itemElements = [];
    item.navbarView(this);
  }
}

@Directive({
  selector: '.back-button',
  hostListeners: {
    '^click': 'goBack($event)'
  }
})
class BackButton {
  constructor(@Parent() navbar: Navbar, item: ViewItem, elementRef: ElementRef) {
    this.item = item;
    navbar.backButtonElement = elementRef.domElement;
  }

  goBack(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.item.viewCtrl.pop();
  }
}

@Directive({
  selector: '.navbar-title'
})
export class Title {
  constructor(@Parent() navbar: Navbar, elementRef: ElementRef) {
    navbar.titleElement = elementRef.domElement;
  }
}

@Directive({
  selector: '.navbar-item'
})
export class NavbarItem {
  constructor(@Parent() navbar: Navbar, elementRef: ElementRef) {
    navbar.itemElements.push(elementRef.domElement);
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
