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

  constructor() {
    this.items = [];
    this.navCtrl = new NavController(this);
  }

  set initial(Class) {
    if (!this._init) {
      this._init = true
      this.push(Class);
    }
  }

  push(Class: Function, params = {}, opts = {}) {
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
    let enteringItem = new NavItem(this, Class, params);

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
    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // default the direction to "back"
    opts.direction = opts.direction || 'back';

    // get the active item and set that it is staged to be leaving
    // was probably the one popped from the stack
    let leavingItem = this.getActive() || {};
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
    enteringItem.setup().then(() => {

      // get any items that are already staged to leave, or are actively leaving
      // since a different item will be leaving, reset any actively leaving items to cached
      let leavingItems = this.getLeavingItems();
      for (let i = 0; i < leavingItems.length; i++) {
        leavingItems[i].state = CACHED_STATE;
      }

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
        transAnimation.start().then(() => {

          // transition has completed, update each item's state
          enteringItem.state = ACTIVE_STATE;
          leavingItem.state = CACHED_STATE;

          // destroy any items that shouldn't stay around
          this.cleanup();

          // allow clicks again
          ClickBlock(false);

          // resolve that this push has completed
          resolve();
        });

      });

    });

    return promise;
  }


  cleanup() {
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      let item = this.items[i];
      if (item && item.shouldDestroy) {
        this.remove(item);
        i = 0;
        ii = this.items.length;
debugger
        item.dispose && item.dispose();
      }
    }
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

  getLeavingItems() {
    let items = [];
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      if (this.items[i].state === ACTIVELY_LEAVING_STATE || this.items[i].state === STAGED_LEAVING_STATE) {
        items.push(this.items[i]);
      }
    }
    return items;
  }

  last() {
    return this.items[this.items.length - 1]
  }

  length() {
    return this.items.length;
  }

  remove(index) {
    const item = this.items[index];
    this.items.splice(index, 1);
  }

  getToolbars(pos: String) {
    let last = this.last();
    return last && last.navItem && last.navItem._toolbars[pos] || [];
  }

  get hideHeader() {
    return !this.getToolbars('top').length;
  }

  get hideFooter() {
    return !this.getToolbars('bottom').length;
  }

  canSwipeBack() {
    return !!this.getPrevious(this.getActive());
  }
}
