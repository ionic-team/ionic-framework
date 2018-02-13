import { Injectable } from '@angular/core';
import {
  Event,
  NavigationEnd,
  Router
} from '@angular/router';

import { ensureExternalRounterController } from '../util/util';

@Injectable()
export class RouteEventHandler {

  constructor(private router: Router) {

    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        ensureExternalRounterController().then((element) => {
          element.updateExternalNavOccuring(false);
        });
      }
    });
  }

  externalNavStart() {
    return ensureExternalRounterController().then((element) => {
      element.updateExternalNavOccuring(true);
    });
  }
}

