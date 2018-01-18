import {
  ApplicationRef,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  Injectable,
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

import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

let queue: any[];

@Injectable()
export class RouterIntegration {

  private outletRef: ElementRef;

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private router: Router) {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationStart)).subscribe((event: any) => {
      // console.log('event: ', event);
      // this.renderRouteToDom();
      if (event instanceof NavigationEnd) {
        executeQueue();
      } else if (event instanceof NavigationStart) {
        initializeQueue();
      }
    });
  }
}

export function executeQueue() {
  console.log('Executing the queue');
}

export function initializeQueue() {
  console.log('initializeQueue');
  queue = [];
}
