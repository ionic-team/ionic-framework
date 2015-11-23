import {Component, Directive, Host, ElementRef, Compiler, DynamicComponentLoader, AppViewManager, NgZone, Renderer} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Keyboard} from '../../util/keyboard';
import {NavController} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {Tabs} from './tabs';


/**
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
 * Like Nav, you must set a root page to be loaded initially for each Tab with
 * the 'root' property:
 * ```
 * import {GettingStartedPage} from 'getting-started';
 * @App({
 *   template: `<ion-tabs>
 *                <ion-tab [root]="tabOneRoot"></ion-tab>
 *                <ion-tab [root]="tabTwoRoot"></ion-tab>
 *              <ion-tabs>`
 * })
 * class MyApp {
 *   constructor(){
 *     this.tabOneRoot = GettingStartedPage;
 *     this.tabTwoRoot = GettingStartedPage;
 *   }
 * }
 * ```
 * <h3 id="tab_properties">Tab Properties</h3>
 * The Tabs component automatically creates the TabBar from the properties you
 * set on each Tab.
 *
 * To change the title and icon, use the `tab-title` and `tab-icon`
 * inputs:
 * ```html
 * <ion-tabs>
 * 	 <ion-tab tab-title="Home" tab-icon="home" [root]="tabOneRoot"></ion-tab>
 * 	 <ion-tab tab-title="Login" tab-icon="star" [root]="tabTwoRoot"></ion-tab>
 * <ion-tabs>
 * ```
 */
@Component({
  selector: 'ion-tab',
  inputs: [
    'root',
    'tabTitle',
    'tabIcon'
  ],
  host: {
    '[class.show-tab]': 'isSelected',
    '[attr.id]': '_panelId',
    '[attr.aria-labelledby]': '_btnId',
    'role': 'tabpanel'
  },
  template: '<template #contents></template>'
})
export class Tab extends NavController {

  constructor(
    @Host() parentTabs: Tabs,
    app: IonicApp,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    compiler: Compiler,
    loader: DynamicComponentLoader,
    viewManager: AppViewManager,
    zone: NgZone,
    renderer: Renderer
  ) {
    // A Tab is a NavController for its child pages
    super(parentTabs, app, config, keyboard, elementRef, compiler, loader, viewManager, zone, renderer);
    this._isInitial = parentTabs.add(this);

    this._panelId = 'tabpanel-' + this.id;
    this._btnId = 'tab-' + this.id;
  }

  /**
   * @private
   */
  onInit() {
    if (this._isInitial) {
      this.parent.select(this);

    } else if (this.parent.preloadTabs) {
      this._loadTimer = setTimeout(() => {
        if (!this._loaded) {
          let opts = {
            animate: false,
            preload: true
          };
          this.load(opts, () => {
            this.hideNavbars(true);
          });
        }
      }, 1000 * this.index);
    }
  }

  /**
   * @private
   */
  load(opts, done) {
    if (!this._loaded && this.root) {
      this.push(this.root, null, opts, done);
      this._loaded = true;

    } else {
      done();
    }
  }

  /**
   * @private
   */
  loadPage(viewCtrl, navbarContainerRef, done) {
    // by default a page's navbar goes into the shared tab's navbar section
    navbarContainerRef = this.parent.navbarContainerRef;

    let isTabSubPage = (this.parent.subPages && viewCtrl.index > 0);
    if (isTabSubPage) {
      // a subpage, that's not the first index
      // should not use the shared tabs navbar section, but use it's own
      navbarContainerRef = null;
    }

    super.loadPage(viewCtrl, navbarContainerRef, () => {
      if (viewCtrl.instance) {
        viewCtrl.instance._tabSubPage = isTabSubPage;
      }
      done();
    });
  }

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

  get index() {
    return this.parent.getIndex(this);
  }

  onDestroy() {
    clearTimeout(this._loadTimer);
  }

}
