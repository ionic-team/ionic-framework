import {Component, Directive, View, Host, ElementRef, Optional, forwardRef, Inject} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicView} from '../../config/decorators';
import {MenuToggle} from '../menu/menu-toggle';
import {Navbar} from '../nav-bar/nav-bar';


/**
 * TODO
 */
export class ToolbarBase extends Ion  {

  constructor(
    elementRef: ElementRef,
    config: IonicConfig
  ) {
    super(elementRef, config);
    this.itemRefs = [];
    this.titleRef = null;
  }

  setTitleCmp(titleCmp) {
    this.titleCmp = titleCmp;
  }

  getTitleText() {
    return (this.titleCmp && this.titleCmp.getTitleText()) || '';
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  getTitleRef() {
    return this.titleCmp && this.titleCmp.elementRef;
  }

  /**
   * A toolbar items include the left and right side `ion-nav-items`,
   * and every `menu-toggle`. It does not include the `ion-title`.
   * @returns {TODO} Array of this toolbar's item ElementRefs.
   */
  getItemRefs() {
    return this.itemRefs;
  }

  addItemRef(itemElementRef) {
    this.itemRefs.push(itemElementRef);
  }

}


/**
 * TODO
 */
@Component({
  selector: 'ion-toolbar',
  host: {
    'class': 'toolbar'
  }
})
@IonicView({
  template:
    '<div class="toolbar-inner">' +
      '<ng-content select="[menu-toggle]"></ng-content>' +
      '<ng-content select="ion-title"></ng-content>' +
      '<ng-content select="ion-nav-items[primary]"></ng-content>' +
      '<ng-content select="ion-nav-items[secondary]"></ng-content>' +
    '</div>' +
    '<div class="toolbar-background"></div>'
})
export class Toolbar extends ToolbarBase {
  constructor(
    elementRef: ElementRef,
    config: IonicConfig
  ) {
    super(elementRef, config);
  }

}


@Component({
  selector: 'ion-title'
})
@View({
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

  getTitleText() {
    return this.getNativeElement().textContent;
  }
}


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
