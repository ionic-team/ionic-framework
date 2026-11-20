import { Location } from '@angular/common';
import { Injectable, Optional } from '@angular/core';
import {
  NavigationExtras,
  Router,
  UrlSerializer,
  UrlTree,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  NavigationSkipped,
} from '@angular/router';
import type { AnimationBuilder, NavDirection, RouterDirection } from '@ionic/core/components';

import { IonRouterOutlet } from '../directives/navigation/router-outlet';

import { Platform } from './platform';

export interface AnimationOptions {
  animated?: boolean;
  animation?: AnimationBuilder;
  animationDirection?: 'forward' | 'back';
}

export interface NavigationOptions extends NavigationExtras, AnimationOptions {}

@Injectable({
  providedIn: 'root',
})
export class NavController {
  private topOutlet?: IonRouterOutlet;
  private direction: 'forward' | 'back' | 'root' | 'auto' = DEFAULT_DIRECTION;
  private animated?: NavDirection = DEFAULT_ANIMATED;
  private animationBuilder?: AnimationBuilder;
  private guessDirection: RouterDirection = 'forward';
  private guessAnimation?: NavDirection;
  private lastNavId = -1;

  /**
   * Navigation ids of the history entries seen so far. `pop()` uses them to
   * tell whether the previous view is the entry directly behind.
   */
  private historyEntries: number[] = [];
  /** Index of the current entry in `historyEntries`, or `-1` when unknown. */
  private historyIndex = -1;
  /** How the navigation in progress changes history, applied on `NavigationEnd`. */
  private pendingEntry?: {
    id: number | undefined;
    kind: 'push' | 'replace' | 'restore' | 'none' | 'unknown';
    fromPath: string;
    restoredId?: number;
    /** Whether the browser was on the tracked entry when the navigation started. */
    fromTrackedEntry: boolean;
  };

  constructor(
    platform: Platform,
    private location: Location,
    private serializer: UrlSerializer,
    @Optional() private router?: Router
  ) {
    // Subscribe to router events to detect direction
    if (router) {
      router.events.subscribe((ev) => {
        if (ev instanceof NavigationStart) {
          // restoredState is set if the browser back/forward button is used
          const id = ev.restoredState ? ev.restoredState.navigationId : ev.id;
          this.guessDirection = this.guessAnimation = id < this.lastNavId ? 'back' : 'forward';
          this.lastNavId = this.guessDirection === 'forward' ? ev.id : id;

          const fromPath = this.location.path();
          const fromTrackedEntry = this.isOnCurrentHistoryEntry();
          if (ev.navigationTrigger === 'popstate') {
            this.pendingEntry = {
              id: ev.id,
              kind: 'restore',
              fromPath,
              fromTrackedEntry,
              restoredId: ev.restoredState?.navigationId,
            };
          } else if (ev.navigationTrigger === 'hashchange') {
            // The browser added or changed the entry itself.
            this.pendingEntry = { id: undefined, kind: 'unknown', fromPath, fromTrackedEntry };
          } else {
            const extras = router.getCurrentNavigation()?.extras ?? {};
            if (extras.skipLocationChange) {
              this.pendingEntry = { id: undefined, kind: 'none', fromPath, fromTrackedEntry };
            } else {
              this.pendingEntry = {
                id: ev.id,
                kind: extras.replaceUrl ? 'replace' : 'push',
                fromPath,
                fromTrackedEntry,
              };
            }
          }
        }

        if (ev instanceof NavigationEnd) {
          this.commitHistoryEntry(ev.id);
        }

        // Reset explicit direction when navigation is canceled (e.g., guard rejection)
        // to prevent stale direction from leaking into the next navigation
        if (ev instanceof NavigationCancel || ev instanceof NavigationError) {
          this.direction = DEFAULT_DIRECTION;
          this.animated = DEFAULT_ANIMATED;
          this.animationBuilder = undefined;

          /**
           * Drop the tracked history if the browser might not be on the tracked
           * entry anymore. An error can come after the URL was written, and the
           * router may have rewritten an untracked entry to look tracked.
           */
          const pending = this.pendingEntry;
          if (
            ev instanceof NavigationError ||
            pending?.kind === 'restore' ||
            !pending?.fromTrackedEntry ||
            !this.isOnCurrentHistoryEntry()
          ) {
            this.resetHistoryEntries();
          }
          this.pendingEntry = undefined;
        }
      });
    }

    // Subscribe to backButton events
    platform.backButton.subscribeWithPriority(0, (processNextHandler) => {
      this.pop();
      processNextHandler();
    });
  }

  /**
   * This method uses Angular's [Router](https://angular.io/api/router/Router) under the hood,
   * it's equivalent to calling `this.router.navigateByUrl()`, but it's explicit about the **direction** of the transition.
   *
   * Going **forward** means that a new page is going to be pushed to the stack of the outlet (ion-router-outlet),
   * and that it will show a "forward" animation by default.
   *
   * Navigating forward can also be triggered in a declarative manner by using the `[routerDirection]` directive:
   *
   * ```html
   * <a routerLink="/path/to/page" routerDirection="forward">Link</a>
   * ```
   */
  navigateForward(url: string | UrlTree | any[], options: NavigationOptions = {}): Promise<boolean> {
    this.setDirection('forward', options.animated, options.animationDirection, options.animation);
    return this.navigate(url, options);
  }

  /**
   * This method uses Angular's [Router](https://angular.io/api/router/Router) under the hood,
   * it's equivalent to calling:
   *
   * ```ts
   * this.navController.setDirection('back');
   * this.router.navigateByUrl(path);
   * ```
   *
   * Going **back** means that all the pages in the stack until the navigated page is found will be popped,
   * and that it will show a "back" animation by default.
   *
   * Navigating back can also be triggered in a declarative manner by using the `[routerDirection]` directive:
   *
   * ```html
   * <a routerLink="/path/to/page" routerDirection="back">Link</a>
   * ```
   */
  navigateBack(url: string | UrlTree | any[], options: NavigationOptions = {}): Promise<boolean> {
    this.setDirection('back', options.animated, options.animationDirection, options.animation);
    return this.navigate(url, options);
  }

  /**
   * This method uses Angular's [Router](https://angular.io/api/router/Router) under the hood,
   * it's equivalent to calling:
   *
   * ```ts
   * this.navController.setDirection('root');
   * this.router.navigateByUrl(path);
   * ```
   *
   * Going **root** means that all existing pages in the stack will be removed,
   * and the navigated page will become the single page in the stack.
   *
   * Navigating root can also be triggered in a declarative manner by using the `[routerDirection]` directive:
   *
   * ```html
   * <a routerLink="/path/to/page" routerDirection="root">Link</a>
   * ```
   */
  navigateRoot(url: string | UrlTree | any[], options: NavigationOptions = {}): Promise<boolean> {
    this.setDirection('root', options.animated, options.animationDirection, options.animation);
    return this.navigate(url, options);
  }

  /**
   * Same as [Location](https://angular.io/api/common/Location)'s back() method.
   * It will use the standard `window.history.back()` under the hood, but featuring a `back` animation
   * by default.
   */
  back(options: AnimationOptions = { animated: true, animationDirection: 'back' }): void {
    this.setDirection('back', options.animated, options.animationDirection, options.animation);
    return this.location.back();
  }

  /**
   * This methods goes back in the context of Ionic's stack navigation.
   *
   * It recursively finds the top active `ion-router-outlet` and calls `pop()`.
   * This is the recommended way to go back when you are using `ion-router-outlet`.
   *
   * Resolves to `true` if it was able to pop.
   */
  async pop(): Promise<boolean> {
    let outlet = this.topOutlet;

    while (outlet) {
      if (await outlet.pop()) {
        return true;
      } else {
        outlet = outlet.parentOutlet;
      }
    }

    return false;
  }

  /**
   * This methods specifies the direction of the next navigation performed by the Angular router.
   *
   * `setDirection()` does not trigger any transition, it just sets some flags to be consumed by `ion-router-outlet`.
   *
   * It's recommended to use `navigateForward()`, `navigateBack()` and `navigateRoot()` instead of `setDirection()`.
   */
  setDirection(
    direction: RouterDirection,
    animated?: boolean,
    animationDirection?: 'forward' | 'back',
    animationBuilder?: AnimationBuilder
  ): void {
    this.direction = direction;
    this.animated = getAnimation(direction, animated, animationDirection);
    this.animationBuilder = animationBuilder;
  }

  /**
   * @internal
   * Goes back one history entry with a `back` transition and resolves
   * once the router has handled it.
   */
  backInHistory(animationBuilder?: AnimationBuilder): Promise<void> {
    const settled = new Promise<void>((resolve) => {
      const sub = this.router!.events.subscribe((ev) => {
        if (ev instanceof NavigationSkipped) {
          // Nothing transitions, so clear the direction here.
          this.consumeTransition();
        }
        if (
          ev instanceof NavigationEnd ||
          ev instanceof NavigationCancel ||
          ev instanceof NavigationError ||
          ev instanceof NavigationSkipped
        ) {
          sub.unsubscribe();
          resolve();
        }
      });
    });
    this.back({ animation: animationBuilder });
    return settled;
  }

  /**
   * @internal
   * The id of the history entry the navigation in progress shows,
   * recorded on the view it activates.
   */
  getPendingHistoryEntryId(): number | undefined {
    return this.pendingEntry ? this.pendingEntry.id : this.router?.getCurrentNavigation()?.id;
  }

  /**
   * @internal
   * The id of the history entry currently shown, if known.
   */
  getCurrentHistoryEntryId(): number | undefined {
    return this.historyIndex >= 0 ? this.historyEntries[this.historyIndex] : undefined;
  }

  /**
   * @internal
   * Whether the given history entry is the one directly behind
   * the current entry, so going back in history lands on it.
   */
  isPreviousHistoryEntry(entryId: number | undefined): boolean {
    return (
      entryId !== undefined &&
      this.historyIndex > 0 &&
      this.isOnCurrentHistoryEntry() &&
      this.historyEntries[this.historyIndex - 1] === entryId
    );
  }

  /**
   * Entries added outside the router, like with `Location.go()`, aren't
   * tracked, so check the browser is on the tracked entry.
   */
  private isOnCurrentHistoryEntry(): boolean {
    const currentId = (this.location.getState() as { navigationId?: number } | null)?.navigationId;
    return this.historyIndex >= 0 && currentId === this.historyEntries[this.historyIndex];
  }

  private commitHistoryEntry(navigationId: number) {
    const pending = this.pendingEntry;
    this.pendingEntry = undefined;

    if (pending?.kind === 'none') {
      return;
    }

    let index = -1;
    if (pending?.kind === 'restore' && pending.restoredId !== undefined) {
      index = this.historyEntries.indexOf(pending.restoredId);
    } else if ((pending?.kind === 'push' || pending?.kind === 'replace') && pending.fromTrackedEntry) {
      index = this.historyIndex;
    }

    /**
     * There's no known entry to anchor to, so start over from this one. The
     * first navigation can start before this service is created.
     */
    if (pending === undefined || pending.kind === 'unknown' || index < 0) {
      this.historyEntries = [navigationId];
      this.historyIndex = 0;
      return;
    }

    /**
     * The router replaces the current entry instead of pushing when asked
     * to, or when the URL doesn't change. Like the router, compare the old
     * path without its hash to the new one with it.
     */
    const replaced = pending.kind !== 'push' || this.location.path(true) === pending.fromPath;
    if (!replaced) {
      index++;
      this.historyEntries.length = index;
    }
    // The router writes this navigation's id into the entry, replacing any old one.
    this.historyEntries[index] = navigationId;
    this.historyIndex = index;
  }

  private resetHistoryEntries() {
    this.historyEntries = [];
    this.historyIndex = -1;
  }

  /**
   * @internal
   */
  setTopOutlet(outlet: IonRouterOutlet): void {
    this.topOutlet = outlet;
  }

  /**
   * @internal
   */
  consumeTransition(): {
    direction: RouterDirection;
    animation: NavDirection | undefined;
    animationBuilder: AnimationBuilder | undefined;
  } {
    let direction: RouterDirection = 'root';
    let animation: NavDirection | undefined;
    const animationBuilder = this.animationBuilder;

    if (this.direction === 'auto') {
      direction = this.guessDirection;
      animation = this.guessAnimation;
    } else {
      animation = this.animated;
      direction = this.direction;
    }
    this.direction = DEFAULT_DIRECTION;
    this.animated = DEFAULT_ANIMATED;
    this.animationBuilder = undefined;

    return {
      direction,
      animation,
      animationBuilder,
    };
  }

  private navigate(url: string | UrlTree | any[], options: NavigationOptions) {
    if (Array.isArray(url)) {
      return this.router!.navigate(url, options);
    } else {
      /**
       * navigateByUrl ignores any properties that
       * would change the url, so things like queryParams
       * would be ignored unless we create a url tree
       * More Info: https://github.com/angular/angular/issues/18798
       */
      const urlTree = this.serializer.parse(url.toString());

      if (options.queryParams !== undefined) {
        urlTree.queryParams = { ...options.queryParams };
      }

      if (options.fragment !== undefined) {
        urlTree.fragment = options.fragment;
      }

      /**
       * `navigateByUrl` will still apply `NavigationExtras` properties
       * that do not modify the url, such as `replaceUrl` which is why
       * `options` is passed in here.
       */
      return this.router!.navigateByUrl(urlTree, options);
    }
  }
}

const getAnimation = (
  direction: RouterDirection,
  animated: boolean | undefined,
  animationDirection: 'forward' | 'back' | undefined
): NavDirection | undefined => {
  if (animated === false) {
    return undefined;
  }
  if (animationDirection !== undefined) {
    return animationDirection;
  }
  if (direction === 'forward' || direction === 'back') {
    return direction;
  } else if (direction === 'root' && animated === true) {
    return 'forward';
  }
  return undefined;
};

const DEFAULT_DIRECTION = 'auto';
const DEFAULT_ANIMATED = undefined;
