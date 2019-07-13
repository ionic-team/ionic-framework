import { Location } from '@angular/common';
import { Attribute, ComponentFactoryResolver, ComponentRef, Directive, ElementRef, EventEmitter, Injector, NgZone, OnDestroy, OnInit, Optional, Output, SkipSelf, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts, OutletContext, PRIMARY_OUTLET, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

import { Config } from '../../providers/config';
import { NavController } from '../../providers/nav-controller';

import { StackController } from './stack-controller';
import { RouteView, getUrl } from './stack-utils';

@Directive({
  selector: 'ion-router-outlet',
  exportAs: 'outlet',
  inputs: ['animated', 'swipeGesture']
})
export class IonRouterOutlet implements OnDestroy, OnInit {
  private activated: ComponentRef<any> | null = null;
  private activatedView: RouteView | null = null;

  private _activatedRoute: ActivatedRoute | null = null;
  private _swipeGesture?: boolean;
  private name: string;
  private stackCtrl: StackController;
  private nativeEl: HTMLIonRouterOutletElement;

  // Maintain map of activated route proxies for each component instance
  private proxyMap = new WeakMap<any, ActivatedRoute>();

  // Keep the latest activated route in a subject for the proxy routes to switch map to
  private currentActivatedRoute$ = new BehaviorSubject<{ component: any; activatedRoute: ActivatedRoute } | null>(null);

  tabsPrefix: string | undefined;

  @Output() stackEvents = new EventEmitter<any>();
  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  set animated(animated: boolean) {
    this.nativeEl.animated = animated;
  }

  set swipeGesture(swipe: boolean) {
    this._swipeGesture = swipe;

    this.nativeEl.swipeHandler = swipe ? {
      canStart: () => this.stackCtrl.canGoBack(1),
      onStart: () => this.stackCtrl.startBackTransition(),
      onEnd: shouldContinue => this.stackCtrl.endBackTransition(shouldContinue)
    } : undefined;
  }

  constructor(
    private parentContexts: ChildrenOutletContexts,
    private location: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    @Attribute('name') name: string,
    @Optional() @Attribute('tabs') tabs: string,
    private config: Config,
    private navCtrl: NavController,
    commonLocation: Location,
    elementRef: ElementRef,
    router: Router,
    zone: NgZone,
    activatedRoute: ActivatedRoute,
    @SkipSelf() @Optional() readonly parentOutlet?: IonRouterOutlet
  ) {
    this.nativeEl = elementRef.nativeElement;
    this.name = name || PRIMARY_OUTLET;
    this.tabsPrefix = tabs === 'true' ? getUrl(router, activatedRoute) : undefined;
    this.stackCtrl = new StackController(this.tabsPrefix, this.nativeEl, router, navCtrl, zone, commonLocation);
    parentContexts.onChildOutletCreated(this.name, this as any);
  }

  ngOnDestroy(): void {
    this.stackCtrl.destroy();
  }

  getContext(): OutletContext | null {
    return this.parentContexts.getContext(this.name);
  }

  ngOnInit(): void {
    if (!this.activated) {
      // If the outlet was not instantiated at the time the route got activated we need to populate
      // the outlet when it is initialized (ie inside a NgIf)
      const context = this.getContext();
      if (context && context.route) {
        this.activateWith(context.route, context.resolver || null);
      }
    }
    if ((this.nativeEl as any).componentOnReady) {
      this.nativeEl.componentOnReady().then(() => {
        if (this._swipeGesture === undefined) {
          this.swipeGesture = this.config.getBoolean('swipeBackEnabled', (this.nativeEl as any).mode === 'ios');
        }
      });
    }
  }

  get isActivated(): boolean {
    return !!this.activated;
  }

  get component(): object {
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

  get activatedRouteData(): any {
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
  attach(_ref: ComponentRef<any>, _activatedRoute: ActivatedRoute) {
    throw new Error('incompatible reuse strategy');
  }

  deactivate(): void {
    if (this.activated) {
      if (this.activatedView) {
        this.activatedView.savedData = new Map(this.getContext()!.children['contexts']);

        /**
         * Ensure we are saving the NavigationExtras
         * data otherwise it will be lost
         */
        this.activatedView.savedExtras = {};
        const context = this.getContext()!;

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

  activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver | null) {
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
        const context = this.getContext()!;
        context.children['contexts'] = saved;
      }
      // Updated activated route proxy for this component
      this.updateActivatedRouteProxy(cmpRef.instance, activatedRoute);
    } else {
      const snapshot = (activatedRoute as any)._futureSnapshot;
      const component = snapshot.routeConfig!.component as any;
      resolver = resolver || this.resolver;

      const factory = resolver.resolveComponentFactory(component);
      const childContexts = this.parentContexts.getOrCreateContext(this.name).children;

      // We create an activated route proxy object that will maintain future updates for this component
      // over its lifecycle in the stack.
      const component$ = new BehaviorSubject<any>(null);
      const activatedRouteProxy = this.createActivatedRouteProxy(component$, activatedRoute);

      const injector = new OutletInjector(activatedRouteProxy, childContexts, this.location.injector);
      cmpRef = this.activated = this.location.createComponent(factory, this.location.length, injector);

      // Once the component is created we can push it to our local subject supplied to the proxy
      component$.next(cmpRef.instance);

      // Calling `markForCheck` to make sure we will run the change detection when the
      // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
      enteringView = this.stackCtrl.createView(this.activated, activatedRoute);
      enteringView.ref.changeDetectorRef.detectChanges();

      // Store references to the proxy by component
      this.proxyMap.set(cmpRef.instance, activatedRouteProxy);
      this.currentActivatedRoute$.next({ component: cmpRef.instance, activatedRoute });
    }

    this.activatedView = enteringView;
    this.stackCtrl.setActive(enteringView).then(data => {
      this.navCtrl.setTopOutlet(this);
      this.activateEvents.emit(cmpRef.instance);
      this.stackEvents.emit(data);
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
      filter(component => !!component),
      switchMap(component =>
        this.currentActivatedRoute$.pipe(
          filter(current => current !== null && current.component === component),
          switchMap(current => current && (current.activatedRoute as any)[path]),
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
  constructor(
    private route: ActivatedRoute,
    private childContexts: ChildrenOutletContexts,
    private parent: Injector
  ) {}

  get(token: any, notFoundValue?: any): any {
    if (token === ActivatedRoute) {
      return this.route;
    }

    if (token === ChildrenOutletContexts) {
      return this.childContexts;
    }

    // tslint:disable-next-line
    return this.parent.get(token, notFoundValue);
  }
}
