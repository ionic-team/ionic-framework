import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Listen, Method, Prop } from '@stencil/core';
import type { BackButtonEvent } from '@utils/hardware-back-button';
import { debounce } from '@utils/helpers';

import type { AnimationBuilder } from '../../interface';
import type { NavigationHookResult } from '../route/route-interface';

import { ROUTER_INTENT_BACK, ROUTER_INTENT_FORWARD, ROUTER_INTENT_NONE } from './utils/constants';
import { printRedirects, printRoutes } from './utils/debug';
import { readNavState, waitUntilNavNode, writeNavState } from './utils/dom';
import type { RouteChain, RouterDirection, RouterEventDetail } from './utils/interface';
import { findChainForIDs, findChainForSegments, findRouteRedirect } from './utils/matching';
import { readRedirects, readRoutes } from './utils/parser';
import { chainToSegments, generatePath, parsePath, readSegments, writeSegments } from './utils/path';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-router',
})
export class Router implements ComponentInterface {
  private previousPath: string | null = null;
  private busy = false;
  private state = 0;
  private lastState = 0;
  private waitPromise?: Promise<void>;

  @Element() el!: HTMLElement;

  /**
   * The root path to use when matching URLs. By default, this is set to "/", but you can specify
   * an alternate prefix for all URL paths.
   */
  @Prop() root = '/';

  /**
   * The router can work in two "modes":
   * - With hash: `/index.html#/path/to/page`
   * - Without hash: `/path/to/page`
   *
   * Using one or another might depend in the requirements of your app and/or where it's deployed.
   *
   * Usually "hash-less" navigation works better for SEO and it's more user friendly too, but it might
   * requires additional server-side configuration in order to properly work.
   *
   * On the other side hash-navigation is much easier to deploy, it even works over the file protocol.
   *
   * By default, this property is `true`, change to `false` to allow hash-less URLs.
   */
  @Prop() useHash = true;

  /**
   * Event emitted when the route is about to change
   */
  @Event() ionRouteWillChange!: EventEmitter<RouterEventDetail>;

  /**
   * Emitted when the route had changed
   */
  @Event() ionRouteDidChange!: EventEmitter<RouterEventDetail>;

  async componentWillLoad() {
    await waitUntilNavNode();

    const canProceed = await this.runGuards(this.getSegments());
    if (canProceed !== true) {
      if (typeof canProceed === 'object') {
        const { redirect } = canProceed;
        const path = parsePath(redirect);
        this.setSegments(path.segments, ROUTER_INTENT_NONE, path.queryString);
        await this.writeNavStateRoot(path.segments, ROUTER_INTENT_NONE);
      }
    } else {
      await this.onRoutesChanged();
    }
  }

  componentDidLoad() {
    window.addEventListener('ionRouteRedirectChanged', debounce(this.onRedirectChanged.bind(this), 10));
    window.addEventListener('ionRouteDataChanged', debounce(this.onRoutesChanged.bind(this), 100));
  }

  @Listen('popstate', { target: 'window' })
  protected async onPopState() {
    const direction = this.historyDirection();
    let segments = this.getSegments();

    const canProceed = await this.runGuards(segments);
    if (canProceed !== true) {
      if (typeof canProceed === 'object') {
        segments = parsePath(canProceed.redirect).segments;
      } else {
        return false;
      }
    }
    return this.writeNavStateRoot(segments, direction);
  }

  @Listen('ionBackButton', { target: 'document' })
  protected onBackButton(ev: BackButtonEvent) {
    ev.detail.register(0, (processNextHandler) => {
      this.back();
      processNextHandler();
    });
  }

  /** @internal */
  @Method()
  async canTransition() {
    const canProceed = await this.runGuards();
    if (canProceed !== true) {
      if (typeof canProceed === 'object') {
        return canProceed.redirect;
      } else {
        return false;
      }
    }

    return true;
  }

  /**
   * Navigate to the specified path.
   *
   * @param path The path to navigate to.
   * @param direction The direction of the animation. Defaults to `"forward"`.
   */
  @Method()
  async push(path: string, direction: RouterDirection = 'forward', animation?: AnimationBuilder) {
    if (path.startsWith('.')) {
      const currentPath = this.previousPath ?? '/';
      // Convert currentPath to an URL by pre-pending a protocol and a host to resolve the relative path.
      const url = new URL(path, `https://host/${currentPath}`);
      path = url.pathname + url.search;
    }

    let parsedPath = parsePath(path);

    const canProceed = await this.runGuards(parsedPath.segments);
    if (canProceed !== true) {
      if (typeof canProceed === 'object') {
        parsedPath = parsePath(canProceed.redirect);
      } else {
        return false;
      }
    }

    this.setSegments(parsedPath.segments, direction, parsedPath.queryString);
    return this.writeNavStateRoot(parsedPath.segments, direction, animation);
  }

  /** Go back to previous page in the window.history. */
  @Method()
  back(): Promise<void> {
    window.history.back();
    return Promise.resolve(this.waitPromise);
  }

  /** @internal */
  @Method()
  async printDebug() {
    printRoutes(readRoutes(this.el));
    printRedirects(readRedirects(this.el));
  }

  /** @internal */
  @Method()
  async navChanged(direction: RouterDirection): Promise<boolean> {
    if (this.busy) {
      console.warn('[ion-router] router is busy, navChanged was cancelled');
      return false;
    }
    const { ids, outlet } = await readNavState(window.document.body);
    const routes = readRoutes(this.el);
    const chain = findChainForIDs(ids, routes);
    if (!chain) {
      console.warn(
        '[ion-router] no matching URL for ',
        ids.map((i) => i.id)
      );
      return false;
    }

    const segments = chainToSegments(chain);
    if (!segments) {
      console.warn('[ion-router] router could not match path because some required param is missing');
      return false;
    }

    this.setSegments(segments, direction);

    await this.safeWriteNavState(outlet, chain, ROUTER_INTENT_NONE, segments, null, ids.length);
    return true;
  }

  /** This handler gets called when a `ion-route-redirect` component is added to the DOM or if the from or to property of such node changes. */
  private onRedirectChanged() {
    const segments = this.getSegments();
    if (segments && findRouteRedirect(segments, readRedirects(this.el))) {
      this.writeNavStateRoot(segments, ROUTER_INTENT_NONE);
    }
  }

  /** This handler gets called when a `ion-route` component is added to the DOM or if the from or to property of such node changes. */
  private onRoutesChanged() {
    return this.writeNavStateRoot(this.getSegments(), ROUTER_INTENT_NONE);
  }

  private historyDirection() {
    const win = window;

    if (win.history.state === null) {
      this.state++;
      win.history.replaceState(this.state, win.document.title, win.document.location?.href);
    }

    const state = win.history.state;
    const lastState = this.lastState;
    this.lastState = state;

    if (state > lastState || (state >= lastState && lastState > 0)) {
      return ROUTER_INTENT_FORWARD;
    }
    if (state < lastState) {
      return ROUTER_INTENT_BACK;
    }
    return ROUTER_INTENT_NONE;
  }

  private async writeNavStateRoot(
    segments: string[] | null,
    direction: RouterDirection,
    animation?: AnimationBuilder
  ): Promise<boolean> {
    if (!segments) {
      console.error('[ion-router] URL is not part of the routing set');
      return false;
    }

    // lookup redirect rule
    const redirects = readRedirects(this.el);
    const redirect = findRouteRedirect(segments, redirects);

    let redirectFrom: string[] | null = null;

    if (redirect) {
      const { segments: toSegments, queryString } = redirect.to!;
      this.setSegments(toSegments, direction, queryString);
      redirectFrom = redirect.from;
      segments = toSegments;
    }

    // lookup route chain
    const routes = readRoutes(this.el);
    const chain = findChainForSegments(segments, routes);
    if (!chain) {
      console.error('[ion-router] the path does not match any route');
      return false;
    }

    // write DOM give
    return this.safeWriteNavState(document.body, chain, direction, segments, redirectFrom, 0, animation);
  }

  private async safeWriteNavState(
    node: HTMLElement | undefined,
    chain: RouteChain,
    direction: RouterDirection,
    segments: string[],
    redirectFrom: string[] | null,
    index = 0,
    animation?: AnimationBuilder
  ): Promise<boolean> {
    const unlock = await this.lock();
    let changed = false;
    try {
      changed = await this.writeNavState(node, chain, direction, segments, redirectFrom, index, animation);
    } catch (e) {
      console.error(e);
    }
    unlock();
    return changed;
  }

  private async lock() {
    const p = this.waitPromise;
    let resolve!: () => void;
    this.waitPromise = new Promise((r) => (resolve = r));

    if (p !== undefined) {
      await p;
    }
    return resolve;
  }

  /**
   * Executes the beforeLeave hook of the source route and the beforeEnter hook of the target route if they exist.
   *
   * When the beforeLeave hook does not return true (to allow navigating) then that value is returned early and the beforeEnter is executed.
   * Otherwise the beforeEnterHook hook of the target route is executed.
   */
  private async runGuards(
    to: string[] | null = this.getSegments(),
    from?: string[] | null
  ): Promise<NavigationHookResult> {
    if (from === undefined) {
      from = parsePath(this.previousPath).segments;
    }

    if (!to || !from) {
      return true;
    }

    const routes = readRoutes(this.el);

    const fromChain = findChainForSegments(from, routes);
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    const beforeLeaveHook = fromChain && fromChain[fromChain.length - 1].beforeLeave;

    const canLeave = beforeLeaveHook ? await beforeLeaveHook() : true;
    if (canLeave === false || typeof canLeave === 'object') {
      return canLeave;
    }

    const toChain = findChainForSegments(to, routes);
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    const beforeEnterHook = toChain && toChain[toChain.length - 1].beforeEnter;

    return beforeEnterHook ? beforeEnterHook() : true;
  }

  private async writeNavState(
    node: HTMLElement | undefined,
    chain: RouteChain,
    direction: RouterDirection,
    segments: string[],
    redirectFrom: string[] | null,
    index = 0,
    animation?: AnimationBuilder
  ): Promise<boolean> {
    if (this.busy) {
      console.warn('[ion-router] router is busy, transition was cancelled');
      return false;
    }
    this.busy = true;

    // generate route event and emit will change
    const routeEvent = this.routeChangeEvent(segments, redirectFrom);
    if (routeEvent) {
      this.ionRouteWillChange.emit(routeEvent);
    }

    const changed = await writeNavState(node, chain, direction, index, false, animation);
    this.busy = false;

    // emit did change
    if (routeEvent) {
      this.ionRouteDidChange.emit(routeEvent);
    }
    return changed;
  }

  private setSegments(segments: string[], direction: RouterDirection, queryString?: string) {
    this.state++;
    writeSegments(window.history, this.root, this.useHash, segments, direction, this.state, queryString);
  }

  private getSegments(): string[] | null {
    return readSegments(window.location, this.root, this.useHash);
  }

  private routeChangeEvent(toSegments: string[], redirectFromSegments: string[] | null): RouterEventDetail | null {
    const from = this.previousPath;
    const to = generatePath(toSegments);
    this.previousPath = to;
    if (to === from) {
      return null;
    }
    const redirectedFrom = redirectFromSegments ? generatePath(redirectFromSegments) : null;
    return {
      from,
      redirectedFrom,
      to,
    };
  }
}
