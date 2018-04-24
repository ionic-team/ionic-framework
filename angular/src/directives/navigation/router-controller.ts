import { ComponentRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavController } from '../../providers/nav-controller';


export class StackController {

  private viewsSnapshot: RouteView[] = [];
  private views: RouteView[] = [];

  constructor(
    private stack: boolean,
    private containerEl: HTMLIonRouterOutletElement,
    private router: Router,
    private navCtrl: NavController,
  ) {}

  createView(enteringRef: ComponentRef<any>, route: ActivatedRoute): RouteView {
    return {
      ref: enteringRef,
      element: (enteringRef && enteringRef.location && enteringRef.location.nativeElement) as HTMLElement,
      url: this.getUrl(route),
      deactivatedId: -1
    };
  }

  getExistingView(activatedRoute: ActivatedRoute): RouteView|null {
    const activatedUrlKey = this.getUrl(activatedRoute);
    return this.views.find(vw => vw.url === activatedUrlKey);
  }

  canGoBack(deep: number): boolean {
    return this.views.length > deep;
  }

  async setActive(enteringView: RouteView, direction: number, animated: boolean) {
    const leavingView = this.getActive();
    this.insertView(enteringView, direction);
    await this.transition(enteringView, leavingView, direction, animated, this.canGoBack(1));

    this.cleanup();
  }

  pop(deep: number) {
    const view = this.views[this.views.length - deep - 1];
    this.navCtrl.goBack(view.url);
  }

  private insertView(enteringView: RouteView, direction: number) {
    // no stack
    if (!this.stack) {
      this.views = [enteringView];
      return;
    }

    // stack setRoot
    if (direction === 0) {
      this.views = [enteringView];
      return;
    }

    // stack
    const index = this.views.indexOf(enteringView);
    if (index >= 0) {
      this.views = this.views.slice(0, index + 1);
    } else {
      if (direction === 1) {
        this.views.push(enteringView);
      } else {
        this.views = [enteringView];
      }
    }
  }

  private cleanup() {
    this.viewsSnapshot
      .filter(view => !this.views.includes(view))
      .forEach(view => destroyView(view));

    for (let i = 0; i < this.views.length - 1; i++) {
      this.views[i].element.hidden = true;
    }
    this.viewsSnapshot = this.views.slice();
  }

  getActive(): RouteView | null {
    return this.views.length > 0 ? this.views[this.views.length - 1] : null;
  }

  private async transition(
    enteringView: RouteView,
    leavingView: RouteView,
    direction: number,
    animated: boolean,
    showGoBack: boolean
  ) {
    const enteringEl = enteringView ? enteringView.element : undefined;
    const leavingEl = leavingView ? leavingView.element : undefined;
    const containerEl = this.containerEl;
    if (enteringEl && enteringEl !== leavingEl) {
      enteringEl.classList.add('ion-page', 'hide-page');
      containerEl.appendChild(enteringEl);

      await containerEl.componentOnReady();
      await containerEl.commit(enteringEl, leavingEl, {
        duration: !animated ? 0 : undefined,
        direction: direction === 1 ? 'forward' : 'back',
        deepWait: true,
        showGoBack
      });
    }
  }

  private getUrl(activatedRoute: ActivatedRoute) {
    const urlTree = this.router.createUrlTree(['.'], { relativeTo: activatedRoute });
    return this.router.serializeUrl(urlTree);
  }

}

export function destroyView(view: RouteView) {
  if (view) {
    // TODO lifecycle event
    view.ref.destroy();
  }
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

export interface RouteView {
  url: string;
  element: HTMLElement;
  ref: ComponentRef<any>;
  deactivatedId: number;
}
