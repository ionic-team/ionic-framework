import {
  Location
} from '@angular/common';

import {
  ApplicationRef,
  Compiler,
  Injector,
  ModuleWithProviders,
  NgModule,
  NgModuleFactoryLoader,
  Optional,
} from '@angular/core';

import {ɵgetDOM as getDOM} from '@angular/platform-browser';

import {
  ROUTES,
  ROUTER_CONFIGURATION,
  ChildrenOutletContexts,
  ExtraOptions,
  Route,
  Router,
  RouteReuseStrategy,
  UrlHandlingStrategy,
  UrlSerializer
} from '@angular/router';

import { IonicAngularModule } from '../module';

import { PushPopOutletContexts } from './router/push-pop-outlet-contexts';
import { CustomRouter } from './router/router';
import { IonNav  } from './ion-nav';
import { flatten } from '../util/util';

@NgModule({
  declarations: [
    IonNav
  ],
  imports: [
    IonicAngularModule
  ],
  exports: [
    IonNav
  ]
})
export class IonicRouterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicRouterModule,
      providers: [
        {
          provide: ChildrenOutletContexts,
          useClass: PushPopOutletContexts
        },
        {
          provide: Router,
          useFactory: setupRouter,
          deps: [
            ApplicationRef, UrlSerializer, ChildrenOutletContexts, Location, Injector,
            NgModuleFactoryLoader, Compiler, ROUTES, ROUTER_CONFIGURATION,
            [UrlHandlingStrategy, new Optional()], [RouteReuseStrategy, new Optional()]
          ]
        },
      ]
    };
  }
}

export function setupRouter(
  ref: ApplicationRef, urlSerializer: UrlSerializer, contexts: ChildrenOutletContexts,
  location: Location, injector: Injector, loader: NgModuleFactoryLoader, compiler: Compiler,
  config: Route[][], opts: ExtraOptions = {}, urlHandlingStrategy?: UrlHandlingStrategy,
  routeReuseStrategy?: RouteReuseStrategy) {

const router = new CustomRouter(
    null, urlSerializer, contexts, location, injector, loader, compiler, flatten(config));

if (urlHandlingStrategy) {
  router.urlHandlingStrategy = urlHandlingStrategy;
}

if (routeReuseStrategy) {
  router.routeReuseStrategy = routeReuseStrategy;
}

if (opts.errorHandler) {
  router.errorHandler = opts.errorHandler;
}

if (opts.enableTracing) {
  const dom = getDOM();
  router.events.subscribe((e: any) => {
    dom.logGroup(`Router Event: ${(<any>e.constructor).name}`);
    dom.log(e.toString());
    dom.log(e);
    dom.logGroupEnd();
  });
}

if (opts.onSameUrlNavigation) {
  router.onSameUrlNavigation = opts.onSameUrlNavigation;
}

if (opts.paramsInheritanceStrategy) {
  router.paramsInheritanceStrategy = opts.paramsInheritanceStrategy;
}

return router;
}