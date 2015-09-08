import {Directive, Component, View, Host, ElementRef, forwardRef, Injector, NgZone} from 'angular2/angular2';

import {ViewController} from '../view/view-controller';
import {ViewItem} from '../view/view-item';
import {Tabs} from './tabs';


/**
 * @name ionTab
 * @requires ionTabs
 * @description
 * Contains a tab's content. The content only exists while the given tab is selected.
 *
 * @usage
 * ```html
 * <ion-tab tab-title="Heart" tab-icon="ion-ios-heart-outline" [root]="root1"></ion-tab>
 * ```
 */
@Component({
  selector: 'ion-tab',
  properties: [
    'root',
    'tabTitle',
    'tabIcon'
  ],
  host: {
    '[attr.id]': 'panelId',
    '[attr.aria-labelledby]': 'labeledBy',
    '[attr.aria-hidden]': 'isNotSelected',
    '[class.tab-selected]': 'isSelected',
    'role': 'tabpanel'
  }
})
@View({
  template: '<template pane-anchor></template><ng-content></ng-content>',
  directives: [forwardRef(() => TabPaneAnchor)]
})
export class Tab extends ViewController {

  /**
   * TODO
   * @param {Tabs} tabs  TODO
   * @param {ElementRef} elementRef  TODO
   * @param {Injector} injector  TODO
   * @param {NgZone} zone  TODO
   */
  constructor(
    @Host() tabs: Tabs,
    elementRef: ElementRef,
    injector: Injector,
    zone: NgZone
  ) {
    // A Tab is both a container of many views, and is a view itself.
    // A Tab is one ViewItem within it's Host Tabs (which extends ViewController)
    // A Tab is a ViewController for its child ViewItems
    super(tabs, injector, elementRef, zone);
    this.tabs = tabs;

    this.childNavbar(true);

    let item = this.item = new ViewItem(tabs.Host);
    item.setInstance(this);
    item.viewElementRef(elementRef);
    tabs.addTab(this);

    this.navbarView = item.navbarView = () => {
      let activeItem = this.getActive();
      return activeItem && activeItem.navbarView();
    };

    item.enableBack = () => {
      // override ViewItem's enableBack(), should use the
      // active child nav item's enableBack() instead
      let activeItem = this.getActive();
      return (activeItem && activeItem.enableBack());
    };

    this.panelId = 'tab-panel-' + item.id;
    this.labeledBy = 'tab-button-' + item.id;
  }

  onInit() {
    if (this._initialResolve) {
      this.tabs.select(this).then(() => {
        this._initialResolve();
        this._initialResolve = null;
      });
    }
  }

  /**
   * TODO
   * @param {Function} callback  TODO
   */
  load(callback) {
    if (!this._loaded && this.root) {
      let opts = {
        animate: false,
        navbar: false
      };
      this.push(this.root, null, opts).then(() => {
        callback && callback();
      });
      this._loaded = true;

    } else {
      callback && callback();
    }
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  queueInitial() {
    // this Tab will be used as the initial one for the first load of Tabs
    return new Promise(res => { this._initialResolve = res; });
  }

  get isSelected() {
    return this.tabs.isActive(this.item);
  }

  get isNotSelected() {
    return !this.tabs.isActive(this.item);
  }

}


/**
 * TODO
 */
@Directive({
  selector: 'template[pane-anchor]'
})
class TabPaneAnchor {

  /**
  * TODO
  * @param {Tab} tab  TODO
  * @param {ElementRef} elementRef  TODO
  */
  constructor(@Host() tab: Tab, elementRef: ElementRef) {
    tab.anchorElementRef(elementRef);
  }
}
