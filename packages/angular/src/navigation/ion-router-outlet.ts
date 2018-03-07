import { Attribute, ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts } from '@angular/router';
import * as ctrl from './router-controller';
import { runTransition } from './router-transition';


@Directive({selector: 'ion-router-outlet', exportAs: 'ionOutlet'})
export class IonRouterOutlet implements OnDestroy, OnInit {
  private activated: ComponentRef<any>|null = null;
  private _activatedRoute: ActivatedRoute|null = null;
  private name: string;

  private views: ctrl.RouteView[] = [];

  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  constructor(
      private parentContexts: ChildrenOutletContexts, private location: ViewContainerRef,
      private resolver: ComponentFactoryResolver, @Attribute('name') name: string,
      private changeDetector: ChangeDetectorRef) {
    this.name = name || 'primary';
    parentContexts.onChildOutletCreated(this.name, this as any);
  }

  ngOnDestroy(): void {
    ctrl.destoryViews(this.views);
    this.parentContexts.onChildOutletDestroyed(this.name);
  }

  ngOnInit(): void {
    if (!this.activated) {
      // If the outlet was not instantiated at the time the route got activated we need to populate
      // the outlet when it is initialized (ie inside a NgIf)
      const context = this.parentContexts.getContext(this.name);
      if (context && context.route) {
        if (context.attachRef) {
          // `attachRef` is populated when there is an existing component to mount
          this.attach(context.attachRef, context.route);
        } else {
          // otherwise the component defined in the configuration is created
          this.activateWith(context.route, context.resolver || null);
        }
      }
    }
  }

  get isActivated(): boolean { return !!this.activated; }

  get component(): Object {
    if (!this.activated) throw new Error('Outlet is not activated');
    return this.activated.instance;
  }

  get activatedRoute(): ActivatedRoute {
    if (!this.activated) throw new Error('Outlet is not activated');
    return this._activatedRoute as ActivatedRoute;
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
  detach(): ComponentRef<any> {
    if (!this.activated) throw new Error('Outlet is not activated');
    this.location.detach();
    const cmp = this.activated;
    this.activated = null;
    this._activatedRoute = null;
    return cmp;
  }

  /**
   * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
   */
  attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
    this.activated = ref;
    this._activatedRoute = activatedRoute;

    ctrl.attachView(this.views, this.location, ref, activatedRoute);
  }

  deactivate(): void {
    if (this.activated) {
      const c = this.component;

      ctrl.deactivateView(this.views, this.activated);

      this.activated = null;
      this._activatedRoute = null;
      this.deactivateEvents.emit(c);
    }
  }

  activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver|null) {
    if (this.isActivated) {
      throw new Error('Cannot activate an already activated outlet');
    }

    this._activatedRoute = activatedRoute;

    const existingView = ctrl.getExistingView(this.views, activatedRoute);
    if (existingView) {
      // we've already got a view hanging around
      this.activated = existingView.ref;

    } else {
      // haven't created this view yet
      const snapshot = (activatedRoute as any)._futureSnapshot;

      const component = <any>snapshot.routeConfig !.component;
      resolver = resolver || this.resolver;

      const factory = resolver.resolveComponentFactory(component);
      const childContexts = this.parentContexts.getOrCreateContext(this.name).children;

      const injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);
      this.activated = this.location.createComponent(factory, this.location.length, injector);

      // keep a ref
      ctrl.initRouteViewElm(this.views, this.activated, activatedRoute);
    }

    // Calling `markForCheck` to make sure we will run the change detection when the
    // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
    this.changeDetector.markForCheck();

    const lastDeactivatedRef = ctrl.getLastDeactivatedRef(this.views);

    runTransition(this.activated, lastDeactivatedRef).then(() => {
      console.log('transition end');
      this.activateEvents.emit(this.activated.instance);
    });
  }
}


class OutletInjector implements Injector {
  constructor(
      private route: ActivatedRoute, private childContexts: ChildrenOutletContexts,
      private parent: Injector) {}

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
