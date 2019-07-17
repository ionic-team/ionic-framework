import { Location } from '@angular/common';
import { ComponentRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterDirection } from '@ionic/core';

import { bindLifecycleEvents } from '../../providers/angular-delegate';
import { NavController } from '../../providers/nav-controller';

import { RouteView, StackEvent, computeStackId, destroyView, getUrl, insertView, isTabSwitch, toSegments } from './stack-utils';

export class StackController {

  private views: RouteView[] = [];
  private runningTask?: Promise<any>;
  private skipTransition = false;
  private tabsPrefix: string[] | undefined;
  private activeView: RouteView | undefined;
  private nextId = 0;

  constructor(
    tabsPrefix: string | undefined,
    private containerEl: HTMLIonRouterOutletElement,
    private router: Router,
    private navCtrl: NavController,
    private zone: NgZone,
    private location: Location
  ) {
    this.tabsPrefix = tabsPrefix !== undefined ? toSegments(tabsPrefix) : undefined;
  }

  createView(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): RouteView {
    const url = getUrl(this.router, activatedRoute);
    const element = (ref && ref.location && ref.location.nativeElement) as HTMLElement;
    const unlistenEvents = bindLifecycleEvents(ref.instance, element);
    return {
      id: this.nextId++,
      stackId: computeStackId(this.tabsPrefix, url),
      unlistenEvents,
      element,
      ref,
      url,
    };
  }

  getExistingView(activatedRoute: ActivatedRoute): RouteView | undefined {
    const activatedUrlKey = getUrl(this.router, activatedRoute);
    return this.views.find(vw => vw.url === activatedUrlKey);
  }

  setActive(enteringView: RouteView): Promise<StackEvent> {
    let { direction, animation } = this.navCtrl.consumeTransition();
    const leavingView = this.activeView;
    const tabSwitch = isTabSwitch(enteringView, leavingView);
    if (tabSwitch) {
      direction = 'back';
      animation = undefined;
    }
    const viewsSnapshot = this.views.slice();

    let currentNavigation;

    const router = (this.router as any);

    // Angular >= 7.2.0
    if (router.getCurrentNavigation) {
      currentNavigation = router.getCurrentNavigation();

    // Angular < 7.2.0
    } else if (
      router.navigations &&
      router.navigations.value
    ) {
      currentNavigation = router.navigations.value;
    }

    /**
     * If the navigation action
     * sets `replaceUrl: true`
     * then we need to make sure
     * we remove the last item
     * from our views stack
     */
    if (
      currentNavigation &&
      currentNavigation.extras &&
      currentNavigation.extras.replaceUrl
    ) {
      if (this.views.length > 0) {
        this.views.splice(-1, 1);
      }
    }

    const views = this.insertView(enteringView, direction);
    return this.wait(() => {
      return this.transition(enteringView, leavingView, animation, this.canGoBack(1), false)
        .then(() => cleanupAsync(enteringView, views, viewsSnapshot, this.location))
        .then(() => ({
          enteringView,
          direction,
          animation,
          tabSwitch
        }));
    });
  }

  canGoBack(deep: number, stackId = this.getActiveStackId()): boolean {
    return this.getStack(stackId).length > deep;
  }

  pop(deep: number, stackId = this.getActiveStackId()) {
    return this.zone.run(() => {
      const views = this.getStack(stackId);
      if (views.length <= deep) {
        return Promise.resolve(false);
      }
      const view = views[views.length - deep - 1];
      let url = view.url;

      const viewSavedData = view.savedData;
      if (viewSavedData) {
        const primaryOutlet = viewSavedData.get('primary');
        if (
          primaryOutlet &&
          primaryOutlet.route &&
          primaryOutlet.route._routerState &&
          primaryOutlet.route._routerState.snapshot &&
          primaryOutlet.route._routerState.snapshot.url
        ) {
          url = primaryOutlet.route._routerState.snapshot.url;
        }
      }

      return this.navCtrl.navigateBack(url, view.savedExtras).then(() => true);
    });
  }

  startBackTransition() {
    const leavingView = this.activeView;
    if (leavingView) {
      const views = this.getStack(leavingView.stackId);
      const enteringView = views[views.length - 2];
      return this.wait(() => {
        return this.transition(
          enteringView, // entering view
          leavingView, // leaving view
          'back',
          true,
          true
        );
      });
    }
    return Promise.resolve();
  }

  endBackTransition(shouldComplete: boolean) {
    if (shouldComplete) {
      this.skipTransition = true;
      this.pop(1);
    }
  }

  getLastUrl(stackId?: string) {
    const views = this.getStack(stackId);
    return views.length > 0 ? views[views.length - 1] : undefined;
  }

  getActiveStackId(): string | undefined {
    return this.activeView ? this.activeView.stackId : undefined;
  }

  destroy() {
    this.containerEl = undefined!;
    this.views.forEach(destroyView);
    this.activeView = undefined;
    this.views = [];
  }

  private getStack(stackId: string | undefined) {
    return this.views.filter(v => v.stackId === stackId);
  }

  private insertView(enteringView: RouteView, direction: RouterDirection) {
    this.activeView = enteringView;
    this.views = insertView(this.views, enteringView, direction);
    return this.views.slice();
  }

  private transition(
    enteringView: RouteView | undefined,
    leavingView: RouteView | undefined,
    direction: 'forward' | 'back' | undefined,
    showGoBack: boolean,
    progressAnimation: boolean
  ) {
    if (this.skipTransition) {
      this.skipTransition = false;
      return Promise.resolve(false);
    }
    if (enteringView) {
      enteringView.ref.changeDetectorRef.reattach();
    }
    // TODO: disconnect leaving page from change detection to
    // reduce jank during the page transition
    // if (leavingView) {
    //   leavingView.ref.changeDetectorRef.detach();
    // }
    const enteringEl = enteringView ? enteringView.element : undefined;
    const leavingEl = leavingView ? leavingView.element : undefined;
    const containerEl = this.containerEl;
    if (enteringEl && enteringEl !== leavingEl) {
      enteringEl.classList.add('ion-page', 'ion-page-invisible');
      if (enteringEl.parentElement !== containerEl) {
        containerEl.appendChild(enteringEl);
      }

      return this.zone.runOutsideAngular(() => containerEl.commit(enteringEl, leavingEl, {
        deepWait: true,
        duration: direction === undefined ? 0 : undefined,
        direction,
        showGoBack,
        progressAnimation
      }));
    }
    return Promise.resolve(false);
  }

  private async wait<T>(task: () => Promise<T>): Promise<T> {
    if (this.runningTask !== undefined) {
      await this.runningTask;
      this.runningTask = undefined;
    }
    const promise = this.runningTask = task();
    return promise;
  }
}

function cleanupAsync(activeRoute: RouteView, views: RouteView[], viewsSnapshot: RouteView[], location: Location) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      cleanup(activeRoute, views, viewsSnapshot, location);
      resolve();
    });
  });
}

function cleanup(activeRoute: RouteView, views: RouteView[], viewsSnapshot: RouteView[], location: Location) {
  viewsSnapshot
    .filter(view => !views.includes(view))
    .forEach(destroyView);

  views.forEach(view => {
    /**
     * In the event that a user navigated multiple
     * times in rapid succession, we want to make sure
     * we don't pre-emptively detach a view while
     * it is in mid-transition.
     *
     * In this instance we also do not care about query
     * params or fragments as it will be the same view regardless
     */
    const locationWithoutParams = location.path().split('?')[0];
    const locationWithoutFragment = locationWithoutParams.split('#')[0];

    if (view !== activeRoute && view.url !== locationWithoutFragment) {
      const element = view.element;
      element.setAttribute('aria-hidden', 'true');
      element.classList.add('ion-page-hidden');
      view.ref.changeDetectorRef.detach();
    }
  });
}
