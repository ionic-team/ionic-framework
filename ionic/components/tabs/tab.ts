import {Directive, Component, View, Host, ElementRef, forwardRef, Injector, NgZone} from 'angular2/angular2';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';

import {NavController} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {Tabs} from './tabs';


/**
 * @name ionTab
 * @requires ionTabs
 * @description
 * Contains a tab's content. The content only exists while the given tab is selected.
 *
 * @usage
 * ```html
 * <ion-tab tab-title="Heart" tab-icon="ion-ios-heart-outline" [root]="root1"></ion-tab>
 * ```
 */
@Component({
  selector: 'ion-tab',
  properties: [
    'root',
    'tabTitle',
    'tabIcon'
  ],
  host: {
    '[attr.id]': 'panelId',
    '[attr.aria-labelledby]': 'labeledBy',
    '[attr.aria-hidden]': 'isNotSelected',
    'role': 'tabpanel'
  }
})
@View({
  template: '<template content-anchor></template><ng-content></ng-content>',
  directives: [forwardRef(() => TabContentAnchor)]
})
export class Tab extends NavController {

  /**
   * TODO
   * @param {Tabs} tabs  TODO
   * @param {ElementRef} elementRef  TODO
   * @param {Injector} injector  TODO
   * @param {NgZone} zone  TODO
   */
  constructor(
    @Host() tabs: Tabs,
    elementRef: ElementRef,
    injector: Injector,
    zone: NgZone
  ) {
    // A Tab is both a container of many views, and is a view itself.
    // A Tab is one ViewController within it's Host Tabs (which extends NavController)
    // A Tab is a NavController for its child ViewControllers
    super(tabs, injector, elementRef, zone);
    this.tabs = tabs;

    let viewCtrl = this.viewCtrl = new ViewController(tabs.Host);
    viewCtrl.setInstance(this);
    viewCtrl.viewElementRef(elementRef);
    this._initTab = tabs.addTab(this);

    this.navbarView = viewCtrl.navbarView = () => {
      let activeView = this.getActive();
      return activeView && activeView.navbarView();
    };

    viewCtrl.enableBack = () => {
      // override ViewController's enableBack(), should use the
      // active child nav item's enableBack() instead
      let activeView = this.getActive();
      return (activeView && activeView.enableBack());
    };

    this.panelId = 'tab-panel-' + viewCtrl.id;
    this.labeledBy = 'tab-button-' + viewCtrl.id;
  }

  onInit() {
    console.log('Tab onInit');

    if (this._initTab) {
      this.tabs.select(this);

    } else {
      // TODO: OPTIONAL PRELOAD OTHER TABS!
      // setTimeout(() => {
      //   this.load();
      // }, 300);
    }
  }

  load(callback) {
    if (!this._loaded && this.root) {
      let opts = {
        animate: false,
        navbar: false
      };
      this.push(this.root, null, opts).then(() => {
        callback && callback();
      });
      this._loaded = true;

    } else {
      callback && callback();
    }
  }

  get isSelected() {
    return this.tabs.isActive(this.viewCtrl);
  }

  get isNotSelected() {
    return !this.tabs.isActive(this.viewCtrl);
  }

  loadContainer(hostProtoViewRef, componentType, viewCtrl, done) {

    let viewComponetRef = this.createViewComponetRef(hostProtoViewRef, this.contentContainerRef, this.getBindings(viewCtrl));
    viewCtrl.disposals.push(() => {
      viewComponetRef.dispose();
    });

    // a new ComponentRef has been created
    // set the ComponentRef's instance to this ViewController
    viewCtrl.setInstance(viewComponetRef.instance);

    // remember the ElementRef to the content that was just created
    viewCtrl.viewElementRef(viewComponetRef.location);

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

    done();
  }

}


@Directive({selector: 'template[content-anchor]'})
class TabContentAnchor {
  constructor(
    @Host() tab: Tab,
    viewContainerRef: ViewContainerRef
  ) {
    tab.contentContainerRef = viewContainerRef;
  }
}
