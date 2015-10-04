import {Component, Directive, View, Injector, NgFor, ElementRef, Optional, Host, forwardRef, NgZone} from 'angular2/angular2';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {NavController} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {IonicComponent, IonicView} from '../../config/decorators';
import {IonicConfig} from '../../config/config';
import * as dom from 'ionic/util/dom';


/**
 * The Tabs component is a container that contains a [TabBar]() and any number of
 * individual [Tab]() components. On iOS, the TabBar is placed on the bottom of
 * the screen, while on Android it is at the top.
 *
 * For basic Tabs usage, see the [Tabs section]() of the component docs.
 * See the [Tab API reference]() for more details on individual Tab components.
 *
 * You can override the platform specific TabBar placement, by using the
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
 */
@IonicComponent({
  selector: 'ion-tabs',
  defaultProperties: {
    'tabBarPlacement': 'bottom',
    'tabBarIcons': 'top'
  }
})
@IonicView({
  template: '' +
    '<section class="navbar-container">' +
      '<template navbar-anchor></template>' +
    '</section>' +
    '<nav class="tab-bar-container">' +
      '<tab-bar role="tablist">' +
        '<a *ng-for="#t of tabs" [tab]="t" class="tab-button" role="tab">' +
          '<icon [name]="t.tabIcon" [is-active]="t.isSelected" class="tab-button-icon"></icon>' +
          '<span class="tab-button-text">{{t.tabTitle}}</span>' +
        '</a>' +
        '<tab-highlight></tab-highlight>' +
      '</tab-bar>' +
    '</nav>' +
    '<section class="content-container">' +
      '<ng-content></ng-content>' +
    '</section>',
  directives: [
    forwardRef(() => TabButton),
    forwardRef(() => TabHighlight),
    forwardRef(() => TabNavBarAnchor)
  ]
})
export class Tabs extends NavController {
  /**
   * TODO
   */
 constructor(
    @Optional() hostNavCtrl: NavController,
    @Optional() viewCtrl: ViewController,
    app: IonicApp,
    injector: Injector,
    elementRef: ElementRef,
    zone: NgZone
  ) {
    super(hostNavCtrl, injector, elementRef, zone);
    this.app = app;

    this._ready = new Promise(res => { this._isReady = res; });

    // Tabs may also be an actual ViewController which was navigated to
    // if Tabs is static and not navigated to within a NavController
    // then skip this and don't treat it as it's own ViewController
    if (viewCtrl) {
      this.viewCtrl = viewCtrl;

      // special overrides for the Tabs ViewController
      // the Tabs ViewController does not have it's own navbar
      // so find the navbar it should use within it's active Tab
      viewCtrl.navbarView = () => {
        let activeTab = this.getActive();
        if (activeTab && activeTab.instance) {
          return activeTab.instance.navbarView();
        }
      };

      // a Tabs ViewController should not have a back button
      // enableBack back button will later be determined
      // by the active ViewController that has a navbar
      viewCtrl.enableBack = () => {
        return false;
      };

      viewCtrl.onReady = () => {
        return this._ready;
      };
    }

  }

  addTab(tab) {
    this.add(tab.viewCtrl);

    // return true/false if it's the initial tab
    return (this.length() === 1);
  }

  /**
   * TODO
   * @param {Tab} tab  TODO
   * @returns {TODO} TODO
   */
  select(tab) {
    let enteringView = null;
    if (typeof tab === 'number') {
      enteringView = this.getByIndex(tab);
    } else {
      enteringView = this.getByInstance(tab)
    }

    // If we select the same tab as the active one, do some magic.
    if(enteringView === this.getActive()) {
      this._touchActive(tab);
      return;
    }

    if (!enteringView || !enteringView.instance || !this.app.isEnabled()) {
      return Promise.reject();
    }

    return new Promise(resolve => {
      enteringView.instance.load(() => {
        let opts = {
          animate: false
        };

        let leavingView = this.getActive() || new ViewController();
        leavingView.shouldDestroy = false;
        leavingView.shouldCache = true;

        this.transition(enteringView, leavingView, opts, () => {
          this.highlight && this.highlight.select(tab);
          this._isReady();
          resolve();
        });
      });

    });
  }

  /**
   * "Touch" the active tab, either going back to the root view of the tab
   * or scrolling the tab to the top
   */
  _touchActive(tab) {
    let stateLen = tab.length();

    if(stateLen > 1) {
      // Pop to the root view
      tab.popToRoot();
    }
  }

  get tabs() {
    return this.instances();
  }

}

/**
 * @private
 * TODO
 */
@Directive({
  selector: '.tab-button',
  properties: ['tab'],
  host: {
    '[attr.id]': 'btnId',
    '[attr.aria-controls]': 'panelId',
    '[attr.aria-selected]': 'tab.isSelected',
    '[class.has-title]': 'hasTitle',
    '[class.has-icon]': 'hasIcon',
    '[class.has-title-only]': 'hasTitleOnly',
    '[class.icon-only]': 'hasIconOnly',
    '(click)': 'onClick($event)',
  }
})
class TabButton extends Ion {
  constructor(@Host() tabs: Tabs, config: IonicConfig, elementRef: ElementRef) {
    super(elementRef, config);
    this.tabs = tabs;

    if (config.get('hoverCSS') === false) {
      elementRef.nativeElement.classList.add('disable-hover');
    }
  }

  onInit() {
    this.tab.btn = this;
    let id = this.tab.viewCtrl.id;
    this.btnId = 'tab-button-' + id;
    this.panelId = 'tab-panel-' + id;

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
  constructor(@Host() tabs: Tabs, config: IonicConfig, elementRef: ElementRef) {
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
