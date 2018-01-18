import {
  Attribute,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewContainerRef
} from '@angular/core';

import { PRIMARY_OUTLET, ActivatedRoute, ChildrenOutletContexts } from '@angular/router';

import { RouterDelegate } from './router-delegate';
import { AngularMountingData } from '@ionic/angular';

@Directive({
  selector: 'ion-outlet',
})
export class IonicRouterOutlet implements OnDestroy, OnInit {

  public name: string;
  public activationStatus = NOT_ACTIVATED;
  public componentConstructor: Type<any> = null;
  public componentInstance: any = null;
  public activatedRoute: ActivatedRoute = null;
  public activatedRouteData: any = {};
  public activeComponentRef: ComponentRef<any> = null;

  @Output('activate') activateEvents = new EventEmitter<any>();
  @Output('deactivate') deactivateEvents = new EventEmitter<any>();

  constructor(
    protected elementRef: ElementRef,
    protected parentContexts: ChildrenOutletContexts,
    protected location: ViewContainerRef,
    protected resolver: ComponentFactoryResolver,
    @Attribute('name') name: string,
    protected changeDetector: ChangeDetectorRef,
    protected routerComponentMounter: RouterDelegate) {

      console.log('name: ', name);
    this.name = name || PRIMARY_OUTLET;
    parentContexts.onChildOutletCreated(this.name, this as any);
  }

  ngOnDestroy(): void {
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

  get component(): Object {
    return this.componentInstance;
  }

  detach(): ComponentRef<any> {
    return null;
  }

  attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
  }

  deactivate(): void {
  }

  activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver|null) {
    /*if (this.activationStatus !== NOT_ACTIVATED) {
      return;
    }*/
    this.activationStatus = ACTIVATION_IN_PROGRESS;
    this.activatedRoute = activatedRoute;
    const snapshot = (activatedRoute as any)._futureSnapshot;
    const component = snapshot.routeConfig ? snapshot.routeConfig.component : null;
    resolver = resolver || this.resolver;
    const factory = resolver.resolveComponentFactory(component);
    const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
    const injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);
    this.activeComponentRef = this.location.createComponent(factory, this.location.length, injector);
    // Calling `markForCheck` to make sure we will run the change detection when the
    // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
    this.changeDetector.markForCheck();
    this.activateEvents.emit(this.activeComponentRef.instance);
    console.log('activateWith');
    this.activationStatus = ACTIVATED;


    // console.log('activateWith: ', this.activationStatus);
    /*this.routerComponentMounter.addEntryToQueue({
      activatedRoute,
      componentFactoryResolver: resolver,
      injector,
      elementRef: this.elementRef,
      callback: (data: AngularMountingData) => {
        // console.log('callback!');
        this.changeDetector.markForCheck();
        this.activateEvents.emit(data.instance);
        this.activationStatus = ACTIVATED;
      }
    });
    */

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

export const NOT_ACTIVATED = 0;
export const ACTIVATION_IN_PROGRESS = 1;
export const ACTIVATED = 2;
