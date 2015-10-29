import {Component, Directive, ElementRef, Host, Optional, forwardRef, Inject, NgZone, Compiler, AppViewManager, DynamicComponentLoader, Renderer, ViewContainerRef} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
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
  template: '<template #contents></template>'
})
export class Nav extends NavController {

  constructor(
    @Optional() hostNavCtrl: NavController,
    app: IonicApp,
    config: Config,
    elementRef: ElementRef,
    compiler: Compiler,
    loader: DynamicComponentLoader,
    viewManager: AppViewManager,
    zone: NgZone,
    renderer: Renderer
  ) {
    super(hostNavCtrl, app, config, elementRef, compiler, loader, viewManager, zone, renderer);
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
    this.isSwipeBackEnabled( (this.swipeBackEnabled || '').toString() !== 'false' );
  }

}
