import {Compiler, ElementRef, Injector, bind} from 'angular2/angular2';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {AppViewManager} from 'angular2/src/core/compiler/view_manager';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicApp} from '../app/app';
import {IonicRouter} from '../../routing/router';
import {ViewItem} from './view-item';
import {NavController} from '../nav/nav-controller';
import {PaneController} from '../nav/pane';
import {Transition} from '../../transitions/transition';
import {ClickBlock} from '../../util/click-block';
import * as util from 'ionic/util';


export class ViewController extends Ion {

  constructor(
    parentViewCtrl: ViewController,
    injector: Injector,
    elementRef: ElementRef
  ) {
    let config = injector.get(IonicConfig);
    super(elementRef, config);

    this.parent = parentViewCtrl;

    this.compiler = injector.get(Compiler);
    this.loader = injector.get(DynamicComponentLoader);
    this.viewMngr = injector.get(AppViewManager);
    this.router = injector.get(IonicRouter);
    this.app = injector.get(IonicApp);
    this.config = config;

    this.router.addViewController(this);

    this.items = [];
    this.panes = new PaneController(this);

    this.sbTransition = null;
    this.sbActive = false;
    this.sbEnabled = true;

    this.id = ++ctrlIds;
    this._ids = -1;

    // build a new injector for child ViewItems to use
    this.injector = injector.resolveAndCreateChild([
      bind(ViewController).toValue(this),
      bind(NavController).toValue(new NavController(this))
    ]);

    this.bindings = Injector.resolve([
      bind(ViewController).toValue(this),
      bind(NavController).toValue(new NavController(this))
    ]);
  }

  push(component, params = {}, opts = {}) {
    if (!component || this.isTransitioning()) {
      return Promise.reject();
    }

    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // do not animate if this is the first in the stack
    if (!this.items.length) {
      opts.animation = 'none';
    }

    // default the direction to "forward"
    opts.direction = opts.direction || 'forward';

    // the active item is going to be the leaving one (if one exists)
    let leavingItem = this.getActive() || new ViewItem();
    leavingItem.shouldCache = (util.isBoolean(opts.cacheLeavingItem) ? opts.cacheLeavingItem : true);
    leavingItem.shouldDestroy = !leavingItem.shouldCache;
    if (leavingItem.shouldDestroy) {
      leavingItem.willUnload();
    }

    // create a new ViewItem
    let enteringItem = new ViewItem(this, component, params);

    // add the item to the stack
    this.add(enteringItem);

    // notify app of the state change
    this.app.stateChange('push', enteringItem);

    // start the transition
    this.transition(enteringItem, leavingItem, opts, () => {
      resolve();
    });

    return promise;
  }

  pop(opts = {}) {
    if (this.isTransitioning() || this.items.length < 2) {
      return Promise.reject();
    }

    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // default the direction to "back"
    opts.direction = opts.direction || 'back';

    // get the active item and set that it is staged to be leaving
    // was probably the one popped from the stack
    let leavingItem = this.getActive() || new ViewItem();
    leavingItem.shouldCache = (util.isBoolean(opts.cacheLeavingItem) ? opts.cacheLeavingItem : false);
    leavingItem.shouldDestroy = !leavingItem.shouldCache;
    if (leavingItem.shouldDestroy) {
      leavingItem.willUnload();
    }

    // the entering item is now the new last item
    // Note: we might not have an entering item if this is the
    // only item on the history stack.
    let enteringItem = this.getPrevious(leavingItem);
    if (enteringItem) {
      // notify app of the state change
      this.app.stateChange('pop', enteringItem);

      // start the transition
      this.transition(enteringItem, leavingItem, opts, () => {
        // transition completed, destroy the leaving item
        resolve();
      });

    } else {
      this.transitionComplete();
      resolve();
    }

    return promise;
  }

  /**
   * Set the item stack to reflect the given component classes.
   */
  setItems(components, opts = {}) {
    if (!components || !components.length) {
      return Promise.resolve();
    }

    this.app.stateClear();

    // if animate has not been set then default to false
    opts.animate = opts.animate || false;

    // ensure leaving items are not cached, and should be destroyed
    opts.cacheLeavingItem = false;

    // get the items to auto remove without having to do a transiton for each
    // the last item (the currently active one) will do a normal transition out
    if (this.items.length > 1) {
      let autoRemoveItems = this.items.slice(0, this.items.length - 1);
      for (let i = 0; i < autoRemoveItems.length; i++) {
        autoRemoveItems[i].shouldDestroy = true;
        autoRemoveItems[i].shouldCache = false;
        autoRemoveItems[i].willUnload();
      }
    }

    let component = null;
    let viewItem = null;

    // create the ViewItems that go before the new active ViewItem in the stack
    // but the previous views won't should render yet
    if (components.length > 1) {
      let newBeforeItems = components.slice(0, components.length - 1);
      for (let j = 0; j < newBeforeItems.length; j++) {
        component = newBeforeItems[j];
        if (component) {
          viewItem = new ViewItem(this, component.component || component, component.params);
          viewItem.state = CACHED_STATE;
          viewItem.shouldDestroy = false;
          viewItem.shouldCache = false;

          // add the item to the stack
          this.add(viewItem);
        }
      }
    }

    // get the component that will become the active item
    // it'll be the last one in the given components array
    component = components[ components.length - 1 ];

    // transition the leaving and entering
    return this.push((component && component.component) || component, (component && component.params), opts);
  }

  setRoot(component, params = {}, opts = {}) {
    return this.setItems([{
             component,
             params
           }], opts);
  }

  transition(enteringItem, leavingItem, opts, callback) {
    if (!enteringItem || enteringItem === leavingItem) {
      return callback();
    }

    if (opts.animate === false) {
      opts.animation = 'none';

    } else if (!opts.animation) {
      opts.animation = this.config.setting('viewTransition');
    }

    opts.animate = (opts.animation !== 'none');

    // wait for the new item to complete setup
    enteringItem.stage(() => {

      enteringItem.shouldDestroy = false;
      enteringItem.shouldCache = false;
      enteringItem.willEnter();
      leavingItem.willLeave();

      // set that the new item pushed on the stack is staged to be entering/leaving
      // staged state is important for the transition to find the correct item
      enteringItem.state = STAGED_ENTERING_STATE;
      leavingItem.state = STAGED_LEAVING_STATE;

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
        ClickBlock(true, duration + 200);
      }

      // start the transition
      transAnimation.play().then(() => {

        // transition has completed, update each item's state
        enteringItem.state = ACTIVE_STATE;
        leavingItem.state = CACHED_STATE;

        // dispose any items that shouldn't stay around
        transAnimation.dispose();

        enteringItem.didEnter();
        leavingItem.didLeave();

        // all done!
        this.transitionComplete();

        callback();
      });

    });
  }

  swipeBackStart() {
    if (this.isTransitioning() || this.items.length < 2) {
      return;
    }

    this.sbActive = true;
    this.sbResolve = null;

    // default the direction to "back"
    let opts = {
      direction: 'back'
    };

    // get the active item and set that it is staged to be leaving
    // was probably the one popped from the stack
    let leavingItem = this.getActive() || new ViewItem();
    leavingItem.shouldDestroy = true;
    leavingItem.shouldCache = false;
    leavingItem.willLeave();
    leavingItem.willUnload();

    // the entering item is now the new last item
    let enteringItem = this.getPrevious(leavingItem);
    enteringItem.shouldDestroy = false;
    enteringItem.shouldCache = false;
    enteringItem.willEnter();

    // wait for the new item to complete setup
    enteringItem.stage(() => {

      // set that the new item pushed on the stack is staged to be entering/leaving
      // staged state is important for the transition to find the correct item
      enteringItem.state = STAGED_ENTERING_STATE;
      leavingItem.state = STAGED_LEAVING_STATE;

      // init the transition animation
      this.sbTransition = Transition.create(this, opts);
      this.sbTransition.easing('linear');
      this.sbTransition.stage();

      let swipeBackPromise = new Promise(res => { this.sbResolve = res; });

      swipeBackPromise.then((completeSwipeBack) => {

        if (completeSwipeBack) {
          // swipe back has completed, update each item's state
          enteringItem.state = ACTIVE_STATE;
          leavingItem.state = CACHED_STATE;

          enteringItem.didEnter();
          leavingItem.didLeave();

          // notify app of the state change
          this.app.stateChange('pop', enteringItem);

        } else {
          // cancelled the swipe back, return items to original state
          leavingItem.state = ACTIVE_STATE;
          enteringItem.state = CACHED_STATE;

          leavingItem.willEnter();
          leavingItem.didEnter();
          enteringItem.didLeave();

          leavingItem.shouldDestroy = false;
          enteringItem.shouldDestroy = false;
        }

        // all done!
        this.transitionComplete();

      });

    });

  }

  swipeBackProgress(progress) {
    if (this.sbTransition) {
      ClickBlock(true, 4000);
      this.sbTransition.progress( Math.min(1, Math.max(0, progress)) );
    }
  }

  swipeBackEnd(completeSwipeBack, progress, playbackRate) {
    // to reverse the animation use a negative playbackRate
    if (this.sbTransition && this.sbActive) {
      this.sbActive = false;

      if (progress <= 0) {
        this.swipeBackProgress(0.0001);
      } else if (progress >= 1) {
        this.swipeBackProgress(0.9999);
      }

      if (!completeSwipeBack) {
        playbackRate = playbackRate * -1;
      }

      this.sbTransition.playbackRate(playbackRate);

      this.sbTransition.play().then(() => {
        this.sbResolve && this.sbResolve(completeSwipeBack);
        this.sbTransition && this.sbTransition.dispose();
        this.sbResolve = this.sbTransition = null;
      });
    }
  }

  isSwipeBackEnabled(val) {
    if (arguments.length) {
       this.sbEnabled = !!val;
    }
    return this.sbEnabled;
  }

  canSwipeBack() {
    if (this.sbEnabled) {
      let activeItem = this.getActive();
      if (activeItem) {
        return activeItem.enableBack();
      }
    }
    return false;
  }

  transitionComplete() {
    let destroys = [];

    this.items.forEach(item => {
      if (item) {
        if (item.shouldDestroy) {
          destroys.push(item);

        } else if (item.state === CACHED_STATE && item.shouldCache) {
          item.shouldCache = false;
        }
      }
    });

    destroys.forEach(item => {
      this.remove(item);
      item.destroy();
    });

    // allow clicks again
    ClickBlock(false);
  }

  isTransitioning() {
    let state;
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      state = this.items[i].state;
      if (state === STAGED_ENTERING_STATE ||
          state === STAGED_LEAVING_STATE) {
        return true;
      }
    }
    return false;
  }

  getActive() {
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      if (this.items[i].state === ACTIVE_STATE) {
        return this.items[i];
      }
    }
    return null;
  }

  getByInstance(instance) {
    if (instance) {
      for (let i = 0, ii = this.items.length; i < ii; i++) {
        if (this.items[i].instance === instance) {
          return this.items[i];
        }
      }
    }
    return null;
  }

  getByIndex(index) {
    if (index < this.items.length && index > -1) {
      return this.items[index];
    }
    return null;
  }

  getPrevious(item) {
    if (item) {
      return this.items[ this.items.indexOf(item) - 1 ];
    }
    return null;
  }

  getStagedEnteringItem() {
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      if (this.items[i].state === STAGED_ENTERING_STATE) {
        return this.items[i];
      }
    }
    return null;
  }

  getStagedLeavingItem() {
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      if (this.items[i].state === STAGED_LEAVING_STATE) {
        return this.items[i];
      }
    }
    return null;
  }

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

  anchorElementRef() {
    if (arguments.length) {
      this._anchorER = arguments[0];
    }
    return this._anchorER;
  }

  anchorViewContainerRef() {
    if (arguments.length) {
      this._anchorVC = arguments[0];
    }
    return this._anchorVC;
  }

  childNavbar() {
    if (arguments.length) {
      this._childNavbar = arguments[0];
    }
    return this._childNavbar;
  }

  add(item) {
    item.id = this.id + '-' + (++this._ids);
    this.items.push(item);
  }

  remove(itemOrIndex) {
    util.array.remove(this.items, itemOrIndex);
  }

  indexOf(item) {
    return this.items.indexOf(item);
  }

  length() {
    return this.items.length;
  }

  instances() {
    let instances = [];
    for (let item of this.items) {
      if (item.instance) {
        instances.push(item.instance);
      }
    }
    return instances;
  }

  isActive(item) {
    return (item && item.state === ACTIVE_STATE);
  }

  isStagedEntering(item) {
    return (item && item.state === STAGED_ENTERING_STATE);
  }

}

const ACTIVE_STATE = 1;
const CACHED_STATE = 2;
const STAGED_ENTERING_STATE = 3;
const STAGED_LEAVING_STATE = 4;

let ctrlIds = -1;
