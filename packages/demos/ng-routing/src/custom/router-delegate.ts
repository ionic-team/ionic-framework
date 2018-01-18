import {
  ApplicationRef,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  Injectable,
  Type,
  ViewContainerRef
} from '@angular/core';

import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationStart,
  NavigationEnd,
  Router,
  UrlSegment
} from '@angular/router';

import {
  AngularComponentMounter,
  AngularMountingData
} from '@ionic/angular';

import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RouterDelegate {

  public routeQueue: ActivateOutletData[] = [];

  constructor(
    public appRef: ApplicationRef,
    public injector: Injector,
    public angularComponentMounter: AngularComponentMounter,
    public router: Router) {

    router.events.pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationStart)).subscribe((event: any) => {
      // console.log('event: ', event);
      // this.renderRouteToDom();
      if (event instanceof NavigationEnd) {
        console.log('navigation end');
        executeQueue(this);
      } else if (event instanceof NavigationStart) {
        console.log('navigation start');
        initializeQueue(this);
      }
    });
  }

  addEntryToQueue(entry: ActivateOutletData) {
    // console.log('adding to queue');
    this.routeQueue.push(entry);
  }
}

export async function executeQueue(delegate: RouterDelegate) {
  // console.log('executing queue');
  for (const entry of delegate.routeQueue) {
    // console.log('processing entry');
    await reconcileRoute(delegate, entry);
  }
  // console.log('done executing queue');
}

export async function reconcileRoute(delegate: RouterDelegate, toActivate: ActivateOutletData) {
  await wait(1000);
  const mountingData = await delegate.angularComponentMounter.attachViewToDom(
    toActivate.elementRef.nativeElement,
    null,
    toActivate.activatedRoute.component as Type<any>,
    toActivate.componentFactoryResolver,
    toActivate.injector,
    {},
    []
  );
  return toActivate.callback(mountingData);
}

export function initializeQueue(delegate: RouterDelegate) {
  // console.log('initializeQueue');
  delegate.routeQueue = [];
}

export interface ActivateOutletData {
  activatedRoute: ActivatedRoute;
  componentFactoryResolver: ComponentFactoryResolver;
  elementRef: ElementRef;
  injector: Injector;
  callback: (data: AngularMountingData) => void;
}

export function wait(duration: number = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
