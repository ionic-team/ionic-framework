import {Directive, ElementRef, Optional, Host, forwardRef, ViewContainerRef, HostListener} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {Ion} from '../ion';
import {Attr} from '../app/id';
import {Config} from '../../config/config';
import {Platform} from '../../platform/platform';
import {NavController} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {ConfigComponent} from '../../decorators/config-component';
import {Icon} from '../icon/icon';
import {rafFrames} from '../../util/dom';


/**
 * @name Tabs
 * @property {any} [tabbarPlacement] - set position of the tabbar, top or bottom
 * @property {any} [tabbarIcons] - set the position of the tabbar's icons: top, bottom, left, right, hide
 * @property {any} [preloadTabs] - sets whether to preload all the tabs, true or false
 * @usage
* ```html
 * <ion-tabs>
 *   <ion-tab [root]="tabRoot"></ion-tab>
 * </ion-tabs>
 * ```
 * @description
 * _For basic Tabs usage, see the [Tabs section](../../../../components/#tabs)
 * of the Component docs._
 *
 * The Tabs component is a container with a TabBar and any number of
 * individual Tab components. On iOS, the TabBar is placed on the bottom of
 * the screen, while on Android it is at the top.
 *
 * @see {@link /docs/v2/components#tabs Tabs Component Docs}
 * @see {@link ../Tab Tab API Docs}
 */
@ConfigComponent({
  selector: 'ion-tabs',
  defaultInputs: {
    'tabbarPlacement': 'bottom',
    'tabbarIcons': 'top',
    'preloadTabs': false
  },
  template:
    '<ion-navbar-section>' +
      '<template navbar-anchor></template>' +
    '</ion-navbar-section>' +
    '<ion-tabbar-section>' +
      '<tabbar role="tablist">' +
        '<a *ngFor="#t of _tabs" [tab]="t" class="tab-button" role="tab">' +
          '<icon [name]="t.tabIcon" [isActive]="t.isSelected" class="tab-button-icon"></icon>' +
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
    config: Config,
    elementRef: ElementRef,
    @Optional() viewCtrl: ViewController,
    @Optional() navCtrl: NavController,
    private platform: Platform
  ) {
    super(elementRef, config);
    this.parent = navCtrl;
    this.subPages = config.get('tabSubPages');

    this._tabs = [];
    this._id = ++tabIds;
    this._ids = -1;
    this._onReady = null;

    // Tabs may also be an actual ViewController which was navigated to
    // if Tabs is static and not navigated to within a NavController
    // then skip this and don't treat it as it's own ViewController
    if (viewCtrl) {
      viewCtrl.setContent(this);
      viewCtrl.setContentRef(elementRef);

      viewCtrl.onReady = (done) => {
        this._onReady = done;
      };
    }
  }

  /**
   * @private
   */
  ngOnInit() {
    super.ngOnInit();
    this.preloadTabs = (this.preloadTabs !== "false" && this.preloadTabs !== false);

    if (this._highlight) {
      this.platform.onResize(() => {
        this._highlight.select(this.getSelected());
      });
    }
  }

  /**
   * @private
   */
  add(tab) {
    tab.id = this._id + '-' + (++this._ids);
    this._tabs.push(tab);

    return (this._tabs.length === 1);
  }

  /**
   * @param {Number} index Index of the tab you want to select
   */
  select(tabOrIndex) {
    let selectedTab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
    if (!selectedTab) {
      return Promise.reject();
    }

    let deselectedTab = this.getSelected();

    if (selectedTab === deselectedTab) {
      // no change
      return this._touchActive(selectedTab);
    }

    console.time('Tabs#select ' + selectedTab.id);

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

      selectedTab.emitSelect();

      if (selectedTab.root) {
        // only show the selectedTab if it has a root
        // it's possible the tab is only for opening modal's or signing out
        // and doesn't actually have content. In the case there's no content
        // for a tab then do nothing and leave the current view as is
        this._tabs.forEach(tab => {
          tab.setSelected(tab === selectedTab);
        });
      }

      this._highlight && this._highlight.select(selectedTab);

      selectedPage && selectedPage.didEnter();
      deselectedPage && deselectedPage.didLeave();

      if (this._onReady) {
        this._onReady();
        this._onReady = null;
      }

      console.time('Tabs#select ' + selectedTab.id);
    });
  }

  /**
   * @param {Number} index Index of the tab you want to get
   * @returns {Any} Tab Returs the tab who's index matches the one passed
   */
  getByIndex(index) {
    if (index < this._tabs.length && index > -1) {
      return this._tabs[index];
    }
    return null;
  }

  /**
   * @return {Any} Tab Returns the currently selected tab
   */
  getSelected() {
    for (let i = 0; i < this._tabs.length; i++) {
      if (this._tabs[i].isSelected) {
        return this._tabs[i];
      }
    }
    return null;
  }

  /**
   * @private
   */
  getIndex(tab) {
    return this._tabs.indexOf(tab);
  }

  /**
   * @private
   * "Touch" the active tab, going back to the root view of the tab
   * or optionally letting the tab handle the event
   */
  _touchActive(tab) {
    let active = tab.getActive();

    if (!active) {
      return Promise.resolve();
    }

    let instance = active.instance;

    // If they have a custom tab selected handler, call it
    if (instance.tabSelected) {
      return instance.tabSelected();
    }

    // If we're a few pages deep, pop to root
    if (tab.length() > 1) {
      // Pop to the root view
      return tab.popToRoot();
    }

    // Otherwise, if the page we're on is not our real root, reset it to our
    // default root type
    if (tab.root != active.componentType) {
      return tab.setRoot(tab.root);
    }

    // And failing all of that, we do something safe and secure
    return Promise.resolve();
  }

  /**
   * Returns the root NavController. Returns `null` if Tabs is not
   * within a NavController.
   * @returns {NavController}
   */
  get rootNav() {
    let nav = this.parent;
    while (nav.parent) {
      nav = nav.parent;
    }
    return nav;
  }

}

let tabIds = -1;


/**
 * @private
 */
@Directive({
  selector: '.tab-button',
  inputs: ['tab'],
  host: {
    '[attr.id]': 'tab._btnId',
    '[attr.aria-controls]': 'tab._panelId',
    '[attr.aria-selected]': 'tab.isSelected',
    '[class.has-title]': 'hasTitle',
    '[class.has-icon]': 'hasIcon',
    '[class.has-title-only]': 'hasTitleOnly',
    '[class.icon-only]': 'hasIconOnly',
    '[class.disable-hover]': 'disHover'
  }
})
class TabButton extends Ion {
  constructor(@Host() tabs: Tabs, config: Config, elementRef: ElementRef) {
    super(elementRef, config);
    this.tabs = tabs;
    this.disHover = (config.get('hoverCSS') === false);
  }

  ngOnInit() {
    this.tab.btn = this;
    this.hasTitle = !!this.tab.tabTitle;
    this.hasIcon = !!this.tab.tabIcon;
    this.hasTitleOnly = (this.hasTitle && !this.hasIcon);
    this.hasIconOnly = (this.hasIcon && !this.hasTitle);
  }

  @HostListener('click')
  private onClick() {
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
      tabs._highlight = this;
      this.elementRef = elementRef;
    }
  }

  select(tab) {
    rafFrames(3, () => {
      let d = tab.btn.getDimensions();
      let ele = this.elementRef.nativeElement;
      ele.style.transform = 'translate3d(' + d.left + 'px,0,0) scaleX(' + d.width + ')';

      if (!this.init) {
        this.init = true;
        rafFrames(6, () => {
          ele.classList.add('animate');
        });
      }
    });
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
