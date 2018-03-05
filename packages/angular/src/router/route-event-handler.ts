import { Injectable } from '@angular/core';
import {
  Event,
  NavigationEnd,
  Router
} from '@angular/router';

import { getIonApp } from '../util/util';

@Injectable()
export class RouteEventHandler {

  constructor(public router: Router) {

    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        getIonApp().then((appElement) => {
          appElement.updateExternalNavOccuring(false);
        });
      }
    });
  }

  externalNavStart() {
    return getIonApp().then((appElement) => {
      appElement.updateExternalNavOccuring(true);
    });
  }
}

