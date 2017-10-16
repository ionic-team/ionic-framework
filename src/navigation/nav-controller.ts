import { EventEmitter } from '@angular/core';

import { Config } from '../config/config';
import { NavOptions, TransitionDoneFn } from './nav-util';
import { Page } from './nav-util';
import { ViewController } from './view-controller';
import { NavigationContainer } from './navigation-container';

/**
 * @name NavController
 * @description
 *
 * NavController is the base class for navigation controller components like
 * [`Nav`](../../components/nav/Nav/) and [`Tab`](../../components/tabs/Tab/). You use navigation controllers
 * to navigate to [pages](#view-creation) in your app. At a basic level, a
 * navigation controller is an array of pages representing a particular history
 * (of a Tab for example). This array can be manipulated to navigate throughout
 * an app by pushing and popping pages or inserting and removing them at
 * arbitrary locations in history.
 *
 * The current page is the last one in the array, or the top of the stack if we
 * think of it that way. [Pushing](#push) a new page onto the top of the
 * navigation stack causes the new page to be animated in, while [popping](#pop)
 * the current page will navigate to the previous page in the stack.
 *
 * Unless you are using a directive like [NavPush](../../components/nav/NavPush/), or need a
 * specific NavController, most times you will inject and use a reference to the
 * nearest NavController to manipulate the navigation stack.
 *
 * ## Basic usage
 * The simplest way to navigate through an app is to create and initialize a new
 * nav controller using the `<ion-nav>` component.  `ion-nav` extends the `NavController`
 * class.
 *
 * ```typescript
 * import { Component } from `@angular/core`;
 * import { StartPage } from './start-page';
 *
 * @Component(
 *   template: `<ion-nav [root]="rootPage"></ion-nav>`
 * })
 * class MyApp {
 *   // set the rootPage to the first page we want displayed
 *   public rootPage: any = StartPage;
 *
 *   constructor(){
 *   }
 * }
 *
 * ```
 *
 * ### Injecting NavController
 * Injecting NavController will always get you an instance of the nearest
 * NavController, regardless of whether it is a Tab or a Nav.
 *
 * Behind the scenes, when Ionic instantiates a new NavController, it creates an
 * injector with NavController bound to that instance (usually either a Nav or
 * Tab) and adds the injector to its own providers.  For more information on
 * providers and dependency injection, see [Dependency Injection](https://angular.io/docs/ts/latest/guide/dependency-injection.html).
 *
 * Instead, you can inject NavController and know that it is the correct
 * navigation controller for most situations (for more advanced situations, see
 * [Menu](../../menu/Menu/) and [Tab](../../tab/Tab/)).
 *
 * ```ts
 *  import { NavController } from 'ionic-angular';
 *
 *  class MyComponent {
 *    constructor(public navCtrl: NavController) {
 *
 *    }
 *  }
 * ```
 *
 * ### Navigating from the Root component
 * What if you want to control navigation from your root app component?
 * You can't inject `NavController` because any components that are navigation
 * controllers are _children_ of the root component so they aren't available
 * to be injected.
 *
 * By adding a reference variable to the `ion-nav`, you can use `@ViewChild` to
 * get an instance of the `Nav` component, which is a navigation controller
 * (it extends `NavController`):
 *
 * ```typescript
 *
 * import { Component, ViewChild } from '@angular/core';
 * import { NavController } from 'ionic-angular';
 *
 * @Component({
 *    template: '<ion-nav #myNav [root]="rootPage"></ion-nav>'
 * })
 * export class MyApp {
 *    @ViewChild('myNav') nav: NavController
 *    public rootPage: any = TabsPage;
 *
 *    // Wait for the components in MyApp's template to be initialized
 *    // In this case, we are waiting for the Nav with reference variable of "#myNav"
 *    ngOnInit() {
 *       // Let's navigate from TabsPage to Page1
 *       this.nav.push(Page1);
 *    }
 * }
 * ```
 *
 * ### Navigating from an Overlay Component
 * What if you wanted to navigate from an overlay component (popover, modal, alert, etc)?
 * In this example, we've displayed a popover in our app. From the popover, we'll get a
 * reference of the root `NavController` in our app, using the `getRootNav()` method.
 *
 *
 * ```typescript
 * import { Component } from '@angular/core';
 * import { App, ViewController } from 'ionic-angular';
 *
 * @Component({
 *     template: `
 *     <ion-content>
 *       <h1>My PopoverPage</h1>
 *       <button ion-button (click)="pushPage()">Call pushPage</button>
 *      </ion-content>
 *     `
 *   })
 *   class PopoverPage {
 *     constructor(
 *       public viewCtrl: ViewController
 *       public appCtrl: App
 *     ) {}
 *
 *     pushPage() {
 *       this.viewCtrl.dismiss();
 *       this.appCtrl.getRootNav().push(SecondPage);
 *     }
 *   }
 *```
 *
 *
 * ## View creation
 * Views are created when they are added to the navigation stack.  For methods
 * like [push()](#push), the NavController takes any component class that is
 * decorated with `@Component` as its first argument.  The NavController then
 * compiles that component, adds it to the app and animates it into view.
 *
 * By default, pages are cached and left in the DOM if they are navigated away
 * from but still in the navigation stack (the exiting page on a `push()` for
 * example).  They are destroyed when removed from the navigation stack (on
 * [pop()](#pop) or [setRoot()](#setRoot)).
 *
 * ## Pushing a View
 * To push a new view onto the navigation stack, use the `push` method.
 * If the page has an [`<ion-navbar>`](../../navbar/Navbar/),
 * a back button will automatically be added to the pushed view.
 *
 * Data can also be passed to a view by passing an object to the `push` method.
 * The pushed view can then receive the data by accessing it via the `NavParams`
 * class.
 *
 * ```typescript
 * import { Component } from '@angular/core';
 * import { NavController } from 'ionic-angular';
 * import { OtherPage } from './other-page';
 * @Component({
 *    template: `
 *    <ion-header>
 *      <ion-navbar>
 *        <ion-title>Login</ion-title>
 *      </ion-navbar>
 *    </ion-header>
 *
 *    <ion-content>
 *      <button ion-button (click)="pushPage()">
 *        Go to OtherPage
 *      </button>
 *    </ion-content>
 *    `
 * })
 * export class StartPage {
 *   constructor(public navCtrl: NavController) {
 *   }
 *
 *   pushPage(){
 *     // push another page onto the navigation stack
 *     // causing the nav controller to transition to the new page
 *     // optional data can also be passed to the pushed page.
 *     this.navCtrl.push(OtherPage, {
 *       id: "123",
 *       name: "Carl"
 *     });
 *   }
 * }
 *
 * import { NavParams } from 'ionic-angular';
 *
 * @Component({
 *   template: `
 *   <ion-header>
 *     <ion-navbar>
 *       <ion-title>Other Page</ion-title>
 *     </ion-navbar>
 *   </ion-header>
 *   <ion-content>I'm the other page!</ion-content>`
 * })
 * class OtherPage {
 *   constructor(private navParams: NavParams) {
 *      let id = navParams.get('id');
 *      let name = navParams.get('name');
 *   }
 * }
 * ```
 *
 * ## Removing a view
 * To remove a view from the stack, use the `pop` method.
 * Popping a view will transition to the previous view.
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { NavController } from 'ionic-angular';
 *
 * @Component({
 *   template: `
 *   <ion-header>
 *     <ion-navbar>
 *       <ion-title>Other Page</ion-title>
 *     </ion-navbar>
 *   </ion-header>
 *   <ion-content>I'm the other page!</ion-content>`
 * })
 * class OtherPage {
 *    constructor(public navCtrl: NavController ){
 *    }
 *
 *    popView(){
 *      this.navCtrl.pop();
 *    }
 * }
 * ```
 *
 * ## Lifecycle events
 * Lifecycle events are fired during various stages of navigation.  They can be
 * defined in any component type which is pushed/popped from a `NavController`.
 *
 * ```ts
 * import { Component } from '@angular/core';
 *
 * @Component({
 *   template: 'Hello World'
 * })
 * class HelloWorld {
 *   ionViewDidLoad() {
 *     console.log("I'm alive!");
 *   }
 *   ionViewWillLeave() {
 *     console.log("Looks like I'm about to leave :(");
 *   }
 * }
 * ```
 *
 *  | Page Event          | Returns                     | Description                                                                                                                                                                                                                                                    |
 *  |---------------------|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 *  | `ionViewDidLoad`    | void                        | Runs when the page has loaded. This event only happens once per page being created. If a page leaves but is cached, then this event will not fire again on a subsequent viewing. The `ionViewDidLoad` event is good place to put your setup code for the page. |
 *  | `ionViewWillEnter`  | void                        | Runs when the page is about to enter and become the active page.                                                                                                                                                                                               |
 *  | `ionViewDidEnter`   | void                        | Runs when the page has fully entered and is now the active page. This event will fire, whether it was the first load or a cached page.                                                                                                                         |
 *  | `ionViewWillLeave`  | void                        | Runs when the page is about to leave and no longer be the active page.                                                                                                                                                                                         |
 *  | `ionViewDidLeave`   | void                        | Runs when the page has finished leaving and is no longer the active page.                                                                                                                                                                                      |
 *  | `ionViewWillUnload` | void                        | Runs when the page is about to be destroyed and have its elements removed.                                                                                                                                                                                     |
 *  | `ionViewCanEnter`   | boolean/Promise&lt;void&gt; | Runs before the view can enter. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can enter                                                                                                     |
 *  | `ionViewCanLeave`   | boolean/Promise&lt;void&gt; | Runs before the view can leave. This can be used as a sort of "guard" in authenticated views where you need to check permissions before the view can leave                                                                                                     |
 *
 *
 * ## Nav Guards
 *
 * In some cases, a developer should be able to control views leaving and entering. To allow for this, NavController has the `ionViewCanEnter` and `ionViewCanLeave` methods.
 * Similar to Angular route guards, but are more integrated with NavController. For example, if you wanted to prevent a user from leaving a view:
 *
 * ```ts
 * export class MyClass{
 *  constructor(
 *    public navCtrl: NavController
 *   ){}
 *
 *   pushPage(){
 *     this.navCtrl.push(DetailPage);
 *   }
 *
 *   ionViewCanLeave(): boolean{
 *    // here we can either return true or false
 *    // depending on if we want to leave this view
 *    if(isValid(randomValue)){
 *       return true;
 *     } else {
 *       return false;
 *     }
 *   }
 * }
 * ```
 *
 * We need to make sure that our `navCtrl.push` has a catch in order to catch the and handle the error.
 * If you need to prevent a view from entering, you can do the same thing
 *
 * ```ts
 * export class MyClass{
 *  constructor(
 *    public navCtrl: NavController
 *   ){}
 *
 *   pushPage(){
 *     this.navCtrl.push(DetailPage);
 *   }
 *
 * }
 *
 * export class DetailPage(){
 *   constructor(
 *     public navCtrl: NavController
 *   ){}
 *   ionViewCanEnter(): boolean{
 *    // here we can either return true or false
 *    // depending on if we want to enter this view
 *    if(isValid(randomValue)){
 *       return true;
 *     } else {
 *       return false;
 *     }
 *   }
 * }
 * ```
 *
 * Similar to `ionViewCanLeave` we still need a catch on the original `navCtrl.push` in order to handle it properly.
 * When handling the back button in the `ion-navbar`, the catch is already taken care of for you by the framework.
 *
 * ## NavOptions
 *
 * Some methods on `NavController` allow for customizing the current transition.
 * To do this, we can pass an object with the modified properites.
 *
 *
 * | Property  | Value     | Description                                                                                                |
 * |-----------|-----------|------------------------------------------------------------------------------------------------------------|
 * | animate   | `boolean` | Whether or not the transition should animate.                                                              |
 * | animation | `string`  | What kind of animation should be used.                                                                     |
 * | direction | `string`  | The conceptual direction the user is navigating. For example, is the user navigating `forward`, or `back`? |
 * | duration  | `number`  | The length in milliseconds the animation should take.                                                      |
 * | easing    | `string`  | The easing for the animation.                                                                              |
 *
 * The property 'animation' understands the following values: `md-transition`, `ios-transition` and `wp-transition`.
 *
 * @see {@link /docs/components#navigation Navigation Component Docs}
 */
export abstract class NavController implements NavigationContainer {

  /**
   * Observable to be subscribed to when a component is loaded.
   * @returns {Observable} Returns an observable
   */
  viewDidLoad: EventEmitter<any>;

  /**
   * Observable to be subscribed to when a component is about to be loaded.
   * @returns {Observable} Returns an observable
   */
  viewWillEnter: EventEmitter<any>;

  /**
   * Observable to be subscribed to when a component has fully become the active component.
   * @returns {Observable} Returns an observable
   */
  viewDidEnter: EventEmitter<any>;

  /**
   * Observable to be subscribed to when a component is about to leave, and no longer active.
   * @returns {Observable} Returns an observable
   */
  viewWillLeave: EventEmitter<any>;

  /**
   * Observable to be subscribed to when a component has fully left and is no longer active.
   * @returns {Observable} Returns an observable
   */
  viewDidLeave: EventEmitter<any>;

  /**
   * Observable to be subscribed to when a component is about to be unloaded and destroyed.
   * @returns {Observable} Returns an observable
   */
  viewWillUnload: EventEmitter<any>;

  /**
   * @hidden
   */
  id: string;

  /**
   * @hidden
   */
  name: string;

  /**
   * The parent navigation instance. If this is the root nav, then
   * it'll be `null`. A `Tab` instance's parent is `Tabs`, otherwise
   * the parent would be another nav, if it's not already the root nav.
   */
  parent: any;

  /**
   * @hidden
   */
  config: Config;

  /**
   * @input {boolean} If true, swipe to go back is enabled.
   */
  swipeBackEnabled: boolean;

  /**
   * Push a new component onto the current navigation stack. Pass any aditional information
   * along as an object. This additional information is accessible through NavParams
   *
   * @param {Page|string} page The component class or deeplink name you want to push onto the navigation stack.
   * @param {object} [params={}] Any NavParams you want to pass along to the next view.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract push(page: Page | string, params?: any, opts?: NavOptions, done?: TransitionDoneFn): Promise<any>;

  /**
   * Inserts a component into the nav stack at the specified index. This is useful if
   * you need to add a component at any point in your navigation stack.
   *
   *
   * @param {number} insertIndex The index where to insert the page.
   * @param {Page|string} page The component class or deeplink name you want to push onto the navigation stack.
   * @param {object} [params={}] Any NavParams you want to pass along to the next view.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract insert(insertIndex: number, page: Page | string, params?: any, opts?: NavOptions, done?: TransitionDoneFn): Promise<any>;

  /**
   * Inserts an array of components into the nav stack at the specified index.
   * The last component in the array will become instantiated as a view,
   * and animate in to become the active view.
   *
   * @param {number} insertIndex The index where you want to insert the page.
   * @param {array} insertPages An array of objects, each with a `page` and optionally `params` property.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract insertPages(insertIndex: number, insertPages: Array<{page: Page | string, params?: any}>, opts?: NavOptions, done?: TransitionDoneFn): Promise<any>;

  /**
   * Call to navigate back from a current component. Similar to `push()`, you
   * can also pass navigation options.
   *
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract pop(opts?: NavOptions, done?: TransitionDoneFn): Promise<any>;

  /**
   * Navigate back to the root of the stack, no matter how far back that is.
   *
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract popToRoot(opts?: NavOptions, done?: TransitionDoneFn): Promise<any>;

  /**
   * @hidden
   * Pop to a specific view in the history stack. If an already created
   * instance of the page is not found in the stack, then it'll `setRoot`
   * to the nav stack by removing all current pages and pushing on a
   * new instance of the given page. Note that any params passed to
   * this method are not used when an existing page instance has already
   * been found in the stack. Nav params are only used by this method
   * when a new instance needs to be created.
   *
   * @param {Page|string|ViewController} page The component class or deeplink name you want to push onto the navigation stack.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract popTo(page: Page | string | ViewController, opts?: NavOptions, done?: TransitionDoneFn): Promise<any>;

  /**
   * @hidden
   * Pop sequently all the pages in the stack.
   *
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract popAll(): Promise<any[]>;

  /**
   * Removes a page from the nav stack at the specified index.
   *
   * @param {number} startIndex The starting index to remove pages from the stack. Default is the index of the last page.
   * @param {number} [removeCount] The number of pages to remove, defaults to remove `1`.
   * @param {object} [opts={}] Any options you want to use pass to transtion.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract remove(startIndex: number, removeCount?: number, opts?: NavOptions, done?: TransitionDoneFn): Promise<any>;

  /**
   * Removes the specified view controller from the nav stack.
   *
   * @param {ViewController} [viewController] The viewcontroller to remove.
   * @param {object} [opts={}] Any options you want to use pass to transtion.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract removeView(viewController: ViewController, opts?: NavOptions, done?: TransitionDoneFn): Promise<any>;

  /**
   * Set the root for the current navigation stack.
   * @param {Page|string|ViewController} pageOrViewCtrl The name of the component you want to push on the navigation stack.
   * @param {object} [params={}] Any NavParams you want to pass along to the next view.
   * @param {object} [opts={}] Any options you want to use pass to transtion.
   * @param {Function} done Callback function on done.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract setRoot(pageOrViewCtrl: Page | string | ViewController, params?: any, opts?: NavOptions, done?: TransitionDoneFn): Promise<any>;
  abstract goToRoot(options: NavOptions): Promise<any>;

  /**
   * Set the views of the current navigation stack and navigate to the
   * last view. By default animations are disabled, but they can be enabled
   * by passing options to the navigation controller.You can also pass any
   * navigation params to the individual pages in the array.
   *
   * @param {Array<{page:any, params: any}>} pages An array of objects, each with a `page` and optionally `params` property to load in the stack.
   * @param {Object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract setPages(pages: ({page: Page | string, params?: any} | ViewController)[], opts?: NavOptions, done?: TransitionDoneFn): Promise<any>;

  /**
   * @param {number} index The index of the page to get.
   * @returns {ViewController} Returns the view controller that matches the given index.
   */
  abstract getByIndex(index: number): ViewController;

  /**
   * @returns {ViewController} Returns the active page's view controller.
   */
  abstract getActive(includeEntering?: boolean): ViewController;

  /**
   * Returns if the given view is the active view or not.
   * @param {ViewController} view
   * @returns {boolean}
   */
  abstract isActive(view: ViewController): boolean;

  /**
   * Returns the view controller which is before the given view controller.
   * If no view controller is passed in, then it'll default to the active view.
   * @param {ViewController} view
   * @returns {viewController}
   */
  abstract getPrevious(view?: ViewController): ViewController;

  /**
   * Returns the first view controller in this nav controller's stack.
   * @returns {ViewController}
   */
  abstract first(): ViewController;

  /**
   * Returns the last page in this nav controller's stack.
   * @returns {ViewController}
   */
  abstract last(): ViewController;

  /**
   * Returns the index number of the given view controller.
   * @param {ViewController} view
   * @returns {number}
   */
  abstract indexOf(view: ViewController): number;

  /**
   * Returns the number of views in this nav controller.
   * @returns {number} The number of views in this stack, including the current view.
   */
  abstract length(): number;

  /**
   * Returns the current stack of views in this nav controller.
   * @returns {Array<ViewController>} the stack of view controllers in this nav controller.
   */
  abstract getViews(): Array<ViewController>;

  /**
   * Returns a list of the active child navigation.
   */
  abstract getActiveChildNavs(): any[];

  /**
   * Returns the active child navigation.
   */
  abstract getActiveChildNav(): any;

  /**
   * Returns a list of all child navigation containers
   */
  abstract getAllChildNavs(): any[];


  /**
   * Returns if the nav controller is actively transitioning or not.
   * @return {boolean}
   */
  abstract isTransitioning(includeAncestors?: boolean): boolean;

  /**
   * If it's possible to use swipe back or not. If it's not possible
   * to go back, or swipe back is not enabled, then this will return `false`.
   * If it is possible to go back, and swipe back is enabled, then this
   * will return `true`.
   * @returns {boolean}
   */
  abstract canSwipeBack(): boolean;

  /**
   * Returns `true` if there's a valid previous page that we can pop
   * back to. Otherwise returns `false`.
   * @returns {boolean}
   */
  abstract canGoBack(): boolean;

  /**
   * @hidden
   */
  abstract registerChildNav(nav: any): void;

  /**
   * @hidden
   */
  abstract resize(): void;



  /*
   * @hidden
   */
  abstract getType(): string;

  /*
   * @hidden
   */
  abstract getSecondaryIdentifier(): string;

}
