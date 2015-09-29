import {Component, Directive, View, Injector, NgFor, ElementRef, Optional, Host, forwardRef, NgZone} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {NavController} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {IonicComponent, IonicView} from '../../config/decorators';
import {IonicConfig} from '../../config/config';
import * as dom from 'ionic/util/dom';


/**
 * @name ionTabs
 * @description
 * Powers a multi-tabbed interface with a Tab Bar and a set of "pages"
 * that can be tabbed through.
 *
 * Assign any tabs attribute to the element to define its look and feel.
 *
 * For iOS, tabs will appear at the bottom of the screen. For Android, tabs
 * will be at the top of the screen, below the nav-bar. This follows each platform's
 * design specification, but can be configured with IonicConfig.
 *
 * See the ionTab component's documentation for more details on individual tabs.
 *
 * @usage
 * ```html
 * <ion-tabs>
 *   <ion-tab tab-title="Heart" tab-icon="heart-" [root]="root1"></ion-tab>
 *   <ion-tab tab-title="Star" tab-icon="star" [root]="root2"></ion-tab>
 *   <ion-tab tab-title="Stopwatch" tab-icon="stopwatch" [root]="root3"></ion-tab>
 * </ion-tabs>
 * ```
 *
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
  directives: [forwardRef(() => TabButton), forwardRef(() => TabHighlight)]
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
    }

  }

  /**
   * TODO
   * @param {Tab} tab  TODO
   */
  addTab(tab) {
    // tab.viewCtrl refers to the ViewController of the individual Tab being added to Tabs (NavController)
    // this.viewCtrl refers to the ViewController instsance on Tabs
    this.add(tab.viewCtrl);

    if (this.length() === 1) {
      // this was the first tab added, queue this one to be loaded and selected
      let promise = tab.queueInitial();
      this.viewCtrl && this.viewCtrl.addPromise(promise);
    }
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
          resolve();
        });
      });

    });
  }

  get tabs() {
    return this.instances();
  }

}

/**
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

    if (config.setting('hoverCSS') === false) {
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


@Directive({
  selector: 'tab-highlight'
})
class TabHighlight {
  constructor(@Host() tabs: Tabs, config: IonicConfig, elementRef: ElementRef) {
    if (config.setting('mode') === 'md') {
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
