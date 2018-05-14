import { Attribute, ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Directive, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Optional, Output, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts, PRIMARY_OUTLET, Router } from '@angular/router';
import { StackController } from './router-controller';
import { NavController } from '../../providers/nav-controller';
import { bindLifecycleEvents } from '../../providers/angular-delegate';

@Directive({
  selector: 'ion-router-outlet',
  exportAs: 'outlet'
})
export class IonRouterOutlet implements OnDestroy, OnInit {

  private activated: ComponentRef<any>|null = null;

  private _activatedRoute: ActivatedRoute|null = null;
  private name: string;
  private stackCtrl: StackController;

  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  constructor(
    private parentContexts: ChildrenOutletContexts,
    private location: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private elementRef: ElementRef,
    @Attribute('name') name: string,
    @Optional() @Attribute('stack') stack: any,
    private changeDetector: ChangeDetectorRef,
    private navCtrl: NavController,
    router: Router
  ) {
    this.name = name || PRIMARY_OUTLET;
    parentContexts.onChildOutletCreated(this.name, this as any);
    const hasStack = stack !== 'false' || stack !== false;
    this.stackCtrl = new StackController(hasStack, elementRef.nativeElement, router, this.navCtrl);
  }

  ngOnDestroy(): void {
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
    if (!this.activated) {
      throw new Error('Outlet is not activated');
    }
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
    this.location.insert(ref.hostView);
  }

  deactivate(): void {
    if (this.activated) {
      const c = this.component;
      this.activated = null;
      this._activatedRoute = null;
      this.deactivateEvents.emit(c);
    }
  }

  async activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver|null) {
    if (this.isActivated) {
      throw new Error('Cannot activate an already activated outlet');
    }
    this._activatedRoute = activatedRoute;

    let enteringView = this.stackCtrl.getExistingView(activatedRoute);
    if (enteringView) {
      this.activated = enteringView.ref;
    } else {
      const snapshot = (activatedRoute as any)._futureSnapshot;
      const component = <any>snapshot.routeConfig !.component;
      resolver = resolver || this.resolver;

      const factory = resolver.resolveComponentFactory(component);
      const childContexts = this.parentContexts.getOrCreateContext(this.name).children;

      const injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);
      const cmp = this.activated = this.location.createComponent(factory, this.location.length, injector);

      bindLifecycleEvents(cmp.instance, cmp.location.nativeElement);

      // Calling `markForCheck` to make sure we will run the change detection when the
      // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
      this.changeDetector.markForCheck();
      enteringView = this.stackCtrl.createView(this.activated, activatedRoute);
    }

    const {direction, animated} = this.navCtrl.consumeTransition();
    await this.stackCtrl.setActive(enteringView, direction, animated);
    this.activateEvents.emit(this.activated.instance);

    emitEvent(this.elementRef.nativeElement);
  }

  canGoBack(deep = 1) {
    return this.stackCtrl.canGoBack(deep);
  }

  pop(deep = 1) {
    return this.stackCtrl.pop(deep);
  }
}

function emitEvent(el: HTMLElement) {
  const event = new CustomEvent('ionRouterOutletActivated', {
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(event);
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

    return this.parent.get(token, notFoundValue);
  }
}
