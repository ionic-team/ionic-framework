import { EventEmitter } from '@angular/core';

import { Config } from '../config/config';
import { NavOptions } from './nav-util';
import { ViewController } from './view-controller';


/**
 * @name NavController
 * @description
 *
 * NavController is the base class for navigation controller components like
 * [`Nav`](../Nav/) and [`Tab`](../../tabs/Tab/). You use navigation controllers
 * to navigate to [pages](#view-creation) in your app.
 *
 * For more information, see the [Navigation Controller doc](/docs/v2/navigation/navigation-controller).
 *
 * @see {@link /docs/v2/navigation Navigation Docs}
 * @see {@link ../../components/nav/Nav Nav API Docs}
 */
export abstract class NavController {

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
   * @private
   */
  id: string;

  /**
   * The parent navigation instance. If this is the root nav, then
   * it'll be `null`. A `Tab` instance's parent is `Tabs`, otherwise
   * the parent would be another nav, if it's not already the root nav.
   */
  parent: any;

  /**
   * @private
   */
  config: Config;

  /**
   * Push a new component onto the current navigation stack. Pass any aditional information
   * along as an object. This additional information is accessible through NavParams
   *
   * @param {Page} page  The page component class you want to push on to the navigation stack
   * @param {object} [params={}] Any nav-params you want to pass along to the next view
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract push(page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any>;

  /**
   * Inserts a component into the nav stack at the specified index. This is useful if
   * you need to add a component at any point in your navigation stack.
   *
   *
   * @param {number} insertIndex  The index where to insert the page.
   * @param {Page} page  The component you want to insert into the nav stack.
   * @param {object} [params={}] Any nav-params you want to pass along to the next page.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract insert(insertIndex: number, page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any>;

  /**
   * Inserts an array of components into the nav stack at the specified index.
   * The last component in the array will become instantiated as a view,
   * and animate in to become the active view.
   *
   * @param {number} insertIndex  The index where you want to insert the page.
   * @param {array} insertPages  An array of objects, each with a `page` and optionally `params` property.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract insertPages(insertIndex: number, insertPages: Array<{page: any, params?: any}>, opts?: NavOptions, done?: Function): Promise<any>;

  /**
   * Call to navigate back from a current component. Similar to `push()`, you
   * can also pass navigation options.
   *
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract pop(opts?: NavOptions, done?: Function): Promise<any>;

  /**
   * Navigate back to the root of the stack, no matter how far back that is.
   *
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract popToRoot(opts?: NavOptions, done?: Function): Promise<any>;

  /**
   * @private
   * Pop to a specific view in the history stack. If an already created
   * instance of the page is not found in the stack, then it'll `setRoot`
   * to the nav stack by removing all current pages and pushing on a
   * new instance of the given page. Note that any params passed to
   * this method are not used when an existing page instance has already
   * been found in the stack. Nav params are only used by this method
   * when a new instance needs to be created.
   *
   * @param {any} page A page can be a ViewController instance or string.
   * @param {object} [params={}] Any nav-params to be used when a new view instance is created at the root.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract popTo(page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any>;

  /**
   * @private
   * Pop sequently all the pages in the stack.
   *
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract popAll(): Promise<any[]>;

  /**
   * Removes a page from the nav stack at the specified index.
   *
   * @param {number} [startIndex]  The starting index to remove pages from the stack. Default is the index of the last page.
   * @param {number} [removeCount]  The number of pages to remove, defaults to remove `1`.
   * @param {object} [opts={}] Any options you want to use pass to transtion.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract remove(startIndex: number, removeCount?: number, opts?: NavOptions, done?: Function): Promise<any>;

  /**
   * Removes the specified view controller from the nav stack.
   *
   * @param {ViewController} [viewController] The viewcontroller to remove.
   * @param {object} [opts={}] Any options you want to use pass to transtion.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract removeView(viewController: ViewController, opts?: NavOptions, done?: Function): Promise<any>;

  /**
   * Set the root for the current navigation stack.
   * @param {string|ViewController} pageOrViewCtrl  The name of the component you want to push on the navigation stack.
   * @param {object} [params={}] Any nav-params you want to pass along to the next view.
   * @param {object} [opts={}] Any options you want to use pass to transtion.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract setRoot(pageOrViewCtrl: any, params?: any, opts?: NavOptions, done?: Function): Promise<any>;

  /**
   * Set the views of the current navigation stack and navigate to the
   * last view. By default animations are disabled, but they can be enabled
   * by passing options to the navigation controller.You can also pass any
   * navigation params to the individual pages in the array.
   *
   * @param {array} pages An array of objects, each with a `page` and optionally `params` property to load in the stack.
   * @param {object} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  abstract setPages(pages: any[], opts?: NavOptions, done?: Function): Promise<any>;

  /**
   * @param {number} index  The index of the page to get.
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
   * Returns the active child navigation.
   */
  abstract getActiveChildNav(): any;

  /**
   * Returns if the nav controller is actively transitioning or not.
   * @return {boolean}
   */
  abstract isTransitioning(includeAncestors?: boolean): boolean

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
   * @private
   */
  abstract registerChildNav(nav: any): void;
}
