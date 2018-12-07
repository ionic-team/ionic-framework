import { ComponentRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavController, NavDirection } from '../../providers/nav-controller';


export class StackController {

  private viewsSnapshot: RouteView[] = [];
  private views: RouteView[] = [];
  private runningTransition?: Promise<boolean>;
  private skipTransition = false;
  private tabsPrefix: string[] | undefined;
  private activeView: RouteView | undefined;
  private nextId = 0;

  constructor(
    private stack: boolean,
    tabsPrefix: string | undefined,
    private containerEl: HTMLIonRouterOutletElement,
    private router: Router,
    private navCtrl: NavController,
    private zone: NgZone,
  ) {
    this.tabsPrefix = tabsPrefix ? toSegments(tabsPrefix) : undefined;
    if (this.tabsPrefix) {
      this.stack = true;
    }
  }

  createView(enteringRef: ComponentRef<any>, activatedRoute: ActivatedRoute): RouteView {
    const url = getUrl(this.router, activatedRoute);
    return {
      id: this.nextId++,
      ref: enteringRef,
      element: (enteringRef && enteringRef.location && enteringRef.location.nativeElement) as HTMLElement,
      stackId: computeStackId(this.tabsPrefix, url),
      url,
    };
  }

  getExistingView(activatedRoute: ActivatedRoute): RouteView | undefined {
    const activatedUrlKey = getUrl(this.router, activatedRoute);
    return this.views.find(vw => vw.url === activatedUrlKey);
  }

  async setActive(enteringView: RouteView) {
    let { direction, animated } = this.navCtrl.consumeTransition();
    const leavingView = this.getActive();
    if (isTabSwitch(enteringView, leavingView)) {
      direction = 'forward';
      animated = false;
    }
    this.insertView(enteringView, direction);
    await this.transition(enteringView, leavingView, direction, animated, this.canGoBack(1), false);
    this.cleanup(enteringView);
  }

  canGoBack(deep: number, stackId = this.getActiveStackId()): boolean {
    return this.getStack(stackId).length > deep;
  }

  pop(deep: number, stackId = this.getActiveStackId()) {
    this.zone.run(() => {
      const views = this.getStack(stackId);
      const view = views[views.length - deep - 1];
      this.navCtrl.navigateBack(view.url);
    });
  }

  getStack(stackId: string | undefined) {
    return this.views.filter(v => v.stackId === stackId);
  }

  startBackTransition(stackId?: string) {
    const views = this.getStack(stackId);
    this.transition(
      views[views.length - 2], // entering view
      views[views.length - 1], // leaving view
      'back',
      true,
      true,
      true
    );
  }

  endBackTransition(shouldComplete: boolean) {
    if (shouldComplete) {
      this.skipTransition = true;
      this.pop(1);
    }
  }

  getActiveStackId(): string | undefined {
    return this.activeView ? this.activeView.stackId : undefined;
  }

  getActive(): RouteView | undefined {
    return this.activeView;
  }

  getLastUrl(stackId?: string) {
    const views = this.getStack(stackId);
    return views.length > 0 ? views[views.length - 1] : undefined;
  }

  private insertView(enteringView: RouteView, direction: NavDirection) {
    // no stack
    this.activeView = enteringView;
    if (!this.stack) {
      this.views = [enteringView];
      return;
    }

    // stack setRoot
    if (direction === 'root') {
      this.views = this.views.filter(v => v.stackId !== enteringView.stackId);
      this.views.push(enteringView);
      return;
    }

    // stack
    const index = this.views.indexOf(enteringView);
    if (index >= 0) {
      this.views = this.views.filter(v => v.stackId !== enteringView.stackId || v.id <= enteringView.id);
    } else {
      if (direction === 'forward') {
        this.views.push(enteringView);
      } else {
        this.views = this.views.filter(v => v.stackId !== enteringView.stackId);
        this.views.push(enteringView);
      }
    }
  }

  private cleanup(activeRoute: RouteView) {
    const views = this.views;
    this.viewsSnapshot
      .filter(view => !views.includes(view))
      .forEach(view => destroyView(view));

    views.forEach(view => {
      if (view !== activeRoute) {
        const element = view.element;
        element.setAttribute('aria-hidden', 'true');
        element.classList.add('ion-page-hidden');
      }
    });
    this.viewsSnapshot = views.slice();
  }

  private async transition(
    enteringView: RouteView | undefined,
    leavingView: RouteView | undefined,
    direction: NavDirection,
    animated: boolean,
    showGoBack: boolean,
    progressAnimation: boolean
  ) {
    if (this.runningTransition) {
      await this.runningTransition;
      this.runningTransition = undefined;
    }
    if (this.skipTransition) {
      this.skipTransition = false;
      return;
    }
    // TODO
    // if (enteringView) {
    //   enteringView.ref.changeDetectorRef.reattach();
    //   enteringView.ref.changeDetectorRef.markForCheck();
    // }
    const enteringEl = enteringView ? enteringView.element : undefined;
    const leavingEl = leavingView ? leavingView.element : undefined;
    const containerEl = this.containerEl;
    if (enteringEl && enteringEl !== leavingEl) {
      enteringEl.classList.add('ion-page', 'ion-page-invisible');
      if (enteringEl.parentElement !== containerEl) {
        containerEl.appendChild(enteringEl);
      }

      await containerEl.componentOnReady();
      this.runningTransition = containerEl.commit(enteringEl, leavingEl, {
        duration: !animated ? 0 : undefined,
        direction: direction === 'forward' ? 'forward' : 'back', // TODO: refactor
        deepWait: true,
        showGoBack,
        progressAnimation
      });
      await this.runningTransition;
    }
  }
}

export function getUrl(router: Router, activatedRoute: ActivatedRoute) {
  const urlTree = router.createUrlTree(['.'], { relativeTo: activatedRoute });
  return router.serializeUrl(urlTree);
}

function isTabSwitch(enteringView: RouteView, leavingView: RouteView | undefined) {
  if (!leavingView) {
    return false;
  }
  return enteringView.stackId !== leavingView.stackId;
}

function destroyView(view: RouteView) {
  if (view) {
    // TODO lifecycle event
    view.ref.destroy();
  }
}

function computeStackId(prefixUrl: string[] | undefined, url: string) {
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

function toSegments(path: string): string[] {
  return path
    .split('/')
    .map(s => s.trim())
    .filter(s => s !== '');
}

export interface RouteView {
  id: number;
  url: string;
  stackId: string | undefined;
  element: HTMLElement;
  ref: ComponentRef<any>;
  savedData?: any;
}
