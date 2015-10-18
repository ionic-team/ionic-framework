import {Directive, ElementRef, Optional, Host, NgFor, forwardRef, ViewContainerRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {ViewController} from '../nav/view-controller';
import {ConfigComponent} from '../../config/decorators';
import {Icon} from '../icon/icon';


/**
 * _For basic Tabs usage, see the [Tabs section](../../../../components/#tabs)
 * of the Component docs._
 *
 * The Tabs component is a container with a TabBar and any number of
 * individual Tab components. On iOS, the TabBar is placed on the bottom of
 * the screen, while on Android it is at the top.
 *
 * See the [Tab API reference](../Tab/) for more details on individual Tab components.
 *
 * The TabBar is automatically created for you using the
 * [properties you set on each Tab](../Tab/#tab_properties).
 *
 * To override the platform specific TabBar placement, use the
 * `tab-bar-placement` property:
 *
 * ```ts
 * <ion-tabs tab-bar-placement="top">
 *   <ion-tab [root]="tabRoot"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * To change the location of the icons in the TabBar, use the `tab-bar-icons`
 * property:
 * ```ts
 * <ion-tabs tab-bar-icons="bottom">
 *   <ion-tab [root]="tabRoot"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * You can select tabs programatically by injecting Tabs into any child
 * component, and using the [select()](#select) method:
 * ```ts
 * @Page({
 *   template: `<button (click)="goToTabTwo()">Go to Tab2</button>`
 * })
 * class TabOne {
 *   constructor(tabs: Tabs){
 *     this.tabs = tabs;
 *   }
 *
 *   goToTabTwo() {
 *     this.tabs.select(this.tabs.tabs[1]);
 *   }
 * }
 * ```
 * The [tabs](#tabs) property is an array of all child [Tab](../Tab/) components
 * of that Tabs component.
 *
 */
@ConfigComponent({
  selector: 'ion-tabs',
  defaultInputs: {
    'tabBarPlacement': 'bottom',
    'tabBarIcons': 'top',
    'preloadTabs': true
  },
  template:
    '<ion-navbar-section>' +
      '<template navbar-anchor></template>' +
    '</ion-navbar-section>' +
    '<ion-tab-bar-section>' +
      '<tab-bar role="tablist">' +
        '<a *ng-for="#t of _tabs" [tab]="t" class="tab-button" role="tab">' +
          '<icon [name]="t.tabIcon" [is-active]="t.isSelected" class="tab-button-icon"></icon>' +
          '<span class="tab-button-text">{{t.tabTitle}}</span>' +
        '</a>' +
        '<tab-highlight></tab-highlight>' +
      '</tab-bar>' +
    '</ion-tab-bar-section>' +
    '<ion-content-section>' +
      '<ng-content></ng-content>' +
    '</ion-content-section>',
  directives: [
    Icon,
    NgFor,
    forwardRef(() => TabButton),
    forwardRef(() => TabHighlight),
    forwardRef(() => TabNavBarAnchor)
  ]
})
export class Tabs extends Ion {

  /**
   * Hi, I'm "Tabs". I'm really just another Page, with a few special features.
   * "Tabs" can be a sibling to other pages that can be navigated to, which those
   * sibling pages may or may not have their own tab bars (doesn't matter). The fact
   * that "Tabs" can happen to have children "Tab" classes, and each "Tab" can have
   * children pages with their own "ViewController" instance, as nothing to do with the
   * point that "Tabs" is itself is just a page with its own instance of ViewController.
   */
 constructor(
    app: IonicApp,
    config: Config,
    elementRef: ElementRef,
    @Optional() viewCtrl: ViewController
  ) {
    super(elementRef, config);
    this.app = app;
    this.preload = config.get('preloadTabs');

    // collection of children "Tab" instances, which extends NavController
    this._tabs = [];

    // Tabs may also be an actual ViewController which was navigated to
    // if Tabs is static and not navigated to within a NavController
    // then skip this and don't treat it as it's own ViewController
    if (viewCtrl) {
      this._ready = new Promise(res => { this._isReady = res; });

      viewCtrl.onReady = () => {
        return this._ready;
      };
    }
  }

  /**
   * @private
   */
  add(tab) {
    tab.id = ++_tabIds;
    tab.btnId = 'tab-' + tab.id;
    tab.panelId = 'tabpanel-' + tab.id;
    this._tabs.push(tab);

    return (this._tabs.length === 1);
  }

  /**
   * TODO
   * @param {Tab} tab  TODO
   * @returns {TODO} TODO
   */
  select(tabOrIndex) {
    let selectedTab = null;

    if (typeof tabOrIndex === 'number') {
      selectedTab = this.getByIndex(tabOrIndex);

    } else {
      selectedTab = tabOrIndex;
    }

    if (!selectedTab || !this.app.isEnabled()) {
      return Promise.reject();
    }

    let deselectedTab = this.getSelected();

    if (selectedTab === deselectedTab) {
      // no change
      return this._touchActive(selectedTab);
    }

    console.debug('select tab', selectedTab.id);

    selectedTab.load(() => {
      this._isReady && this._isReady();

      this._tabs.forEach(tab => {
        tab.isSelected = (tab === selectedTab);

        tab._views.forEach(viewCtrl => {
          let navbarRef = viewCtrl.navbarRef();
          if (navbarRef) {
            navbarRef.nativeElement.classList[tab.isSelected ? 'remove': 'add']('deselected-tab');
          }
        });
      });

      this.highlight && this.highlight.select(selectedTab);
    });
  }

  /**
   * TODO
   * @param {TODO} index  TODO
   * @returns {TODO} TODO
   */
  getByIndex(index) {
    if (index < this._tabs.length && index > -1) {
      return this._tabs[index];
    }
    return null;
  }

  getSelected() {
    for (let i = 0; i < this._tabs.length; i++) {
      if (this._tabs[i].isSelected) {
        return this._tabs[i];
      }
    }
    return null;
  }

  getIndex(tab) {
    return this._tabs.indexOf(tab);
  }

  /**
   * @private
   * "Touch" the active tab, either going back to the root view of the tab
   * or scrolling the tab to the top
   */
  _touchActive(tab) {
    let stateLen = tab.length();

    if(stateLen > 1) {
      // Pop to the root view
      return tab.popToRoot();
    }

    return Promise.resolve();
  }

}

let _tabIds = -1;


/**
 * @private
 * TODO
 */
@Directive({
  selector: '.tab-button',
  inputs: ['tab'],
  host: {
    '[attr.id]': 'tab.btnId',
    '[attr.aria-controls]': 'tab.panelId',
    '[attr.aria-selected]': 'tab.isSelected',
    '[class.has-title]': 'hasTitle',
    '[class.has-icon]': 'hasIcon',
    '[class.has-title-only]': 'hasTitleOnly',
    '[class.icon-only]': 'hasIconOnly',
    '(click)': 'onClick($event)',
  }
})
class TabButton extends Ion {
  constructor(@Host() tabs: Tabs, config: Config, elementRef: ElementRef) {
    super(elementRef, config);
    this.tabs = tabs;

    if (config.get('hoverCSS') === false) {
      elementRef.nativeElement.classList.add('disable-hover');
    }
  }

  onInit() {
    this.tab.btn = this;
    this.hasTitle = !!this.tab.tabTitle;
    this.hasIcon = !!this.tab.tabIcon;
    this.hasTitleOnly = (this.hasTitle && !this.hasIcon);
    this.hasIconOnly = (this.hasIcon && !this.hasTitle);
  }

  onClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.tabs.select(this.tab);
  }
}

/**
 * @private
 * TODO
 */
@Directive({
  selector: 'tab-highlight'
})
class TabHighlight {
  constructor(@Host() tabs: Tabs, config: Config, elementRef: ElementRef) {
    if (config.get('mode') === 'md') {
      tabs.highlight = this;
      this.elementRef = elementRef;
    }
  }

  select(tab) {
    setTimeout(() => {
      let d = tab.btn.getDimensions();
      let ele = this.elementRef.nativeElement;
      ele.style.transform = 'translate3d(' + d.left + 'px,0,0) scaleX(' + d.width + ')';

      if (!this.init) {
        this.init = true;
        setTimeout(() => {
          ele.classList.add('animate');
        }, 64)
      }
    }, 32);
  }

}


/**
 * @private
 * TODO
 */
@Directive({selector: 'template[navbar-anchor]'})
class TabNavBarAnchor {
  constructor(
    @Host() tabs: Tabs,
    viewContainerRef: ViewContainerRef
  ) {
    tabs.navbarContainerRef = viewContainerRef;
  }
}
