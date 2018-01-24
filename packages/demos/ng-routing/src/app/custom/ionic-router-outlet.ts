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
  // NavigationStart,
  // NavigationEnd,
  Router
} from '@angular/router';


import { FrameworkDelegate } from '@ionic/core';

import {
  AngularComponentMounter,
  AngularEscapeHatch,
  AngularMountingData,
  OutletInjector
} from '@ionic/angular';

// import { OutletInjector } from './router/outlet-injector';

let id = 0;

@Directive({
  selector: 'ion-navasdfadfasdf',
})
export class IonNav implements FrameworkDelegate, OnDestroy, OnInit {

  public name: string;
  public activationStatus = NOT_ACTIVATED;
  public componentConstructor: Type<any> = null;
  public componentInstance: any = null;
  public activatedRoute: ActivatedRoute = null;
  public activatedRouteData: any = {};
  public activeComponentRef: ComponentRef<any> = null;
  private id: number = id++;
  private parent: any;

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
    protected zone: NgZone,
    @Attribute('name') name: string,
  protected mounter: AngularComponentMounter) {

    this.parent = this.elementRef.nativeElement.parentElement;
    this.elementRef.nativeElement.delegate = this;
    this.name = name || PRIMARY_OUTLET;
    parentContexts.onChildOutletCreated(this.name, this as any);
    console.log(`Nav ${this.id} constructed`);
  }

  ngOnDestroy(): void {
    console.log(`Nav ${this.id} ngOnDestroy`);
    this.parentContexts.onChildOutletDestroyed(this.name);
  }

  get isActivated(): boolean {
    return this.activationStatus === ACTIVATION_IN_PROGRESS
      || this.activationStatus === ACTIVATED;
  }

  ngOnInit(): void {
    console.log(`Nav ${this.id} ngOnInit`);
    if (!this.isActivated) {
      // If the outlet was not instantiated at the time the route got activated we need to populate
      // the outlet when it is initialized (ie inside a NgIf)
      const context = this.parentContexts.getContext(this.name);
      if (context && context.route) {
        // the component defined in the configuration is created
        console.log(`outlet ${this.id} is being activated from ngOnInit: ${this.activationStatus}`);
        this.activateWith(context.route, context.resolver || null);
      }
    }
  }

  ngAfterViewInit() {
    console.log(`Nav ${this.id} ngAfterViewInit`);
  }

  get component(): Object {
    return this.componentInstance;
  }

  detach(): ComponentRef<any> {
    return null;
  }

  attach() {
  }

  deactivate(): void {
    console.log(`outlet ${this.id} is being deactivated`);
    this.activationStatus = NOT_ACTIVATED;
    this.deactivateEvents.emit(this.componentConstructor);
  }

  activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver): any /*Promise<void>*/ {
    if (this.activationStatus !== NOT_ACTIVATED) {
      console.log(`outlet ${this.id} is already activated: ${this.activationStatus}`);
      return;
    }

    console.log(`outlet ${this.id} is starting activation: ${this.activationStatus}`);
    this.activationStatus = ACTIVATION_IN_PROGRESS;
    this.activatedRoute = activatedRoute;
    const snapshot = (activatedRoute as any)._futureSnapshot;
    const component = snapshot.routeConfig ? snapshot.routeConfig.component : null;
    resolver = resolver || this.cfr;
    const factory = resolver.resolveComponentFactory(component);
    const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
    const injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);
    // this.activeComponentRef = this.location.createComponent(factory, this.location.length, injector);
    // Calling `markForCheck` to make sure we will run the change detection when the
    // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.


    return this.mounter.attachViewToDom(this.elementRef.nativeElement, null, component, resolver, injector, {}, []).then((res) => {

      this.changeDetector.markForCheck();
      this.activateEvents.emit(res.instance);
      this.activationStatus = ACTIVATED;
    });
  }

  attachViewToDom(elementOrContainerToMountTo: HTMLIonNavElement,
    elementOrComponentToMount: Type<any>,
    data?: any,
    classesToAdd?: string[],
    escapeHatch: AngularEscapeHatch = {}): Promise<AngularMountingData> {

    console.log('attachViewToDom');
    // wrap whatever the user provides in an ion-page
    const cfr = escapeHatch.cfr || this.cfr;
    const injector = escapeHatch.injector || this.injector;
    return this.angularComponentMounter.attachViewToDom(elementOrContainerToMountTo,
      null, elementOrComponentToMount, cfr, injector, data, classesToAdd);
  }

  removeViewFromDom(parentElement: HTMLElement, childElement: HTMLElement) {
    return this.angularComponentMounter.removeViewFromDom(parentElement, childElement);
  }

}

export function activateRoute(navElement: HTMLIonNavElement,
  component: Type<any>, cfr: ComponentFactoryResolver, injector: Injector): Promise<void> {

  return (navElement as any).componentOnReady().then(() => {

    // check if the component is the top view
    const activeViews = navElement.getViews();
    if (activeViews.length === 0) {
      // there isn't a view in the stack, so push one
      // console.log('activateRoute: Pushing component');
      return navElement.push(component, {}, {}, {
        cfr,
        injector
      });
    }

    const currentView = activeViews[activeViews.length - 1];
    if (currentView.component === component) {
      // the top view is already the component being activated, so there is no change needed
      // console.log('activateRoute: Doing nothing since already top');
      return Promise.resolve();
    }

    // check if the component is the previous view, if so, pop back to it

    if (activeViews.length > 1) {
      // there's at least two views in the stack
      const previousView = activeViews[activeViews.length - 2];
      if (previousView.component === component) {
        // cool, we match the previous view, so pop it
        // console.log('activateRoute: Popping');
        return navElement.pop();
      }
    }

    // check if the component is already in the stack of views, in which case we pop back to it
    for (const view of activeViews) {
      if (view.component === component) {
        // cool, we found the match, pop back to that bad boy
        // console.log('activateRoute: Pop back to page');
        return navElement.popTo(view);
      }
    }

    // since it's none of those things, we should probably just push that bad boy and call it a day
    // console.log('activateRoute: Pushing, which is the default behavior');
    return navElement.push(component, {}, {}, {
      cfr,
      injector
    });
  });
}

export const NOT_ACTIVATED = 0;
export const ACTIVATION_IN_PROGRESS = 1;
export const ACTIVATED = 2;
