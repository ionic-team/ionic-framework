import {Directive, ElementRef, Optional, Host, NgFor, NgIf, forwardRef, ViewContainerRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {Attr} from '../app/id';
import {Config} from '../../config/config';
import {Platform} from '../../platform/platform';
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
 * `tabbar-placement` property:
 *
 * ```html
 * <ion-tabs tabbar-placement="top">
 *   <ion-tab [root]="tabRoot"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * To change the location of the icons in the TabBar, use the `tabbar-icons`
 * property:
 * ```html
 * <ion-tabs tabbar-icons="bottom">
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
    'tabbarPlacement': 'bottom',
    'tabbarIcons': 'top',
    'tabbarStyle': 'default',
    'preloadTabs': false
  },
  template:
    '<ion-navbar-section>' +
      '<template navbar-anchor></template>' +
    '</ion-navbar-section>' +
    '<ion-tabbar-section>' +
      '<tabbar role="tablist" [attr]="tabbarStyle">' +
        '<a *ng-for="#t of tabs" [tab]="t" class="tab-button" role="tab">' +
          '<icon [name]="t.tabIcon" [is-active]="t.isSelected" class="tab-button-icon"></icon>' +
          '<span class="tab-button-text">{{t.tabTitle}}</span>' +
        '</a>' +
        '<tab-highlight></tab-highlight>' +
      '</tabbar>' +
    '</ion-tabbar-section>' +
    '<ion-content-section>' +
      '<ng-content></ng-content>' +
    '</ion-content-section>',
  directives: [
    Icon,
    NgFor,
    NgIf,
    Attr,
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
    @Optional() viewCtrl: ViewController,
    private platform: Platform
  ) {
    super(elementRef, config);
    this.app = app;
    this.subPages = config.get('tabSubPages');

    // collection of children "Tab" instances, which extends NavController
    this.tabs = [];

    // Tabs may also be an actual ViewController which was navigated to
    // if Tabs is static and not navigated to within a NavController
    // then skip this and don't treat it as it's own ViewController
    if (viewCtrl) {
      viewCtrl.setContent(this);
      viewCtrl.setContentRef(elementRef);

      // TODO: improve how this works, probably not use promises here
      this.readyPromise = new Promise(res => { this.isReady = res; });
      viewCtrl.onReady = () => {
        return this.readyPromise;
      };
    }
  }

  /**
   * @private
   */
  onInit() {
    super.onInit();
    this.preloadTabs = (this.preloadTabs !== "false" && this.preloadTabs !== false);

    if (this.highlight) {
      this.platform.onResize(() => {
        this.highlight.select(this.getSelected());
      });
    }
  }

  /**
   * @private
   */
  add(tab) {
    tab.id = ++_tabIds;
    tab.btnId = 'tab-' + tab.id;
    tab.panelId = 'tabpanel-' + tab.id;
    this.tabs.push(tab);

    return (this.tabs.length === 1);
  }

  /**
   * TODO
   * @param {Tab} tab  TODO
   * @returns {TODO} TODO
   */
  select(tabOrIndex) {
    let selectedTab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
    if (!selectedTab) {
      return Promise.reject();
    }

    console.time('select tab ' + selectedTab.id);

    let deselectedTab = this.getSelected();

    if (selectedTab === deselectedTab) {
      // no change
      return this.touchActive(selectedTab);
    }

    let opts = {
      animate: false
    };

    let deselectedPage;
    if (deselectedTab) {
      deselectedPage = deselectedTab.getActive();
      deselectedPage && deselectedPage.willLeave();
    }

    let selectedPage = selectedTab.getActive();
    selectedPage && selectedPage.willEnter();

    selectedTab.load(opts, () => {
      this.tabs.forEach(tab => {
        tab.setSelected(tab === selectedTab);
      });

      this.highlight && this.highlight.select(selectedTab);

      selectedPage && selectedPage.didEnter();
      deselectedPage && deselectedPage.didLeave();

      this.isReady && this.isReady();

      console.timeEnd('select tab ' + selectedTab.id);
    });
  }

  /**
   * TODO
   * @param {TODO} index  TODO
   * @returns {TODO} TODO
   */
  getByIndex(index) {
    if (index < this.tabs.length && index > -1) {
      return this.tabs[index];
    }
    return null;
  }

  getSelected() {
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].isSelected) {
        return this.tabs[i];
      }
    }
    return null;
  }

  getIndex(tab) {
    return this.tabs.indexOf(tab);
  }

  /**
   * @private
   * "Touch" the active tab, going back to the root view of the tab
   * or optionally letting the tab handle the event
   */
  touchActive(tab) {
    let active = tab.getActive();

    if(!active) {
      return Promise.resolve();
    }

    let instance = active.instance;

    // If they have a custom tab selected handler, call it
    if(instance.tabSelected) {
      return instance.tabSelected();
    }

    // If we're a few pages deep, pop to root
    if (tab.length() > 1) {
      // Pop to the root view
      return tab.popToRoot();
    }

    // Otherwise, if the page we're on is not our real root, reset it to our
    // default root type
    if(tab.root != active.componentType) {
      return tab.setRoot(tab.root);
    }

    // And failing all of that, we do something safe and secure
    return Promise.resolve();
  }

}

let _tabIds = -1;


/**
 * @private
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
    '[class.disable-hover]': 'disHover',
    '(click)': 'onClick()',
  }
})
class TabButton extends Ion {
  constructor(@Host() tabs: Tabs, config: Config, elementRef: ElementRef) {
    super(elementRef, config);
    this.tabs = tabs;
    this.disHover = (config.get('hoverCSS') === false);
  }

  onInit() {
    this.tab.btn = this;
    this.hasTitle = !!this.tab.tabTitle;
    this.hasIcon = !!this.tab.tabIcon;
    this.hasTitleOnly = (this.hasTitle && !this.hasIcon);
    this.hasIconOnly = (this.hasIcon && !this.hasTitle);
  }

  onClick() {
    this.tabs.select(this.tab);
  }
}


/**
 * @private
 */
@Directive({
  selector: 'tab-highlight'
})
class TabHighlight {
  constructor(@Host() tabs: Tabs, config: Config, elementRef: ElementRef) {
    if (config.get('tabbarHighlight')) {
      tabs.highlight = this;
      this.elementRef = elementRef;
    }
  }

  select(tab) {
    let d = tab.btn.getDimensions();
    let ele = this.elementRef.nativeElement;
    ele.style.transform = 'translate3d(' + d.left + 'px,0,0) scaleX(' + d.width + ')';

    if (!this.init) {
      this.init = true;
      setTimeout(() => {
        ele.classList.add('animate');
      }, 64);
    }
  }

}


/**
 * @private
 */
@Directive({selector: 'template[navbar-anchor]'})
class TabNavBarAnchor {
  constructor(@Host() tabs: Tabs, viewContainerRef: ViewContainerRef) {
    tabs.navbarContainerRef = viewContainerRef;
  }
}
