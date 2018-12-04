import { ComponentRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavController, NavDirection } from '../../providers/nav-controller';


export class StackController {

  private viewsSnapshot: RouteView[] = [];
  private views: RouteView[] = [];
  private runningTransition?: Promise<boolean>;
  private skipTransition = false;

  constructor(
    private stack: boolean,
    private containerEl: HTMLIonRouterOutletElement,
    private router: Router,
    private navCtrl: NavController,
    private zone: NgZone,
  ) {}

  createView(enteringRef: ComponentRef<any>, route: ActivatedRoute): RouteView {
    return {
      ref: enteringRef,
      element: (enteringRef && enteringRef.location && enteringRef.location.nativeElement) as HTMLElement,
      url: this.getUrl(route)
    };
  }

  getExistingView(activatedRoute: ActivatedRoute): RouteView | undefined {
    const activatedUrlKey = this.getUrl(activatedRoute);
    return this.views.find(vw => vw.url === activatedUrlKey);
  }

  async setActive(enteringView: RouteView, direction: NavDirection, animated: boolean) {
    const leavingView = this.getActive();
    this.insertView(enteringView, direction);
    await this.transition(enteringView, leavingView, direction, animated, this.canGoBack(1), false);
    this.cleanup();
  }

  canGoBack(deep: number): boolean {
    return this.views.length > deep;
  }

  pop(deep: number) {
    this.zone.run(() => {
      const view = this.views[this.views.length - deep - 1];
      this.navCtrl.navigateBack(view.url);
    });
  }

  startBackTransition() {
    this.transition(
      this.views[this.views.length - 2], // entering view
      this.views[this.views.length - 1], // leaving view
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


  private insertView(enteringView: RouteView, direction: NavDirection) {
    // no stack
    if (!this.stack) {
      this.views = [enteringView];
      return;
    }

    // stack setRoot
    if (direction === 'root') {
      this.views = [enteringView];
      return;
    }

    // stack
    const index = this.views.indexOf(enteringView);
    if (index >= 0) {
      this.views = this.views.slice(0, index + 1);
    } else {
      if (direction === 'forward') {
        this.views.push(enteringView);
      } else {
        this.views = [enteringView];
      }
    }
  }

  private cleanup() {
    const views = this.views;
    this.viewsSnapshot
      .filter(view => !views.includes(view))
      .forEach(view => destroyView(view));

    for (let i = 0; i < views.length - 1; i++) {
      const view = views[i];
      const element = view.element;
      element.setAttribute('aria-hidden', 'true');
      element.classList.add('ion-page-hidden');
      // view.ref.changeDetectorRef.detach();
    }

    this.viewsSnapshot = views.slice();
  }

  getActive(): RouteView | undefined {
    const views = this.views;
    return views.length > 0 ? views[views.length - 1] : undefined;
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

  private getUrl(activatedRoute: ActivatedRoute) {
    const urlTree = this.router.createUrlTree(['.'], { relativeTo: activatedRoute });
    return this.router.serializeUrl(urlTree);
  }
}

function destroyView(view: RouteView) {
  if (view) {
    // TODO lifecycle event
    view.ref.destroy();
  }
}

export interface RouteView {
  url: string;
  element: HTMLElement;
  ref: ComponentRef<any>;
  savedData?: any;
}
