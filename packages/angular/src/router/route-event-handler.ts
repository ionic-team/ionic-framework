import { Injectable } from '@angular/core';
import {
  Event,
  NavigationEnd,
  NavigationStart,
  Router
} from '@angular/router';

let initialized = false;

@Injectable()
export class RouteEventHandler {

  constructor(private router: Router) {
    (window as any).externalNav = false;

    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        (window as any).externalNav = false;
      }
    });
  }

  externalNavStart() {
    (window as any).externalNav = true;
  }
}