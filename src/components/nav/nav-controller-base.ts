import { ComponentResolver, ElementRef, EventEmitter, NgZone, provide, ReflectiveInjector, Renderer, ViewContainerRef } from '@angular/core';

import { addSelector } from '../../config/bootstrap';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { GestureController } from '../../gestures/gesture-controller';
import { Ion } from '../ion';
import { isBlank, isPresent, pascalCaseToDashCase } from '../../util/util';
import { Keyboard } from '../../util/keyboard';
import { NavController } from './nav-controller';
import { NavOptions, DIRECTION_BACK, DIRECTION_FORWARD } from './nav-interfaces';
import { NavParams } from './nav-params';
import { SwipeBackGesture } from './swipe-back';
import { Transition } from '../../transitions/transition';
import { ViewController } from './view-controller';


/**
 * This class is for internal use only. It is not exported publicly.
 */
export class NavControllerBase extends Ion implements NavController {
  _transIds = 0;
  _init = false;
  _isPortal: boolean;
  _trans: Transition;
  _sbGesture: SwipeBackGesture;
  _sbThreshold: number;
  _viewport: ViewContainerRef;
  _children: any[] = [];
  _sbEnabled: boolean;
  _ids: number = -1;
  _trnsDelay: any;
  _views: ViewController[] = [];

  viewDidLoad: EventEmitter<any>;
  viewWillEnter: EventEmitter<any>;
  viewDidEnter: EventEmitter<any>;
  viewWillLeave: EventEmitter<any>;
  viewDidLeave: EventEmitter<any>;
  viewWillUnload: EventEmitter<any>;
  viewDidUnload: EventEmitter<any>;

  id: string;
  parent: any;
  config: Config;
  trnsTime: number = 0;

  constructor(
    parent: any,
    public _app: App,
    config: Config,
    public _keyboard: Keyboard,
    elementRef: ElementRef,
    public _zone: NgZone,
    public _renderer: Renderer,
    public _compiler: ComponentResolver,
    public _gestureCtrl: GestureController
  ) {
    super(elementRef);

    this.parent = parent;
    this.config = config;

    this._trnsDelay = config.get('pageTransitionDelay');

    this._sbEnabled = config.getBoolean('swipeBackEnabled');
    this._sbThreshold = config.getNumber('swipeBackThreshold', 40);

    this.id = 'n' + (++ctrlIds);

    this.viewDidLoad = new EventEmitter();
    this.viewWillEnter = new EventEmitter();
    this.viewDidEnter = new EventEmitter();
    this.viewWillLeave = new EventEmitter();
    this.viewDidLeave = new EventEmitter();
    this.viewWillUnload = new EventEmitter();
    this.viewDidUnload = new EventEmitter();
  }

  setViewport(val: ViewContainerRef) {
    this._viewport = val;
  }

  setRoot(page: any, params?: any, opts?: NavOptions): Promise<any> {
    return this.setPages([{page, params}], opts);
  }

  setPages(pages: Array<{page: any, params?: any}>, opts?: NavOptions): Promise<any> {
    if (!pages || !pages.length) {
      return Promise.resolve(false);
    }

    if (isBlank(opts)) {
      opts = {};
    }

    // remove existing views
    let leavingView = this._remove(0, this._views.length);

    // create view controllers out of the pages and insert the new views
    let views = pages.map(p => new ViewController(p.page, p.params));
    let enteringView = this._insert(0, views);

    // if animation wasn't set to true then default it to NOT animate
    if (opts.animate !== true) {
      opts.animate = false;
    }

    // set the nav direction to "back" if it wasn't set
    opts.direction = opts.direction || DIRECTION_BACK;

    let resolve: any;
    let promise = new Promise(res => { resolve = res; });

    // start the transition, fire resolve when done...
    this._transition(enteringView, leavingView, opts, (hasCompleted: boolean) => {
      // transition has completed!!
      resolve(hasCompleted);
    });

    return promise;
  }

  push(page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this.insertPages(-1, [{page: page, params: params}], opts, done);
  }

  /**
   * DEPRECATED: Please use inject the overlays controller and use the present method on the instance instead.
   */
  private present(enteringView: ViewController, opts?: NavOptions): Promise<any> {
    // deprecated warning: added beta.11 2016-06-27
    console.warn('nav.present() has been deprecated.\n' +
                 'Please inject the overlay\'s controller and use the present method on the instance instead.');
    return Promise.resolve();
  }

  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this.insertPages(insertIndex, [{page: page, params: params}], opts, done);
  }

  insertPages(insertIndex: number, insertPages: Array<{page: any, params?: any}>, opts?: NavOptions, done?: Function): Promise<any> {
    let views = insertPages.map(p => new ViewController(p.page, p.params));
    return this.insertViews(insertIndex, views, opts, done);
  }

  insertViews(insertIndex: number, insertViews: ViewController[], opts: NavOptions = {}, done?: Function) {
    let promise: Promise<any>;
    if (!done) {
      // only create a promise if a done callback wasn't provided
      promise = new Promise(res => { done = res; });
    }

    if (!insertViews || !insertViews.length) {
      done(false);
      return promise;
    }

    if (isBlank(opts)) {
      opts = {};
    }

    // insert the new page into the stack
    // returns the newly created entering view
    let enteringView = this._insert(insertIndex, insertViews);

    // manually set the new view's id if an id was passed in the options
    if (isPresent(opts.id)) {
      enteringView.id = opts.id;
    }

    // set the nav direction to "forward" if it wasn't set
    opts.direction = opts.direction || 'forward';

    // set which animation it should use if it wasn't set yet
    if (!opts.animation) {
      opts.animation = enteringView.getTransitionName(opts.direction);
    }

    // it's possible that the newly added view doesn't need to
    // transition in, but was simply inserted somewhere in the stack
    // go backwards through the stack and find the first active view
    // which could be active or one ready to enter
    for (var i = this._views.length - 1; i >= 0; i--) {
      if (this._views[i].state === STATE_ACTIVE || this._views[i].state === STATE_INIT_ENTER) {
        // found the view at the end of the stack that's either
        // already active or it is about to enter

        if (this._views[i] === enteringView) {
          // cool, so the last valid view is also our entering view!!
          // this means we should animate that bad boy in so it's the active view
          // return a promise and resolve when the transition has completed

          // get the leaving view which the _insert() already set
          let leavingView = this.getByState(STATE_INIT_LEAVE);
          if (!leavingView && this._isPortal) {
            // if we didn't find an active view, and this is a portal
            let activeNav = <NavControllerBase>this._app.getActiveNav();
            if (activeNav) {
              leavingView = activeNav.getByState(STATE_INIT_LEAVE);
            }
          }

          // start the transition, fire resolve when done...
          this._transition(enteringView, leavingView, opts, done);
          return promise;
        }
        break;
      }
    }

    // the page was not pushed onto the end of the stack
    // but rather inserted somewhere in the middle or beginning
    // Since there are views after this new one, don't transition in
    // auto resolve cuz there was is no need for an animation
    done(enteringView);

    return promise;
  }

  _insert(insertIndex: number, insertViews: ViewController[]): ViewController {
    // when this is done, there should only be at most
    // 1 STATE_INIT_ENTER and 1 STATE_INIT_LEAVE
    // there should not be any that are STATE_ACTIVE after this is done

    // allow -1 to be passed in to auto push it on the end
    // and clean up the index if it's larger then the size of the stack
    if (insertIndex < 0 || insertIndex > this._views.length) {
      insertIndex = this._views.length;
    }

    // first see if there's an active view
    let view = this.getActive();
    if (!view && this._isPortal) {
      // if we didn't find an active view, and this is a portal
      let activeNav = this._app.getActiveNav();
      if (activeNav) {
        view = activeNav.getActive();
      }
    }

    if (view) {
      // there's an active view, set that it's initialized to leave
      view.state = STATE_INIT_LEAVE;

    } else if (view = this.getByState(STATE_INIT_ENTER)) {
      // oh no, there's already a transition initalized ready to enter!
      // but it actually hasn't entered yet at all so lets
      // just keep it in the array, but not render or animate it in
      view.state = STATE_INACTIVE;
    }

    // insert each of the views in the pages array
    let insertView: ViewController = null;

    insertViews.forEach((view, i) => {
      insertView = view;

      // create the new entering view
      view.setNav(this);
      view.state = STATE_INACTIVE;

      // give this inserted view an ID
      view.id = this.id + '-' + (++this._ids);

      // insert the entering view into the correct index in the stack
      this._views.splice(insertIndex + i, 0, view);
    });

    if (insertView) {
      insertView.state = STATE_INIT_ENTER;
    }

    return insertView;
  }

  pop(opts?: NavOptions, done?: Function): Promise<any> {
    // get the index of the active view
    // which will become the view to be leaving
    let activeView = this.getByState(STATE_TRANS_ENTER) ||
                     this.getByState(STATE_INIT_ENTER) ||
                     this.getActive();

    return this.remove(this.indexOf(activeView), 1, opts, done);
  }

  popToRoot(opts?: NavOptions, done?: Function): Promise<any> {
    return this.popTo(this.first(), opts, done);
  }

  popTo(view: ViewController, opts?: NavOptions, done?: Function): Promise<any> {
    let startIndex = this.indexOf(view);
    if (startIndex < 0) {
      return Promise.reject('View not found to pop to');
    }

    let activeView = this.getByState(STATE_TRANS_ENTER) ||
                     this.getByState(STATE_INIT_ENTER) ||
                     this.getActive();
    let removeCount = this.indexOf(activeView) - startIndex;

    return this.remove(startIndex + 1, removeCount, opts, done);
  }

  remove(startIndex: number = -1, removeCount: number = 1, opts?: NavOptions, done?: Function): Promise<any> {
    let promise: Promise<any>;

    if (!done) {
      promise = new Promise(resolve => { done = resolve; });
    }

    if (startIndex === -1) {
      startIndex = (this._views.length - 1);

    } else if (startIndex < 0 || startIndex >= this._views.length) {
      console.error('index out of range removing view from nav');
      done(false);
      return promise;
    }

    if (isBlank(opts)) {
      opts = {};
    }

    // if not set, by default climb up the nav controllers if
    // there isn't a previous view in this nav controller
    if (isBlank(opts.climbNav)) {
      opts.climbNav = true;
    }

    // default the direction to "back"
    opts.direction = opts.direction || DIRECTION_BACK;

    // figure out the states of each view in the stack
    let leavingView = this._remove(startIndex, removeCount);

    if (!leavingView) {
      let forcedActive = this.getByState(STATE_FORCE_ACTIVE);
      if (forcedActive) {
        // this scenario happens when a remove is going on
        // during a transition
        if (this._trans) {
          this._trans.stop();
          this._trans.destroy();
          this._trans = null;
          this._cleanup();
        }

        done(false);
        return promise;
      }
    }

    if (leavingView) {
      // there is a view ready to leave, meaning that a transition needs
      // to happen and the previously active view is going to animate out

      // get the view thats ready to enter
      let enteringView = this.getByState(STATE_INIT_ENTER);

      if (!enteringView && this._isPortal) {
        // if we didn't find an active view, and this is a portal
        let activeNav = this._app.getActiveNav();
        if (activeNav) {
          enteringView = activeNav.last();
          if (enteringView) {
            enteringView.state = STATE_INIT_ENTER;
          }
        }
      }
      if (!enteringView && !this._isPortal) {
        // oh nos! no entering view to go to!
        // if there is no previous view that would enter in this nav stack
        // and the option is set to climb up the nav parent looking
        // for the next nav we could transition to instead
        if (opts.climbNav) {
          let parentNav: NavController = this.parent;
          while (parentNav) {
            if (!isTabs(parentNav)) {
              // Tabs can be a parent, but it is not a collection of views
              // only we're looking for an actual NavController w/ stack of views
              leavingView.fireWillLeave();
              this.viewWillLeave.emit(leavingView);
              this._app.viewWillLeave.emit(leavingView);

              return parentNav.pop(opts).then((rtnVal: boolean) => {
                leavingView.fireDidLeave();
                this.viewDidLeave.emit(leavingView);
                this._app.viewDidLeave.emit(leavingView);
                return rtnVal;
              });
            }
            parentNav = parentNav.parent;
          }
        }

        // there's no previous view and there's no valid parent nav
        // to climb to so this shouldn't actually remove the leaving
        // view because there's nothing that would enter, eww
        leavingView.state = STATE_ACTIVE;
        done(false);

        return promise;
      }

      if (!opts.animation) {
        opts.animation = leavingView.getTransitionName(opts.direction);
      }

      // start the transition, fire resolve when done...
      this._transition(enteringView, leavingView, opts, done);

      return promise;
    }

    // no need to transition when the active view isn't being removed
    // there's still an active view after _remove() figured out states
    // so this means views that were only removed before the active
    // view, so auto-resolve since no transition needs to happen
    done(false);
    return promise;
  }

  /**
   * @private
   */
  _remove(startIndex: number, removeCount: number): ViewController {
    // when this is done, there should only be at most
    // 1 STATE_INIT_ENTER and 1 STATE_INIT_LEAVE
    // there should not be any that are STATE_ACTIVE after this is done
    let view: ViewController = null;

    // loop through each view that is set to be removed
    for (var i = startIndex, ii = removeCount + startIndex; i < ii; i++) {
      view = this.getByIndex(i);
      if (!view) break;

      if (view.state === STATE_TRANS_ENTER || view.state === STATE_TRANS_LEAVE) {
        // oh no!!! this view should be removed, but it's
        // actively transitioning in at the moment!!
        // since it's viewable right now, let's just set that
        // it should be removed after the transition
        view.state = STATE_REMOVE_AFTER_TRANS;

      } else if (view.state === STATE_INIT_ENTER) {
        // asked to be removed before it even entered!
        view.state = STATE_CANCEL_ENTER;

      } else {
        // if this view is already leaving then no need to immediately
        // remove it, otherwise set the remove state
        // this is useful if the view being removed isn't going to
        // animate out, but just removed from the stack, no transition
        view.state = STATE_REMOVE;
      }
    }

    if (view = this.getByState(STATE_INIT_LEAVE)) {
      // looks like there's already an active leaving view

      // reassign previous entering view to just be inactive
      let enteringView = this.getByState(STATE_INIT_ENTER);
      if (enteringView) {
        enteringView.state = STATE_INACTIVE;
      }

      // from the index of the leaving view, go backwards and
      // find the first view that is inactive
      for (var i = this.indexOf(view) - 1; i >= 0; i--) {
        if (this._views[i].state === STATE_INACTIVE) {
          this._views[i].state = STATE_INIT_ENTER;
          break;
        }
      }

    } else if (view = this.getByState(STATE_TRANS_LEAVE)) {
      // an active transition is happening, but a new transition
      // still needs to happen force this view to be the active one
      view.state = STATE_FORCE_ACTIVE;

    } else if (view = this.getByState(STATE_REMOVE)) {
      // there is no active transition about to happen
      // find the first view that is supposed to be removed and
      // set that it is the init leaving view
      // the first view to be removed, it should init leave
      view.state = STATE_INIT_LEAVE;
      view.fireWillUnload();
      this.viewWillUnload.emit(view);
      this._app.viewWillUnload.emit(view);

      // from the index of the leaving view, go backwards and
      // find the first view that is inactive so it can be the entering
      for (var i = this.indexOf(view) - 1; i >= 0; i--) {
        if (this._views[i].state === STATE_INACTIVE) {
          this._views[i].state = STATE_INIT_ENTER;
          break;
        }
      }
    }

    // if there is still an active view, then it wasn't one that was
    // set to be removed, so there actually won't be a transition at all
    view = this.getActive();
    if (view) {
      // the active view remains untouched, so all the removes
      // must have happened before it, so really no need for transition
      view = this.getByState(STATE_INIT_ENTER);
      if (view) {
        // if it was going to enter, then just make inactive
        view.state = STATE_INACTIVE;
      }
      view = this.getByState(STATE_INIT_LEAVE);
      if (view) {
        // this was going to leave, so just remove it completely
        view.state = STATE_REMOVE;
      }
    }

    // remove views that have been set to be removed, but not
    // apart of any transitions that will eventually happen
    this._views.filter(v => v.state === STATE_REMOVE).forEach(view => {
      view.fireWillLeave();
      view.fireDidLeave();
      this._views.splice(this.indexOf(view), 1);
      view.destroy();
    });

    return this.getByState(STATE_INIT_LEAVE);
  }

  /**
   * @private
   */
  _transition(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function) {
    let transId = ++this._transIds;

    if (enteringView === leavingView) {
      // if the entering view and leaving view are the same thing don't continue
      this._transFinish(transId, enteringView, leavingView, null, false, false);
      done(false);
      return;
    }

    if (isBlank(opts)) {
      opts = {};
    }

    this._setAnimate(opts);

    if (!leavingView) {
      // if no leaving view then create a bogus one
      leavingView = new ViewController();
    }

    if (!enteringView) {
      // if no entering view then create a bogus one
      enteringView = new ViewController();
      enteringView.fireLoaded();
    }

    /* Async steps to complete a transition
      1. _render: compile the view and render it in the DOM. Load page if it hasn't loaded already. When done call postRender
      2. _postRender: Run willEnter/willLeave, then wait a frame (change detection happens), then call beginTransition
      3. _beforeTrans: Create the transition's animation, play the animation, wait for it to end
      4. _afterTrans: Run didEnter/didLeave, call _transComplete()
      5. _transComplete: Cleanup, remove cache views, then call the final callback
    */

    // begin the multiple async process of transitioning to the entering view
    this._render(transId, enteringView, leavingView, opts, (hasCompleted: boolean) => {
      this._transFinish(transId, enteringView, leavingView, opts.direction, false, hasCompleted);
      done(hasCompleted);
    });
  }

  /**
   * @private
   */
  _setAnimate(opts: NavOptions) {
    if ((this._views.length === 1 && !this._init && !this._isPortal) || this.config.get('animate') === false) {
      opts.animate = false;
    }
  }

  /**
   * @private
   */
  _render(transId: number, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function) {
    // compile/load the view into the DOM

    if (enteringView.state === STATE_INACTIVE) {
      // this entering view is already set to inactive, so this
      // transition must be canceled, so don't continue
      return done();
    }

    enteringView.state = STATE_INIT_ENTER;
    leavingView.state = STATE_INIT_LEAVE;

    // remember if this nav is already transitioning or not
    let isAlreadyTransitioning = this.isTransitioning();

    if (enteringView.isLoaded()) {
      // already compiled this view, do not load again and continue
      this._postRender(transId, enteringView, leavingView, isAlreadyTransitioning, opts, done);

    } else {
      // view has not been compiled/loaded yet
      // continue once the view has finished compiling
      // DOM WRITE
      this.setTransitioning(true, 500);

      this.loadPage(enteringView, this._viewport, opts, () => {
        enteringView.fireLoaded();
        this.viewDidLoad.emit(enteringView);
        this._app.viewDidLoad.emit(enteringView);

        this._postRender(transId, enteringView, leavingView, isAlreadyTransitioning, opts, done);
      });
    }
  }

  /**
   * @private
   */
  _postRender(transId: number, enteringView: ViewController, leavingView: ViewController, isAlreadyTransitioning: boolean, opts: NavOptions, done: Function) {
    // called after _render has completed and the view is compiled/loaded

    if (enteringView.state === STATE_INACTIVE) {
      // this entering view is already set to inactive, so this
      // transition must be canceled, so don't continue
      return done();
    }

    if (!opts.preload) {
      // the enteringView will become the active view, and is not being preloaded

      // set the correct zIndex for the entering and leaving views
      // if there's already another trans_enter happening then
      // the zIndex for the entering view should go off of that one
      // DOM WRITE
      let lastestLeavingView = this.getByState(STATE_TRANS_ENTER) || leavingView;
      this._setZIndex(enteringView, lastestLeavingView, opts.direction);

      // make sure the entering and leaving views are showing
      // DOM WRITE
      if (isAlreadyTransitioning) {
        // the previous transition was still going when this one started
        // so to be safe, only update showing the entering/leaving
        // don't hide the others when they could still be transitioning
        enteringView.domShow(true, this._renderer);
        leavingView.domShow(true, this._renderer);

      } else {
        // there are no other transitions happening but this one
        // only entering/leaving should show, all others hidden
        // also if a view is an overlay or the previous view is an
        // overlay then always show the overlay and the view before it
        this._views.forEach(view => {
          view.domShow(this._isPortal || (view === enteringView) || (view === leavingView), this._renderer);
        });
      }

      // call each view's lifecycle events
      if (leavingView.fireOtherLifecycles) {
        // only fire entering lifecycle if the leaving
        // view hasn't explicitly set not to
        enteringView.fireWillEnter();
        this.viewWillEnter.emit(enteringView);
        this._app.viewWillEnter.emit(enteringView);
      }

      if (enteringView.fireOtherLifecycles) {
        // only fire leaving lifecycle if the entering
        // view hasn't explicitly set not to
        leavingView.fireWillLeave();
        this.viewWillLeave.emit(leavingView);
        this._app.viewWillLeave.emit(leavingView);
      }

    } else {
      // this view is being preloaded, don't call lifecycle events
      // transition does not need to animate
      opts.animate = false;
    }

    this._beforeTrans(enteringView, leavingView, opts, done);
  }

  /**
   * @private
   */
  _beforeTrans(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function) {
    // called after one raf from postRender()
    // create the transitions animation, play the animation
    // when the transition ends call wait for it to end

    if (enteringView.state === STATE_INACTIVE || enteringView.state === STATE_CANCEL_ENTER) {
      // this entering view is already set to inactive or has been canceled
      // so this transition must not begin, so don't continue
      return done();
    }

    enteringView.state = STATE_TRANS_ENTER;
    leavingView.state = STATE_TRANS_LEAVE;

    // everything during the transition should runOutsideAngular
    this._zone.runOutsideAngular(() => {

      // init the transition animation
      let transitionOpts = {
        animation: opts.animation,
        direction: opts.direction,
        duration: opts.duration,
        easing: opts.easing,
        renderDelay: opts.transitionDelay || this._trnsDelay,
        isRTL: this.config.platform.isRTL(),
        ev: opts.ev,
      };

      let transAnimation = this._createTrans(enteringView, leavingView, transitionOpts);

      this._trans && this._trans.destroy();
      this._trans = transAnimation;

      if (opts.animate === false) {
        // force it to not animate the elements, just apply the "to" styles
        transAnimation.duration(0);
      }

      // check if a parent is transitioning and get the time that it ends
      let parentTransitionEndTime = this.getLongestTrans(Date.now());
      if (parentTransitionEndTime > 0) {
        // the parent is already transitioning and has disabled the app
        // so just update the local transitioning information
        let duration = parentTransitionEndTime - Date.now();
        this.setTransitioning(true, duration);

      } else {
        // this is the only active transition (for now), so disable the app
        let keyboardDurationPadding = 0;
        if (this._keyboard.isOpen()) {
          // add XXms to the duration the app is disabled when the keyboard is open
          keyboardDurationPadding = 600;
        }
        let duration = transAnimation.getDuration() + keyboardDurationPadding;
        let enableApp = (duration < 64);
        this._app.setEnabled(enableApp, duration);
        this.setTransitioning(!enableApp, duration);
      }

      // create a callback for when the animation is done
      transAnimation.onFinish((trans: Transition) => {
        // transition animation has ended

        // destroy the animation and it's element references
        trans.destroy();

        this._afterTrans(enteringView, leavingView, opts, trans.hasCompleted, done);
      });

      // cool, let's do this, start the transition
      if (opts.progressAnimation) {
        // this is a swipe to go back, just get the transition progress ready
        // kick off the swipe animation start
        transAnimation.progressStart();

      } else {

        // this is a normal animation
        // kick it off and let it play through
        transAnimation.play();
      }
    });
  }

  /**
   * @private
   */
  _afterTrans(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, hasCompleted: boolean, done: Function) {
    // transition has completed, update each view's state
    // place back into the zone, run didEnter/didLeave
    // call the final callback when done

    // run inside of the zone again
    this._zone.run(() => {

      if (!opts.preload && hasCompleted) {
        if (leavingView.fireOtherLifecycles) {
          // only fire entering lifecycle if the leaving
          // view hasn't explicitly set not to
          enteringView.fireDidEnter();
          this.viewDidEnter.emit(enteringView);
          this._app.viewDidEnter.emit(enteringView);
        }

        if (enteringView.fireOtherLifecycles && this._init) {
          // only fire leaving lifecycle if the entering
          // view hasn't explicitly set not to
          // and after the nav has initialized
          leavingView.fireDidLeave();
          this.viewDidLeave.emit(leavingView);
          this._app.viewDidLeave.emit(leavingView);
        }
      }

      if (enteringView.state === STATE_INACTIVE) {
        // this entering view is already set to inactive, so this
        // transition must be canceled, so don't continue
        return done(hasCompleted);
      }

      if (opts.keyboardClose !== false && this._keyboard.isOpen()) {
        // the keyboard is still open!
        // no problem, let's just close for them
        this._keyboard.close();
        this._keyboard.onClose(() => {

          // keyboard has finished closing, transition complete
          done(hasCompleted);
        }, 32);

      } else {
        // all good, transition complete
        done(hasCompleted);
      }
    });
  }

  /**
   * @private
   */
  _transFinish(transId: number, enteringView: ViewController, leavingView: ViewController, direction: string, updateUrl: boolean, hasCompleted: boolean) {
    // a transition has completed, but not sure if it's the last one or not
    // check if this transition is the most recent one or not

    if (enteringView.state === STATE_CANCEL_ENTER) {
      // this view was told to leave before it finished entering
      this.remove(enteringView.index, 1);
    }

    if (transId === this._transIds) {
      // ok, good news, there were no other transitions that kicked
      // off during the time this transition started and ended

      if (hasCompleted) {
        // this transition has completed as normal
        // so the entering one is now the active view
        // and the leaving view is now just inactive
        if (enteringView.state !== STATE_REMOVE_AFTER_TRANS) {
          enteringView.state = STATE_ACTIVE;
        }
        if (leavingView.state !== STATE_REMOVE_AFTER_TRANS) {
          leavingView.state = STATE_INACTIVE;
        }

        // only need to do all this clean up if the transition
        // completed, otherwise nothing actually changed
        // destroy all of the views that come after the active view
        this._cleanup();

        // make sure only this entering view and PREVIOUS view are the
        // only two views that are not display:none
        // do not make any changes to the stack's current visibility
        // if there is an overlay somewhere in the stack
        leavingView = this.getPrevious(enteringView);
        if (this._isPortal) {
          // ensure the entering view is showing
          enteringView.domShow(true, this._renderer);

        } else {
          // only possibly hide a view if there are no overlays in the stack
          this._views.forEach(view => {
            view.domShow((view === enteringView) || (view === leavingView), this._renderer);
          });
        }

        // this check only needs to happen once, which will add the css
        // class to the nav when it's finished its first transition
        this._init = true;

      } else {
        // this transition has not completed, meaning the
        // entering view did not end up as the active view
        // this would happen when swipe to go back started
        // but the user did not complete the swipe and the
        // what was the active view stayed as the active view
        leavingView.state = STATE_ACTIVE;
        enteringView.state = STATE_INACTIVE;
      }

      // check if there is a parent actively transitioning
      let transitionEndTime = this.getLongestTrans(Date.now());
      // if transitionEndTime is greater than 0, there is a parent transition occurring
      // so delegate enabling the app to the parent.  If it <= 0, go ahead and enable the app
      if (transitionEndTime <= 0) {
        this._app && this._app.setEnabled(true);
      }

      // update that this nav is not longer actively transitioning
      this.setTransitioning(false);

      // see if we should add the swipe back gesture listeners or not
      this._sbCheck();

    } else {
      // darn, so this wasn't the most recent transition
      // so while this one did end, there's another more recent one
      // still going on. Because a new transition is happening,
      // then this entering view isn't actually going to be the active
      // one, so only update the state to active/inactive if the state
      // wasn't already updated somewhere else during its transition
      if (enteringView.state === STATE_TRANS_ENTER) {
        enteringView.state = STATE_INACTIVE;
      }
      if (leavingView.state === STATE_TRANS_LEAVE) {
        leavingView.state = STATE_INACTIVE;
      }
    }
  }

  /**
   *@private
   * This method is just a wrapper to the Transition function of same name
   * to make it easy/possible to mock the method call by overriding the function.
   * In testing we don't want to actually do the animation, we want to return a stub instead
   */
  _createTrans(enteringView: ViewController, leavingView: ViewController, transitionOpts: any): Transition {
    return Transition.createTransition(enteringView, leavingView, transitionOpts);
  }

  _cleanup() {
    // ok, cleanup time!! Destroy all of the views that are
    // INACTIVE and come after the active view
    let activeViewIndex = this.indexOf(this.getActive());
    let destroys = this._views.filter(v => v.state === STATE_REMOVE_AFTER_TRANS);

    for (var i = activeViewIndex + 1; i < this._views.length; i++) {
      if (this._views[i].state === STATE_INACTIVE) {
        destroys.push(this._views[i]);
      }
    }

    // all pages being destroyed should be removed from the list of
    // pages and completely removed from the dom
    destroys.forEach(view => {
      this._views.splice(this.indexOf(view), 1);
      view.destroy();
      this.viewDidUnload.emit(view);
      this._app.viewDidUnload.emit(view);
    });

    // if any z-index goes under 0, then reset them all
    let shouldResetZIndex = this._views.some(v => v.zIndex < 0);
    if (shouldResetZIndex) {
      this._views.forEach(view => {
        view.setZIndex(view.zIndex + INIT_ZINDEX + 1, this._renderer);
      });
    }
  }

  getActiveChildNav(): any {
    return this._children[this._children.length - 1];
  }

  /**
   * @private
   */
  registerChildNav(nav: any) {
    this._children.push(nav);
  }

  /**
   * @private
   */
  unregisterChildNav(nav: any) {
    let index = this._children.indexOf(nav);
    if (index > -1) {
      this._children.splice(index, 1);
    }
  }

  /**
   * @private
   */
  ngOnDestroy() {
    for (var i = this._views.length - 1; i >= 0; i--) {
      this._views[i].destroy();
    }
    this._views.length = 0;

    if (this.parent && this.parent.unregisterChildNav) {
      this.parent.unregisterChildNav(this);
    }
  }

  /**
   * @private
   */
  loadPage(view: ViewController, viewport: ViewContainerRef, opts: NavOptions, done: Function) {
    if (!viewport || !view.componentType) {
      return;
    }

    // TEMPORARY: automatically set selector w/ dah reflector
    // TODO: use componentFactory.create once fixed
    addSelector(view.componentType, 'ion-page');

    this._compiler.resolveComponent(view.componentType).then(componentFactory => {

      if (view.state === STATE_CANCEL_ENTER) {
        // view may have already been removed from the stack
        // if so, don't even bother adding it
        view.destroy();
        this._views.splice(view.index, 1);
        return;
      }

      // add more providers to just this page
      let componentProviders = ReflectiveInjector.resolve([
        provide(NavController, {useValue: this}),
        provide(ViewController, {useValue: view}),
        provide(NavParams, {useValue: view.getNavParams()})
      ]);

      let childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, this._viewport.parentInjector);

      let componentRef = componentFactory.create(childInjector, null, null);

      viewport.insert(componentRef.hostView, viewport.length);

      // a new ComponentRef has been created
      // set the ComponentRef's instance to its ViewController
      view.setInstance(componentRef.instance);

      // the component has been loaded, so call the view controller's loaded method to load any dependencies into the dom
      view.loaded(() => {

        // the ElementRef of the actual ion-page created
        let pageElementRef = componentRef.location;

        // remember the ChangeDetectorRef for this ViewController
        view.setChangeDetector(componentRef.changeDetectorRef);

        // remember the ElementRef to the ion-page elementRef that was just created
        view.setPageRef(pageElementRef);

        // auto-add page css className created from component JS class name
        let cssClassName = pascalCaseToDashCase(view.componentType.name);
        this._renderer.setElementClass(pageElementRef.nativeElement, cssClassName, true);

        view.onDestroy(() => {
          // ensure the element is cleaned up for when the view pool reuses this element
          this._renderer.setElementAttribute(pageElementRef.nativeElement, 'class', null);
          this._renderer.setElementAttribute(pageElementRef.nativeElement, 'style', null);
          componentRef.destroy();
        });

        // our job is done here
        done(view);
      });
    });
  }

  /**
   * @private
   */
  swipeBackStart() {
    // default the direction to "back"
    let opts: NavOptions = {
      direction: DIRECTION_BACK,
      progressAnimation: true
    };

    // figure out the states of each view in the stack
    let leavingView = this._remove(this._views.length - 1, 1);

    if (leavingView) {
      opts.animation = leavingView.getTransitionName(opts.direction);

      // get the view thats ready to enter
      let enteringView = this.getByState(STATE_INIT_ENTER);

      // start the transition, fire callback when done...
      this._transition(enteringView, leavingView, opts, (hasCompleted: boolean) => {
        // swipe back has finished!!
        console.debug('swipeBack, hasCompleted', hasCompleted);
      });
    }
  }

  /**
   * @private
   */
  swipeBackProgress(stepValue: number) {
    if (this._trans && this._sbGesture) {
      // continue to disable the app while actively dragging
      this._app.setEnabled(false, 4000);
      this.setTransitioning(true, 4000);

      // set the transition animation's progress
      this._trans.progressStep(stepValue);
    }
  }

  /**
   * @private
   */
  swipeBackEnd(shouldComplete: boolean, currentStepValue: number) {
    if (this._trans && this._sbGesture) {
      // the swipe back gesture has ended
      this._trans.progressEnd(shouldComplete, currentStepValue);
    }
  }

  /**
   * @private
   */
  _sbCheck() {
    if (this._sbEnabled) {
      // this nav controller can have swipe to go back

      if (!this._sbGesture) {
        // create the swipe back gesture if we haven't already
        let opts = {
          edge: 'left',
          threshold: this._sbThreshold
        };
        this._sbGesture = new SwipeBackGesture(this.getNativeElement(), opts, this, this._gestureCtrl);
      }

      if (this.canSwipeBack()) {
        // it is be possible to swipe back
        if (!this._sbGesture.isListening) {
          this._zone.runOutsideAngular(() => {
            // start listening if it's not already
            console.debug('swipeBack gesture, listen');
            this._sbGesture.listen();
          });
        }

      } else if (this._sbGesture.isListening) {
        // it should not be possible to swipe back
        // but the gesture is still listening
        console.debug('swipeBack gesture, unlisten');
        this._sbGesture.unlisten();
      }
    }
  }

  canSwipeBack(): boolean {
    return (this._sbEnabled && !this.isTransitioning() && this._app.isEnabled() && this.canGoBack());
  }

  canGoBack(): boolean {
    let activeView = this.getActive();
    if (activeView) {
      return activeView.enableBack();
    }
    return false;
  }

  isTransitioning(includeAncestors?: boolean): boolean {
    let now = Date.now();
    if (includeAncestors && this.getLongestTrans(now) > 0) {
      return true;
    }
    return (this.trnsTime > now);
  }

  setTransitioning(isTransitioning: boolean, fallback: number = 700) {
    this.trnsTime = (isTransitioning ? Date.now() + fallback : 0);
  }

  getLongestTrans(now: number) {
    // traverses parents upwards and looks at the time the
    // transition ends (if it's transitioning) and returns the
    // value that is the furthest into the future thus giving us
    // the longest transition duration
    let parentNav = <NavControllerBase>this.parent;
    let transitionEndTime = -1;
    while (parentNav) {
      if (parentNav.trnsTime > transitionEndTime) {
        transitionEndTime = parentNav.trnsTime;
      }
      parentNav = parentNav.parent;
    }

    // only check if the transitionTime is greater than the current time once
    return transitionEndTime > 0 && transitionEndTime > now ? transitionEndTime : 0;
  }

  getByState(state: number): ViewController {
    for (var i = this._views.length - 1; i >= 0; i--) {
      if (this._views[i].state === state) {
        return this._views[i];
      }
    }
    return null;
  }

  getByIndex(index: number): ViewController {
    return (index < this._views.length && index > -1 ? this._views[index] : null);
  }

  getActive(): ViewController {
    return this.getByState(STATE_ACTIVE);
  }

  isActive(view: ViewController): boolean {
    // returns if the given view is the active view or not
    return !!(view && view.state === STATE_ACTIVE);
  }

  getPrevious(view: ViewController): ViewController {
    // returns the view controller which is before the given view controller.
    return this.getByIndex(this.indexOf(view) - 1);
  }

  first(): ViewController {
    // returns the first view controller in this nav controller's stack.
    return (this._views.length ? this._views[0] : null);
  }

  last(): ViewController {
    // returns the last page in this nav controller's stack.
    return (this._views.length ? this._views[this._views.length - 1] : null);
  }

  indexOf(view: ViewController): number {
    // returns the index number of the given view controller.
    return this._views.indexOf(view);
  }

  length(): number {
    return this._views.length;
  }

  isSwipeBackEnabled(): boolean {
    return this._sbEnabled;
  }

  /**
   * DEPRECATED: Please use app.getRootNav() instead
   */
  private get rootNav(): NavController {
    // deprecated 07-14-2016 beta.11
    console.warn('nav.rootNav() has been deprecated, please use app.getRootNav() instead');
    return this._app.getRootNav();
  }

  /**
   * @private
   * Dismiss all pages which have set the `dismissOnPageChange` property.
   */
  dismissPageChangeViews() {
    this._views.forEach(view => {
      if (view.data && view.data.dismissOnPageChange) {
        view.dismiss();
      }
    });
  }

  /**
   * @private
   */
  _setZIndex(enteringView: ViewController, leavingView: ViewController, direction: string) {
    if (enteringView) {
      // get the leaving view, which could be in various states
      if (!leavingView || !leavingView.isLoaded()) {
        // the leavingView is a mocked view, either we're
        // actively transitioning or it's the initial load

        var previousView = this.getPrevious(enteringView);
        if (previousView && previousView.isLoaded()) {
          // we found a better previous view to reference
          // use this one instead
          enteringView.setZIndex(previousView.zIndex + 1, this._renderer);

        } else {
          // this is the initial view
          enteringView.setZIndex(this._isPortal ? PORTAL_ZINDEX : INIT_ZINDEX, this._renderer);
        }

      } else if (direction === DIRECTION_BACK) {
        // moving back
        enteringView.setZIndex(leavingView.zIndex - 1, this._renderer);

      } else {
        // moving forward
        enteringView.setZIndex(leavingView.zIndex + 1, this._renderer);
      }
    }
  }

}

export const isTabs = (nav: any) => {
  // Tabs (ion-tabs)
  return !!nav.getSelected;
};

export const isTab = (nav: any) => {
  // Tab (ion-tab)
  return isPresent(nav._tabId);
};

export const isNav = function(nav: any) {
  // Nav (ion-nav), Tab (ion-tab), Portal (ion-portal)
  return isPresent(nav.push);
};


export const STATE_ACTIVE = 1;
export const STATE_INACTIVE = 2;
export const STATE_INIT_ENTER = 3;
export const STATE_INIT_LEAVE = 4;
export const STATE_TRANS_ENTER = 5;
export const STATE_TRANS_LEAVE = 6;
export const STATE_REMOVE = 7;
export const STATE_REMOVE_AFTER_TRANS = 8;
export const STATE_CANCEL_ENTER = 9;
export const STATE_FORCE_ACTIVE = 10;

const INIT_ZINDEX = 100;
const PORTAL_ZINDEX = 9999;

let ctrlIds = -1;