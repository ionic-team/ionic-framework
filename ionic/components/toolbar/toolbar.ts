import {Component, Directive, View, Host, ElementRef, forwardRef, Query, QueryList} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicView} from '../../config/annotations';
import {MenuToggle} from '../menu/menu-toggle';


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
  constructor(elementRef: ElementRef) {
    super(elementRef, null);
  }
}


@Directive({
  selector: 'ion-nav-items,[menu-toggle]'
})
export class ToolbarItem extends Ion {
  constructor(elementRef: ElementRef) {
    super(elementRef, null);
  }
}


/**
 * TODO
 */
export class ToolbarBase extends Ion  {

  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    titleQry: QueryList<ToolbarTitle>,
    itemQry: QueryList<ToolbarItem>
  ) {
    super(elementRef, config);
    this.titleQry = titleQry;
    this.itemQry = itemQry;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  getTitle() {
    return this.titleQry.first;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  getTitleRef() {
    return this.titleQry.first && this.titleQry.first.elementRef;
  }

  /**
   * A toolbar items include the left and right side `ion-nav-items`,
   * and every `menu-toggle`. It does not include the `ion-title`.
   * @returns {TODO} Array of this toolbar's item ElementRefs.
   */
  getItemRefs() {
    let refs = [];
    this.itemQry.map(function(itm) {
      refs.push(itm.getElementRef());
    });
    return refs;
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
    '</div>'
})
export class Toolbar extends ToolbarBase {

  constructor(
    elementRef: ElementRef ,
    config: IonicConfig,
    @Query(ToolbarTitle) titleQry: QueryList<ToolbarTitle>,
    @Query(ToolbarItem) itemQry: QueryList<ToolbarItem>
  ) {
    super(elementRef, config, titleQry, itemQry);
  }

}
