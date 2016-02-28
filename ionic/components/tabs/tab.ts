import {Component, Directive, Host, Inject, forwardRef, ElementRef, Compiler, AppViewManager, NgZone, Renderer, Type} from 'angular2/core';
import {EventEmitter, Input, Output} from 'angular2/core';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Keyboard} from '../../util/keyboard';
import {NavController, NavOptions} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {Tabs} from './tabs';
import {TabButton} from './tab-button';


/**
 * @name Tab
 * @description
 * _For basic Tabs usage, see the [Tabs section](../../../../components/#tabs)
 * of the Component docs._
 *
 * Tab components are basic navigation controllers used with Tabs.  Much like
 * Nav, they are a subclass of NavController and can be used to navigate
 * to pages in and manipulate the navigation stack of a particular tab.
 *
 * For more information on using navigation controllers like Tab or [Nav](../../nav/Nav/),
 * take a look at the [NavController API reference](../NavController/).
 *
 * See the [Tabs API reference](../Tabs/) for more details on configuring Tabs
 * and the TabBar.
 *
 * @usage
 * For most cases, you can give tab a `[root]` property along with the component you want to load.
 *
 * ```html
 * <ion-tabs>
 *  <ion-tab [root]="chatRoot" tabTitle="Chat" tabIcon="chat"><ion-tab>
 * </ion-tabs>
 * ```
 *
 * ```ts
 * import {Chat} from '../chat/chat';
 * export class Tabs {
 *    constructor(){
 *      // here we'll set the property of chatRoot to
 *      // the imported class of Chat
 *      this.chatRoot = Chat
 *    }
 * }
 * ```
 *
 * In other cases, you may not want to navigate to a new component, but just
 * call a method. You can use the `(select)` event to call a method on your
 * class. Below is an example of presenting a modal from one of the tabs.
 *
 * ```html
 * <ion-tabs preloadTabs="false">
 *   <ion-tab (select)="chat()"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * ```ts
 * export class Tabs {
 *   constructor(nav: NavController){
 *     this.nav = nav;
 *   }
 *   chat() {
 *     let modal = Modal.create(ChatPage);
 *     this.nav.present(modal);
 *   }
 * }
 * ```
 *
 *
 *
 * @demo /docs/v2/demos/tabs/
 */
@Component({
  selector: 'ion-tab',
  host: {
    '[class.show-tab]': 'isSelected',
    '[attr.id]': '_panelId',
    '[attr.aria-labelledby]': '_btnId',
    'role': 'tabpanel'
  },
  template: '<div #contents></div>'
})
export class Tab extends NavController {

  /**
   * @private
   */
  public isSelected: boolean;
  private _isInitial: boolean;
  private _panelId: string;
  private _btnId: string;
  private _loaded: boolean;
  private _loadTmr: number;

  /**
   * @private
   */
  btn: TabButton;

  /**
   * @input {Page} Set the root page for this tab
   */
  @Input() root: Type;

  /**
   * @input {object} Any nav-params you want to pass to the root page of the tab
   */
  @Input() rootParams: any;

  /**
   * @input {string} Set the title of this tab
   */
  @Input() tabTitle: string;

  /**
   * @input {string} Set the icon for this tab
   */
  @Input() tabIcon: string;

  /**
   * @input {string} Set the badge for this tab
   */
  @Input() tabBadge: string;

  /**
   * @input {string} Set the badge color for this tab
   */
  @Input() tabBadgeStyle: string;

  /**
   * @output {Tab} Method to call when the current tab is selected
   */
  @Output() select: EventEmitter<Tab> = new EventEmitter();

  constructor(
    @Inject(forwardRef(() => Tabs)) parentTabs: Tabs,
    app: IonicApp,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    compiler: Compiler,
    viewManager: AppViewManager,
    zone: NgZone,
    renderer: Renderer
  ) {
    // A Tab is a NavController for its child pages
    super(parentTabs, app, config, keyboard, elementRef, 'contents', compiler, viewManager, zone, renderer);

    parentTabs.add(this);

    this._panelId = 'tabpanel-' + this.id;
    this._btnId = 'tab-' + this.id;
  }

  /**
   * @private
   */
  ngOnInit() {
    this.tabBadgeStyle = this.tabBadgeStyle ? this.tabBadgeStyle : 'default';
  }

  /**
   * @private
   */
  load(opts: NavOptions, done?: Function) {
    if (!this._loaded && this.root) {
      this.push(this.root, this.rootParams, opts).then(() => {
        done();
      });
      this._loaded = true;

    } else {
      done();
    }
  }


  /**
   * @private
   */
  preload(wait: number) {
    this._loadTmr = setTimeout(() => {
      if (!this._loaded) {
        console.debug('Tabs, preload', this.id);
        this.load({
          animate: false,
          preload: true,
          postLoad: (viewCtrl) => {
            let navbar = viewCtrl.getNavbar();
            navbar && navbar.setHidden(true);
          }
        }, function(){});
      }
    }, wait);
  }

  /**
   * @private
   */
  loadPage(viewCtrl: ViewController, navbarContainerRef: any, opts: NavOptions, done: Function) {
    // by default a page's navbar goes into the shared tab's navbar section
    navbarContainerRef = this.parent.navbarContainerRef;

    let isTabSubPage = (this.parent.subPages && viewCtrl.index > 0);
    if (isTabSubPage) {
      // a subpage, that's not the first index
      // should not use the shared tabs navbar section, but use it's own
      navbarContainerRef = null;
    }

    super.loadPage(viewCtrl, navbarContainerRef, opts, () => {
      if (viewCtrl.instance) {
        viewCtrl.instance._tabSubPage = isTabSubPage;
      }
      done();
    });
  }

  /**
   * @private
   */
  setSelected(isSelected: boolean) {
    this.isSelected = isSelected;
    this.hideNavbars(!isSelected);
  }

  /**
   * @private
   */
  hideNavbars(shouldHideNavbars: boolean) {
    this._views.forEach(viewCtrl => {
      let navbar = viewCtrl.getNavbar();
      navbar && navbar.setHidden(shouldHideNavbars);
    });
  }

  /**
   * @private
   */
  get index(): number {
    return this.parent.getIndex(this);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    clearTimeout(this._loadTmr);
    super.ngOnDestroy();
  }

}
