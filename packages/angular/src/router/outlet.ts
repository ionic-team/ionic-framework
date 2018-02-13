import {
  Attribute,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Injector,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewContainerRef,
} from '@angular/core';

import {
  PRIMARY_OUTLET,
  ActivatedRoute,
  ChildrenOutletContexts,
  Router
} from '@angular/router';

import { NavResult, RouterDelegate } from '@ionic/core';

import { OutletInjector } from './outlet-injector';
import { RouteEventHandler } from './route-event-handler';

import { AngularComponentMounter, AngularEscapeHatch } from '..';
import { ensureExternalRounterController } from '../util/util';
import { ExternalRouterController } from '../../../core/dist/types/components/external-router-controller/external-router-controller';

let id = 0;

@Directive({
  selector: 'ion-nav',
})
export class RouterOutlet implements OnDestroy, OnInit, RouterDelegate {

  public name: string;
  public activationStatus = NOT_ACTIVATED;
  public componentConstructor: Type<any> = null;
  public componentInstance: any = null;
  public activatedRoute: ActivatedRoute = null;
  public activatedRouteData: any = {};
  public activeComponentRef: ComponentRef<any> = null;
  private id: number = id++;

  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  constructor(
    public location: ViewContainerRef,
    public changeDetector: ChangeDetectorRef,
    public elementRef: ElementRef,
    protected angularComponentMounter: AngularComponentMounter,
    protected parentContexts: ChildrenOutletContexts,
    protected cfr: ComponentFactoryResolver,
    protected injector: Injector,
    protected router: Router,
    private routeEventHandler: RouteEventHandler,
    @Attribute('name') name: string) {

    (this.elementRef.nativeElement as HTMLIonNavElement).routerDelegate = this;
    this.name = name || PRIMARY_OUTLET;
    parentContexts.onChildOutletCreated(this.name, this as any);
  }

  pushUrlState(urlSegment: string): Promise<any> {
    return this.router.navigateByUrl(urlSegment);
  }

  popUrlState(): Promise<any> {
    window.history.back();
    return Promise.resolve();
  }

  ngOnDestroy(): void {
    console.debug(`Nav ${this.id} ngOnDestroy`);
    this.parentContexts.onChildOutletDestroyed(this.name);
  }

  get isActivated(): boolean {
    return this.activationStatus === ACTIVATION_IN_PROGRESS
      || this.activationStatus === ACTIVATED;
  }

  ngOnInit(): void {
    if (!this.isActivated) {
      // If the outlet was not instantiated at the time the route got activated we need to populate
      // the outlet when it is initialized (ie inside a NgIf)
      const context = this.parentContexts.getContext(this.name);
      if (context && context.route) {
        // the component defined in the configuration is created
        // otherwise the component defined in the configuration is created
        this.activateWith(context.route, context.resolver || null);
      }
    }
  }

  get component(): Object {
    return this.componentInstance;
  }

  deactivate(): void {
    console.debug(`outlet ${this.id} is being deactivated`);
    this.activationStatus = NOT_ACTIVATED;
    this.deactivateEvents.emit(this.componentConstructor);
  }

  activateWith(activatedRoute: ActivatedRoute, cfr: ComponentFactoryResolver): Promise<void> {

    if (this.activationStatus !== NOT_ACTIVATED) {
      return Promise.resolve();
    }

    this.activationStatus = ACTIVATION_IN_PROGRESS;
    this.activatedRoute = activatedRoute;
    const snapshot = (activatedRoute as any)._futureSnapshot;
    const component = snapshot.routeConfig ? snapshot.routeConfig.component : null;
    cfr = cfr || this.cfr;
    const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
    const injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);

    const isTopLevel = !hasChildComponent(activatedRoute);

    return this.routeEventHandler.externalNavStart().then(() => {
      return activateRoute(this.elementRef.nativeElement, component, cfr, injector, isTopLevel).then(() => {
        this.changeDetector.markForCheck();
        this.activateEvents.emit(null);
        this.activationStatus = ACTIVATED;
      });
    });
  }
}

export function activateRoute(navElement: HTMLIonNavElement,
  component: Type<any>, cfr: ComponentFactoryResolver, injector: Injector, isTopLevel: boolean): Promise<void> {

  return ensureExternalRounterController().then((externalRouterController) => {
    const escapeHatch = getEscapeHatch(cfr, injector);
    return externalRouterController.reconcileNav(navElement, component, escapeHatch, isTopLevel);
  });
}

export const NOT_ACTIVATED = 0;
export const ACTIVATION_IN_PROGRESS = 1;
export const ACTIVATED = 2;

export function hasChildComponent(activatedRoute: ActivatedRoute): boolean {
  // don't worry about recursion for now, that's a future problem that may or may not manifest itself
  for (const childRoute of activatedRoute.children) {
    if (childRoute.component) {
      return true;
    }
  }
  return false;
}

export function getEscapeHatch(cfr: ComponentFactoryResolver, injector: Injector): AngularEscapeHatch {
  return {
    cfr,
    injector,
    fromExternalRouter: true,
    url: location.pathname
  };
}
