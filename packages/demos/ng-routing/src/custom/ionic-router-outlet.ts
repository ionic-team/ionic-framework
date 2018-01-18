import {
  AfterViewInit,
  ApplicationRef,
  Attribute,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Injector,
  OnInit,
  ViewContainerRef,
} from '@angular/core';

import {
  PRIMARY_OUTLET,
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ChildrenOutletContexts,
  NavigationStart,
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';

import { RouterIntegration } from './router-integration';

import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Directive({
  selector: 'ion-outlet'
})
export class IonicRouterOutlet extends RouterOutlet {

  private componentRef: ComponentRef<any>;
  private _activated: any;

  constructor(
    private appRef: ApplicationRef,
    private elementRef: ElementRef,
    private _parentContexts: ChildrenOutletContexts,
    private _location: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Attribute('name') private _name: string,
    private _changeDetector: ChangeDetectorRef,
    private integration: RouterIntegration,
    private router: Router,
    private injector: Injector
  ) {
    super(_parentContexts, _location, componentFactoryResolver, name, _changeDetector);
    console.log('I am an outlet instance');
  }

  activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver) {
    console.log('activateWith');
    if (this.isActivated) {
      throw new Error('Cannot activate an already activated outlet');
    }
    (this as any)._activatedRoute = activatedRoute;
    const snapshot = (activatedRoute as any)._futureSnapshot;
    const component = <any>snapshot.routeConfig ? snapshot.routeConfig.component : null;
    resolver = resolver || this.componentFactoryResolver;
    const factory = resolver.resolveComponentFactory(component);
    const childContexts = this._parentContexts.getOrCreateContext(this._name).children;
    const injector = new OutletInjector(activatedRoute, childContexts, this._location.injector);
    this._activated = this._location.createComponent(factory, this._location.length, injector);
    // Calling `markForCheck` to make sure we will run the change detection when the
    // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
    this._changeDetector.markForCheck();
    this.activateEvents.emit(this._activated.instance);

    //super.activateWith(activatedRoute, resolver);
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
