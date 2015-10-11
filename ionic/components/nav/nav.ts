import {Component, Directive, ElementRef, Host, Optional, forwardRef, Inject, NgZone, Compiler, AppViewManager, DynamicComponentLoader, Renderer, ViewContainerRef} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';
import {ConfigComponent} from '../../config/decorators';
import {NavController} from './nav-controller';

/**
 * _For a quick walkthrough of navigation in Ionic, check out the
 * [Navigation section](../../../../components/#navigation) of the Component
 * docs._
 *
 * Nav is a basic navigation controller component.  As a subclass of NavController
 * you use it to navigate to pages in your app and manipulate the navigation stack.
 * Nav automatically animates transitions between pages for you.
 *
 * For more information on using navigation controllers like Nav or [Tab](../../Tabs/Tab/),
 * take a look at the [NavController API reference](../NavController/).
 *
 * You must set a root page (where page is any [@Page](../../config/Page/)
 * component) to be loaded initially by any Nav you create, using
 * the 'root' property:
 *
 * ```ts
 * import {GettingStartedPage} from 'getting-started';
 * @App({
 *   template: `<ion-nav [root]="rootPage"></ion-nav>`
 * })
 * class MyApp {
 *   constructor(){
 *     this.rootPage = GettingStartedPage;
 *   }
 * }
 * ```
 *
 * <h2 id="back_navigation">Back navigation</h2>
 * If a [page](../NavController/#creating_pages) you navigate to has a [NavBar](../NavBar/),
 * Nav will automatically add a back button to it if there is a page
 * before the one you are navigating to in the navigation stack.
 *
 * Additionally, specifying the `swipe-back-enabled` property will allow you to
 * swipe to go back:
 * ```ts
 * <ion-nav swipe-back-enabled="false" [root]="rootPage"></ion-nav>
 * ```
 *
 * Here is a diagram of how Nav animates smoothly between pages:
 *
 * <div class="highlight less-margin">
 *   <pre>
 *                           +-------+
 *                           |  App  |
 *                           +---+---+
 *                           &lt;ion-app&gt;
 *                               |
 *                  +------------+-------------+
 *                  |   Ionic Nav Controller   |
 *                  +------------+-------------+
 *                           &lt;ion-nav&gt;
 *                               |
 *                               |
 *             Pane 3  +--------------------+                     LoginPage
 *           Pane 2  +--------------------+ |          Has header, animates into pane 1
 *         Pane 1  +--------------------+ | |              +--------------------+
 *                 | | Header (Pane 1)  |&lt;-----------------|       Login        |
 *                 +--------------------+ | |              +--------------------+
 *                 | | |                | | |              | Username:          |
 *                 | | |                | | |              | Password:          |
 *                 | | |  Pane 3 is     | | |              |                    |
 *                 | | |  only content  | | |              |                    |
 *                 | | |                |&lt;-----------------|                    |
 *                 | | |                | | |              |                    |
 *                 | | |                | | |              |                    |
 *                 | +------------------|-+ |              |                    |
 *                 | | Footer (Pane 2)--|-|-+              |                    |
 *                 | +------------------|-+                |                    |
 *                 +--------------------+                  +--------------------+
 *                       &lt;ion-pane&gt;                              &lt;ion-view&gt;
 *
 *                   Pane 1                    Pane 2                    Pane 3
 *           +--------------------+    +--------------------+    +--------------------+
 *           | Header             |    | Content            |    | Content            |
 *           +--------------------+    |                    |    |                    |
 *           | Content            |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    |                    |    |                    |
 *           |                    |    +--------------------+    |                    |
 *           |                    |    | Footer             |    |                    |
 *           +--------------------+    +--------------------+    +--------------------+
 *
 *   </pre>
 * </div>
 *
 * ### Panes
 *
 * NOTE: You don't have to do anything with panes because Ionic takes care of
 * animated transitions for you. This is an explanation of how Nav works to
 * accompany the diagram above.
 *
 * When you push a new page onto the navigation stack using [NavController.push()](../NavController/#push)
 * or the [NavPush directive](../NavPush/), Nav animates the new page into the
 * appropriate pane.
 *
 * Panes are the containers Nav creates to animate views into. They do not have
 * any content of their own, as they are just a structural reference for where
 * the various parts of a page (header, footer, content) should animate into.
 *
 * The easiest scenario is animating between pages with the same structure. If
 * you have a page with a header and content, and navigate to another page that
 * also has a header and content, Nav can smoothly animate the incoming page
 * into the pane the exiting page is leaving. This allows for things like
 * seamless header animations between pages that both have headers.
 *
 * But suppose you have a page with a header and content and want to navigate to
 * a page with no header. Nav creates a new pane with no header that is directly
 * behind the current pane. It then animates the exiting page out of the current
 * pane and the new page into the new content-only pane.
 *
 */
@ConfigComponent({
  selector: 'ion-nav',
  inputs: [
    'root'
  ],
  defaultInputs: {
    'swipeBackEnabled': true
  },
  host: {
    '[class.has-views]': '_views.length > 0'
  },
  template: '<template pane-anchor></template>',
  directives: [forwardRef(() => NavPaneAnchor)]
})
export class Nav extends NavController {

  /**
   * TODO
   * @param {NavController} hostNavCtrl  TODO
   * @param {Injector} injector  TODO
   * @param {ElementRef} elementRef  TODO
   * @param {NgZone} zone  TODO
   */
  constructor(
    @Optional() hostNavCtrl: NavController,
    app: IonicApp,
    config: IonicConfig,
    elementRef: ElementRef,
    compiler: Compiler,
    loader: DynamicComponentLoader,
    viewManager: AppViewManager,
    zone: NgZone
  ) {
    super(hostNavCtrl, app, config, elementRef, compiler, loader, viewManager, zone);
    this.panes = [];
  }

  /**
   * @private
   */
  onInit() {
    super.onInit();

    if (this.root) {
      if (typeof this.root !== 'function') {
        throw 'The [root] property in <ion-nav> must be given a reference to a component class from within the constructor.';
      }
      this.push(this.root);
    }

    // default the swipe back to be enabled
    let isSwipeBackEnabled = (this.swipeBackEnabled || '').toString() !== 'false';
    this.isSwipeBackEnabled( isSwipeBackEnabled );
  }

  /**
   * @private
   * TODO
   * @param  {TODO}   componentType    TODO
   * @param  {TODO}   hostProtoViewRef TODO
   * @param  {TODO}   viewCtrl         TODO
   * @param  {Function} done             TODO
   * @return {TODO}                    TODO
   */
  loadContainer(componentType, hostProtoViewRef, viewCtrl, done) {
    // this gets or creates the Pane which similar nav items live in
    // Nav items with just a navbar/content would all use the same Pane
    // Tabs and view's without a navbar would get a different Panes
    let structure = this.getStructure(hostProtoViewRef);

    if (structure.tabs) {
      // the component being loaded is an <ion-tabs>
      // Tabs is essentially a pane, cuz it has its own navbar and content containers
      this.loadNextToAnchor(componentType, this.anchorElementRef(), viewCtrl).then(componentRef => {

        componentRef.instance._paneView = true;

        viewCtrl.disposals.push(() => {
          componentRef.dispose();
        });

        viewCtrl.onReady().then(() => {
          done();
        });

      });

    } else {
      // normal ion-view going into pane
      this.getPane(structure, viewCtrl, (pane) => {
        // add the content of the view into the pane's content area
        this.loadNextToAnchor(componentType, pane.contentAnchorRef, viewCtrl).then(componentRef => {

          viewCtrl.disposals.push(() => {
            componentRef.dispose();

            // remove the pane if there are no view items left
            pane.totalViews--;
            if (pane.totalViews === 0) {
              pane.dispose && pane.dispose();
            }
          });

          // count how many ViewControllers are in this pane
          pane.totalViews++;

          // a new ComponentRef has been created
          // set the ComponentRef's instance to this ViewController
          viewCtrl.setInstance(componentRef.instance);

          // remember the ElementRef to the content that was just created
          viewCtrl.setContentRef(componentRef.location);

          // get the NavController's container for navbars, which is
          // the place this NavController will add each ViewController's navbar
          let navbarContainerRef = pane.navbarContainerRef;

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
        });

      });
    }
  }

  /**
   * @private
   * TODO
   * @param  {TODO}   structure TODO
   * @param  {TODO}   viewCtrl  TODO
   * @param  {Function} done      TODO
   * @return {TODO}             TODO
   */
  getPane(structure, viewCtrl, done) {
    let pane = this.panes[this.panes.length - 1];

    if (pane && pane.navbar === structure.navbar) {
      // the last pane's structure is the same as the one
      // this ViewController will need, so reuse it
      done(pane);

    } else {
      // create a new nav pane
      this._loader.loadNextToLocation(Pane, this.anchorElementRef(), this.bindings).then(componentRef => {

        // get the pane reference
        pane = this.newPane;
        this.newPane = null;

        pane.showNavbar(structure.navbar);
        pane.dispose = () => {
          componentRef.dispose();
          this.panes.splice(this.panes.indexOf(pane), 1);
        };

        this.panes.push(pane);

        done(pane);

      }, loaderErr => {
        console.error(loaderErr);

      }).catch(err => {
        console.error(err);
      });

    }
  }
  /**
   * @private
   * TODO
   * @param  {TODO} pane TODO
   * @return {TODO}      TODO
   */
  addPane(pane) {
    this.newPane = pane;
  }

  /**
   * @private
   * TODO
   * @param  {TODO} componentProtoViewRef TODO
   * @return {TODO}                       TODO
   */
  getStructure(componentProtoViewRef) {
    let templateCmds = componentProtoViewRef._protoView.templateCmds;
    let compiledTemplateData, directives;
    let i, ii, j, jj, k, kk;

    for (i = 0, ii = templateCmds.length; i < ii; i++) {
      if (templateCmds[i].template) {
        compiledTemplateData = templateCmds[i].template.getData(templateCmds[i].templateId);
        if (compiledTemplateData) {
          for (j = 0, jj = compiledTemplateData.commands.length; j < jj; j++) {
            directives = compiledTemplateData.commands[j].directives;

            if (directives && (kk = directives.length)) {

              for (k = 0; k < kk; k++) {

                if (directives[k].name == 'NavbarTemplate') {
                  return { navbar: true };
                }

                if (directives[k].name == 'Tabs') {
                  return { tabs: true };
                }

              }

            }

          }
        }
      }
    }

    return {};
  }

}

/**
 * @private
 */
@Directive({selector: 'template[pane-anchor]'})
class NavPaneAnchor {
  constructor(@Host() nav: Nav, elementRef: ElementRef) {
    nav.anchorElementRef(elementRef);
  }
}

/**
 * @private
 */
@Directive({selector: 'template[navbar-anchor]'})
class NavBarAnchor {
  constructor(
    @Host() @Inject(forwardRef(() => Pane)) pane: Pane,
    viewContainerRef: ViewContainerRef
  ) {
    pane.navbarContainerRef = viewContainerRef;
  }
}

/**
 * @private
 */
@Directive({selector: 'template[content-anchor]'})
class ContentAnchor {
  constructor(
    @Host() @Inject(forwardRef(() => Pane)) pane: Pane,
    elementRef: ElementRef
  ) {
    pane.contentAnchorRef = elementRef;
  }
}

/**
 * @private
 */
@Component({
  selector: 'ion-pane',
  template:
    '<ion-navbar-section>' +
      '<template navbar-anchor></template>' +
    '</ion-navbar-section>' +
    '<ion-content-section>' +
      '<template content-anchor></template>' +
    '</ion-content-section>',
  directives: [NavBarAnchor, ContentAnchor]
})
class Pane {
  constructor(
    nav: Nav,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    this.zIndex = (nav.panes.length ? nav.panes[nav.panes.length - 1].zIndex + 1 : 0);
    renderer.setElementStyle(elementRef, 'zIndex', this.zIndex);

    nav.addPane(this);
    this.totalViews = 0;
    this.elementRef = elementRef;
    this.renderer = renderer;
  }

  showNavbar(hasNavbar) {
    this.navbar = hasNavbar;
    this.renderer.setElementAttribute(this.elementRef, 'no-navbar', hasNavbar ? null : '' );
  }

}
