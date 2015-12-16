import {Component, Directive, Host, ElementRef, Optional, forwardRef, Inject, ContentChildren, ContentChild, QueryList} from 'angular2/core';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {MenuToggle} from '../menu/menu-toggle';
import {Navbar} from '../navbar/navbar';
import {Button} from '../button/button';


/**
 * @private
 */
export class ToolbarBase extends Ion  {
  itemRefs = [];
  titleRef = null;
  titleCmp: any;

  constructor(
    elementRef: ElementRef,
    config: Config
  ) {
    super(elementRef, config);
  }

  /**
   * @private
   */
  setTitleCmp(titleCmp) {
    this.titleCmp = titleCmp;
  }

  /**
   * @private
   * Returns the toolbar title text if it exists or an empty string
   */
  getTitleText() {
    return (this.titleCmp && this.titleCmp.getTitleText()) || '';
  }

  /**
   * @private
   */
  getTitleRef() {
    return this.titleCmp && this.titleCmp.elementRef;
  }

  /**
   * @private
   * A toolbar items include the left and right side `ion-buttons`,
   * and every `menu-toggle`. It does not include the `ion-title`.
   * @returns {TODO} Array of this toolbar's item ElementRefs.
   */
  getItemRefs() {
    return this.itemRefs;
  }

  /**
   * @private
   */
  addItemRef(itemElementRef) {
    this.itemRefs.push(itemElementRef);
  }

}

/**
 * @name Toolbar
 * @description
 * The toolbar is generic bar that sits above or below content.
 * Unlike an `Navbar`, `Toolbar` can be used for a subheader as well.
 * @usage
 * ```html
 * <ion-toolbar>
 *   <ion-title>My Toolbar Title</ion-title>
 * </ion-toolbar>
 *
 *  <ion-content></ion-content>
 *  ```
 */
@Component({
  selector: 'ion-toolbar',
  template:
    '<div class="toolbar-background"></div>' +
    '<ng-content select="[menuToggle],ion-buttons[left]"></ng-content>' +
    '<ng-content select="ion-buttons[start]"></ng-content>' +
    '<ng-content select="ion-buttons[end],ion-buttons[right]"></ng-content>' +
    '<div class="toolbar-content">' +
      '<ng-content></ng-content>' +
    '</div>',
  host: {
    'class': 'toolbar'
  }
})
export class Toolbar extends ToolbarBase {

  constructor(
    elementRef: ElementRef,
    config: Config
  ) {
    super(elementRef, config);
  }

}

/**
 * @name ToolbarTitle
 * @description
 * `ion-title` is a component that sets the title of the `Toolbar` or `Navbar`
 * @usage
 * ```html
 * <ion-navbar *navbar>
 *    <ion-title>Tab 1</ion-title>
 * </ion-navbar>
 *
 *<!-- or if you wanted to create a subheader title-->
 * <ion-navbar *navbar>
 *    <ion-title>Tab 1</ion-title>
 * </ion-navbar>
 * <ion-toolbar>
 *   <ion-title>SubHeader</ion-title>
 * </ion-toolbar>
 *  ```
 */
@Component({
  selector: 'ion-title',
  template:
    '<div class="toolbar-title">' +
      '<ng-content></ng-content>' +
    '</div>'
})
export class ToolbarTitle extends Ion {
  constructor(
    elementRef: ElementRef,
    @Optional() toolbar: Toolbar,
    @Optional() @Inject(forwardRef(() => Navbar)) navbar: Navbar
  ) {
    super(elementRef, null);
    toolbar && toolbar.setTitleCmp(this);
    navbar && navbar.setTitleCmp(this);
  }
/**
 * @private
 */
  getTitleText() {
    return this.getNativeElement().textContent;
  }
}


/**
 * @private
 */
@Directive({
  selector: 'ion-buttons,[menuToggle],ion-nav-items'
})
export class ToolbarItem {
  inToolbar: boolean;

  constructor(
    elementRef: ElementRef,
    @Optional() toolbar: Toolbar,
    @Optional() @Inject(forwardRef(() => Navbar)) navbar: Navbar
  ) {
    toolbar && toolbar.addItemRef(elementRef);
    navbar && navbar.addItemRef(elementRef);
    this.inToolbar = !!(toolbar || navbar);

    // Deprecation warning
    if (elementRef.nativeElement.tagName === 'ION-NAV-ITEMS') {

      if (elementRef.nativeElement.hasAttribute('primary')) {
        console.warn('<ion-nav-items primary> has been renamed to <ion-buttons start>, please update your HTML');
        elementRef.nativeElement.setAttribute('start', '');

      } else if (elementRef.nativeElement.hasAttribute('secondary')) {
        console.warn('<ion-nav-items secondary> has been renamed to <ion-buttons end>, please update your HTML');
        elementRef.nativeElement.setAttribute('end', '');

      } else {
        console.warn('<ion-nav-items> has been renamed to <ion-buttons>, please update your HTML');
      }
    }

  }

  @ContentChildren(Button)
  set _buttons(buttons) {
    if (this.inToolbar) {
      Button.setRoles(buttons, 'bar-button');
    }
  }
}
