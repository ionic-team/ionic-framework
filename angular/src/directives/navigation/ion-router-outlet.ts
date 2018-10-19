import { Attribute, ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, Directive, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Optional, Output, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts, OutletContext, PRIMARY_OUTLET, Router } from '@angular/router';
import { RouteView, StackController } from './router-controller';
import { NavController } from '../../providers/nav-controller';
import { bindLifecycleEvents } from '../../providers/angular-delegate';

@Directive({
  selector: 'ion-router-outlet',
  exportAs: 'outlet'
})
export class IonRouterOutlet implements OnDestroy, OnInit {

  private activated: ComponentRef<any> | null = null;
  private activatedView: RouteView | null = null;

  private _activatedRoute: ActivatedRoute | null = null;
  private name: string;
  private stackCtrl: StackController;

  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  @Input()
  set animated(animated: boolean) {
    (this.elementRef.nativeElement as HTMLIonRouterOutletElement).animated = animated;
  }

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
    const hasStack = stack !== 'false' && stack !== false;
    this.stackCtrl = new StackController(hasStack, elementRef.nativeElement, router, this.navCtrl);
  }

  ngOnDestroy(): void {
    console.log('router-outlet destroyed');
    this.parentContexts.onChildOutletDestroyed(this.name);
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
  }

  get isActivated(): boolean { return !!this.activated; }

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
    } else {
      const snapshot = (activatedRoute as any)._futureSnapshot;
      const component = snapshot.routeConfig!.component as any;
      resolver = resolver || this.resolver;

      const factory = resolver.resolveComponentFactory(component);
      const childContexts = this.parentContexts.getOrCreateContext(this.name).children;

      const injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);
      cmpRef = this.activated = this.location.createComponent(factory, this.location.length, injector);

      bindLifecycleEvents(cmpRef.instance, cmpRef.location.nativeElement);

      // Calling `markForCheck` to make sure we will run the change detection when the
      // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
      this.changeDetector.markForCheck();
      enteringView = this.stackCtrl.createView(this.activated, activatedRoute);
    }

    const { direction, animated } = this.navCtrl.consumeTransition();
    this.activatedView = enteringView;
    this.stackCtrl.setActive(enteringView, direction, animated).then(() => {
      this.activateEvents.emit(cmpRef.instance);
      emitEvent(this.elementRef.nativeElement);
    });

  }

  canGoBack(deep = 1) {
    return this.stackCtrl.canGoBack(deep);
  }

  pop(deep = 1) {
    return this.stackCtrl.pop(deep);
  }
}

function emitEvent(el: HTMLElement) {
  const ev = new CustomEvent('ionRouterOutletActivated', {
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(ev);
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
