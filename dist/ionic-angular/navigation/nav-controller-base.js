var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { EventEmitter, Input, ReflectiveInjector } from '@angular/core';
import { DIRECTION_BACK, DIRECTION_FORWARD, INIT_ZINDEX, STATE_ATTACHED, STATE_DESTROYED, STATE_INITIALIZED, STATE_NEW, convertToViews, } from './nav-util';
import { setZIndex } from './nav-util';
import { isBlank, isNumber, isPresent, isTrueProperty } from '../util/util';
import { ViewController, isViewController } from './view-controller';
import { Ion } from '../components/ion';
import { NavController } from './nav-controller';
import { NavParams } from './nav-params';
import { SwipeBackGesture } from './swipe-back';
/**
 * @hidden
 * This class is for internal use only. It is not exported publicly.
 */
var NavControllerBase = (function (_super) {
    __extends(NavControllerBase, _super);
    /**
     * @param {?} parent
     * @param {?} _app
     * @param {?} config
     * @param {?} plt
     * @param {?} elementRef
     * @param {?} _zone
     * @param {?} renderer
     * @param {?} _cfr
     * @param {?} _gestureCtrl
     * @param {?} _trnsCtrl
     * @param {?} _linker
     * @param {?} _domCtrl
     * @param {?} _errHandler
     */
    function NavControllerBase(parent, _app, config, plt, elementRef, _zone, renderer, _cfr, _gestureCtrl, _trnsCtrl, _linker, _domCtrl, _errHandler) {
        var _this = _super.call(this, config, elementRef, renderer) || this;
        _this.parent = parent;
        _this._app = _app;
        _this.config = config;
        _this.plt = plt;
        _this._zone = _zone;
        _this._cfr = _cfr;
        _this._gestureCtrl = _gestureCtrl;
        _this._trnsCtrl = _trnsCtrl;
        _this._linker = _linker;
        _this._domCtrl = _domCtrl;
        _this._errHandler = _errHandler;
        _this._ids = -1;
        _this._init = false;
        _this._queue = [];
        _this._trnsId = null;
        _this._trnsTm = false;
        _this._views = [];
        _this._zIndexOffset = 0;
        _this.viewDidLoad = new EventEmitter();
        _this.viewWillEnter = new EventEmitter();
        _this.viewDidEnter = new EventEmitter();
        _this.viewWillLeave = new EventEmitter();
        _this.viewDidLeave = new EventEmitter();
        _this.viewWillUnload = new EventEmitter();
        _this._sbEnabled = config.getBoolean('swipeBackEnabled');
        _this._children = [];
        _this.id = 'n' + (++ctrlIds);
        _this._destroyed = false;
        return _this;
    }
    Object.defineProperty(NavControllerBase.prototype, "swipeBackEnabled", {
        /**
         * @return {?}
         */
        get: function () {
            return this._sbEnabled;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._sbEnabled = isTrueProperty(val);
            this._swipeBackCheck();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} page
     * @param {?=} params
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    NavControllerBase.prototype.push = function (page, params, opts, done) {
        return this._queueTrns({
            insertStart: -1,
            insertViews: [{ page: page, params: params }],
            opts: opts,
        }, done);
    };
    /**
     * @param {?} insertIndex
     * @param {?} page
     * @param {?=} params
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    NavControllerBase.prototype.insert = function (insertIndex, page, params, opts, done) {
        return this._queueTrns({
            insertStart: insertIndex,
            insertViews: [{ page: page, params: params }],
            opts: opts,
        }, done);
    };
    /**
     * @param {?} insertIndex
     * @param {?} insertPages
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    NavControllerBase.prototype.insertPages = function (insertIndex, insertPages, opts, done) {
        return this._queueTrns({
            insertStart: insertIndex,
            insertViews: insertPages,
            opts: opts,
        }, done);
    };
    /**
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    NavControllerBase.prototype.pop = function (opts, done) {
        return this._queueTrns({
            removeStart: -1,
            removeCount: 1,
            opts: opts,
        }, done);
    };
    /**
     * @param {?} indexOrViewCtrl
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    NavControllerBase.prototype.popTo = function (indexOrViewCtrl, opts, done) {
        var /** @type {?} */ config = {
            removeStart: -1,
            removeCount: -1,
            opts: opts
        };
        if (isViewController(indexOrViewCtrl)) {
            config.removeView = indexOrViewCtrl;
            config.removeStart = 1;
        }
        else if (isNumber(indexOrViewCtrl)) {
            config.removeStart = indexOrViewCtrl + 1;
        }
        return this._queueTrns(config, done);
    };
    /**
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    NavControllerBase.prototype.popToRoot = function (opts, done) {
        return this._queueTrns({
            removeStart: 1,
            removeCount: -1,
            opts: opts,
        }, done);
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.popAll = function () {
        var /** @type {?} */ promises = [];
        for (var /** @type {?} */ i = this._views.length - 1; i >= 0; i--) {
            promises.push(this.pop(null));
        }
        return Promise.all(promises);
    };
    /**
     * @param {?} startIndex
     * @param {?=} removeCount
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    NavControllerBase.prototype.remove = function (startIndex, removeCount, opts, done) {
        if (removeCount === void 0) { removeCount = 1; }
        return this._queueTrns({
            removeStart: startIndex,
            removeCount: removeCount,
            opts: opts,
        }, done);
    };
    /**
     * @param {?} viewController
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    NavControllerBase.prototype.removeView = function (viewController, opts, done) {
        return this._queueTrns({
            removeView: viewController,
            removeStart: 0,
            removeCount: 1,
            opts: opts,
        }, done);
    };
    /**
     * @param {?} pageOrViewCtrl
     * @param {?=} params
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    NavControllerBase.prototype.setRoot = function (pageOrViewCtrl, params, opts, done) {
        return this.setPages([{ page: pageOrViewCtrl, params: params }], opts, done);
    };
    /**
     * @param {?} viewControllers
     * @param {?=} opts
     * @param {?=} done
     * @return {?}
     */
    NavControllerBase.prototype.setPages = function (viewControllers, opts, done) {
        if (isBlank(opts)) {
            opts = {};
        }
        // if animation wasn't set to true then default it to NOT animate
        if (opts.animate !== true) {
            opts.animate = false;
        }
        return this._queueTrns({
            insertStart: 0,
            insertViews: viewControllers,
            removeStart: 0,
            removeCount: -1,
            opts: opts
        }, done);
    };
    /**
     * @param {?} ti
     * @param {?} done
     * @return {?}
     */
    NavControllerBase.prototype._queueTrns = function (ti, done) {
        var /** @type {?} */ promise = new Promise(function (resolve, reject) {
            ti.resolve = resolve;
            ti.reject = reject;
        });
        ti.done = done;
        // Normalize empty
        if (ti.insertViews && ti.insertViews.length === 0) {
            ti.insertViews = undefined;
        }
        // Enqueue transition instruction
        this._queue.push(ti);
        // if there isn't a transition already happening
        // then this will kick off this transition
        this._nextTrns();
        return promise;
    };
    /**
     * @param {?} result
     * @param {?} ti
     * @return {?}
     */
    NavControllerBase.prototype._success = function (result, ti) {
        if (this._queue === null) {
            this._fireError('nav controller was destroyed', ti);
            return;
        }
        this._init = true;
        this._trnsId = null;
        // ensure we're not transitioning here
        this.setTransitioning(false);
        this._swipeBackCheck();
        // let's see if there's another to kick off
        this._nextTrns();
        if (ti.done) {
            ti.done(result.hasCompleted, result.requiresTransition, result.enteringName, result.leavingName, result.direction);
        }
        ti.resolve(result.hasCompleted);
    };
    /**
     * @param {?} rejectReason
     * @param {?} ti
     * @return {?}
     */
    NavControllerBase.prototype._failed = function (rejectReason, ti) {
        if (this._queue === null) {
            this._fireError('nav controller was destroyed', ti);
            return;
        }
        this._trnsId = null;
        this._queue.length = 0;
        // let's see if there's another to kick off
        this.setTransitioning(false);
        this._swipeBackCheck();
        this._nextTrns();
        this._fireError(rejectReason, ti);
    };
    /**
     * @param {?} rejectReason
     * @param {?} ti
     * @return {?}
     */
    NavControllerBase.prototype._fireError = function (rejectReason, ti) {
        if (ti.done) {
            ti.done(false, false, rejectReason);
        }
        if (ti.reject && !this._destroyed) {
            ti.reject(rejectReason);
        }
        else {
            ti.resolve(false);
        }
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype._nextTrns = function () {
        var _this = this;
        // this is the framework's bread 'n butta function
        // only one transition is allowed at any given time
        if (this.isTransitioning()) {
            return false;
        }
        // there is no transition happening right now
        // get the next instruction
        var /** @type {?} */ ti = this._queue.shift();
        if (!ti) {
            return false;
        }
        // set that this nav is actively transitioning
        var /** @type {?} */ enteringView;
        var /** @type {?} */ leavingView;
        this._startTI(ti)
            .then(function () { return _this._loadLazyLoading(ti); })
            .then(function () {
            leavingView = _this.getActive();
            enteringView = _this._getEnteringView(ti, leavingView);
            if (!leavingView && !enteringView) {
                throw 'no views in the stack to be removed';
            }
            if (enteringView && enteringView._state === STATE_NEW) {
                _this._viewInit(enteringView);
            }
            // Needs transition?
            ti.requiresTransition = (ti.enteringRequiresTransition || ti.leavingRequiresTransition) && enteringView !== leavingView;
        })
            .then(function () { return _this._viewTest(enteringView, leavingView, ti); })
            .then(function () { return _this._postViewInit(enteringView, leavingView, ti); })
            .then(function () { return _this._transition(enteringView, leavingView, ti); })
            .then(function (result) { return _this._success(result, ti); })
            .catch(function (rejectReason) { return _this._failed(rejectReason, ti); });
        return true;
    };
    /**
     * @param {?} ti
     * @return {?}
     */
    NavControllerBase.prototype._startTI = function (ti) {
        var /** @type {?} */ viewsLength = this._views.length;
        if (isPresent(ti.removeView)) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            var /** @type {?} */ index = this.indexOf(ti.removeView);
            if (index < 0) {
                return Promise.reject('removeView was not found');
            }
            ti.removeStart += index;
        }
        if (isPresent(ti.removeStart)) {
            if (ti.removeStart < 0) {
                ti.removeStart = (viewsLength - 1);
            }
            if (ti.removeCount < 0) {
                ti.removeCount = (viewsLength - ti.removeStart);
            }
            ti.leavingRequiresTransition = (ti.removeCount > 0) && ((ti.removeStart + ti.removeCount) === viewsLength);
        }
        if (ti.insertViews) {
            // allow -1 to be passed in to auto push it on the end
            // and clean up the index if it's larger then the size of the stack
            if (ti.insertStart < 0 || ti.insertStart > viewsLength) {
                ti.insertStart = viewsLength;
            }
            ti.enteringRequiresTransition = (ti.insertStart === viewsLength);
        }
        this.setTransitioning(true);
        return Promise.resolve();
    };
    /**
     * @param {?} ti
     * @return {?}
     */
    NavControllerBase.prototype._loadLazyLoading = function (ti) {
        var _this = this;
        var /** @type {?} */ insertViews = ti.insertViews;
        if (insertViews) {
            (void 0) /* assert */;
            return convertToViews(this._linker, insertViews).then(function (viewControllers) {
                (void 0) /* assert */;
                viewControllers = viewControllers.filter(function (v) { return v !== null; });
                if (viewControllers.length === 0) {
                    throw 'invalid views to insert';
                }
                // Check all the inserted view are correct
                for (var /** @type {?} */ i = 0; i < viewControllers.length; i++) {
                    var /** @type {?} */ view = viewControllers[i];
                    var /** @type {?} */ nav = view._nav;
                    if (nav && nav !== _this) {
                        throw 'inserted view was already inserted';
                    }
                    if (view._state === STATE_DESTROYED) {
                        throw 'inserted view was already destroyed';
                    }
                }
                ti.insertViews = viewControllers;
            });
        }
        return Promise.resolve();
    };
    /**
     * @param {?} ti
     * @param {?} leavingView
     * @return {?}
     */
    NavControllerBase.prototype._getEnteringView = function (ti, leavingView) {
        var /** @type {?} */ insertViews = ti.insertViews;
        if (insertViews) {
            // grab the very last view of the views to be inserted
            // and initialize it as the new entering view
            return insertViews[insertViews.length - 1];
        }
        var /** @type {?} */ removeStart = ti.removeStart;
        if (isPresent(removeStart)) {
            var /** @type {?} */ views = this._views;
            var /** @type {?} */ removeEnd = removeStart + ti.removeCount;
            var /** @type {?} */ i;
            var /** @type {?} */ view;
            for (i = views.length - 1; i >= 0; i--) {
                view = views[i];
                if ((i < removeStart || i >= removeEnd) && view !== leavingView) {
                    return view;
                }
            }
        }
        return null;
    };
    /**
     * @param {?} enteringView
     * @param {?} leavingView
     * @param {?} ti
     * @return {?}
     */
    NavControllerBase.prototype._postViewInit = function (enteringView, leavingView, ti) {
        var _this = this;
        (void 0) /* assert */;
        (void 0) /* assert */;
        (void 0) /* assert */;
        var /** @type {?} */ opts = ti.opts || {};
        var /** @type {?} */ insertViews = ti.insertViews;
        var /** @type {?} */ removeStart = ti.removeStart;
        var /** @type {?} */ removeCount = ti.removeCount;
        var /** @type {?} */ view;
        var /** @type {?} */ i;
        var /** @type {?} */ destroyQueue;
        // there are views to remove
        if (isPresent(removeStart)) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            destroyQueue = [];
            for (i = 0; i < removeCount; i++) {
                view = this._views[i + removeStart];
                if (view && view !== enteringView && view !== leavingView) {
                    destroyQueue.push(view);
                }
            }
            // default the direction to "back"
            opts.direction = opts.direction || DIRECTION_BACK;
        }
        var /** @type {?} */ finalBalance = this._views.length + (insertViews ? insertViews.length : 0) - (removeCount ? removeCount : 0);
        (void 0) /* assert */;
        if (finalBalance === 0 && !this._isPortal) {
            console.warn("You can't remove all the pages in the navigation stack. nav.pop() is probably called too many times.", this, this.getNativeElement());
            throw 'navigation stack needs at least one root page';
        }
        // At this point the transition can not be rejected, any throw should be an error
        // there are views to insert
        if (insertViews) {
            // manually set the new view's id if an id was passed in the options
            if (isPresent(opts.id)) {
                enteringView.id = opts.id;
            }
            // add the views to the
            for (i = 0; i < insertViews.length; i++) {
                view = insertViews[i];
                this._insertViewAt(view, ti.insertStart + i);
            }
            if (ti.enteringRequiresTransition) {
                // default to forward if not already set
                opts.direction = opts.direction || DIRECTION_FORWARD;
            }
        }
        // if the views to be removed are in the beginning or middle
        // and there is not a view that needs to visually transition out
        // then just destroy them and don't transition anything
        // batch all of lifecycles together
        // let's make sure, callbacks are zoned
        if (destroyQueue && destroyQueue.length > 0) {
            this._zone.run(function () {
                for (i = 0; i < destroyQueue.length; i++) {
                    view = destroyQueue[i];
                    _this._willLeave(view, true);
                    _this._didLeave(view);
                    _this._willUnload(view);
                }
            });
            // once all lifecycle events has been delivered, we can safely detroy the views
            for (i = 0; i < destroyQueue.length; i++) {
                this._destroyView(destroyQueue[i]);
            }
        }
        // set which animation it should use if it wasn't set yet
        if (ti.requiresTransition && !opts.animation) {
            if (isPresent(ti.removeStart)) {
                opts.animation = (leavingView || enteringView).getTransitionName(opts.direction);
            }
            else {
                opts.animation = (enteringView || leavingView).getTransitionName(opts.direction);
            }
        }
        ti.opts = opts;
    };
    /**
     * DOM WRITE
     * @param {?} enteringView
     * @return {?}
     */
    NavControllerBase.prototype._viewInit = function (enteringView) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        // render the entering view, and all child navs and views
        // entering view has not been initialized yet
        var /** @type {?} */ componentProviders = ReflectiveInjector.resolve([
            { provide: NavController, useValue: this },
            { provide: ViewController, useValue: enteringView },
            { provide: NavParams, useValue: enteringView.getNavParams() }
        ]);
        var /** @type {?} */ componentFactory = this._linker.resolveComponent(enteringView.component);
        var /** @type {?} */ childInjector = ReflectiveInjector.fromResolvedProviders(componentProviders, this._viewport.parentInjector);
        // create ComponentRef and set it to the entering view
        enteringView.init(componentFactory.create(childInjector, []));
        enteringView._state = STATE_INITIALIZED;
        this._preLoad(enteringView);
    };
    /**
     * @param {?} view
     * @param {?} componentRef
     * @param {?} viewport
     * @return {?}
     */
    NavControllerBase.prototype._viewAttachToDOM = function (view, componentRef, viewport) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        // fire willLoad before change detection runs
        this._willLoad(view);
        // render the component ref instance to the DOM
        // ******** DOM WRITE ****************
        viewport.insert(componentRef.hostView, viewport.length);
        view._state = STATE_ATTACHED;
        if (view._cssClass) {
            // the ElementRef of the actual ion-page created
            var /** @type {?} */ pageElement = componentRef.location.nativeElement;
            // ******** DOM WRITE ****************
            this._renderer.setElementClass(pageElement, view._cssClass, true);
        }
        componentRef.changeDetectorRef.detectChanges();
        // successfully finished loading the entering view
        // fire off the "didLoad" lifecycle events
        this._zone.run(this._didLoad.bind(this, view));
    };
    /**
     * @param {?} enteringView
     * @param {?} leavingView
     * @param {?} ti
     * @return {?}
     */
    NavControllerBase.prototype._viewTest = function (enteringView, leavingView, ti) {
        // Only test canLeave/canEnter if there is transition
        if (!ti.requiresTransition) {
            return Promise.resolve();
        }
        var /** @type {?} */ promises = [];
        if (leavingView) {
            promises.push(leavingView._lifecycleTest('Leave'));
        }
        if (enteringView) {
            promises.push(enteringView._lifecycleTest('Enter'));
        }
        if (promises.length === 0) {
            return Promise.resolve();
        }
        // darn, async promises, gotta wait for them to resolve
        return Promise.all(promises).then(function (values) {
            if (values.some(function (result) { return result === false; })) {
                throw 'canEnter/Leave returned false';
            }
        }).catch(function (reason) {
            // Do not
            ti.reject = null;
            throw reason;
        });
    };
    /**
     * @param {?} enteringView
     * @param {?} leavingView
     * @param {?} ti
     * @return {?}
     */
    NavControllerBase.prototype._transition = function (enteringView, leavingView, ti) {
        var _this = this;
        if (!ti.requiresTransition) {
            // transition is not required, so we are already done!
            // they're inserting/removing the views somewhere in the middle or
            // beginning, so visually nothing needs to animate/transition
            // resolve immediately because there's no animation that's happening
            return Promise.resolve({
                hasCompleted: true,
                requiresTransition: false
            });
        }
        var /** @type {?} */ opts = ti.opts;
        // figure out if this transition is the root one or a
        // child of a parent nav that has the root transition
        this._trnsId = this._trnsCtrl.getRootTrnsId(this);
        if (this._trnsId === null) {
            // this is the root transition, meaning all child navs and their views
            // should be added as a child transition to this one
            this._trnsId = this._trnsCtrl.nextId();
        }
        // create the transition options
        var /** @type {?} */ animationOpts = {
            animation: opts.animation,
            direction: opts.direction,
            duration: (opts.animate === false ? 0 : opts.duration),
            easing: opts.easing,
            isRTL: this._config.plt.isRTL,
            ev: opts.ev,
        };
        // create the transition animation from the TransitionController
        // this will either create the root transition, or add it as a child transition
        var /** @type {?} */ transition = this._trnsCtrl.get(this._trnsId, enteringView, leavingView, animationOpts);
        // ensure any swipeback transitions are cleared out
        this._sbTrns && this._sbTrns.destroy();
        this._sbTrns = null;
        // swipe to go back root transition
        if (transition.isRoot() && opts.progressAnimation) {
            this._sbTrns = transition;
        }
        // transition start has to be registered before attaching the view to the DOM!
        var /** @type {?} */ promise = new Promise(function (resolve) { return transition.registerStart(resolve); }).then(function () {
            return _this._transitionStart(transition, enteringView, leavingView, opts);
        });
        if (enteringView && (enteringView._state === STATE_INITIALIZED)) {
            // render the entering component in the DOM
            // this would also render new child navs/views
            // which may have their very own async canEnter/Leave tests
            // ******** DOM WRITE ****************
            this._viewAttachToDOM(enteringView, enteringView._cmp, this._viewport);
        }
        if (!transition.hasChildren) {
            // lowest level transition, so kick it off and let it bubble up to start all of them
            transition.start();
        }
        return promise;
    };
    /**
     * @param {?} transition
     * @param {?} enteringView
     * @param {?} leavingView
     * @param {?} opts
     * @return {?}
     */
    NavControllerBase.prototype._transitionStart = function (transition, enteringView, leavingView, opts) {
        var _this = this;
        (void 0) /* assert */;
        this._trnsId = null;
        // set the correct zIndex for the entering and leaving views
        // ******** DOM WRITE ****************
        setZIndex(this, enteringView, leavingView, opts.direction, this._renderer);
        // always ensure the entering view is viewable
        // ******** DOM WRITE ****************
        enteringView && enteringView._domShow(true, this._renderer);
        // always ensure the leaving view is viewable
        // ******** DOM WRITE ****************
        leavingView && leavingView._domShow(true, this._renderer);
        // initialize the transition
        transition.init();
        // we should animate (duration > 0) if the pushed page is not the first one (startup)
        // or if it is a portal (modal, actionsheet, etc.)
        var /** @type {?} */ isFirstPage = !this._init && this._views.length === 1;
        var /** @type {?} */ shouldNotAnimate = isFirstPage && !this._isPortal;
        var /** @type {?} */ canNotAnimate = this._config.get('animate') === false;
        if (shouldNotAnimate || canNotAnimate) {
            opts.animate = false;
        }
        if (opts.animate === false) {
            // if it was somehow set to not animation, then make the duration zero
            transition.duration(0);
        }
        // create a callback that needs to run within zone
        // that will fire off the willEnter/Leave lifecycle events at the right time
        transition.beforeAddRead(this._viewsWillLifecycles.bind(this, enteringView, leavingView));
        // get the set duration of this transition
        var /** @type {?} */ duration = transition.getDuration();
        // create a callback for when the animation is done
        var /** @type {?} */ promise = new Promise(function (resolve) {
            transition.onFinish(resolve);
        });
        if (transition.isRoot()) {
            // this is the top most, or only active transition, so disable the app
            // add XXms to the duration the app is disabled when the keyboard is open
            if (duration > DISABLE_APP_MINIMUM_DURATION && opts.disableApp !== false) {
                // if this transition has a duration and this is the root transition
                // then set that the app is actively disabled
                this._app.setEnabled(false, duration + ACTIVE_TRANSITION_OFFSET, opts.minClickBlockDuration);
            }
            else {
                (void 0) /* console.debug */;
            }
            // cool, let's do this, start the transition
            if (opts.progressAnimation) {
                // this is a swipe to go back, just get the transition progress ready
                // kick off the swipe animation start
                transition.progressStart();
            }
            else {
                // only the top level transition should actually start "play"
                // kick it off and let it play through
                // ******** DOM WRITE ****************
                transition.play();
            }
        }
        return promise.then(function () { return _this._zone.run(function () {
            return _this._transitionFinish(transition, opts);
        }); });
    };
    /**
     * @param {?} transition
     * @param {?} opts
     * @return {?}
     */
    NavControllerBase.prototype._transitionFinish = function (transition, opts) {
        var /** @type {?} */ hasCompleted = transition.hasCompleted;
        var /** @type {?} */ enteringView = transition.enteringView;
        var /** @type {?} */ leavingView = transition.leavingView;
        // mainly for testing
        var /** @type {?} */ enteringName;
        var /** @type {?} */ leavingName;
        if (hasCompleted) {
            // transition has completed (went from 0 to 1)
            if (enteringView) {
                enteringName = enteringView.name;
                this._didEnter(enteringView);
            }
            if (leavingView) {
                leavingName = leavingView.name;
                this._didLeave(leavingView);
            }
            this._cleanup(enteringView);
        }
        else {
            // If transition does not complete, we have to cleanup anyway, because
            // previous pages in the stack are not hidden probably.
            this._cleanup(leavingView);
        }
        if (transition.isRoot()) {
            // this is the root transition
            // it's safe to destroy this transition
            this._trnsCtrl.destroy(transition.trnsId);
            // it's safe to enable the app again
            this._app.setEnabled(true);
            // mark ourselves as not transitioning - `deepLinker navchange` requires this
            // TODO - probably could be resolved in a better way
            this.setTransitioning(false);
            if (!this.hasChildren() && opts.updateUrl !== false) {
                // notify deep linker of the nav change
                // if a direction was provided and should update url
                this._linker.navChange(opts.direction);
            }
            if (opts.keyboardClose !== false) {
                // the keyboard is still open!
                // no problem, let's just close for them
                this.plt.focusOutActiveElement();
            }
        }
        return {
            hasCompleted: hasCompleted,
            requiresTransition: true,
            enteringName: enteringName,
            leavingName: leavingName,
            direction: opts.direction
        };
    };
    /**
     * @param {?} enteringView
     * @param {?} leavingView
     * @return {?}
     */
    NavControllerBase.prototype._viewsWillLifecycles = function (enteringView, leavingView) {
        var _this = this;
        if (enteringView || leavingView) {
            this._zone.run(function () {
                // Here, the order is important. WillLeave must be called before WillEnter.
                leavingView && _this._willLeave(leavingView, !enteringView);
                enteringView && _this._willEnter(enteringView);
            });
        }
    };
    /**
     * @param {?} view
     * @param {?} index
     * @return {?}
     */
    NavControllerBase.prototype._insertViewAt = function (view, index) {
        var /** @type {?} */ existingIndex = this._views.indexOf(view);
        if (existingIndex > -1) {
            // this view is already in the stack!!
            // move it to its new location
            (void 0) /* assert */;
            this._views.splice(index, 0, this._views.splice(existingIndex, 1)[0]);
        }
        else {
            (void 0) /* assert */;
            // this is a new view to add to the stack
            // create the new entering view
            view._setNav(this);
            // give this inserted view an ID
            this._ids++;
            if (!view.id) {
                view.id = this.id + "-" + this._ids;
            }
            // insert the entering view into the correct index in the stack
            this._views.splice(index, 0, view);
        }
    };
    /**
     * @param {?} view
     * @return {?}
     */
    NavControllerBase.prototype._removeView = function (view) {
        (void 0) /* assert */;
        var /** @type {?} */ views = this._views;
        var /** @type {?} */ index = views.indexOf(view);
        (void 0) /* assert */;
        if (index >= 0) {
            views.splice(index, 1);
        }
    };
    /**
     * @param {?} view
     * @return {?}
     */
    NavControllerBase.prototype._destroyView = function (view) {
        view._destroy(this._renderer);
        this._removeView(view);
    };
    /**
     * DOM WRITE
     * @param {?} activeView
     * @return {?}
     */
    NavControllerBase.prototype._cleanup = function (activeView) {
        // ok, cleanup time!! Destroy all of the views that are
        // INACTIVE and come after the active view
        // only do this if the views exist, though
        if (!this._destroyed) {
            var /** @type {?} */ activeViewIndex = this._views.indexOf(activeView);
            var /** @type {?} */ views = this._views;
            var /** @type {?} */ reorderZIndexes = false;
            var /** @type {?} */ view = void 0;
            var /** @type {?} */ i = void 0;
            for (i = views.length - 1; i >= 0; i--) {
                view = views[i];
                if (i > activeViewIndex) {
                    // this view comes after the active view
                    // let's unload it
                    this._willUnload(view);
                    this._destroyView(view);
                }
                else if (i < activeViewIndex && !this._isPortal) {
                    // this view comes before the active view
                    // and it is not a portal then ensure it is hidden
                    view._domShow(false, this._renderer);
                }
                if (view._zIndex <= 0) {
                    reorderZIndexes = true;
                }
            }
            if (!this._isPortal && reorderZIndexes) {
                for (i = 0; i < views.length; i++) {
                    view = views[i];
                    // ******** DOM WRITE ****************
                    view._setZIndex(view._zIndex + INIT_ZINDEX + 1, this._renderer);
                }
            }
        }
    };
    /**
     * @param {?} view
     * @return {?}
     */
    NavControllerBase.prototype._preLoad = function (view) {
        (void 0) /* assert */;
        view._preLoad();
    };
    /**
     * @param {?} view
     * @return {?}
     */
    NavControllerBase.prototype._willLoad = function (view) {
        (void 0) /* assert */;
        try {
            view._willLoad();
        }
        catch (e) {
            this._errHandler && this._errHandler.handleError(e);
        }
    };
    /**
     * @param {?} view
     * @return {?}
     */
    NavControllerBase.prototype._didLoad = function (view) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        try {
            view._didLoad();
            this.viewDidLoad.emit(view);
            this._app.viewDidLoad.emit(view);
        }
        catch (e) {
            this._errHandler && this._errHandler.handleError(e);
        }
    };
    /**
     * @param {?} view
     * @return {?}
     */
    NavControllerBase.prototype._willEnter = function (view) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        try {
            view._willEnter();
            this.viewWillEnter.emit(view);
            this._app.viewWillEnter.emit(view);
        }
        catch (e) {
            this._errHandler && this._errHandler.handleError(e);
        }
    };
    /**
     * @param {?} view
     * @return {?}
     */
    NavControllerBase.prototype._didEnter = function (view) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        try {
            view._didEnter();
            this.viewDidEnter.emit(view);
            this._app.viewDidEnter.emit(view);
        }
        catch (e) {
            this._errHandler && this._errHandler.handleError(e);
        }
    };
    /**
     * @param {?} view
     * @param {?} willUnload
     * @return {?}
     */
    NavControllerBase.prototype._willLeave = function (view, willUnload) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        try {
            view._willLeave(willUnload);
            this.viewWillLeave.emit(view);
            this._app.viewWillLeave.emit(view);
        }
        catch (e) {
            this._errHandler && this._errHandler.handleError(e);
        }
    };
    /**
     * @param {?} view
     * @return {?}
     */
    NavControllerBase.prototype._didLeave = function (view) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        try {
            view._didLeave();
            this.viewDidLeave.emit(view);
            this._app.viewDidLeave.emit(view);
        }
        catch (e) {
            this._errHandler && this._errHandler.handleError(e);
        }
    };
    /**
     * @param {?} view
     * @return {?}
     */
    NavControllerBase.prototype._willUnload = function (view) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        try {
            view._willUnload();
            this.viewWillUnload.emit(view);
            this._app.viewWillUnload.emit(view);
        }
        catch (e) {
            this._errHandler && this._errHandler.handleError(e);
        }
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.hasChildren = function () {
        return this._children && this._children.length > 0;
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.getActiveChildNavs = function () {
        return this._children;
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.getAllChildNavs = function () {
        return this._children;
    };
    /**
     * @param {?} container
     * @return {?}
     */
    NavControllerBase.prototype.registerChildNav = function (container) {
        this._children.push(container);
    };
    /**
     * @param {?} nav
     * @return {?}
     */
    NavControllerBase.prototype.unregisterChildNav = function (nav) {
        this._children = this._children.filter(function (child) { return child !== nav; });
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.destroy = function () {
        var /** @type {?} */ views = this._views;
        var /** @type {?} */ view;
        for (var /** @type {?} */ i = 0; i < views.length; i++) {
            view = views[i];
            view._willUnload();
            view._destroy(this._renderer);
        }
        // release swipe back gesture and transition
        this._sbGesture && this._sbGesture.destroy();
        this._sbTrns && this._sbTrns.destroy();
        this._queue = this._views = this._sbGesture = this._sbTrns = null;
        // Unregister navcontroller
        if (this.parent && this.parent.unregisterChildNav) {
            this.parent.unregisterChildNav(this);
        }
        this._destroyed = true;
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.swipeBackStart = function () {
        if (this.isTransitioning() || this._queue.length > 0) {
            return;
        }
        // default the direction to "back";
        var /** @type {?} */ opts = {
            direction: DIRECTION_BACK,
            progressAnimation: true
        };
        this._queueTrns({
            removeStart: -1,
            removeCount: 1,
            opts: opts,
        }, null);
    };
    /**
     * @param {?} stepValue
     * @return {?}
     */
    NavControllerBase.prototype.swipeBackProgress = function (stepValue) {
        if (this._sbTrns && this._sbGesture) {
            // continue to disable the app while actively dragging
            this._app.setEnabled(false, ACTIVE_TRANSITION_DEFAULT);
            this.setTransitioning(true);
            // set the transition animation's progress
            this._sbTrns.progressStep(stepValue);
        }
    };
    /**
     * @param {?} shouldComplete
     * @param {?} currentStepValue
     * @param {?} velocity
     * @return {?}
     */
    NavControllerBase.prototype.swipeBackEnd = function (shouldComplete, currentStepValue, velocity) {
        if (this._sbTrns && this._sbGesture) {
            // the swipe back gesture has ended
            var /** @type {?} */ dur = this._sbTrns.getDuration() / (Math.abs(velocity) + 1);
            this._sbTrns.progressEnd(shouldComplete, currentStepValue, dur);
        }
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype._swipeBackCheck = function () {
        if (this.canSwipeBack()) {
            if (!this._sbGesture) {
                this._sbGesture = new SwipeBackGesture(this.plt, this, this._gestureCtrl, this._domCtrl);
            }
            this._sbGesture.listen();
        }
        else if (this._sbGesture) {
            this._sbGesture.unlisten();
        }
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.canSwipeBack = function () {
        return (this._sbEnabled &&
            !this._isPortal &&
            !this._children.length &&
            !this.isTransitioning() &&
            this._app.isEnabled() &&
            this.canGoBack());
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.canGoBack = function () {
        var /** @type {?} */ activeView = this.getActive();
        return !!(activeView && activeView.enableBack());
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.isTransitioning = function () {
        return this._trnsTm;
    };
    /**
     * @param {?} isTransitioning
     * @return {?}
     */
    NavControllerBase.prototype.setTransitioning = function (isTransitioning) {
        this._trnsTm = isTransitioning;
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.getActive = function () {
        return this._views[this._views.length - 1];
    };
    /**
     * @param {?} view
     * @return {?}
     */
    NavControllerBase.prototype.isActive = function (view) {
        return (view === this.getActive());
    };
    /**
     * @param {?} index
     * @return {?}
     */
    NavControllerBase.prototype.getByIndex = function (index) {
        return this._views[index];
    };
    /**
     * @param {?=} view
     * @return {?}
     */
    NavControllerBase.prototype.getPrevious = function (view) {
        // returns the view controller which is before the given view controller.
        if (!view) {
            view = this.getActive();
        }
        var /** @type {?} */ views = this._views;
        return views[views.indexOf(view) - 1];
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.first = function () {
        // returns the first view controller in this nav controller's stack.
        return this._views[0];
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.last = function () {
        // returns the last page in this nav controller's stack.
        return this._views[this._views.length - 1];
    };
    /**
     * @param {?} view
     * @return {?}
     */
    NavControllerBase.prototype.indexOf = function (view) {
        // returns the index number of the given view controller.
        return this._views.indexOf(view);
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.length = function () {
        return this._views.length;
    };
    /**
     * Return the stack of views in this NavController.
     * @return {?}
     */
    NavControllerBase.prototype.getViews = function () {
        return this._views;
    };
    /**
     * Return a view controller
     * @param {?} id
     * @return {?}
     */
    NavControllerBase.prototype.getViewById = function (id) {
        for (var _i = 0, _a = this._views; _i < _a.length; _i++) {
            var vc = _a[_i];
            if (vc && vc.id === id) {
                return vc;
            }
        }
        return null;
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.isSwipeBackEnabled = function () {
        return this._sbEnabled;
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.dismissPageChangeViews = function () {
        for (var _i = 0, _a = this._views; _i < _a.length; _i++) {
            var view = _a[_i];
            if (view.data && view.data.dismissOnPageChange) {
                view.dismiss().catch(function () { });
            }
        }
    };
    /**
     * @param {?} val
     * @return {?}
     */
    NavControllerBase.prototype.setViewport = function (val) {
        this._viewport = val;
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.resize = function () {
        var /** @type {?} */ active = this.getActive();
        if (!active) {
            return;
        }
        var /** @type {?} */ content = active.getIONContent();
        content && content.resize();
    };
    /**
     * @param {?} _opts
     * @return {?}
     */
    NavControllerBase.prototype.goToRoot = function (_opts) {
        return Promise.reject(new Error('goToRoot needs to be implemented by child class'));
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.getType = function () {
        return 'nav';
    };
    /**
     * @return {?}
     */
    NavControllerBase.prototype.getSecondaryIdentifier = function () {
        return null;
    };
    /**
     * Returns the active child navigation.
     * @return {?}
     */
    NavControllerBase.prototype.getActiveChildNav = function () {
        console.warn('(getActiveChildNav) is deprecated and will be removed in the next major release. Use getActiveChildNavs instead.');
        return this._children[this._children.length - 1];
    };
    return NavControllerBase;
}(Ion));
export { NavControllerBase };
NavControllerBase.propDecorators = {
    'swipeBackEnabled': [{ type: Input },],
};
function NavControllerBase_tsickle_Closure_declarations() {
    /** @type {?} */
    NavControllerBase.propDecorators;
    /** @type {?} */
    NavControllerBase.prototype._children;
    /** @type {?} */
    NavControllerBase.prototype._ids;
    /** @type {?} */
    NavControllerBase.prototype._init;
    /** @type {?} */
    NavControllerBase.prototype._isPortal;
    /** @type {?} */
    NavControllerBase.prototype._queue;
    /** @type {?} */
    NavControllerBase.prototype._sbEnabled;
    /** @type {?} */
    NavControllerBase.prototype._sbGesture;
    /** @type {?} */
    NavControllerBase.prototype._sbTrns;
    /** @type {?} */
    NavControllerBase.prototype._trnsId;
    /** @type {?} */
    NavControllerBase.prototype._trnsTm;
    /** @type {?} */
    NavControllerBase.prototype._viewport;
    /** @type {?} */
    NavControllerBase.prototype._views;
    /** @type {?} */
    NavControllerBase.prototype._zIndexOffset;
    /** @type {?} */
    NavControllerBase.prototype._destroyed;
    /** @type {?} */
    NavControllerBase.prototype.viewDidLoad;
    /** @type {?} */
    NavControllerBase.prototype.viewWillEnter;
    /** @type {?} */
    NavControllerBase.prototype.viewDidEnter;
    /** @type {?} */
    NavControllerBase.prototype.viewWillLeave;
    /** @type {?} */
    NavControllerBase.prototype.viewDidLeave;
    /** @type {?} */
    NavControllerBase.prototype.viewWillUnload;
    /** @type {?} */
    NavControllerBase.prototype.id;
    /** @type {?} */
    NavControllerBase.prototype.name;
    /** @type {?} */
    NavControllerBase.prototype.parent;
    /** @type {?} */
    NavControllerBase.prototype._app;
    /** @type {?} */
    NavControllerBase.prototype.config;
    /** @type {?} */
    NavControllerBase.prototype.plt;
    /** @type {?} */
    NavControllerBase.prototype._zone;
    /** @type {?} */
    NavControllerBase.prototype._cfr;
    /** @type {?} */
    NavControllerBase.prototype._gestureCtrl;
    /** @type {?} */
    NavControllerBase.prototype._trnsCtrl;
    /** @type {?} */
    NavControllerBase.prototype._linker;
    /** @type {?} */
    NavControllerBase.prototype._domCtrl;
    /** @type {?} */
    NavControllerBase.prototype._errHandler;
}
var /** @type {?} */ ctrlIds = -1;
var /** @type {?} */ DISABLE_APP_MINIMUM_DURATION = 64;
var /** @type {?} */ ACTIVE_TRANSITION_DEFAULT = 5000;
var /** @type {?} */ ACTIVE_TRANSITION_OFFSET = 2000;
//# sourceMappingURL=nav-controller-base.js.map