import {Component, Directive, Host, Inject, forwardRef, ElementRef, Compiler, AppViewManager, NgZone, Renderer, Type} from 'angular2/core';
import {EventEmitter, Input, Output} from 'angular2/core';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Keyboard} from '../../util/keyboard';
import {NavController} from '../nav/nav-controller';
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
 * @property {Page} [root] - set the root page for this tab
 * @property {String} [tabTitle] - set the title of this tab
 * @property {String} [tabIcon] - set the icon for this tab
 * @property {Any} [tabBadge] - set the badge for this tab
 * @property {String} [tabBadgeStyle] - set the badge color for this tab
 * @property {Any} (select) - method to call when the current tab is selected
 *
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
  private _loadTimer: any;

  /**
   * @private
   */
  btn: TabButton;


  /**
   * @private
   */
  @Input() root: Type;

  /**
   * @private
   */
  @Input() tabTitle: string;

  /**
   * @private
   */
  @Input() tabIcon: string;

  /**
   * @private
   */
  @Input() tabBadge: string;

  /**
   * @private
   */
  @Input() tabBadgeStyle: string;

  /**
   * @private
   */
  @Output() select: EventEmitter<any> = new EventEmitter();

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
  load(opts, done?: Function) {
    if (!this._loaded && this.root) {
      this.push(this.root, null, opts).then(() => {
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
  preload(wait) {
    this._loadTimer = setTimeout(() => {
      if (!this._loaded) {
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
  loadPage(viewCtrl, navbarContainerRef, opts, done) {
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
  setSelected(isSelected) {
    this.isSelected = isSelected;
    this.hideNavbars(!isSelected);
  }

  /**
   * @private
   */
  hideNavbars(shouldHideNavbars) {
    this._views.forEach(viewCtrl => {
      let navbar = viewCtrl.getNavbar();
      navbar && navbar.setHidden(shouldHideNavbars);
    });
  }

  /**
   * @private
   */
  get index() {
    return this.parent.getIndex(this);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    clearTimeout(this._loadTimer);
  }

}
