import { Location } from '@angular/common';
import {
  ComponentRef,
  ElementRef,
  Injector,
  NgZone,
  OnDestroy,
  OnInit,
  ViewContainerRef,
  inject,
  Attribute,
  Component,
  EventEmitter,
  Optional,
  Output,
  SkipSelf,
  EnvironmentInjector,
  Input,
  InjectionToken,
  Injectable,
  reflectComponentType,
} from '@angular/core';
import type { Provider } from '@angular/core';
import { OutletContext, Router, ActivatedRoute, ChildrenOutletContexts, PRIMARY_OUTLET, Data } from '@angular/router';
import { componentOnReady } from '@ionic/core/components';
import type { AnimationBuilder } from '@ionic/core/components';
import { Observable, BehaviorSubject, Subscription, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

import { Config } from '../../providers/config';
import { NavController } from '../../providers/nav-controller';

import { StackController } from './stack-controller';
import { RouteView, StackDidChangeEvent, StackWillChangeEvent, getUrl, isTabSwitch } from './stack-utils';

// TODO(FW-2827): types

@Component({
  selector: 'ion-router-outlet',
  template: '<ng-container #outletContent><ng-content></ng-content></ng-container>',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class IonRouterOutlet implements OnDestroy, OnInit {

  abstract outletContent: any;

  nativeEl: HTMLIonRouterOutletElement;
  activatedView: RouteView | null = null;
  tabsPrefix: string | undefined;

  private _swipeGesture?: boolean;
  private stackCtrl: StackController;

  // Maintain map of activated route proxies for each component instance
  private proxyMap = new WeakMap<any, ActivatedRoute>();
  // Keep the latest activated route in a subject for the proxy routes to switch map to
  private currentActivatedRoute$ = new BehaviorSubject<{ component: any; activatedRoute: ActivatedRoute } | null>(null);

  private activated: ComponentRef<any> | null = null;
  /** @internal */
  get activatedComponentRef(): ComponentRef<any> | null {
    return this.activated;
  }
  private _activatedRoute: ActivatedRoute | null = null;

  /**
   * The name of the outlet
   */
  @Input() name = PRIMARY_OUTLET;

  /** @internal */
  @Output() stackWillChange = new EventEmitter<StackWillChangeEvent>();
  /** @internal */
  @Output() stackDidChange = new EventEmitter<StackDidChangeEvent>();

  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('activate') activateEvents = new EventEmitter<any>();
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  private parentContexts = inject(ChildrenOutletContexts);
  private location = inject(ViewContainerRef);
  private environmentInjector = inject(EnvironmentInjector);
  private inputBinder = inject(INPUT_BINDER, { optional: true });
  /** @nodoc */
  readonly supportsBindingToComponentInputs = true;

  // Ionic providers
  private config = inject(Config);
  private navCtrl = inject(NavController);

  set animation(animation: AnimationBuilder) {
    this.nativeEl.animation = animation;
  }

  set animated(animated: boolean) {
    this.nativeEl.animated = animated;
  }

  set swipeGesture(swipe: boolean) {
    this._swipeGesture = swipe;

    this.nativeEl.swipeHandler = swipe
      ? {
          canStart: () => this.stackCtrl.canGoBack(1) && !this.stackCtrl.hasRunningTask(),
          onStart: () => this.stackCtrl.startBackTransition(),
          onEnd: (shouldContinue) => this.stackCtrl.endBackTransition(shouldContinue),
        }
      : undefined;
  }

  constructor(
    @Attribute('name') name: string,
    @Optional() @Attribute('tabs') tabs: string,
    commonLocation: Location,
    elementRef: ElementRef,
    router: Router,
    zone: NgZone,
    activatedRoute: ActivatedRoute,
    protected outletContentContainer: ViewContainerRef,
    @SkipSelf() @Optional() readonly parentOutlet?: IonRouterOutlet
  ) {
    this.nativeEl = elementRef.nativeElement;
    this.name = name || PRIMARY_OUTLET;
    this.tabsPrefix = tabs === 'true' ? getUrl(router, activatedRoute) : undefined;
    this.stackCtrl = new StackController(this.tabsPrefix, this.nativeEl, router, this.navCtrl, zone, commonLocation);
    this.parentContexts.onChildOutletCreated(this.name, this as any);

    console.log('looking at container', this.outletContentContainer)

    setTimeout(() => {
      console.log('in timeout', this.outletContentContainer)
    }, 500);
  }

  ngOnDestroy(): void {
    this.stackCtrl.destroy();
    this.inputBinder?.unsubscribeFromRouteData(this);
  }

  getContext(): OutletContext | null {
    return this.parentContexts.getContext(this.name);
  }

  ngOnInit(): void {
    this.initializeOutletWithName();
  }

  // Note: Ionic deviates from the Angular Router implementation here
  private initializeOutletWithName() {
    if (!this.activated) {
      // If the outlet was not instantiated at the time the route got activated we need to populate
      // the outlet when it is initialized (ie inside a NgIf)
      const context = this.getContext();
      if (context?.route) {
        this.activateWith(context.route, context.injector);
      }
    }

    new Promise((resolve) => componentOnReady(this.nativeEl, resolve)).then(() => {
      if (this._swipeGesture === undefined) {
        this.swipeGesture = this.config.getBoolean('swipeBackEnabled', (this.nativeEl as any).mode === 'ios');
      }
    });
  }

  get isActivated(): boolean {
    return !!this.activated;
  }

  get component(): Record<string, unknown> {
    if (!this.activated) {
      throw new Error('Outlet is not activated');
    }
    return this.activated.instance;
  }

  get activatedRoute(): ActivatedRoute {
    if (!this.activated) {
      throw new Error('Outlet is not activated');
    }
    return this._activatedRoute as ActivatedRoute;
  }

  get activatedRouteData(): Data {
    if (this._activatedRoute) {
      return this._activatedRoute.snapshot.data;
    }
    return {};
  }

  /**
   * Called when the `RouteReuseStrategy` instructs to detach the subtree
   */
  detach(): ComponentRef<any> {
    throw new Error('incompatible reuse strategy');
  }

  /**
   * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attach(_ref: ComponentRef<any>, _activatedRoute: ActivatedRoute): void {
    throw new Error('incompatible reuse strategy');
  }

  deactivate(): void {
    if (this.activated) {
      if (this.activatedView) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const context = this.getContext()!;
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
          primaryOutlet.route = { ...context.route };
        }

        /**
         * Ensure we are saving the NavigationExtras
         * data otherwise it will be lost
         */
        this.activatedView.savedExtras = {};
        if (context.route) {
          const contextSnapshot = context.route.snapshot;

          this.activatedView.savedExtras.queryParams = contextSnapshot.queryParams;
          (this.activatedView.savedExtras.fragment as string | null) = contextSnapshot.fragment;
        }
      }
      const c = this.component;
      this.activatedView = null;
      this.activated = null;
      this._activatedRoute = null;
      this.deactivateEvents.emit(c);
    }
  }

  activateWith(activatedRoute: ActivatedRoute, environmentInjector: EnvironmentInjector | null): void {
    if (this.isActivated) {
      throw new Error('Cannot activate an already activated outlet');
    }
    this._activatedRoute = activatedRoute;

    let cmpRef: any;
    let enteringView = this.stackCtrl.getExistingView(activatedRoute);
    if (enteringView) {
      cmpRef = this.activated = enteringView.ref;
      const saved = enteringView.savedData;
      if (saved) {
        // self-restore
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const context = this.getContext()!;
        context.children['contexts'] = saved;
      }
      // Updated activated route proxy for this component
      this.updateActivatedRouteProxy(cmpRef.instance, activatedRoute);
    } else {
      const snapshot = (activatedRoute as any)._futureSnapshot;

      /**
       * Angular 14 introduces a new `loadComponent` property to the route config.
       * This function will assign a `component` property to the route snapshot.
       * We check for the presence of this property to determine if the route is
       * using standalone components.
       */
      const childContexts = this.parentContexts.getOrCreateContext(this.name).children;

      // We create an activated route proxy object that will maintain future updates for this component
      // over its lifecycle in the stack.
      const component$ = new BehaviorSubject<any>(null);
      const activatedRouteProxy = this.createActivatedRouteProxy(component$, activatedRoute);

      const injector = new OutletInjector(activatedRouteProxy, childContexts, this.location.injector);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const component = snapshot.routeConfig!.component ?? snapshot.component;

      /**
       * View components need to be added as a child of ion-router-outlet
       * for page transitions and swipe to go back.
       * However, createComponent mounts components as siblings of the
       * ViewContainerRef. As a result, outletContentContainer must reference
       * an ng-container inside of ion-router-outlet and not
       * ion-router-outlet itself.
       */
      cmpRef = this.activated = this.outletContentContainer.createComponent(component, {
        index: this.outletContentContainer.length,
        injector,
        environmentInjector: environmentInjector ?? this.environmentInjector,
      });

      // Once the component is created we can push it to our local subject supplied to the proxy
      component$.next(cmpRef.instance);

      // Calling `markForCheck` to make sure we will run the change detection when the
      // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
      enteringView = this.stackCtrl.createView(this.activated, activatedRoute);

      // Store references to the proxy by component
      this.proxyMap.set(cmpRef.instance, activatedRouteProxy);
      this.currentActivatedRoute$.next({ component: cmpRef.instance, activatedRoute });
    }

    this.inputBinder?.bindActivatedRouteToOutletComponent(this);

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
  canGoBack(deep = 1, stackId?: string): boolean {
    return this.stackCtrl.canGoBack(deep, stackId);
  }

  /**
   * Resolves to `true` if it the outlet was able to sucessfully pop the last N pages.
   */
  pop(deep = 1, stackId?: string): Promise<boolean> {
    return this.stackCtrl.pop(deep, stackId);
  }

  /**
   * Returns the URL of the active page of each stack.
   */
  getLastUrl(stackId?: string): string | undefined {
    const active = this.stackCtrl.getLastUrl(stackId);
    return active ? active.url : undefined;
  }

  /**
   * Returns the RouteView of the active page of each stack.
   * @internal
   */
  getLastRouteView(stackId?: string): RouteView | undefined {
    return this.stackCtrl.getLastUrl(stackId);
  }

  /**
   * Returns the root view in the tab stack.
   * @internal
   */
  getRootView(stackId?: string): RouteView | undefined {
    return this.stackCtrl.getRootUrl(stackId);
  }

  /**
   * Returns the active stack ID. In the context of ion-tabs, it means the active tab.
   */
  getActiveStackId(): string | undefined {
    return this.stackCtrl.getActiveStackId();
  }

  /**
   * Since the activated route can change over the life time of a component in an ion router outlet, we create
   * a proxy so that we can update the values over time as a user navigates back to components already in the stack.
   */
  private createActivatedRouteProxy(component$: Observable<any>, activatedRoute: ActivatedRoute): ActivatedRoute {
    const proxy: any = new ActivatedRoute();

    proxy._futureSnapshot = (activatedRoute as any)._futureSnapshot;
    proxy._routerState = (activatedRoute as any)._routerState;
    proxy.snapshot = activatedRoute.snapshot;
    proxy.outlet = activatedRoute.outlet;
    proxy.component = activatedRoute.component;

    // Setup wrappers for the observables so consumers don't have to worry about switching to new observables as the state updates
    (proxy as any)._paramMap = this.proxyObservable(component$, 'paramMap');
    (proxy as any)._queryParamMap = this.proxyObservable(component$, 'queryParamMap');
    proxy.url = this.proxyObservable(component$, 'url');
    proxy.params = this.proxyObservable(component$, 'params');
    proxy.queryParams = this.proxyObservable(component$, 'queryParams');
    proxy.fragment = this.proxyObservable(component$, 'fragment');
    proxy.data = this.proxyObservable(component$, 'data');

    return proxy as ActivatedRoute;
  }

  /**
   * Create a wrapped observable that will switch to the latest activated route matched by the given component
   */
  private proxyObservable(component$: Observable<any>, path: string): Observable<any> {
    return component$.pipe(
      // First wait until the component instance is pushed
      filter((component) => !!component),
      switchMap((component) =>
        this.currentActivatedRoute$.pipe(
          filter((current) => current !== null && current.component === component),
          switchMap((current) => current && (current.activatedRoute as any)[path]),
          distinctUntilChanged()
        )
      )
    );
  }

  /**
   * Updates the activated route proxy for the given component to the new incoming router state
   */
  private updateActivatedRouteProxy(component: any, activatedRoute: ActivatedRoute): void {
    const proxy = this.proxyMap.get(component);
    if (!proxy) {
      throw new Error(`Could not find activated route proxy for view`);
    }

    (proxy as any)._futureSnapshot = (activatedRoute as any)._futureSnapshot;
    (proxy as any)._routerState = (activatedRoute as any)._routerState;
    proxy.snapshot = activatedRoute.snapshot;
    proxy.outlet = activatedRoute.outlet;
    proxy.component = activatedRoute.component;

    this.currentActivatedRoute$.next({ component, activatedRoute });
  }
}

class OutletInjector implements Injector {
  constructor(private route: ActivatedRoute, private childContexts: ChildrenOutletContexts, private parent: Injector) {}

  get(token: any, notFoundValue?: any): any {
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
const INPUT_BINDER = new InjectionToken<RoutedComponentInputBinder>('');

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
@Injectable()
class RoutedComponentInputBinder {
  private outletDataSubscriptions = new Map<IonRouterOutlet, Subscription>();

  bindActivatedRouteToOutletComponent(outlet: IonRouterOutlet): void {
    this.unsubscribeFromRouteData(outlet);
    this.subscribeToRouteData(outlet);
  }

  unsubscribeFromRouteData(outlet: IonRouterOutlet): void {
    this.outletDataSubscriptions.get(outlet)?.unsubscribe();
    this.outletDataSubscriptions.delete(outlet);
  }

  private subscribeToRouteData(outlet: IonRouterOutlet) {
    const { activatedRoute } = outlet;
    const dataSubscription = combineLatest([activatedRoute.queryParams, activatedRoute.params, activatedRoute.data])
      .pipe(
        switchMap(([queryParams, params, data], index) => {
          data = { ...queryParams, ...params, ...data };
          // Get the first result from the data subscription synchronously so it's available to
          // the component as soon as possible (and doesn't require a second change detection).
          if (index === 0) {
            return of(data);
          }
          // Promise.resolve is used to avoid synchronously writing the wrong data when
          // two of the Observables in the `combineLatest` stream emit one after
          // another.
          return Promise.resolve(data);
        })
      )
      .subscribe((data) => {
        // Outlet may have been deactivated or changed names to be associated with a different
        // route
        if (
          !outlet.isActivated ||
          !outlet.activatedComponentRef ||
          outlet.activatedRoute !== activatedRoute ||
          activatedRoute.component === null
        ) {
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
}

export const provideComponentInputBinding = (): Provider => {
  return {
    provide: INPUT_BINDER,
    useFactory: componentInputBindingFactory,
    deps: [Router],
  };
};

function componentInputBindingFactory(router?: Router) {
  /**
   * We cast the router to any here, since the componentInputBindingEnabled
   * property is not available until Angular v16.
   */
  if ((router as any)?.componentInputBindingEnabled) {
    return new RoutedComponentInputBinder();
  }
  return null;
}
