import * as util from 'ionic/util';
import {Transition, ClickBlock} from 'ionic/ionic';
import {NavItem} from './nav-item';
import {NavController} from './nav-controller';


const STAGED_STATE = 'staged';
const STAGED_ENTERING_STATE = 'staged-enter';
const STAGED_LEAVING_STATE = 'staged-leave';
const ACTIVELY_ENTERING_STATE = 'entering';
const ACTIVELY_LEAVING_STATE = 'leaving';
const ACTIVE_STATE = 'active';
const CACHED_STATE = 'cached';


export class NavBase {

  constructor(loader, injector) {
    this.loader = loader;
    this.injector = injector;
    this.items = [];
    this.navCtrl = new NavController(this);
    this.sbTransition = null;
    this.sbActive = false;
  }

  set initial(Component) {
    if (!this._init && Component) {
      this._init = true;
      this.push(Component);
    }
  }

  push(Component, params = {}, opts = {}) {
    if (this.isTransitioning()) {
      return Promise.reject();
    }

    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // default the direction to "forward"
    opts.direction = opts.direction || 'forward';

    // do not animate if this is the first in the stack
    if (!this.items.length) {
      opts.animation = 'none';
    }

    // the active item is going to be the leaving one (if one exists)
    let leavingItem = this.getActive() || {};
    leavingItem.shouldDestroy = false;

    // create a new NavStackItem
    let enteringItem = new NavItem(this, Component, params);

    // set that this item is staged (it's not ready to be animated in yet)
    enteringItem.state = STAGED_STATE;
    enteringItem.shouldDestroy = false;

    // add the item to the stack
    this.items.push(enteringItem);

    // start the transition
    this.transition(enteringItem, leavingItem, opts).then(() => {
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
    let leavingItem = this.getActive();
    leavingItem.shouldDestroy = true;

    // the entering item is now the new last item
    let enteringItem = this.getPrevious(leavingItem);
    enteringItem.shouldDestroy = false;

    // start the transition
    this.transition(enteringItem, leavingItem, opts).then(() => {
      // transition completed, destroy the leaving item
      resolve();
    });

    return promise;
  }

  transition(enteringItem, leavingItem, opts) {
    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // block possible clicks during transition
    ClickBlock(opts.animation !== 'none', 520);

    // wait for the new item to complete setup
    enteringItem.stage().then(() => {

      // set that the leaving item is stage to be leaving
      leavingItem.state = STAGED_LEAVING_STATE;

      // set that the new item pushed on the stack is staged to be entering
      // setting staged state is important for the transition logic to find the correct item
      enteringItem.state = STAGED_ENTERING_STATE;

      // init the transition animation
      let transAnimation = Transition.create(this, opts);

      // wait for the items to be fully staged
      transAnimation.stage().then(() => {

        // update the state that the items are actively entering/leaving
        enteringItem.state = ACTIVELY_ENTERING_STATE;
        leavingItem.state = ACTIVELY_LEAVING_STATE;

        // start the transition
        transAnimation.play().then(() => {

          // transition has completed, update each item's state
          enteringItem.state = ACTIVE_STATE;
          leavingItem.state = CACHED_STATE;

          // destroy any items that shouldn't stay around
          this.cleanup();

          // dispose all references
          transAnimation.dispose();

          // allow clicks again
          ClickBlock(false);

          // resolve that this push has completed
          resolve();
        });

      });

    });

    return promise;
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
    let leavingItem = this.getActive();
    leavingItem.shouldDestroy = true;

    // the entering item is now the new last item
    let enteringItem = this.getPrevious(leavingItem);
    enteringItem.shouldDestroy = false;

    // start the transition
    // block possible clicks during transition
    ClickBlock(true);

    // wait for the new item to complete setup
    enteringItem.stage().then(() => {

      // set that the leaving item is stage to be leaving
      leavingItem.state = STAGED_LEAVING_STATE;

      // set that the new item pushed on the stack is staged to be entering
      // setting staged state is important for the transition logic to find the correct item
      enteringItem.state = STAGED_ENTERING_STATE;

      // init the transition animation
      this.sbTransition = Transition.create(this, opts);
      this.sbTransition.easing('linear');

      // wait for the items to be fully staged
      this.sbTransition.stage().then(() => {

        // update the state that the items are actively entering/leaving
        enteringItem.state = ACTIVELY_ENTERING_STATE;
        leavingItem.state = ACTIVELY_LEAVING_STATE;

        let swipeBackPromise = new Promise(res => { this.sbResolve = res; });

        swipeBackPromise.then((completeSwipeBack) => {

          if (completeSwipeBack) {
            // swipe back has completed, update each item's state
            enteringItem.state = ACTIVE_STATE;
            leavingItem.state = CACHED_STATE;

            // destroy any items that shouldn't stay around
            this.cleanup();

          } else {
            // cancelled the swipe back, return items to original state
            leavingItem.state = ACTIVE_STATE;
            enteringItem.state = CACHED_STATE;

            leavingItem.shouldDestroy = false;
            enteringItem.shouldDestroy = false;
          }

          // allow clicks again
          ClickBlock(false);

        });

      });

    });

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

  swipeBackProgress(progress) {
    if (this.sbTransition) {
      ClickBlock(true, 4000);
      this.sbTransition.progress( Math.min(1, Math.max(0, progress)) );
    }
  }

  cleanup() {
    this.items.forEach((item) => {
      if (item) {
        if (item.shouldDestroy) {
          this.remove(item);
          item.destroy();

        } else if(item.state !== ACTIVE_STATE) {
          item.cache();
        }
      }
    });
  }

  isTransitioning() {
    var state;
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      state = this.items[i].state;
      if (state === ACTIVELY_ENTERING_STATE ||
          state === ACTIVELY_LEAVING_STATE ||
          state === STAGED_ENTERING_STATE ||
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

  remove(itemOrIndex) {
    util.array.remove(this.items, itemOrIndex);
  }

}
