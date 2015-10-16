import {Component, Directive, Host, ElementRef, Compiler, DynamicComponentLoader, AppViewManager, forwardRef, NgZone, Renderer} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
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
    '[attr.id]': 'panelId',
    '[attr.aria-labelledby]': 'btnId',
    '[class.show-tab]': 'isSelected',
    'role': 'tabpanel'
  },
  template: '<template content-anchor></template><ng-content></ng-content>',
  directives: [forwardRef(() => TabContentAnchor)]
})
export class Tab extends NavController {

  constructor(
    @Host() tabs: Tabs,
    app: IonicApp,
    config: Config,
    elementRef: ElementRef,
    compiler: Compiler,
    loader: DynamicComponentLoader,
    viewManager: AppViewManager,
    zone: NgZone,
    renderer: Renderer
  ) {
    // A Tab is a NavController for its child pages
    super(tabs, app, config, elementRef, compiler, loader, viewManager, zone, renderer);
    this.tabs = tabs;

    this._isInitial = tabs.add(this);
  }

  onInit() {
    console.debug('Tab onInit', this.getIndex());

    if (this._isInitial) {
      this.tabs.select(this);

    } else if (this.tabs.preloadTabs) {
      setTimeout(() => {
        this.load(() => {
          console.debug('preloaded tab', this.getIndex());
        });
      }, 500 * this.getIndex());
    }
  }

  load(callback) {
    if (!this._loaded && this.root) {
      let opts = {
        animate: false,
        navbar: false
      };
      this.push(this.root, null, opts).then(callback);
      this._loaded = true;

    } else {
      callback();
    }
  }

  loadContainer(componentType, hostProtoViewRef, viewCtrl, done) {

    this.loadNextToAnchor(componentType, this.contentAnchorRef, viewCtrl).then(componentRef => {

      viewCtrl.disposals.push(() => {
        componentRef.dispose();
      });

      // a new ComponentRef has been created
      // set the ComponentRef's instance to this ViewController
      viewCtrl.setInstance(componentRef.instance);

      // remember the ElementRef to the content that was just created
      viewCtrl.setContentRef(componentRef.location);

      // get the NavController's container for navbars, which is
      // the place this NavController will add each ViewController's navbar
      let navbarContainerRef = this.tabs.navbarContainerRef;

      // get this ViewController's navbar TemplateRef, which may not
      // exist if the ViewController's template didn't have an <ion-navbar *navbar>
      let navbarTemplateRef = viewCtrl.getNavbarTemplateRef();

      // create the navbar view if the pane has a navbar container, and the
      // ViewController's instance has a navbar TemplateRef to go to inside of it
      if (navbarContainerRef && navbarTemplateRef) {
        let navbarView = navbarContainerRef.createEmbeddedView(navbarTemplateRef, -1);

        viewCtrl.disposals.push(() => {
          let index = navbarContainerRef.indexOf(navbarView);
          if (index > -1) {
            navbarContainerRef.remove(index);
          }
        });
      }

      this.addHasViews();

      done();
    });

  }

  getIndex() {
    return this.tabs.getIndex(this);
  }

}


@Directive({selector: 'template[content-anchor]'})
class TabContentAnchor {
  constructor(@Host() tab: Tab, elementRef: ElementRef) {
    tab.contentAnchorRef = elementRef;
  }
}
