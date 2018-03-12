import { ComponentRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';


export function attachView(views: RouteView[], location: ViewContainerRef, ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
  initRouteViewElm(views, ref, activatedRoute);
  location.insert(ref.hostView);
}


export function initRouteViewElm(views: RouteView[], ref: ComponentRef<any>, activatedRoute: ActivatedRoute) {
  views.push({
    ref: ref,
    urlKey: getUrlKey(activatedRoute),
    deactivatedId: -1
  });

  (ref.location.nativeElement as HTMLElement).classList.add('ion-page');
}


export function getExistingView(views: RouteView[], activatedRoute: ActivatedRoute) {
  return views.find(vw => {
    return isMatchingActivatedRoute(vw.urlKey, activatedRoute);
  });
}


function isMatchingActivatedRoute(existingUrlKey: string, activatedRoute: ActivatedRoute) {
  const activatedUrlKey = getUrlKey(activatedRoute);

  return activatedUrlKey === existingUrlKey;
}


export function getLastDeactivatedRef(views: RouteView[]) {
  if (views.length < 2) {
    return null;
  }

  return views.sort((a, b) => {
    if (a.deactivatedId > b.deactivatedId) return -1;
    if (a.deactivatedId < b.deactivatedId) return 1;
    return 0;
  })[0].ref;
}


function getUrlKey(activatedRoute: ActivatedRoute) {
  const url: UrlSegment[] = (activatedRoute.url as any).value;

  return url.map(u => {
    return u.path + '$$' + JSON.stringify(u.parameters);
  }).join('/');
}


export function deactivateView(views: RouteView[], ref: ComponentRef<any>) {
  const view = views.find(vw => vw.ref === ref);
  if (view) {
    view.deactivatedId = deactivatedIds++;
  }
}


export function destoryViews(views: RouteView[]) {
  views.forEach(vw => {
    vw.ref.destroy();
  });
  views.length = 0;
}


export interface RouteView {
  urlKey: string;
  ref: ComponentRef<any>;
  deactivatedId: number;
}


let deactivatedIds = 0;
