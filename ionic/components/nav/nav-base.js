import {NgElement} from 'angular2/angular2';
import * as util from 'ionic/util';
import {Transition} from 'ionic/ionic';


const STAGED_STATE = 'staged';
const STAGED_ENTERING_STATE = 'staged-enter';
const STAGED_LEAVING_STATE = 'staged-leave';
const ACTIVELY_ENTERING_STATE = 'entering';
const ACTIVELY_LEAVING_STATE = 'leaving';
const ACTIVE_STATE = 'active';
const CACHED_STATE = 'cached';


/*
 * Used by tabs and nav
 */
export class NavBase {
  constructor(
    element: NgElement
  ) {
    this.domElement = element.domElement;

    // this is our sane stack of items. This is synchronous and says an item
    // is removed even if it's still animating out.
    this._stack = [];

    // The navItems array is what add/remove components from the dom.
    // These arrays won't remove a component until they're
    // done animating out.
    this.navItems = [];
  }

  containsClass(Class) {
    for (let i = 0; i < this._stack.length; i++) {
      if (this._stack[i].Class === Class) {
        return true;
      }
    }
    return false;
  }

  set initial(Class) {
    if (!this.initialized) {
      this.initialized = true
      this.push(Class);
    }
  }

  getActiveItem() {
    for (let i = 0, ii = this.navItems.length; i < ii; i++) {
      if (this.navItems[i].state === ACTIVE_STATE) {
        return this.navItems[i];
      }
    }
    return null;
  }

  getStagedEnteringItem() {
    for (let i = 0, ii = this.navItems.length; i < ii; i++) {
      if (this.navItems[i].state === STAGED_ENTERING_STATE) {
        return this.navItems[i];
      }
    }
    return null;
  }

  getStagedLeavingItem() {
    for (let i = 0, ii = this.navItems.length; i < ii; i++) {
      if (this.navItems[i].state === STAGED_LEAVING_STATE) {
        return this.navItems[i];
      }
    }
    return null;
  }

  getLeavingItems() {
    let items = [];
    for (let i = 0, ii = this.navItems.length; i < ii; i++) {
      if (this.navItems[i].state === ACTIVELY_LEAVING_STATE || this.navItems[i].state === STAGED_LEAVING_STATE) {
        items.push(this.navItems[i]);
      }
    }
    return items;
  }

  push(Class: Function, params = {}, opts = {}) {
    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // default the direction to "forward"
    opts.direction = opts.direction || 'forward';

    // do not animate if this is the first in the stack
    if (!this._stack.length) {
      opts.animation = 'none';
    }

    // the active item is going to be the leaving one (if one exists)
    let leavingItem = this.getActiveItem() || {};

    // create a new NavStackItem
    let enteringItem = new NavStackItem(Class, params);

    // set that this item is staged (it's not ready to be animated in yet)
    enteringItem.state = STAGED_STATE;

    // add the item to the stack (just renders in the DOM, doesn't animate yet)
    this._stack.push(enteringItem);
    this.navItems.push(enteringItem);

    // start the transition
    this.transition(enteringItem, leavingItem, opts).then(() => {
      console.log('push completed');
      resolve();
    });

    return promise;
  }

  pop(opts = {}) {
    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // default the direction to "back"
    opts.direction = opts.direction || 'back';

    // remove the last item
    this._stack.pop();

    // the entering item is now the new last item
    let enteringItem = this.last()

    // get the active item and set that it is staged to be leaving
    // was probably the one popped from the stack
    let leavingItem = this.getActiveItem() || {};

    // start the transition
    this.transition(enteringItem, leavingItem, opts).then(() => {
      // transition completed, destroy the leaving item
      console.log('pop completed');
      this._destroy(leavingItem);
      resolve();
    });

    return promise;
  }

  transition(enteringItem, leavingItem, opts) {
    let resolve;
    let promise = new Promise(res => { resolve = res; });

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

          // resolve that this push has completed
          resolve();

          // on the next frame, hide the item that's cached
          util.dom.raf(() => {
            // ensure it's state is still cached
            if (leavingItem.state === CACHED_STATE && leavingItem.navItem) {
              // CSS default is display:none, so setting to '' does the trick
              leavingItem.navItem.domElement.style.display = '';
            }
          });
        });

      });

    });

    return promise;
  }

  last() {
    return this._stack[this._stack.length - 1]
  }

  length() {
    return this._stack.length;
  }

  popAll() {
    while (this._stack.length) {
      const item = this._stack.pop()
      this._destroy(item)
    }
  }

  // Pop from the current item to the item at the specified index.
  // Removes every item in the stack between the current and the given index,
  // then performs a normal pop.
  popTo(index, opts = {}) {
    // Abort if we're already here.
    if (this._stack.length <= index + 1) {
      return Promise.resolve();
    }

    // Save the current navItem, and remove all the other ones in front of our
    // target nav item.
    const current = this._stack.pop()
    while (this._stack.length > index + 1) {
      const item = this._stack.pop()
      this._destroy(item)
    }

    // Now put the current navItem back on the stack and run a normal pop animation.
    this._stack.push(current)
    return this.pop(opts)
  }

  remove(index) {
    const item = this._stack[index];
    this._stack.splice(index, 1);
    this._destroy(item);
  }

  _destroy(navItem) {
    util.array.remove(this.navItems, navItem);
  }

  getPrevious(item) {
    return this._stack[ this._stack.indexOf(item) - 1 ];
  }

  getToolbars(pos: String) {
    let last = this.last();
    return last && last.navItem && last.navItem._toolbars[pos] || [];
  }
}


class NavStackItem {
  constructor(ComponentClass, params = {}) {
    this.Class = ComponentClass;
    this.params = params;
    this._setupPromise = new Promise((resolve) => {
      this._resolveSetupPromise = resolve;
    });
  }

  setup() {
    return this._setupPromise;
  }

  finishSetup(navItem, componentInstance) {
    this.navItem = navItem
    this.instance = componentInstance
    this._resolveSetupPromise()
  }

  setAnimation(state) {
    if (!state) {
      this.navItem.domElement.removeAttribute('animate')
      this.navItem.domElement.classList.remove('start')
    } else {
      this.navItem.domElement.setAttribute('animate', state)
    }
  }

  setShown(isShown) {
    this.navItem.domElement.classList[isShown?'add':'remove']('shown')
  }

  startAnimation() {
    this.navItem.domElement.classList.add('start')
  }

  _animate({ isShown, animation }) {
    this.setAnimation(animation)
    this.setShown(isShown)
    if (animation) {
      // We have to wait two rafs for the element to show. Yawn.
      return util.dom.rafPromise().then(util.dom.rafPromise).then(() => {
        this.startAnimation()
        return util.dom.transitionEndPromise(this.navItem.domElement).then(() => {
          this.setAnimation(null)
        })
      })
    } else {
      return Promise.resolve()
    }
  }

  enterReverse(opts) {
    return this.enter( util.extend({reverse: true}, opts) )
  }

  enter({ reverse = false, animate = false } = {}) {
    return this._animate({
      isShown: true,
      animation: animate ? (reverse ? 'enter-reverse' : 'enter') : null
    })
  }

  leave({ reverse = false, animate = false } = {}) {
    return this._animate({
      isShown: false,
      animation: animate ? (reverse ? 'leave-reverse' : 'leave') : null
    })
  }

  leaveReverse(opts) {
    return this.leave( util.extend({reverse: true}, opts) )
  }

}
