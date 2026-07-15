import { __decorate, __param } from "tslib";
import { ViewContainerRef, inject, Attribute, Directive, EventEmitter, Optional, Output, SkipSelf, EnvironmentInjector, Input, InjectionToken, Injectable, reflectComponentType, } from '@angular/core';
import { Router, ActivatedRoute, ChildrenOutletContexts, PRIMARY_OUTLET } from '@angular/router';
import { componentOnReady } from '@ionic/core/components';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Config } from '../../providers/config';
import { NavController } from '../../providers/nav-controller';
import { StackController } from './stack-controller';
import { getUrl, isTabSwitch } from './stack-utils';
// TODO(FW-2827): types
let IonRouterOutlet = class IonRouterOutlet {
    /** @internal */
    get activatedComponentRef() {
        return this.activated;
    }
    set animation(animation) {
        this.nativeEl.animation = animation;
    }
    set animated(animated) {
        this.nativeEl.animated = animated;
    }
    set swipeGesture(swipe) {
        this._swipeGesture = swipe;
        this.nativeEl.swipeHandler = swipe
            ? {
                canStart: () => this.stackCtrl.canGoBack(1) && !this.stackCtrl.hasRunningTask(),
                onStart: () => this.stackCtrl.startBackTransition(),
                onEnd: (shouldContinue) => this.stackCtrl.endBackTransition(shouldContinue),
            }
            : undefined;
        this.nativeEl.swipeGesture = swipe;
    }
    constructor(name, tabs, commonLocation, elementRef, router, zone, activatedRoute, parentOutlet) {
        this.parentOutlet = parentOutlet;
        this.activatedView = null;
        // Maintain map of activated route proxies for each component instance
        this.proxyMap = new WeakMap();
        // Keep the latest activated route in a subject for the proxy routes to switch map to
        this.currentActivatedRoute$ = new BehaviorSubject(null);
        this.activated = null;
        this._activatedRoute = null;
        /**
         * The name of the outlet
         */
        this.name = PRIMARY_OUTLET;
        /** @internal */
        this.stackWillChange = new EventEmitter();
        /** @internal */
        this.stackDidChange = new EventEmitter();
        // eslint-disable-next-line @angular-eslint/no-output-rename
        this.activateEvents = new EventEmitter();
        // eslint-disable-next-line @angular-eslint/no-output-rename
        this.deactivateEvents = new EventEmitter();
        this.parentContexts = inject(ChildrenOutletContexts);
        this.location = inject(ViewContainerRef);
        this.environmentInjector = inject(EnvironmentInjector);
        this.inputBinder = inject(INPUT_BINDER, { optional: true });
        /** @nodoc */
        this.supportsBindingToComponentInputs = true;
        // Ionic providers
        this.config = inject(Config);
        this.navCtrl = inject(NavController);
        this.nativeEl = elementRef.nativeElement;
        this.name = name || PRIMARY_OUTLET;
        this.tabsPrefix = tabs === 'true' ? getUrl(router, activatedRoute) : undefined;
        this.stackCtrl = new StackController(this.tabsPrefix, this.nativeEl, router, this.navCtrl, zone, commonLocation);
        this.parentContexts.onChildOutletCreated(this.name, this);
    }
    ngOnDestroy() {
        var _a;
        this.stackCtrl.destroy();
        (_a = this.inputBinder) === null || _a === void 0 ? void 0 : _a.unsubscribeFromRouteData(this);
    }
    getContext() {
        return this.parentContexts.getContext(this.name);
    }
    ngOnInit() {
        this.initializeOutletWithName();
    }
    // Note: Ionic deviates from the Angular Router implementation here
    initializeOutletWithName() {
        if (!this.activated) {
            // If the outlet was not instantiated at the time the route got activated we need to populate
            // the outlet when it is initialized (ie inside a NgIf)
            const context = this.getContext();
            if (context === null || context === void 0 ? void 0 : context.route) {
                this.activateWith(context.route, context.injector);
            }
        }
        new Promise((resolve) => componentOnReady(this.nativeEl, resolve)).then(() => {
            if (this._swipeGesture === undefined) {
                this.swipeGesture = this.config.getBoolean('swipeBackEnabled', this.nativeEl.mode === 'ios');
            }
        });
    }
    get isActivated() {
        return !!this.activated;
    }
    get component() {
        if (!this.activated) {
            throw new Error('Outlet is not activated');
        }
        return this.activated.instance;
    }
    get activatedRoute() {
        if (!this.activated) {
            throw new Error('Outlet is not activated');
        }
        return this._activatedRoute;
    }
    get activatedRouteData() {
        if (this._activatedRoute) {
            return this._activatedRoute.snapshot.data;
        }
        return {};
    }
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    detach() {
        throw new Error('incompatible reuse strategy');
    }
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    attach(_ref, _activatedRoute) {
        throw new Error('incompatible reuse strategy');
    }
    deactivate() {
        if (this.activated) {
            if (this.activatedView) {
                const context = this.getContext();
                this.activatedView.savedData = new Map(context.children['contexts']);
                /**
                 * Angular v11.2.10 introduced a change
                 * where this route context is cleared out when
                 * a router-outlet is deactivated, However,
                 * we need this route information in order to
                 * return a user back to the correct tab when
                 * leaving and then going back to the tab context.
                 */
                const primaryOutlet = this.activatedView.savedData.get('primary');
                if (primaryOutlet && context.route) {
                    primaryOutlet.route = Object.assign({}, context.route);
                }
                /**
                 * Ensure we are saving the NavigationExtras
                 * data otherwise it will be lost
                 */
                this.activatedView.savedExtras = {};
                if (context.route) {
                    const contextSnapshot = context.route.snapshot;
                    this.activatedView.savedExtras.queryParams = contextSnapshot.queryParams;
                    this.activatedView.savedExtras.fragment = contextSnapshot.fragment;
                }
            }
            const c = this.component;
            this.activatedView = null;
            this.activated = null;
            this._activatedRoute = null;
            this.deactivateEvents.emit(c);
        }
    }
    activateWith(activatedRoute, environmentInjector) {
        var _a, _b;
        if (this.isActivated) {
            throw new Error('Cannot activate an already activated outlet');
        }
        this._activatedRoute = activatedRoute;
        let cmpRef;
        let enteringView = this.stackCtrl.getExistingView(activatedRoute);
        if (enteringView) {
            cmpRef = this.activated = enteringView.ref;
            const saved = enteringView.savedData;
            if (saved) {
                // self-restore
                const context = this.getContext();
                context.children['contexts'] = saved;
            }
            // Updated activated route proxy for this component
            this.updateActivatedRouteProxy(cmpRef.instance, activatedRoute);
        }
        else {
            const snapshot = activatedRoute._futureSnapshot;
            /**
             * Angular 14 introduces a new `loadComponent` property to the route config.
             * This function will assign a `component` property to the route snapshot.
             * We check for the presence of this property to determine if the route is
             * using standalone components.
             */
            const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
            // We create an activated route proxy object that will maintain future updates for this component
            // over its lifecycle in the stack.
            const component$ = new BehaviorSubject(null);
            const activatedRouteProxy = this.createActivatedRouteProxy(component$, activatedRoute);
            const injector = new OutletInjector(activatedRouteProxy, childContexts, this.location.injector);
            const component = (_a = snapshot.routeConfig.component) !== null && _a !== void 0 ? _a : snapshot.component;
            /**
             * View components need to be added as a child of ion-router-outlet
             * for page transitions and swipe to go back.
             * However, createComponent mounts components as siblings of the
             * ViewContainerRef. As a result, outletContent must reference
             * an ng-container inside of ion-router-outlet and not
             * ion-router-outlet itself.
             */
            cmpRef = this.activated = this.outletContent.createComponent(component, {
                index: this.outletContent.length,
                injector,
                environmentInjector: environmentInjector !== null && environmentInjector !== void 0 ? environmentInjector : this.environmentInjector,
            });
            // Once the component is created we can push it to our local subject supplied to the proxy
            component$.next(cmpRef.instance);
            // Calling `markForCheck` to make sure we will run the change detection when the
            // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
            /**
             * At this point this.activated has been set earlier
             * in this function, so it is guaranteed to be non-null.
             */
            enteringView = this.stackCtrl.createView(this.activated, activatedRoute);
            // Store references to the proxy by component
            this.proxyMap.set(cmpRef.instance, activatedRouteProxy);
            this.currentActivatedRoute$.next({ component: cmpRef.instance, activatedRoute });
        }
        (_b = this.inputBinder) === null || _b === void 0 ? void 0 : _b.bindActivatedRouteToOutletComponent(this);
        this.activatedView = enteringView;
        /**
         * The top outlet is set prior to the entering view's transition completing,
         * so that when we have nested outlets (e.g. ion-tabs inside an ion-router-outlet),
         * the tabs outlet will be assigned as the top outlet when a view inside tabs is
         * activated.
         *
         * In this scenario, activeWith is called for both the tabs and the root router outlet.
         * To avoid a race condition, we assign the top outlet synchronously.
         */
        this.navCtrl.setTopOutlet(this);
        const leavingView = this.stackCtrl.getActiveView();
        this.stackWillChange.emit({
            enteringView,
            tabSwitch: isTabSwitch(enteringView, leavingView),
        });
        this.stackCtrl.setActive(enteringView).then((data) => {
            this.activateEvents.emit(cmpRef.instance);
            this.stackDidChange.emit(data);
        });
    }
    /**
     * Returns `true` if there are pages in the stack to go back.
     */
    canGoBack(deep = 1, stackId) {
        return this.stackCtrl.canGoBack(deep, stackId);
    }
    /**
     * Resolves to `true` if it the outlet was able to sucessfully pop the last N pages.
     */
    pop(deep = 1, stackId) {
        return this.stackCtrl.pop(deep, stackId);
    }
    /**
     * Returns the URL of the active page of each stack.
     */
    getLastUrl(stackId) {
        const active = this.stackCtrl.getLastUrl(stackId);
        return active ? active.url : undefined;
    }
    /**
     * Returns the RouteView of the active page of each stack.
     * @internal
     */
    getLastRouteView(stackId) {
        return this.stackCtrl.getLastUrl(stackId);
    }
    /**
     * Returns the root view in the tab stack.
     * @internal
     */
    getRootView(stackId) {
        return this.stackCtrl.getRootUrl(stackId);
    }
    /**
     * Returns the active stack ID. In the context of ion-tabs, it means the active tab.
     */
    getActiveStackId() {
        return this.stackCtrl.getActiveStackId();
    }
    /**
     * Since the activated route can change over the life time of a component in an ion router outlet, we create
     * a proxy so that we can update the values over time as a user navigates back to components already in the stack.
     */
    createActivatedRouteProxy(component$, activatedRoute) {
        const proxy = new ActivatedRoute();
        proxy._futureSnapshot = activatedRoute._futureSnapshot;
        proxy._routerState = activatedRoute._routerState;
        proxy.snapshot = activatedRoute.snapshot;
        proxy.outlet = activatedRoute.outlet;
        proxy.component = activatedRoute.component;
        // Setup wrappers for the observables so consumers don't have to worry about switching to new observables as the state updates
        proxy._paramMap = this.proxyObservable(component$, 'paramMap');
        proxy._queryParamMap = this.proxyObservable(component$, 'queryParamMap');
        proxy.url = this.proxyObservable(component$, 'url');
        proxy.params = this.proxyObservable(component$, 'params');
        proxy.queryParams = this.proxyObservable(component$, 'queryParams');
        proxy.fragment = this.proxyObservable(component$, 'fragment');
        proxy.data = this.proxyObservable(component$, 'data');
        return proxy;
    }
    /**
     * Create a wrapped observable that will switch to the latest activated route matched by the given component
     */
    proxyObservable(component$, path) {
        return component$.pipe(
        // First wait until the component instance is pushed
        filter((component) => !!component), switchMap((component) => this.currentActivatedRoute$.pipe(filter((current) => current !== null && current.component === component), switchMap((current) => current && current.activatedRoute[path]), distinctUntilChanged())));
    }
    /**
     * Updates the activated route proxy for the given component to the new incoming router state
     */
    updateActivatedRouteProxy(component, activatedRoute) {
        const proxy = this.proxyMap.get(component);
        if (!proxy) {
            throw new Error(`Could not find activated route proxy for view`);
        }
        proxy._futureSnapshot = activatedRoute._futureSnapshot;
        proxy._routerState = activatedRoute._routerState;
        proxy.snapshot = activatedRoute.snapshot;
        proxy.outlet = activatedRoute.outlet;
        proxy.component = activatedRoute.component;
        this.currentActivatedRoute$.next({ component, activatedRoute });
    }
};
__decorate([
    Input()
], IonRouterOutlet.prototype, "name", void 0);
__decorate([
    Output()
], IonRouterOutlet.prototype, "stackWillChange", void 0);
__decorate([
    Output()
], IonRouterOutlet.prototype, "stackDidChange", void 0);
__decorate([
    Output('activate')
], IonRouterOutlet.prototype, "activateEvents", void 0);
__decorate([
    Output('deactivate')
], IonRouterOutlet.prototype, "deactivateEvents", void 0);
IonRouterOutlet = __decorate([
    Directive({
        selector: 'ion-router-outlet',
        exportAs: 'outlet',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['animated', 'animation', 'mode', 'swipeGesture'],
    }),
    __param(0, Attribute('name')),
    __param(1, Optional()),
    __param(1, Attribute('tabs')),
    __param(7, SkipSelf()),
    __param(7, Optional())
], IonRouterOutlet);
export { IonRouterOutlet };
class OutletInjector {
    constructor(route, childContexts, parent) {
        this.route = route;
        this.childContexts = childContexts;
        this.parent = parent;
    }
    get(token, notFoundValue) {
        if (token === ActivatedRoute) {
            return this.route;
        }
        if (token === ChildrenOutletContexts) {
            return this.childContexts;
        }
        return this.parent.get(token, notFoundValue);
    }
}
// TODO: FW-4785 - Remove this once Angular 15 support is dropped
const INPUT_BINDER = new InjectionToken('');
/**
 * Injectable used as a tree-shakable provider for opting in to binding router data to component
 * inputs.
 *
 * The RouterOutlet registers itself with this service when an `ActivatedRoute` is attached or
 * activated. When this happens, the service subscribes to the `ActivatedRoute` observables (params,
 * queryParams, data) and sets the inputs of the component using `ComponentRef.setInput`.
 * Importantly, when an input does not have an item in the route data with a matching key, this
 * input is set to `undefined`. If it were not done this way, the previous information would be
 * retained if the data got removed from the route (i.e. if a query parameter is removed).
 *
 * The `RouterOutlet` should unregister itself when destroyed via `unsubscribeFromRouteData` so that
 * the subscriptions are cleaned up.
 */
let RoutedComponentInputBinder = class RoutedComponentInputBinder {
    constructor() {
        this.outletDataSubscriptions = new Map();
    }
    bindActivatedRouteToOutletComponent(outlet) {
        this.unsubscribeFromRouteData(outlet);
        this.subscribeToRouteData(outlet);
    }
    unsubscribeFromRouteData(outlet) {
        var _a;
        (_a = this.outletDataSubscriptions.get(outlet)) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        this.outletDataSubscriptions.delete(outlet);
    }
    subscribeToRouteData(outlet) {
        const { activatedRoute } = outlet;
        const dataSubscription = combineLatest([activatedRoute.queryParams, activatedRoute.params, activatedRoute.data])
            .pipe(switchMap(([queryParams, params, data], index) => {
            data = Object.assign(Object.assign(Object.assign({}, queryParams), params), data);
            // Get the first result from the data subscription synchronously so it's available to
            // the component as soon as possible (and doesn't require a second change detection).
            if (index === 0) {
                return of(data);
            }
            // Promise.resolve is used to avoid synchronously writing the wrong data when
            // two of the Observables in the `combineLatest` stream emit one after
            // another.
            return Promise.resolve(data);
        }))
            .subscribe((data) => {
            // Outlet may have been deactivated or changed names to be associated with a different
            // route
            if (!outlet.isActivated ||
                !outlet.activatedComponentRef ||
                outlet.activatedRoute !== activatedRoute ||
                activatedRoute.component === null) {
                this.unsubscribeFromRouteData(outlet);
                return;
            }
            const mirror = reflectComponentType(activatedRoute.component);
            if (!mirror) {
                this.unsubscribeFromRouteData(outlet);
                return;
            }
            for (const { templateName } of mirror.inputs) {
                outlet.activatedComponentRef.setInput(templateName, data[templateName]);
            }
        });
        this.outletDataSubscriptions.set(outlet, dataSubscription);
    }
};
RoutedComponentInputBinder = __decorate([
    Injectable()
], RoutedComponentInputBinder);
export const provideComponentInputBinding = () => {
    return {
        provide: INPUT_BINDER,
        useFactory: componentInputBindingFactory,
        deps: [Router],
    };
};
function componentInputBindingFactory(router) {
    /**
     * We cast the router to any here, since the componentInputBindingEnabled
     * property is not available until Angular v16.
     */
    if (router === null || router === void 0 ? void 0 : router.componentInputBindingEnabled) {
        return new RoutedComponentInputBinder();
    }
    return null;
}
