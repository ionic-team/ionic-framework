import {Compiler, ElementRef, Injector, bind, NgZone} from 'angular2/angular2';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {AppViewManager} from 'angular2/src/core/compiler/view_manager';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicApp} from '../app/app';
import {ViewController} from './view-controller';
import {PaneController} from './pane';
import {Transition} from '../../transitions/transition';
import {SwipeBackGesture} from './swipe-back';
import * as util from 'ionic/util';

/**
 * TODO
 */
export class NavController extends Ion {

  constructor(
    parentnavCtrl: NavController,
    injector: Injector,
    elementRef: ElementRef,
    zone: NgZone
  ) {
    let config = injector.get(IonicConfig);
    super(elementRef, config);

    this.parent = parentnavCtrl;

    this.compiler = injector.get(Compiler);
    this.loader = injector.get(DynamicComponentLoader);
    this.viewMngr = injector.get(AppViewManager);
    this.app = injector.get(IonicApp);
    this.config = config;
    this.zone = zone;

    this.views = [];
    this.panes = new PaneController(this);

    this._sbTrans = null;
    this._sbEnabled = config.setting('swipeBackEnabled') || false;
    this._sbThreshold = config.setting('swipeBackThreshold') || 40;

    this.id = ++ctrlIds;
    this._ids = -1;
    this.zIndexes = -1;

    // build a new injector for child ViewControllers to use
    this.bindings = Injector.resolve([
      bind(NavController).toValue(this)
    ]);
  }

  /**
   * TODO
   * @param {TODO} componentType  TODO
   * @param {TODO} [params={}]  TODO
   * @param {TODO} [opts={}]  TODO
   * @returns {Promise} TODO
   */
  push(componentType, params = {}, opts = {}) {
    if (!componentType) {
      return Promise.reject();
    }
    if (typeof componentType !== 'function') {
      throw 'Loading component must be a component class, not "' + componentType.toString() + '"';
    }

    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // do not animate if this is the first in the stack
    if (!this.views.length) {
      opts.animation = 'none';
    }

    // default the direction to "forward"
    opts.direction = opts.direction || 'forward';

    // the active view is going to be the leaving one (if one exists)
    let leavingView = this.getActive() || new ViewController();
    leavingView.shouldCache = (util.isBoolean(opts.cacheleavingView) ? opts.cacheleavingView : true);
    leavingView.shouldDestroy = !leavingView.shouldCache;
    if (leavingView.shouldDestroy) {
      leavingView.willUnload();
    }

    // create a new ViewController
    let enteringView = new ViewController(this, componentType, params);

    // add the view to the stack
    this.add(enteringView);

    if (this.router) {
      // notify router of the state change
      this.router.stateChange('push', enteringView, params);
    }

    // start the transition
    this.transition(enteringView, leavingView, opts, () => {
      resolve();
    });

    return promise;
  }

  /**
   * TODO
   * @param {TODO} [opts={}]  TODO
   * @returns {Promise} TODO
   */
  pop(opts = {}) {
    if (!this.canGoBack()) {
      return Promise.reject();
    }

    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // default the direction to "back"
    opts.direction = opts.direction || 'back';

    // get the active view and set that it is staged to be leaving
    // was probably the one popped from the stack
    let leavingView = this.getActive() || new ViewController();
    leavingView.shouldCache = (util.isBoolean(opts.cacheleavingView) ? opts.cacheleavingView : false);
    leavingView.shouldDestroy = !leavingView.shouldCache;
    if (leavingView.shouldDestroy) {
      leavingView.willUnload();
    }

    // the entering view is now the new last view
    // Note: we might not have an entering view if this is the
    // only view on the history stack.
    let enteringView = this.getPrevious(leavingView);
    if (enteringView) {
      if (this.router) {
        // notify router of the state change
        this.router.stateChange('pop', enteringView);
      }

      // start the transition
      this.transition(enteringView, leavingView, opts, () => {
        // transition completed, destroy the leaving view
        resolve();
      });

    } else {
      this._transComplete();
      resolve();
    }

    return promise;
  }


  /**
   * Inserts a view into the nav stack at the specified index.
   * @param {TODO} componentType  TODO
   * @param {TODO} index TODO
   * @returns {Promise} TODO
   */
  insert(componentType, index) {
    if (!componentType || index < 0) {
      return Promise.reject();
    }

    // push it onto the end
    if (index >= this.views.length) {
      return this.push(componentType);
    }

    // create new ViewController, but don't render yet
    let viewCtrl = new ViewController(this, componentType);
    viewCtrl.state = CACHED_STATE;
    viewCtrl.shouldDestroy = false;
    viewCtrl.shouldCache = false;

    this._incrementId(viewCtrl);
    this.views.splice(index, 0, viewCtrl);
  }

  /**
   * Set the view stack to reflect the given component classes.
   * @param {TODO} components  TODO
   * @param {TODO} [opts={}]  TODO
   * @returns {Promise} TODO
   */
  setViews(components, opts = {}) {
    if (!components || !components.length) {
      return Promise.resolve();
    }

    // if animate has not been set then default to false
    opts.animate = opts.animate || false;

    // ensure leaving views are not cached, and should be destroyed
    opts.cacheleavingView = false;

    // get the views to auto remove without having to do a transiton for each
    // the last view (the currently active one) will do a normal transition out
    if (this.views.length > 1) {
      let autoRemoveItems = this.views.slice(0, this.views.length - 1);
      for (let i = 0; i < autoRemoveItems.length; i++) {
        autoRemoveItems[i].shouldDestroy = true;
        autoRemoveItems[i].shouldCache = false;
        autoRemoveItems[i].willUnload();
      }
    }

    let componentObj = null;
    let componentType = null;
    let viewCtrl = null;

    // create the ViewControllers that go before the new active ViewController in the stack
    // but the previous views won't should render yet
    if (components.length > 1) {
      let newBeforeItems = components.slice(0, components.length - 1);
      for (let j = 0; j < newBeforeItems.length; j++) {
        componentObj = newBeforeItems[j];

        if (componentObj) {

          // could be an object with a componentType property, or it is a componentType
          componentType = componentObj.componentType || componentObj;

          viewCtrl = new ViewController(this, componentType, componentObj.params);
          viewCtrl.state = CACHED_STATE;
          viewCtrl.shouldDestroy = false;
          viewCtrl.shouldCache = false;

          // add the item to the stack
          this.add(viewCtrl);
        }
      }
    }

    // get the component that will become the active item
    // it'll be the last one in the given components array
    componentObj = components[ components.length - 1 ];
    componentType = componentObj.componentType || componentObj;

    // transition the leaving and entering
    return this.push(componentType, componentObj.params, opts);
  }

  /**
   * TODO
   * @param {TODO} componentType  TODO
   * @param {TODO} [params={}]  TODO
   * @param {TODO} [opts={}]  TODO
   * @returns {Promise} TODO
   */
  setRoot(componentType, params = {}, opts = {}) {
    return this.setViews([{
             componentType,
             params
           }], opts);
  }

  /**
   * TODO
   * @param {TODO} enteringView  TODO
   * @param {TODO} leavingView  TODO
   * @param {TODO} opts  TODO
   * @param {Function} callback  TODO
   * @returns {any} TODO
   */
  transition(enteringView, leavingView, opts, callback) {
    if (!enteringView || enteringView === leavingView) {
      return callback();
    }

    if (opts.animate === false) {
      opts.animation = 'none';

    } else if (!opts.animation) {
      opts.animation = this.config.setting('viewTransition');
    }

    opts.animate = (opts.animation !== 'none');

    // wait for the new view to complete setup
    enteringView.stage(() => {

      this.zone.runOutsideAngular(() => {

        enteringView.shouldDestroy = false;
        enteringView.shouldCache = false;
        enteringView.willEnter();
        leavingView.willLeave();

        // set that the new view pushed on the stack is staged to be entering/leaving
        // staged state is important for the transition to find the correct view
        enteringView.state = STAGED_ENTERING_STATE;
        leavingView.state = STAGED_LEAVING_STATE;

        // init the transition animation
        let transAnimation = Transition.create(this, opts);
        if (!opts.animate) {
          // force it to not animate the elements, just apply the "to" styles
          transAnimation.duration(0);
        }

        let duration = transAnimation.duration();
        if (duration > 64) {
          // block any clicks during the transition and provide a
          // fallback to remove the clickblock if something goes wrong
          this.app.setEnabled(false, duration);
          this.app.setTransitioning(true, duration);
        }

        // start the transition
        transAnimation.play().then(() => {

          // transition has completed, update each view's state
          enteringView.state = ACTIVE_STATE;
          leavingView.state = CACHED_STATE;

          // dispose any views that shouldn't stay around
          transAnimation.dispose();

          enteringView.didEnter();
          leavingView.didLeave();

          // all done!
          this.zone.run(() => {
            this._transComplete();
            callback();
          });
        });

      });

    });

  }

  /**
   * TODO
   */
  swipeBackStart() {
    if (!this.app.isEnabled() || !this.canSwipeBack()) {
      return;
    }

    // disables the app during the transition
    this.app.setEnabled(false);
    this.app.setTransitioning(true);

    // default the direction to "back"
    let opts = {
      direction: 'back'
    };

    // get the active view and set that it is staged to be leaving
    // was probably the one popped from the stack
    let leavingView = this.getActive() || new ViewController();
    leavingView.shouldDestroy = true;
    leavingView.shouldCache = false;
    leavingView.willLeave();
    leavingView.willUnload();

    // the entering view is now the new last view
    let enteringView = this.getPrevious(leavingView);
    enteringView.shouldDestroy = false;
    enteringView.shouldCache = false;
    enteringView.willEnter();

    // wait for the new view to complete setup
    enteringView.stage(() => {

      this.zone.runOutsideAngular(() => {
        // set that the new view pushed on the stack is staged to be entering/leaving
        // staged state is important for the transition to find the correct view
        enteringView.state = STAGED_ENTERING_STATE;
        leavingView.state = STAGED_LEAVING_STATE;

        // init the swipe back transition animation
        this._sbTrans = Transition.create(this, opts);
        this._sbTrans.easing('linear').progressStart();

      });
    });

  }

  /**
   * TODO
   * @param {TODO} progress  TODO
   */
  swipeBackProgress(value) {
    if (this._sbTrans) {
      // continue to disable the app while actively dragging
      this.app.setEnabled(false, 4000);
      this.app.setTransitioning(true, 4000);

      // set the transition animation's progress
      this._sbTrans.progress(value);
    }
  }

  /**
   * @private
   * @param {TODO} completeSwipeBack  Should the swipe back complete or not.
   * @param {number} rate  How fast it closes
   */
  swipeBackEnd(completeSwipeBack, rate) {
    if (!this._sbTrans) return;

    // disables the app during the transition
    this.app.setEnabled(false);
    this.app.setTransitioning(true);

    this._sbTrans.progressEnd(completeSwipeBack, rate).then(() => {

      this.zone.run(() => {
        // find the views that were entering and leaving
        let enteringView = this.getStagedEnteringView();
        let leavingView = this.getStagedLeavingView();

        if (enteringView && leavingView) {
          // finish up the animation

          if (completeSwipeBack) {
            // swipe back has completed navigating back
            // update each view's state
            enteringView.state = ACTIVE_STATE;
            leavingView.state = CACHED_STATE;

            enteringView.didEnter();
            leavingView.didLeave();

            if (this.router) {
              // notify router of the pop state change
              this.router.stateChange('pop', enteringView);
            }

          } else {
            // cancelled the swipe back, they didn't end up going back
            // return views to their original state
            leavingView.state = ACTIVE_STATE;
            enteringView.state = CACHED_STATE;

            leavingView.willEnter();
            leavingView.didEnter();
            enteringView.didLeave();

            leavingView.shouldDestroy = false;
            enteringView.shouldDestroy = false;
          }
        }

        // empty out and dispose the swipe back transition animation
        this._sbTrans && this._sbTrans.dispose();
        this._sbTrans = null;

        // all done!
        this._transComplete();

      });
    });

  }

  _runSwipeBack() {
    if (this.canSwipeBack()) {
      // it is possible to swipe back

      if (this.sbGesture) {
        // this is already an active gesture, don't create another one
        return;
      }

      let opts = {
        edge: 'left',
        threshold: this._sbThreshold
      };
      this.sbGesture = new SwipeBackGesture(this.getNativeElement(), opts, this);
      console.debug('SwipeBackGesture listen');
      this.sbGesture.listen();


    } else if (this.sbGesture) {
      // it is not possible to swipe back and there is an
      // active sbGesture, so unlisten it
      console.debug('SwipeBackGesture unlisten');
      this.sbGesture.unlisten();
      this.sbGesture = null;
    }
  }

  /**
   * TODO
   * @param {TODO} val  TODO
   * @returns {TODO} TODO
   */
  isSwipeBackEnabled(val) {
    if (arguments.length) {
       this._sbEnabled = !!val;
    }
    return this._sbEnabled;
  }

  /**
   * If it's possible to use swipe back or not. If it's not possible
   * to go back, or swipe back is not enable then this will return false.
   * If it is possible to go back, and swipe back is enabled, then this
   * will return true.
   * @returns {boolean}
   */
  canSwipeBack() {
    return (this._sbEnabled && this.canGoBack());
  }

  /**
   * Returns `true` if there's a valid previous view that we can pop back to.
   * Otherwise returns false.
   * @returns {boolean}
   */
  canGoBack() {
    let activeView = this.getActive();
    if (activeView) {
      return activeView.enableBack();
    }
    return false;
  }

  /**
   * @private
   */
  _transComplete() {
    let destroys = [];

    this.views.forEach(view => {
      if (view) {
        if (view.shouldDestroy) {
          destroys.push(view);

        } else if (view.state === CACHED_STATE && view.shouldCache) {
          view.shouldCache = false;
        }
      }
    });

    destroys.forEach(view => {
      this.remove(view);
      view.destroy();
    });

    // allow clicks again, but still set an enable time
    // meaning nothing with this view controller can happen for XXms
    this.app.setEnabled(true);
    this.app.setTransitioning(false);

    if (this.views.length === 1) {
      this.elementRef.nativeElement.classList.add('has-views');
    }

    this._runSwipeBack();
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  getActive() {
    for (let i = 0, ii = this.views.length; i < ii; i++) {
      if (this.views[i].state === ACTIVE_STATE) {
        return this.views[i];
      }
    }
    return null;
  }

  /**
   * TODO
   * @param {TODO} instance  TODO
   * @returns {TODO} TODO
   */
  getByInstance(instance) {
    if (instance) {
      for (let i = 0, ii = this.views.length; i < ii; i++) {
        if (this.views[i].instance === instance) {
          return this.views[i];
        }
      }
    }
    return null;
  }

  /**
   * TODO
   * @param {TODO} index  TODO
   * @returns {TODO} TODO
   */
  getByIndex(index) {
    if (index < this.views.length && index > -1) {
      return this.views[index];
    }
    return null;
  }

  /**
   * TODO
   * @param {TODO} view  TODO
   * @returns {TODO} TODO
   */
  getPrevious(view) {
    if (view) {
      return this.views[ this.views.indexOf(view) - 1 ];
    }
    return null;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  getStagedEnteringView() {
    for (let i = 0, ii = this.views.length; i < ii; i++) {
      if (this.views[i].state === STAGED_ENTERING_STATE) {
        return this.views[i];
      }
    }
    return null;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  getStagedLeavingView() {
    for (let i = 0, ii = this.views.length; i < ii; i++) {
      if (this.views[i].state === STAGED_LEAVING_STATE) {
        return this.views[i];
      }
    }
    return null;
  }

  /**
   * TODO
   * @param {TODO} nbContainer  TODO
   * @returns {TODO} TODO
   */
  navbarViewContainer(nbContainer) {
    if (nbContainer) {
      this._nbContainer = nbContainer;
    }
    if (this._nbContainer) {
      return this._nbContainer;
    }
    if (this.parent) {
      return this.parent.navbarViewContainer();
    }
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  anchorElementRef() {
    if (arguments.length) {
      this._anchorER = arguments[0];
    }
    return this._anchorER;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  anchorViewContainerRef() {
    if (arguments.length) {
      this._anchorVC = arguments[0];
    }
    return this._anchorVC;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  childNavbar() {
    if (arguments.length) {
      this._childNavbar = arguments[0];
    }
    return this._childNavbar;
  }

  /**
   * TODO
   * @param {TODO} view  TODO
   * @returns {TODO} TODO
   */
  add(view) {
    this._incrementId(view);
    this.views.push(view);
  }

  _incrementId(view) {
    view.id = this.id + '-' + (++this._ids);
  }

  /**
   * TODO
   * @param {TODO} viewOrIndex  TODO
   * @returns {TODO} TODO
   */
  remove(viewOrIndex) {
    util.array.remove(this.views, viewOrIndex);
  }

  /**
   * First view in this nav controller's stack. This would
   * not return an view which is about to be destroyed.
   * @returns {TODO} TODO
   */
  first() {
    for (let i = 0, l = this.views.length; i < l; i++) {
      if (!this.views[i].shouldDestroy) {
        return this.views[i];
      }
    }
    return null;
  }

  /**
   * Last view in this nav controller's stack. This would
   * not return an view which is about to be destroyed.
   * @returns {TODO} TODO
   */
  last() {
    for (let i = this.views.length - 1; i >= 0; i--) {
      if (!this.views[i].shouldDestroy) {
        return this.views[i];
      }
    }
    return null;
  }

  /**
   * TODO
   * @param {TODO} view  TODO
   * @returns {TODO} TODO
   */
  indexOf(view) {
    return this.views.indexOf(view);
  }

  /**
   * Number of sibling views in the nav controller. This does
   * not include views which are about to be destroyed.
   * @returns {TODO} TODO
   */
  length() {
    let len = 0;
    for (let i = 0, l = this.views.length; i < l; i++) {
      if (!this.views[i].shouldDestroy) {
        len++;
      }
    }
    return len;
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
  instances() {
    let instances = [];
    for (let view of this.views) {
      if (view.instance) {
        instances.push(view.instance);
      }
    }
    return instances;
  }

  /**
   * TODO
   * @param {TODO} view  TODO
   * @returns {TODO} TODO
   */
  isActive(view) {
    return (view && view.state === ACTIVE_STATE);
  }

  /**
   * TODO
   * @param {TODO} view  TODO
   * @returns {TODO} TODO
   */
  isStagedEntering(view) {
    return (view && view.state === STAGED_ENTERING_STATE);
  }

  /**
   * TODO
   * @param {TODO} router  TODO
   */
  registerRouter(router) {
    this.router = router;
  }

}

const ACTIVE_STATE = 1;
const CACHED_STATE = 2;
const STAGED_ENTERING_STATE = 3;
const STAGED_LEAVING_STATE = 4;

let ctrlIds = -1;


/**
 * TODO
 */
export class NavParams {
  /**
   * TODO
   * @param {TODO} data  TODO
   */
  constructor(data) {
    this.data = data || {};
  }

  /**
   * TODO
   * @param {TODO} param  TODO
   */
  get(param) {
    return this.data[param];
  }
}
