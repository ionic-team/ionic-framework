import { ComponentFactoryResolver, ElementRef, EventEmitter, NgZone, ReflectiveInjector, Renderer, ViewContainerRef } from '@angular/core';

import { AnimationOptions } from '../animations/animation';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { isTabs, setZIndex } from './nav-util';
import { DeepLinker } from './deep-linker';
import { GestureController } from '../gestures/gesture-controller';
import { isBlank, isPresent, isString, pascalCaseToDashCase } from '../util/util';
import { Ion } from '../components/ion';
import { Keyboard } from '../util/keyboard';
import { NavController } from './nav-controller';
import { NavOptions, DIRECTION_BACK, DIRECTION_FORWARD, STATE_ACTIVE, STATE_INACTIVE, STATE_INIT_ENTER, STATE_INIT_LEAVE, STATE_TRANS_ENTER, STATE_TRANS_LEAVE, STATE_REMOVE, STATE_REMOVE_AFTER_TRANS, STATE_CANCEL_ENTER, STATE_FORCE_ACTIVE, INIT_ZINDEX, PORTAL_ZINDEX } from './nav-util';
import { NavParams } from './nav-params';
import { SwipeBackGesture } from './swipe-back';
import { Transition } from '../transitions/transition';
import { TransitionController } from '../transitions/transition-controller';
import { ViewController } from './view-controller';


/**
 * @private
 * This class is for internal use only. It is not exported publicly.
 */
export class NavControllerBase extends Ion implements NavController {
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
  rootTransId: string = null;

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
    public _cfr: ComponentFactoryResolver,
    public _gestureCtrl: GestureController,
    public _transCtrl: TransitionController,
    public _linker: DeepLinker
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

  setRoot(page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this.setPages([{page, params}], opts, done);
  }

  setPages(pages: Array<{page: any, params?: any}>, opts?: NavOptions, done?: Function): Promise<any> {
    let promise: Promise<any>;

    if (!done) {
      promise = new Promise(resolve => { done = resolve; });
    }

    if (!pages || !pages.length) {
      done();
      return promise;
    }

    if (!done) {
      promise = new Promise(resolve => { done = resolve; });
    }

    // remove existing views
    const leavingView = this._remove(0, this._views.length);

    // create view controllers out of the pages and insert the new views
    const views = pages.map(p => new ViewController(p.page, p.params));
    const enteringView = this._insert(0, views);

    if (isBlank(opts)) {
      opts = {};
    }

    // if animation wasn't set to true then default it to NOT animate
    if (opts.animate !== true) {
      opts.animate = false;
    }

    // set the nav direction to "back" if it wasn't set
    opts.direction = opts.direction || DIRECTION_BACK;

    if (!opts.animation) {
      opts.animation = leavingView.getTransitionName(opts.direction);
    }

    // start the transition, fire resolve when done...
    this._transition(enteringView, leavingView, opts, done);

    return promise;
  }

  push(page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this.insertPages(-1, [{page: page, params: params}], opts, done);
  }

  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any> {
    return this.insertPages(insertIndex, [{page: page, params: params}], opts, done);
  }

  insertPages(insertIndex: number, insertPages: Array<{page: any, params?: any}>, opts?: NavOptions, done?: Function): Promise<any> {
    const views = insertPages.map(p => new ViewController(p.page, p.params));
    return this.insertViews(insertIndex, views, opts, done);
  }

  insertViews(insertIndex: number, insertViews: ViewController[], opts: NavOptions = {}, done?: Function) {
    let promise: Promise<any>;
    if (!done) {
      // only create a promise if a done callback wasn't provided
      promise = new Promise(res => { done = res; });
    }

    insertViews = insertViews.filter(v => v !== null);

    if (!insertViews || !insertViews.length) {
      done(false);
      return promise;
    }

    if (isBlank(opts)) {
      opts = {};
    }

    // insert the new page into the stack
    // returns the newly created entering view
    const enteringView = this._insert(insertIndex, insertViews);

    // manually set the new view's id if an id was passed in the options
    if (isPresent(opts.id)) {
      enteringView.id = opts.id;
    }

    // set the nav direction to "forward" if it wasn't set
    opts.direction = opts.direction || DIRECTION_FORWARD;

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
          var leavingView = this.getByState(STATE_INIT_LEAVE);
          if (!leavingView && this._isPortal) {
            // if we didn't find an active view, and this is a portal
            var activeNav = <NavControllerBase>this._app.getActiveNav();
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
      view._setNav(this);
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
    const activeView = this.getByState(STATE_TRANS_ENTER) ||
                     this.getByState(STATE_INIT_ENTER) ||
                     this.getActive();

    return this.remove(this.indexOf(activeView), 1, opts, done);
  }

  popToRoot(opts?: NavOptions, done?: Function): Promise<any> {
    return this.popTo(this.first(), opts, done);
  }

  popTo(view: ViewController, opts?: NavOptions, done?: Function): Promise<any> {
    const startIndex = this.indexOf(view);

    const activeView = this.getByState(STATE_TRANS_ENTER) ||
                       this.getByState(STATE_INIT_ENTER) ||
                       this.getActive();
    const removeCount = this.indexOf(activeView) - startIndex;

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
    const leavingView = this._remove(startIndex, removeCount);

    if (!leavingView) {
      const forcedActive = this.getByState(STATE_FORCE_ACTIVE);
      if (forcedActive) {
        // this scenario happens when a remove is going on
        // during a transition
        if (this._trans) {
          this._trans.stop();
          this._trans.destroy();
          this._trans = null;
          // ******** DOM WRITE ****************
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
          let parentNav = this.parent;
          while (parentNav) {
            if (!isTabs(parentNav)) {
              // Tabs can be a parent, but it is not a collection of views
              // only we're looking for an actual NavController w/ stack of views
              leavingView._fireWillLeave();
              this.viewWillLeave.emit(leavingView);
              this._app.viewWillLeave.emit(leavingView);

              return parentNav.pop(opts).then((rtnVal: boolean) => {
                leavingView._fireDidLeave();
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

    } else {
      // no need to transition when the active view isn't being removed
      // there's still an active view after _remove() figured out states
      // so this means views that were only removed before the active
      // view, so auto-resolve since no transition needs to happen
      done(false);
    }

    return promise;
  }

  _remove(startIndex: number, removeCount: number): ViewController {
    // when this is done, there should only be at most
    // 1 STATE_INIT_ENTER and 1 STATE_INIT_LEAVE
    // there should not be any that are STATE_ACTIVE after this is done
    // loop through each view that is set to be removed
    for (var i = startIndex, ii = removeCount + startIndex; i < ii; i++) {
      var view = this.getByIndex(i);
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
      const enteringView = this.getByState(STATE_INIT_ENTER);
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
      view._fireWillUnload();
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
      view._fireWillLeave();
      view._fireDidLeave();
      this._views.splice(this.indexOf(view), 1);
      view._destroy();
    });

    return this.getByState(STATE_INIT_LEAVE);
  }

  _transition(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function) {
    if (enteringView === leavingView || enteringView.state === STATE_INACTIVE || enteringView.state === STATE_CANCEL_ENTER) {
      // if the entering view and leaving view are the same thing don't continue
      // this entering view is already set to inactive or has been canceled
      // so this transition must not begin, so don't continue
      done(false);
      return;
    }

    // destroy the previous transition if it still existed
    this._trans && this._trans.destroy();

    if (!leavingView) {
      // if no leaving view then create a bogus one
      leavingView = new ViewController();
    }

    if (!enteringView) {
      // if no entering view then create a bogus one
      enteringView = new ViewController();
      enteringView._fireLoaded();
    }

    // figure out if this transition is the root one or a
    // child of a parent nav that has the root transition
    let transId = this.rootTransId = this._transCtrl.getRootTransId(this);
    const isRootTransition = (this.rootTransId === null);
    if (isRootTransition) {
      // this is the root transition, meaning all child navs and their views
      // should be added as a child transition to this one
      transId = this.rootTransId = Date.now().toString();
    }

    // create the transition animation from the TransitionController
    // this will either create the root transition, or add it as a child transition
    const trans = this._trans = this._transCtrl.get(transId, opts.animation);

    // render the entering view, and all child navs and views
    // ******** DOM WRITE ****************
    this._render(enteringView, leavingView, opts);

    // if this is the root transition, then at this point
    // all child navs and views have been rendered, so we can
    // safely reset this back to false for the next transition
    this.rootTransId = null;

    // ******** DOM WRITE ****************
    this._beforeTrans(trans, isRootTransition, enteringView, leavingView, opts, (hasCompleted: boolean) => {
      // ******** DOM WRITE ****************
      this._transFinish(transId, isRootTransition, enteringView, leavingView, opts.direction, true, hasCompleted);
      done(hasCompleted);
    });
  }

  /**
   * DOM WRITE
   */
  _render(enteringView: ViewController, leavingView: ViewController, opts: NavOptions) {
    // set the state of these views that they are initialized to enter/leave
    enteringView.state = STATE_INIT_ENTER;
    leavingView.state = STATE_INIT_LEAVE;

    if (!enteringView._isLoaded()) {
      // entering view has not been loaded yet
      // continue once the view has finished loading
      // ******** DOM WRITE ****************
      this._createPage(enteringView, this._viewport);

      // successfully finished loading the entering view
      // fire off the "loaded" lifecycle events
      enteringView._fireLoaded();
      this.viewDidLoad.emit(enteringView);
      this._app.viewDidLoad.emit(enteringView);
    }

    if (!opts.preload) {
      // the enteringView will become the active view, and is not being preloaded

      // set the correct zIndex for the entering and leaving views
      // if there's already another transition happening then
      // the zIndex for the entering view should go off of that one
      // DOM WRITE
      let lastestLeavingView = this.getByState(STATE_TRANS_ENTER) || leavingView;
      setZIndex(this, enteringView, lastestLeavingView, opts.direction, this._renderer);

      // make sure the entering and leaving views are showing
      if (this._transCtrl.multipleActiveTrans()) {
        // the previous transition was still going when this one started
        // so to be safe, only update showing the entering/leaving
        // don't hide the others when they could still be transitioning
        // ******** DOM WRITE ****************
        enteringView._domShow(true, true, this._renderer);
        leavingView._domShow(true, true, this._renderer);

      } else {
        // there are no other transitions happening but this one
        // only entering/leaving should show, all others hidden
        // also if a view is an overlay or the previous view is an
        // overlay then always show the overlay and the view before it
        // ******** DOM WRITE ****************
        this._domShow(enteringView, leavingView);
      }

    } else {
      // a nav can be preloaded, but when it is preloaded then
      // all of the code above does not need to be called so
      // don't call lifecycle events, transition does not need to animate
      opts.animate = false;
    }
  }

  /**
   * DOM WRITE
   */
  _createPage(view: ViewController, viewport: ViewContainerRef) {
    // add more providers to just this page
    const componentProviders = ReflectiveInjector.resolve([
      { provide: NavController, useValue: this },
      { provide: ViewController, useValue: view },
      { provide: NavParams, useValue: view.getNavParams() }
    ]);

    const componentFactory = this._cfr.resolveComponentFactory(view.componentType);
    const childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, this._viewport.parentInjector);

    // ******** DOM WRITE ****************
    const componentRef = viewport.createComponent(componentFactory, viewport.length, childInjector, []);

    // the ElementRef of the actual ion-page created
    const pageElementRef = componentRef.location;

    // ******** DOM WRITE ****************
    this._renderer.setElementClass(pageElementRef.nativeElement, 'ion-page', true);

    // remember the ElementRef to the ion-page elementRef that was just created
    view._setPageElementRef(pageElementRef);

    // set the ComponentRef's instance to its ViewController
    view._setInstance(componentRef.instance);

    // remember the ChangeDetectorRef for this ViewController
    view._setChangeDetector(componentRef.changeDetectorRef);

    // auto-add page css className created from component JS class name
    // ******** DOM WRITE ****************
    const cssClassName = pascalCaseToDashCase(view.componentType.name);
    this._renderer.setElementClass(pageElementRef.nativeElement, cssClassName, true);

    view._onDestroy(() => {
      // ensure the element is cleaned up for when the view pool reuses this element
      // ******** DOM WRITE ****************
      this._renderer.setElementAttribute(pageElementRef.nativeElement, 'class', null);
      this._renderer.setElementAttribute(pageElementRef.nativeElement, 'style', null);
      componentRef.destroy();
    });

    componentRef.changeDetectorRef.detectChanges();
  }

  /**
   * DOM WRITE
   */
  _beforeTrans(trans: Transition, isRootTransition: boolean, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function) {
    // called after one raf from postRender()
    // create the transitions animation, play the animation
    // when the transition ends call wait for it to end
    enteringView.state = STATE_TRANS_ENTER;
    leavingView.state = STATE_TRANS_LEAVE;

    // create the transition options
    const animationOpts: AnimationOptions = {
      animation: opts.animation,
      direction: opts.direction,
      duration: (opts.animate === false ? 0 : opts.duration),
      easing: opts.easing,
      renderDelay: opts.transitionDelay || this._trnsDelay,
      isRTL: this.config.platform.isRTL(),
      ev: opts.ev,
    };

    trans.init(enteringView, leavingView, animationOpts);

    if ((!this._init && this._views.length === 1 && !this._isPortal) || this.config.get('animate') === false) {
      // the initial load shouldn't animate, unless it's a portal
      opts.animate = false;
    }
    if (opts.animate === false) {
      trans.duration(0);
    }

    if (!opts.preload) {
      trans.beforeAddRead(() => {
        this._zone.run(() => {
          // call each view's lifecycle events
          if (leavingView.fireOtherLifecycles) {
            // only fire entering lifecycle if the leaving
            // view hasn't explicitly set not to
            enteringView._fireWillEnter();
            this.viewWillEnter.emit(enteringView);
            this._app.viewWillEnter.emit(enteringView);
          }

          if (enteringView.fireOtherLifecycles) {
            // only fire leaving lifecycle if the entering
            // view hasn't explicitly set not to
            leavingView._fireWillLeave();
            this.viewWillLeave.emit(leavingView);
            this._app.viewWillLeave.emit(leavingView);
          }
        });
      });
    }

    // create a callback for when the animation is done
    trans.onFinish((t: Transition) => {
      // transition animation has ended
      // hasCompleted means if like the progress when from 0 to 1
      this._zone.run(() => {
        this._afterTrans(enteringView, leavingView, opts, t.hasCompleted, done);
      });
    });

    if (isRootTransition) {
      // this is the top most, or only active transition, so disable the app
      // add XXms to the duration the app is disabled when the keyboard is open
      const keyboardDurationPadding = (this._keyboard.isOpen() ? 600 : 0);
      const duration = trans.getDuration() + keyboardDurationPadding;
      const enableApp = (duration < 64);

      this._app.setEnabled(enableApp, duration);
      this.setTransitioning(!enableApp, duration);

      // cool, let's do this, start the transition
      if (opts.progressAnimation) {
        // this is a swipe to go back, just get the transition progress ready
        // kick off the swipe animation start
        trans.progressStart();

      } else {
        // this is a normal animation
        // kick it off and let it play through
        // ******** DOM WRITE ****************
        trans.play();
      }
    }
  }

  _afterTrans(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, hasCompleted: boolean, done: Function) {
    // transition has completed, update each view's state
    // place back into the zone, run didEnter/didLeave
    // call the final callback when done

    // run inside of the zone again
    if (!opts.preload && hasCompleted) {
      if (leavingView.fireOtherLifecycles) {
        // only fire entering lifecycle if the leaving
        // view hasn't explicitly set not to
        enteringView._fireDidEnter();
        this.viewDidEnter.emit(enteringView);
        this._app.viewDidEnter.emit(enteringView);
      }

      if (enteringView.fireOtherLifecycles && this._init) {
        // only fire leaving lifecycle if the entering
        // view hasn't explicitly set not to
        // and after the nav has initialized
        leavingView._fireDidLeave();
        this.viewDidLeave.emit(leavingView);
        this._app.viewDidLeave.emit(leavingView);
      }
    }

    if (enteringView.state === STATE_INACTIVE) {
      // this entering view is already set to inactive, so this
      // transition must be canceled, so don't continue
      done(hasCompleted);

    } else if (opts.keyboardClose !== false && this._keyboard.isOpen()) {
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
  }

  /**
   * DOM WRITE
   */
  _transFinish(transId: string, isRootTransition: boolean, enteringView: ViewController, leavingView: ViewController, direction: string, updateUrl: boolean, hasCompleted: boolean) {
    // a transition has completed, but not sure if it's the last one or not
    // check if this transition is the most recent one or not

    if (enteringView.state === STATE_CANCEL_ENTER) {
      // this view was told to leave before it finished entering
      this.remove(enteringView.index, 1);
    }

    if (this._transCtrl.isMostRecent(transId)) {
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

        if (isRootTransition) {
          // only need to do all this clean up if the transition
          // completed, otherwise nothing actually changed
          // destroy all of the views that come after the active view
          // ******** DOM WRITE ****************
          this._cleanup();

          // make sure only this entering view and PREVIOUS view are the
          // only two views that are not display:none
          // do not make any changes to the stack's current visibility
          // if there is an overlay somewhere in the stack
          leavingView = this.getPrevious(enteringView);
          if (this._isPortal) {
            // ensure the entering view is showing
            // ******** DOM WRITE ****************
            enteringView._domShow(true, true, this._renderer);

          } else {
            // only possibly hide a view if there are no overlays in the stack
            // ******** DOM WRITE ****************
            this._domShow(enteringView, leavingView);
          }
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

      // only the top most transition should handle enabling the app
      if (isRootTransition) {
        // the transition has completed, safe to enable the app again
        this._app.setEnabled(true);

        // update that this nav is not longer actively transitioning
        this.setTransitioning(false);
      }

      if (direction !== null && hasCompleted && updateUrl !== false && !this._isPortal && this._linker) {
        // notify deep linker of the state change if a direction was provided
        this._linker.navChange(this, enteringView, direction, this.isTransitioning(), isRootTransition);
      }

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

    if (isRootTransition) {
      // only destroy the root transition, which will end up
      // destroying all child transitions too
      this._transCtrl.destroy(transId);
    }
  }

  /**
   * DOM WRITE
   */
  _cleanup() {
    // ok, cleanup time!! Destroy all of the views that are
    // INACTIVE and come after the active view
    const activeViewIndex = this.indexOf(this.getActive());
    const destroys = this._views.filter(v => v.state === STATE_REMOVE_AFTER_TRANS);

    for (var i = activeViewIndex + 1; i < this._views.length; i++) {
      if (this._views[i].state === STATE_INACTIVE) {
        destroys.push(this._views[i]);
      }
    }

    // all pages being destroyed should be removed from the list of
    // pages and completely removed from the dom
    destroys.forEach(view => {
      this._views.splice(this.indexOf(view), 1);
      view._destroy();
      this.viewDidUnload.emit(view);
      this._app.viewDidUnload.emit(view);
    });

    // if any z-index goes under 0, then reset them all
    const shouldResetZIndex = this._views.some(v => v.zIndex < 0);
    if (shouldResetZIndex) {
      this._views.forEach(view => {
        // ******** DOM WRITE ****************
        view._setZIndex(view.zIndex + INIT_ZINDEX + 1, this._renderer);
      });
    }
  }

  /**
   * DOM WRITE
   */
  _domShow(enteringView: ViewController, leavingView: ViewController) {
    let view: ViewController;
    for (var i = 0; i < this._views.length; i++) {
      view = this._views[i];
      var shouldShow = this._isPortal || (view === enteringView);
      var shouldRender = shouldShow || (view === leavingView);
      // ******** DOM WRITE ****************
      view._domShow(shouldShow, shouldRender, this._renderer);
    }
  }

  getActiveChildNav(): any {
    return this._children[this._children.length - 1];
  }

  registerChildNav(nav: any) {
    this._children.push(nav);
  }

  unregisterChildNav(nav: any) {
    const index = this._children.indexOf(nav);
    if (index > -1) {
      this._children.splice(index, 1);
    }
  }

  ngOnDestroy() {
    for (var i = this._views.length - 1; i >= 0; i--) {
      this._views[i]._destroy();
    }
    this._views.length = 0;

    if (this.parent && this.parent.unregisterChildNav) {
      this.parent.unregisterChildNav(this);
    }
  }

  swipeBackStart() {
    // default the direction to "back"
    const opts: NavOptions = {
      direction: DIRECTION_BACK,
      progressAnimation: true
    };

    // figure out the states of each view in the stack
    const leavingView = this._remove(this._views.length - 1, 1);

    if (leavingView) {
      opts.animation = leavingView.getTransitionName(opts.direction);

      // get the view thats ready to enter
      const enteringView = this.getByState(STATE_INIT_ENTER);

      // start the transition, fire callback when done...
      this._transition(enteringView, leavingView, opts, (hasCompleted: boolean) => {
        // swipe back has finished!!
        console.debug('swipeBack, hasCompleted', hasCompleted);
      });
    }
  }

  swipeBackProgress(stepValue: number) {
    if (this._trans && this._sbGesture) {
      // continue to disable the app while actively dragging
      this._app.setEnabled(false, 4000);
      this.setTransitioning(true, 4000);

      // set the transition animation's progress
      this._trans.progressStep(stepValue);
    }
  }

  swipeBackEnd(shouldComplete: boolean, currentStepValue: number) {
    if (this._trans && this._sbGesture) {
      // the swipe back gesture has ended
      this._trans.progressEnd(shouldComplete, currentStepValue);
    }
  }

  _sbCheck() {
    if (this._sbEnabled) {
      // this nav controller can have swipe to go back

      if (!this._sbGesture) {
        // create the swipe back gesture if we haven't already
        const opts = {
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
    const activeView = this.getActive();
    return (activeView && activeView.enableBack()) || false;
  }

  isTransitioning(): boolean {
    let transitionEndTime = this.trnsTime;
    let parent = this.parent;
    while (parent) {
      if (parent.trnsTime > transitionEndTime) {
        transitionEndTime = parent.trnsTime;
      }
      parent = parent.parent;
    }

    return (transitionEndTime > Date.now());
  }

  setTransitioning(isTransitioning: boolean, fallback: number = 700) {
    this.trnsTime = (isTransitioning ? Date.now() + fallback : 0);
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

  getActive(includeEntering?: boolean): ViewController {
    if (includeEntering) {
      return this.getByState(STATE_TRANS_ENTER) ||
             this.getByState(STATE_INIT_ENTER) ||
             this.getByState(STATE_ACTIVE);
    }
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

  dismissPageChangeViews() {
    this._views.forEach(view => {
      if (view.data && view.data.dismissOnPageChange) {
        view.dismiss();
      }
    });
  }


  /**
   * @private
   * DEPRECATED: Please use app.getRootNav() instead
   */
  private get rootNav(): NavController {
    // deprecated 07-14-2016 beta.11
    console.warn('nav.rootNav() has been deprecated, please use app.getRootNav() instead');
    return this._app.getRootNav();
  }

  /**
   * @private
   * DEPRECATED: Please use inject the overlays controller and use the present method on the instance instead.
   */
  private present(enteringView: ViewController, opts?: NavOptions): Promise<any> {
    // deprecated warning: added beta.11 2016-06-27
    console.warn('nav.present() has been deprecated.\n' +
                 'Please inject the overlay\'s controller and use the present method on the instance instead.');
    return Promise.resolve();
  }

}

let ctrlIds = -1;
