import {Component, Directive, ElementRef, Optional, Host, forwardRef, ViewContainerRef, ViewChild, ViewChildren, EventEmitter, Output, Input, Renderer} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Tab} from './tab';
import {TabButton} from './tab-button';
import {TabHighlight} from './tab-highlight';
import {Ion} from '../ion';
import {Platform} from '../../platform/platform';
import {NavController} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {Icon} from '../icon/icon';
import {rafFrames} from '../../util/dom';
import {isUndefined} from '../../util/util';


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
@Component({
  selector: 'ion-tabs',
  template:
    '<ion-navbar-section>' +
      '<template navbar-anchor></template>' +
    '</ion-navbar-section>' +
    '<ion-tabbar-section>' +
      '<tabbar role="tablist">' +
        '<a *ngFor="#t of _tabs" [tab]="t" class="tab-button" role="tab">' +
          '<ion-icon [name]="t.tabIcon" [isActive]="t.isSelected" class="tab-button-icon"></ion-icon>' +
          '<span class="tab-button-text">{{t.tabTitle}}</span>' +
          '<ion-badge *ngIf="t.tabBadge" class="tab-badge">{{t.tabBadge}}</ion-badge>' +
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
    TabButton,
    TabHighlight,
    forwardRef(() => TabNavBarAnchor)
  ]
})
export class Tabs extends Ion {
  private _ids: number = -1;
  private _tabs: Array<Tab> = [];
  private _onReady = null;
  private _useHighlight: boolean;

  id: number;
  navbarContainerRef: ViewContainerRef;
  subPages: boolean;

  @Input() preloadTabs: any;
  @Input() tabbarIcons: string;
  @Input() tabbarPlacement: string;
  @Output() change: EventEmitter<Tab> = new EventEmitter();

  @ViewChild(TabHighlight) private _highlight: TabHighlight;
  @ViewChildren(TabButton) private _btns;

  constructor(
    @Optional() viewCtrl: ViewController,
    @Optional() public parent: NavController,
    private _app: IonicApp,
    private _config: Config,
    private _elementRef: ElementRef,
    private _platform: Platform,
    private _renderer: Renderer
  ) {
    super(_elementRef);

    this.id = ++tabIds;
    this.subPages = _config.getBoolean('tabSubPages');
    this._useHighlight = _config.getBoolean('tabbarHighlight');

    // Tabs may also be an actual ViewController which was navigated to
    // if Tabs is static and not navigated to within a NavController
    // then skip this and don't treat it as it's own ViewController
    if (viewCtrl) {
      viewCtrl.setContent(this);
      viewCtrl.setContentRef(_elementRef);

      viewCtrl.onReady = (done) => {
        this._onReady = done;
      };
    }
  }

  /**
   * @private
   */
  ngAfterViewInit() {
    this.preloadTabs = (this.preloadTabs !== "false" && this.preloadTabs !== false);

    this._setConfig('tabbarPlacement', 'bottom');
    this._setConfig('tabbarIcons', 'top');
    this._setConfig('preloadTabs', false);

    if (this._useHighlight) {
      this._platform.onResize(() => {
        this._highlight.select(this.getSelected());
      });
    }

    this._btns.toArray().forEach((tabButton: TabButton) => {
      tabButton.select.subscribe((tab: Tab) => {
        this.select(tab);
      });
    });
  }

  /**
   * @private
   */
  private _setConfig(attrKey, fallback) {
    var val = this[attrKey];
    if (isUndefined(val)) {
      val = this._config.get(attrKey);
    }
    this._renderer.setElementAttribute(this._elementRef.nativeElement, attrKey, val);
  }

  /**
   * @private
   */
  add(tab) {
    tab.id = this.id + '-' + (++this._ids);
    this._tabs.push(tab);

    return (this._tabs.length === 1);
  }

  /**
   * @param {number} index Index of the tab you want to select
   */
  select(tabOrIndex) {
    let selectedTab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
    if (!selectedTab) {
      return;
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

      selectedTab.select.emit(selectedTab);
      this.change.emit(selectedTab);

      if (selectedTab.root) {
        // only show the selectedTab if it has a root
        // it's possible the tab is only for opening modal's or signing out
        // and doesn't actually have content. In the case there's no content
        // for a tab then do nothing and leave the current view as is
        this._tabs.forEach(tab => {
          tab.setSelected(tab === selectedTab);
        });
      }

      if (this._useHighlight) {
        this._highlight.select(selectedTab);
      }

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
   * @param {number} index Index of the tab you want to get
   * @returns {Any} Tab Returs the tab who's index matches the one passed
   */
  getByIndex(index: number): any {
    if (index < this._tabs.length && index > -1) {
      return this._tabs[index];
    }
    return null;
  }

  /**
   * @return {Any} Tab Returns the currently selected tab
   */
  getSelected(): Tab {
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
  getIndex(tab: Tab): number {
    return this._tabs.indexOf(tab);
  }

  /**
   * @private
   * "Touch" the active tab, going back to the root view of the tab
   * or optionally letting the tab handle the event
   */
  private _touchActive(tab) {
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
@Directive({selector: 'template[navbar-anchor]'})
class TabNavBarAnchor {
  constructor(@Host() tabs: Tabs, viewContainerRef: ViewContainerRef) {
    tabs.navbarContainerRef = viewContainerRef;
  }
}
