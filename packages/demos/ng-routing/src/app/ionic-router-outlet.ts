import {
  ApplicationRef,
  Attribute,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  ViewContainerRef,
} from '@angular/core';

import {
  PRIMARY_OUTLET,
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ChildrenOutletContexts,
  RouterOutlet
} from '@angular/router';

import { RouterIntegration } from './router-integration';

@Directive({
  selector: 'ion-outlet'
})
export class IonicRouterOutlet extends RouterOutlet {

  private componentRef: ComponentRef<any>;
  private _activated = false;

  constructor(
    private appRef: ApplicationRef,
    private elementRef: ElementRef,
    private _parentContexts: ChildrenOutletContexts,
    private _location: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Attribute('name') private _name: string,
    changeDetector: ChangeDetectorRef,
    private integration: RouterIntegration
  ) {
    super(_parentContexts, _location, componentFactoryResolver, name, changeDetector);
  }

  attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
  }

  detach() {
    return this.componentRef;
  }

  deactivate() {
  }

  activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver) {
    /*console.log('activatedRoute: ', activatedRoute);
    const snapshot = (activatedRoute as any)._futureSnapshot as ActivatedRouteSnapshot;
    const component = snapshot.routeConfig.component;
    const resolverToUse = resolver || this.componentFactoryResolver;
    const factory = resolverToUse.resolveComponentFactory(component);

    const hostElement = document.createElement(factory.selector);
    const childContexts = this._parentContexts.getOrCreateContext(this._name).children;
    const componentRef = factory.create(this._location.injector, [], hostElement);
    this.appRef.attachView(componentRef.hostView);
    (this.elementRef.nativeElement).appendChild(hostElement);
    */

    this.integration.updateSegmentToResolver(activatedRoute, resolver, this.elementRef);
  }
}
