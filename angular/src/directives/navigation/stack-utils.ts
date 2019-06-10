import { ComponentRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavDirection, RouterDirection } from '@ionic/core';

export function insertView(views: RouteView[], view: RouteView, direction: RouterDirection) {
  if (direction === 'root') {
    return setRoot(views, view);
  } else if (direction === 'forward') {
    return setForward(views, view);
  } else {
    return setBack(views, view);
  }
}

function setRoot(views: RouteView[], view: RouteView) {
  views = views.filter(v => v.stackId !== view.stackId);
  views.push(view);
  return views;
}

function setForward(views: RouteView[], view: RouteView) {
  const index = views.indexOf(view);
  if (index >= 0) {
    views = views.filter(v => v.stackId !== view.stackId || v.id <= view.id);
  } else {
    views.push(view);
  }
  return views;
}

function setBack(views: RouteView[], view: RouteView) {
  const index = views.indexOf(view);
  if (index >= 0) {
    return views.filter(v => v.stackId !== view.stackId || v.id <= view.id);
  } else {
    return setRoot(views, view);
  }
}

export function getUrl(router: Router, activatedRoute: ActivatedRoute) {
  const urlTree = router.createUrlTree(['.'], { relativeTo: activatedRoute });
  return router.serializeUrl(urlTree);
}

export function isTabSwitch(enteringView: RouteView, leavingView: RouteView | undefined) {
  if (!leavingView) {
    return true;
  }
  return enteringView.stackId !== leavingView.stackId;
}

export function computeStackId(prefixUrl: string[] | undefined, url: string) {
  if (!prefixUrl) {
    return undefined;
  }
  const segments = toSegments(url);
  for (let i = 0; i < segments.length; i++) {
    if (i >= prefixUrl.length) {
      return segments[i];
    }
    if (segments[i] !== prefixUrl[i]) {
      return undefined;
    }
  }
  return undefined;
}

export function toSegments(path: string): string[] {
  return path
    .split('/')
    .map(s => s.trim())
    .filter(s => s !== '');
}

export function destroyView(view: RouteView | undefined) {
  if (view) {
    // TODO lifecycle event
    view.ref.destroy();
    view.unlistenEvents();
  }
}

export interface StackEvent {
  enteringView: RouteView;
  direction: RouterDirection;
  animation: NavDirection | undefined;
  tabSwitch: boolean;
}

export interface RouteView {
  id: number;
  url: string;
  stackId: string | undefined;
  element: HTMLElement;
  ref: ComponentRef<any>;
  savedData?: any;
  savedExtras?: NavigationExtras;
  unlistenEvents: () => void;
}
