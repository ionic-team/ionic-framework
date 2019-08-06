import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';

import { BackButtonEvent, RouteChain, RouterDirection, RouterEventDetail } from '../../interface';
import { debounce } from '../../utils/helpers';

import { ROUTER_INTENT_BACK, ROUTER_INTENT_FORWARD, ROUTER_INTENT_NONE } from './utils/constants';
import { printRedirects, printRoutes } from './utils/debug';
import { readNavState, waitUntilNavNode, writeNavState } from './utils/dom';
import { routeRedirect, routerIDsToChain, routerPathToChain } from './utils/matching';
import { readRedirects, readRoutes } from './utils/parser';
import { chainToPath, generatePath, parsePath, readPath, writePath } from './utils/path';

@Component({
  tag: 'ion-router'
})
export class Router implements ComponentInterface {

  private previousPath: string | null = null;
  private busy = false;
  private state = 0;
  private lastState = 0;
  private waitPromise?: Promise<void>;

  @Element() el!: HTMLElement;

  /**
   * By default `ion-router` will match the routes at the root path ("/").
   * That can be changed when
   *
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
   * On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.
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
    console.debug('[ion-router] router will load');
    await waitUntilNavNode();
    console.debug('[ion-router] found nav');

    await this.onRoutesChanged();
  }

  componentDidLoad() {
    window.addEventListener('ionRouteRedirectChanged', debounce(this.onRedirectChanged.bind(this), 10));
    window.addEventListener('ionRouteDataChanged', debounce(this.onRoutesChanged.bind(this), 100));
  }

  @Listen('popstate', { target: 'window' })
  protected onPopState() {
    const direction = this.historyDirection();
    const path = this.getPath();
    console.debug('[ion-router] URL changed -> update nav', path, direction);
    return this.writeNavStateRoot(path, direction);
  }

  @Listen('ionBackButton', { target: 'document' })
  protected onBackButton(ev: BackButtonEvent) {
    ev.detail.register(0, () => this.back());
  }

  /**
   * Navigate to the specified URL.
   *
   * @param url The url to navigate to.
   * @param direction The direction of the animation. Defaults to `"forward"`.
   */
  @Method()
  push(url: string, direction: RouterDirection = 'forward') {
    if (url.startsWith('.')) {
      url = (new URL(url, window.location.href)).pathname;
    }
    console.debug('[ion-router] URL pushed -> updating nav', url, direction);

    const path = parsePath(url);
    this.setPath(path, direction);
    return this.writeNavStateRoot(path, direction);
  }

  /**
   * Go back to previous page in the window.history.
   */
  @Method()
  back() {
    window.history.back();
    return Promise.resolve(this.waitPromise);
  }

  /** @internal */
  @Method()
  async printDebug() {
    console.debug('CURRENT PATH', this.getPath());
    console.debug('PREVIOUS PATH', this.previousPath);
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
    const chain = routerIDsToChain(ids, routes);
    if (!chain) {
      console.warn('[ion-router] no matching URL for ', ids.map(i => i.id));
      return false;
    }

    const path = chainToPath(chain);
    if (!path) {
      console.warn('[ion-router] router could not match path because some required param is missing');
      return false;
    }

    console.debug('[ion-router] nav changed -> update URL', ids, path);
    this.setPath(path, direction);

    await this.safeWriteNavState(outlet, chain, ROUTER_INTENT_NONE, path, null, ids.length);
    return true;
  }

  private onRedirectChanged() {
    const path = this.getPath();
    if (path && routeRedirect(path, readRedirects(this.el))) {
      this.writeNavStateRoot(path, ROUTER_INTENT_NONE);
    }
  }

  private onRoutesChanged() {
    return this.writeNavStateRoot(this.getPath(), ROUTER_INTENT_NONE);
  }

  private historyDirection() {
    const win = window;

    if (win.history.state === null) {
      this.state++;
      win.history.replaceState(this.state, win.document.title, win.document.location && win.document.location.href);
    }

    const state = win.history.state;
    const lastState = this.lastState;
    this.lastState = state;

    if (state > lastState) {
      return ROUTER_INTENT_FORWARD;
    } else if (state < lastState) {
      return ROUTER_INTENT_BACK;
    } else {
      return ROUTER_INTENT_NONE;
    }
  }

  private async writeNavStateRoot(path: string[] | null, direction: RouterDirection): Promise<boolean> {
    if (!path) {
      console.error('[ion-router] URL is not part of the routing set');
      return false;
    }

    // lookup redirect rule
    const redirects = readRedirects(this.el);
    const redirect = routeRedirect(path, redirects);
    let redirectFrom: string[] | null = null;
    if (redirect) {
      this.setPath(redirect.to!, direction);
      redirectFrom = redirect.from;
      path = redirect.to!;
    }

    // lookup route chain
    const routes = readRoutes(this.el);
    const chain = routerPathToChain(path, routes);
    if (!chain) {
      console.error('[ion-router] the path does not match any route');
      return false;
    }

    // write DOM give
    return this.safeWriteNavState(document.body, chain, direction, path, redirectFrom);
  }

  private async safeWriteNavState(
    node: HTMLElement | undefined, chain: RouteChain, direction: RouterDirection,
    path: string[], redirectFrom: string[] | null,
    index = 0
  ): Promise<boolean> {
    const unlock = await this.lock();
    let changed = false;
    try {
      changed = await this.writeNavState(node, chain, direction, path, redirectFrom, index);
    } catch (e) {
      console.error(e);
    }
    unlock();
    return changed;
  }

  private async lock() {
    const p = this.waitPromise;
    let resolve!: () => void;
    this.waitPromise = new Promise(r => resolve = r);

    if (p !== undefined) {
      await p;
    }
    return resolve;
  }

  private async writeNavState(
    node: HTMLElement | undefined, chain: RouteChain, direction: RouterDirection,
    path: string[], redirectFrom: string[] | null,
    index = 0
  ): Promise<boolean> {
    if (this.busy) {
      console.warn('[ion-router] router is busy, transition was cancelled');
      return false;
    }
    this.busy = true;

    // generate route event and emit will change
    const routeEvent = this.routeChangeEvent(path, redirectFrom);
    if (routeEvent) {
      this.ionRouteWillChange.emit(routeEvent);
    }

    const changed = await writeNavState(node, chain, direction, index);
    this.busy = false;

    if (changed) {
      console.debug('[ion-router] route changed', path);
    }

    // emit did change
    if (routeEvent) {
      this.ionRouteDidChange.emit(routeEvent);
    }
    return changed;
  }

  private setPath(path: string[], direction: RouterDirection) {
    this.state++;
    writePath(window.history, this.root, this.useHash, path, direction, this.state);
  }

  private getPath(): string[] | null {
    return readPath(window.location, this.root, this.useHash);
  }

  private routeChangeEvent(path: string[], redirectFromPath: string[] | null): RouterEventDetail | null {
    const from = this.previousPath;
    const to = generatePath(path);
    this.previousPath = to;
    if (to === from) {
      return null;
    }
    const redirectedFrom = redirectFromPath ? generatePath(redirectFromPath) : null;
    return {
      from,
      redirectedFrom,
      to,
    };
  }
}
