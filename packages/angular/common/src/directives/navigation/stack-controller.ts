import { Location } from '@angular/common';
import { ComponentRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type { AnimationBuilder, NavDirection, RouterDirection } from '@ionic/core/components';

import { bindLifecycleEvents } from '../../providers/angular-delegate';
import { NavController } from '../../providers/nav-controller';

import {
  RouteView,
  StackDidChangeEvent,
  computeStackId,
  destroyView,
  getUrl,
  insertView,
  isTabSwitch,
  toSegments,
} from './stack-utils';

// TODO(FW-2827): types

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
    const element = ref?.location?.nativeElement as HTMLElement;
    const unlistenEvents = bindLifecycleEvents(this.zone, ref.instance, element);
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
    const view = this.views.find((vw) => vw.url === activatedUrlKey);
    if (view) {
      view.ref.changeDetectorRef.reattach();
    }
    return view;
  }

  setActive(enteringView: RouteView): Promise<StackDidChangeEvent> {
    const { isDirectionBasedOnNavigationIds, ...consumeResult } = this.navCtrl.consumeTransition();
    let { direction, animation, animationBuilder } = consumeResult;

    const viewsSnapshot = this.views.slice();

    const currentNavigation = this.router.getCurrentNavigation();

    /**
     * If the navigation action sets `replaceUrl: true` then we need to make sure
     * we remove the last item from our views stack
     */
    if (currentNavigation?.extras?.replaceUrl && currentNavigation?.trigger !== 'popstate') {
      if (this.views.length > 0) {
        this.views.splice(-1, 1);
      }
    }

    // determine direction based on the order of the views in the stack
    const leavingView = this.activeView;
    const isEnteringViewReused = this.views.includes(enteringView);
    const leavingViewIndex = leavingView ? this.views.indexOf(leavingView) : -1;
    const enteringViewIndex = isEnteringViewReused ? this.views.indexOf(enteringView) : this.views.length;
    const suggestedDirectionBasedOnStackOrder: NavDirection | undefined =
      leavingViewIndex === -1 ? undefined : enteringViewIndex < leavingViewIndex ? 'back' : 'forward';

    /**
     * The user triggered a back navigation on a page that was navigated to with root. In this case, the new page
     * becomes the root and the leavingView is removed.
     *
     * This can happen e.g. when navigating to a page with navigateRoot and then using the browser back button
     */
    const isPopStateTransitionFromRootPage =
      direction === 'back' &&
      isDirectionBasedOnNavigationIds &&
      leavingView?.root &&
      currentNavigation?.trigger === 'popstate';

    /**
     * whether direction based on stack order takes precedence over direction based on navigation ids
     *
     * only applied if the user did not explicitly set the direction
     * (e.g. via the NavController, routerLink directive etc.)
     */
    const useDirectionBasedOnStackOrder = isDirectionBasedOnNavigationIds && suggestedDirectionBasedOnStackOrder;

    if (isPopStateTransitionFromRootPage) {
      direction = 'root';
      animation = undefined;

      if (leavingViewIndex >= 0) {
        this.views.splice(leavingViewIndex, 1);
      }
    } else if (useDirectionBasedOnStackOrder) {
      direction = suggestedDirectionBasedOnStackOrder;
      animation = suggestedDirectionBasedOnStackOrder;
    }

    const tabSwitch = isTabSwitch(enteringView, leavingView);
    if (tabSwitch) {
      direction = 'back';
      animation = undefined;
    }

    const views = this.insertView(enteringView, direction);

    // Trigger change detection before transition starts
    // This will call ngOnInit() the first time too, just after the view
    // was attached to the dom, but BEFORE the transition starts
    if (!isEnteringViewReused) {
      enteringView.ref.changeDetectorRef.detectChanges();
    }

    /**
     * If we are going back from a page that
     * was presented using a custom animation
     * we should default to using that
     * unless the developer explicitly
     * provided another animation.
     */
    const customAnimation = enteringView.animationBuilder;
    if (animationBuilder === undefined && direction === 'back' && !tabSwitch && customAnimation !== undefined) {
      animationBuilder = customAnimation;
    }

    /**
     * Save any custom animation so that navigating
     * back will use this custom animation by default.
     */
    if (leavingView) {
      leavingView.animationBuilder = animationBuilder;
    }

    // Wait until previous transitions finish
    return this.zone.runOutsideAngular(() => {
      return this.wait(() => {
        // disconnect leaving page from change detection to
        // reduce jank during the page transition
        if (leavingView) {
          leavingView.ref.changeDetectorRef.detach();
        }
        // In case the enteringView is the same as the leavingPage we need to reattach()
        enteringView.ref.changeDetectorRef.reattach();

        return this.transition(enteringView, leavingView, animation, this.canGoBack(1), false, animationBuilder)
          .then(() => cleanupAsync(enteringView, views, viewsSnapshot, this.location, this.zone))
          .then(() => ({
            enteringView,
            direction,
            animation,
            tabSwitch,
          }));
      });
    });
  }

  canGoBack(deep: number, stackId = this.getActiveStackId()): boolean {
    return this.getStack(stackId).length > deep;
  }

  pop(deep: number, stackId = this.getActiveStackId()): Promise<boolean> {
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
        if (primaryOutlet?.route?._routerState?.snapshot.url) {
          url = primaryOutlet.route._routerState.snapshot.url;
        }
      }
      const { animationBuilder } = this.navCtrl.consumeTransition();
      return this.navCtrl.navigateBack(url, { ...view.savedExtras, animation: animationBuilder }).then(() => true);
    });
  }

  startBackTransition(): Promise<boolean> | Promise<void> {
    const leavingView = this.activeView;
    if (leavingView) {
      const views = this.getStack(leavingView.stackId);
      const enteringView = views[views.length - 2];
      const customAnimation = enteringView.animationBuilder;

      return this.wait(() => {
        return this.transition(
          enteringView, // entering view
          leavingView, // leaving view
          'back',
          this.canGoBack(2),
          true,
          customAnimation
        );
      });
    }
    return Promise.resolve();
  }

  endBackTransition(shouldComplete: boolean): void {
    if (shouldComplete) {
      this.skipTransition = true;
      this.pop(1);
    } else if (this.activeView) {
      cleanup(this.activeView, this.views, this.views, this.location, this.zone);
    }
  }

  getLastUrl(stackId?: string): RouteView | undefined {
    const views = this.getStack(stackId);
    return views.length > 0 ? views[views.length - 1] : undefined;
  }

  /**
   * @internal
   */
  getRootUrl(stackId?: string): RouteView | undefined {
    const views = this.getStack(stackId);
    return views.length > 0 ? views[0] : undefined;
  }

  getActiveStackId(): string | undefined {
    return this.activeView ? this.activeView.stackId : undefined;
  }

  /**
   * @internal
   */
  getActiveView(): RouteView | undefined {
    return this.activeView;
  }

  hasRunningTask(): boolean {
    return this.runningTask !== undefined;
  }

  destroy(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.containerEl = undefined!;
    this.views.forEach(destroyView);
    this.activeView = undefined;
    this.views = [];
  }

  private getStack(stackId: string | undefined) {
    return this.views.filter((v) => v.stackId === stackId);
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
    progressAnimation: boolean,
    animationBuilder?: AnimationBuilder
  ) {
    if (this.skipTransition) {
      this.skipTransition = false;
      return Promise.resolve(false);
    }
    if (leavingView === enteringView) {
      return Promise.resolve(false);
    }
    const enteringEl = enteringView ? enteringView.element : undefined;
    const leavingEl = leavingView ? leavingView.element : undefined;
    const containerEl = this.containerEl;
    if (enteringEl && enteringEl !== leavingEl) {
      enteringEl.classList.add('ion-page');
      enteringEl.classList.add('ion-page-invisible');
      if (enteringEl.parentElement !== containerEl) {
        containerEl.appendChild(enteringEl);
      }

      if ((containerEl as any).commit) {
        return containerEl.commit(enteringEl, leavingEl, {
          duration: direction === undefined ? 0 : undefined,
          direction,
          showGoBack,
          progressAnimation,
          animationBuilder,
        });
      }
    }
    return Promise.resolve(false);
  }

  private async wait<T>(task: () => Promise<T>): Promise<T> {
    if (this.runningTask !== undefined) {
      await this.runningTask;
      this.runningTask = undefined;
    }
    const promise = (this.runningTask = task());
    promise.finally(() => (this.runningTask = undefined));
    return promise;
  }
}

const cleanupAsync = (
  activeRoute: RouteView,
  views: RouteView[],
  viewsSnapshot: RouteView[],
  location: Location,
  zone: NgZone
) => {
  if (typeof (requestAnimationFrame as any) === 'function') {
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        cleanup(activeRoute, views, viewsSnapshot, location, zone);
        resolve();
      });
    });
  }
  return Promise.resolve();
};

const cleanup = (
  activeRoute: RouteView,
  views: RouteView[],
  viewsSnapshot: RouteView[],
  location: Location,
  zone: NgZone
) => {
  /**
   * Re-enter the Angular zone when destroying page components. This will allow
   * lifecycle events (`ngOnDestroy`) to be run inside the Angular zone.
   */
  zone.run(() => viewsSnapshot.filter((view) => !views.includes(view)).forEach(destroyView));

  views.forEach((view) => {
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
};
