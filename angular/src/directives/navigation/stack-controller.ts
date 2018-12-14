import { ComponentRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterDirection } from '@ionic/core';

import { NavController, NavDirection } from '../../providers/nav-controller';

import { RouteView, computeStackId, destroyView, getUrl, insertView, isTabSwitch, toSegments } from './stack-utils';

export class StackController {

  private viewsSnapshot: RouteView[] = [];
  private views: RouteView[] = [];
  private runningTransition?: Promise<boolean>;
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
  ) {
    this.tabsPrefix = tabsPrefix !== undefined ? toSegments(tabsPrefix) : undefined;
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
    const leavingView = this.activeView;
    if (isTabSwitch(enteringView, leavingView)) {
      direction = 'back';
      animated = false;
    }
    this.insertView(enteringView, direction);
    await this.transition(enteringView, leavingView, direction, animated, this.canGoBack(1), false);
    this.cleanup();
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

  startBackTransition(stackId = this.getActiveStackId()) {
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

  getLastUrl(stackId?: string) {
    const views = this.getStack(stackId);
    return views.length > 0 ? views[views.length - 1] : undefined;
  }

  private getActiveStackId(): string | undefined {
    return this.activeView ? this.activeView.stackId : undefined;
  }

  private getStack(stackId: string | undefined) {
    return this.views.filter(v => v.stackId === stackId);
  }

  private insertView(enteringView: RouteView, direction: RouterDirection) {
    this.activeView = enteringView;
    this.views = insertView(this.views, enteringView, direction);
  }

  private cleanup() {
    const activeRoute = this.activeView;
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
    if (this.runningTransition !== undefined) {
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
