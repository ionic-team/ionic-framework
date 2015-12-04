import {Component, Directive, Host, ElementRef, Optional, forwardRef, Inject} from 'angular2/angular2';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {MenuToggle} from '../menu/menu-toggle';
import {Navbar} from '../navbar/navbar';


/**
 * @private
 */
export class ToolbarBase extends Ion  {

  constructor(
    elementRef: ElementRef,
    config: Config
  ) {
    super(elementRef, config);
    this.itemRefs = [];
    this.titleRef = null;
  }

  /**
   * @private
   */
  setTitleCmp(titleCmp) {
    this.titleCmp = titleCmp;
  }

  /**
   * @private
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
   * A toolbar items include the left and right side `ion-nav-items`,
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
 * The toolbar is generic bar that sits above content.
 * Unlike an `ionNavbar`, `ionToolbar` can be used for a subheader as well.
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
    '<toolbar-background></toolbar-background>' +
    '<ng-content select="[menu-toggle]"></ng-content>' +
    '<ng-content select="ion-nav-items[primary]"></ng-content>' +
    '<ng-content select="ion-nav-items[secondary]"></ng-content>' +
    '<toolbar-content>' +
      '<ng-content></ng-content>' +
    '</toolbar-content>',
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
 * `ion-title` is a component that sets the title of the `ionToolbar` or `ionNavbar`
 * @usage
 * ```html
 * <ion-navbar *navbar>
 *    <ion-title>Tab 1</ion-title>
 * </ion-navbar>
 *
 *<!-- or if you wanted to crate a subheader title-->
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
  selector: 'ion-nav-items,[menu-toggle]'
})
export class ToolbarItem extends Ion {
  constructor(
    elementRef: ElementRef,
    @Optional() toolbar: Toolbar,
    @Optional() @Inject(forwardRef(() => Navbar)) navbar: Navbar
  ) {
    super(elementRef, null);
    toolbar && toolbar.addItemRef(elementRef);
    navbar && navbar.addItemRef(elementRef);
  }
}
