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
  NavigationEnd,
  Router,
  UrlSegment
} from '@angular/router';

import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

const cfrMap = new Map<string, ComponentFactoryResolver>();
let activeRoute: ActivatedRoute = null;

@Injectable()
export class RouterIntegration {

  private outletRef: ElementRef;

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private router: Router) {

    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      console.log('event: ', event);
      this.renderRouteToDom();
    });
  }

  updateSegmentToResolver(route: ActivatedRoute, cfr: ComponentFactoryResolver, outletRef: ElementRef) {
    this.outletRef = outletRef;
    activeRoute = route;
    return getUrl(route.url).then((url) => {
      console.log('url: ', url);
      cfrMap.set(url, cfr);
    });
  }

  async renderRouteToDom() {
    const snapshot = (activeRoute as any)._futureSnapshot as ActivatedRouteSnapshot;
    const component = snapshot.routeConfig.component;
    const url = await getUrl(activeRoute.url);
    const resolverToUse = cfrMap.get(url) || this.componentFactoryResolver;
    const factory = resolverToUse.resolveComponentFactory(component);

    const hostElement = document.createElement(factory.selector);
   // const childContexts = this._parentContexts.getOrCreateContext(this._name).children;
    const componentRef = factory.create(this.injector, [], hostElement);
    this.appRef.attachView(componentRef.hostView);
    (this.outletRef.nativeElement).appendChild(hostElement);
  }
}

function getUrl(urlObservable: Observable<UrlSegment[]>): Promise<string> {
  return new Promise((resolve) => {
    urlObservable.pipe(map(url => url.join(''))).subscribe((url) => {
      resolve(url);
    });
  });
}
