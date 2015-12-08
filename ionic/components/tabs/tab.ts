import {ChangeDetectorRef, Component, Directive, Host, ElementRef, Compiler, AppViewManager, NgZone, Renderer} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {Keyboard} from '../../util/keyboard';
import {NavController} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {Tabs} from './tabs';


/**
 * @name Tab
 * @usage
 * ```html
 * <ion-tabs>
 * 	 <ion-tab tab-title="Home" tab-icon="home" [root]="tabOneRoot"></ion-tab>
 * 	 <ion-tab tab-title="Login" tab-icon="star" [root]="tabTwoRoot"></ion-tab>
 * </ion-tabs>
 * ```
 *
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
 * @property {any} [root] - set the root page for this tab
 * @property {any} [tab-title] - set the title of this tab
 * @property {any} [tab-icon] - set the icon for this tab

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
    viewManager: AppViewManager,
    zone: NgZone,
    renderer: Renderer,
    cd: ChangeDetectorRef
  ) {
    // A Tab is a NavController for its child pages
    super(parentTabs, app, config, keyboard, elementRef, 'contents', compiler, viewManager, zone, renderer, cd);

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
          this.load({
            animate: false,
            preload: true,
            postLoad: (viewCtrl) => {
              let navbar = viewCtrl.getNavbar();
              navbar && navbar.setHidden(true);
            }
          }, function(){});
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
   *
   * ```ts
   * export class MyClass{
   *  constructor(tab: Tab){
   *    this.tab = tab;
   *    console.log(this.tab.index);
   *  }
   * }
   * ```
   *
   * @returns {Number} Returns the index of this page within its NavController.
   *
   */
  get index() {
    return this.parent.getIndex(this);
  }

  /**
   * @private
   */
  onDestroy() {
    clearTimeout(this._loadTimer);
  }

}
