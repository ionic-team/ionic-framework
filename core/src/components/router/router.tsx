import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Config, QueueController } from '../../interface';
import { debounce } from '../../utils/helpers';
import { printRedirects, printRoutes } from './utils/debug';
import { readNavState, waitUntilNavNode, writeNavState } from './utils/dom';
import { RouteChain, RouteRedirect, RouterDirection, RouterEventDetail } from './utils/interface';
import { routeRedirect, routerIDsToChain, routerPathToChain } from './utils/matching';
import { flattenRouterTree, readRedirects, readRoutes } from './utils/parser';
import { chainToPath, generatePath, parsePath, readPath, writePath } from './utils/path';


@Component({
  tag: 'ion-router'
})
export class Router {

  private routes: RouteChain[] = [];
  private previousPath: string|null = null;
  private redirects: RouteRedirect[] = [];
  private busy = false;
  private state = 0;
  private lastState = 0;

  @Element() el!: HTMLElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ context: 'queue' }) queue!: QueueController;
  @Prop({ context: 'window' }) win!: Window;

  /**
   * By default `ion-router` will match the routes at the root path ("/").
   * That can be changed when
   *
   * T
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
   * requires aditional server-side configuration in order to properly work.
   *
   * On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.
   *
   * By default, this property is `true`, change to `false` to allow hash-less URLs.
   */
  @Prop() useHash = true;

  @Event() ionRouteWillChange!: EventEmitter<RouterEventDetail>;
  @Event() ionRouteDidChange!: EventEmitter<RouterEventDetail>;

  async componentWillLoad() {
    console.debug('[ion-router] router will load');
    await waitUntilNavNode(this.win);
    console.debug('[ion-router] found nav');

    const tree = readRoutes(this.el);
    this.routes = flattenRouterTree(tree);
    this.redirects = readRedirects(this.el);

    this.win.addEventListener('ionRouteRedirectChanged', debounce(this.onRedirectChanged.bind(this), 10));
    this.win.addEventListener('ionRouteDataChanged', debounce(this.onRoutesChanged.bind(this), 100));

    const changed = await this.writeNavStateRoot(this.getPath(), RouterDirection.None);
    if (!changed) {
      console.error('[ion-router] did not change on will load');
    }
  }

  @Listen('window:popstate')
  protected onPopState() {
    const direction = this.historyDirection();
    const path = this.getPath();
    console.debug('[ion-router] URL changed -> update nav', path, direction);
    return this.writeNavStateRoot(path, direction);
  }

  private onRedirectChanged() {
    this.redirects = readRedirects(this.el);
    const path = this.getPath();
    if (path && routeRedirect(path, this.redirects)) {
      this.writeNavStateRoot(path, RouterDirection.None);
    }
  }

  private onRoutesChanged() {
    const tree = readRoutes(this.el);
    this.routes = flattenRouterTree(tree);
    this.writeNavStateRoot(this.getPath(), RouterDirection.None);
  }

  private historyDirection() {
    if (this.win.history.state === null) {
      this.state++;
      this.win.history.replaceState(this.state, this.win.document.title, this.win.document.location.href);
    }

    const state = this.win.history.state;
    const lastState = this.lastState;
    this.lastState = state;

    if (state > lastState) {
      return RouterDirection.Forward;
    } else if (state < lastState) {
      return RouterDirection.Back;
    } else {
      return RouterDirection.None;
    }
  }

  @Method()
  printDebug() {
    console.debug('CURRENT PATH', this.getPath());
    console.debug('PREVIOUS PATH', this.previousPath);
    printRoutes(this.routes);
    printRedirects(this.redirects);
  }

  @Method()
  async navChanged(direction: RouterDirection): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    const { ids, outlet } = readNavState(this.win.document.body);
    const chain = routerIDsToChain(ids, this.routes);
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

    await this.writeNavState(outlet, chain, RouterDirection.None, path, null, ids.length);
    return true;
  }

  @Method()
  push(url: string, direction = RouterDirection.Forward) {
    const path = parsePath(url);
    this.setPath(path, direction);

    console.debug('[ion-router] URL pushed -> updating nav', url, direction);
    return this.writeNavStateRoot(path, direction);
  }

  private async writeNavStateRoot(path: string[]|null, direction: RouterDirection): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    if (!path) {
      console.error('[ion-router] URL is not part of the routing set');
      return false;
    }

    // lookup redirect rule
    const redirect = routeRedirect(path, this.redirects);
    let redirectFrom: string[]|null = null;
    if (redirect) {
      this.setPath(redirect.to!, direction);
      redirectFrom = redirect.from;
      path = redirect.to!;
    }

    // lookup route chain
    const chain = routerPathToChain(path, this.routes);
    if (!chain) {
      console.error('[ion-router] the path does not match any route');
      return false;
    }

    // write DOM give
    return this.writeNavState(this.win.document.body, chain, direction, path, redirectFrom);
  }

  private async writeNavState(
    node: HTMLElement|undefined, chain: RouteChain, direction: RouterDirection,
    path: string[], redirectFrom: string[] | null,
    index = 0
  ): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    this.busy = true;

    // generate route event and emit will change
    const event = this.routeChangeEvent(path, redirectFrom);
    this.ionRouteWillChange.emit(event);

    const changed = await writeNavState(node, chain, direction, index);
    this.busy = false;

    // emit did change
    this.emitRouteDidChange(event, changed);

    return changed;
  }

  private setPath(path: string[], direction: RouterDirection) {
    this.state++;
    writePath(this.win.history, this.root, this.useHash, path, direction, this.state);
  }

  private getPath(): string[] | null {
    return readPath(this.win.location, this.root, this.useHash);
  }

  private emitRouteDidChange(event: RouterEventDetail, changed: boolean) {
    console.debug('[ion-router] route changed', event.to);
    this.previousPath = event.to;
    this.ionRouteDidChange.emit({
      ...event,
      changed
    });
  }

  private routeChangeEvent(path: string[], redirectFromPath: string[]|null) {
    const from = this.previousPath;
    const to = generatePath(path);
    const redirectedFrom = redirectFromPath ? generatePath(redirectFromPath) : null;
    return {
      from,
      redirectedFrom,
      to,
    };
  }
}
