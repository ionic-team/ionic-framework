import {
  Attribute,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  RouterOutlet,
  ChildrenOutletContexts
} from '@angular/router';

import { FrameworkDelegate } from '@ionic/core';

import { AngularComponentMounter } from '../providers/angular-component-mounter';
import { AngularMountingData, AngularEscapeHatch } from '../types/interfaces';
import { isString } from '../util/util';

@Directive({
  selector: 'ion-nav',
})
export class IonNavDelegate extends RouterOutlet implements FrameworkDelegate {

  popNextTransition = false;

  constructor(
    private angularComponentMounter: AngularComponentMounter,
    _changeDetectorRef: ChangeDetectorRef,
    private _parentContexts: ChildrenOutletContexts,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private elementRef: ElementRef,
    private injector: Injector,
    private router: Router,
    @Attribute('name') private _name: string,
    location: ViewContainerRef,

  ) {
    super(_parentContexts, location, _componentFactoryResolver, _name, _changeDetectorRef);
    elementRef.nativeElement.delegate = this;
  }

  attachViewToDom(elementOrContainerToMountTo: HTMLIonNavElement, elementOrComponentToMount: any, data: any, classesToAdd: string[], angularEscapeHatch: AngularEscapeHatch): Promise<AngularMountingData> {

    const cfr = angularEscapeHatch && angularEscapeHatch.cfr ? angularEscapeHatch.cfr : this._componentFactoryResolver;
    const injector = angularEscapeHatch && angularEscapeHatch.injector ? angularEscapeHatch.injector : this.injector;
    // wrap whatever the user provides in an ion-page
    return this.angularComponentMounter.attachViewToDom(elementOrContainerToMountTo, null, elementOrComponentToMount, cfr, injector, data, classesToAdd);
  }

  removeViewFromDom(parentElement: HTMLElement, childElement: HTMLElement) {
    return this.angularComponentMounter.removeViewFromDom(parentElement, childElement);
  }

  deactivate() {
  }

  activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver) {
    // this is mounting a component from the router
    const snapshot = (activatedRoute as any)._futureSnapshot as ActivatedRouteSnapshot;
    const component = snapshot.routeConfig.component;
    const cfr = resolver || this._componentFactoryResolver;
    const childContexts = this._parentContexts.getOrCreateContext(this._name).children;
    const outletInjector = new OutletInjector(activatedRoute, childContexts, this.injector);

    return this.elementRef.nativeElement.componentOnReady().then(() => {
      const escapeHatch: AngularEscapeHatch = {
        cfr,
        injector: outletInjector
      };
      if (this.popNextTransition) {
        this.popNextTransition = false;
        return Promise.resolve();
        // return (this.elementRef.nativeElement as HTMLIonNavElement).pop();
      }
      return (this.elementRef.nativeElement as HTMLIonNavElement).push(component, activatedRoute.params, null, escapeHatch);
    });
  }

  shouldDeferToRouter(elementOrComponentToMount: any): Promise<boolean> {
    return isString(elementOrComponentToMount) ? Promise.resolve(true) : Promise.resolve(false);
  }

  routeToUrl(elementOrComponentToMount: string): Promise<boolean> {
    return this.router.navigateByUrl(elementOrComponentToMount);
  }

  forceBackOnNextRoute() {
    this.popNextTransition = true;
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
