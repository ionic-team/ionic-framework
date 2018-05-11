import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Config, QueueController, RouteChain, RouterDirection, RouterEventDetail, RouterIntent } from '../../interface';
import { debounce } from '../../utils/helpers';
import { printRedirects, printRoutes } from './utils/debug';
import { readNavState, waitUntilNavNode, writeNavState } from './utils/dom';
import { routeRedirect, routerIDsToChain, routerPathToChain } from './utils/matching';
import { readRedirects, readRoutes } from './utils/parser';
import { chainToPath, generatePath, parsePath, readPath, writePath } from './utils/path';


@Component({
  tag: 'ion-router'
})
export class Router {

  private previousPath: string | null = null;
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

    await this.onRoutesChanged();

    this.win.addEventListener('ionRouteRedirectChanged', debounce(this.onRedirectChanged.bind(this), 10));
    this.win.addEventListener('ionRouteDataChanged', debounce(this.onRoutesChanged.bind(this), 100));
    this.onRedirectChanged();
  }

  @Listen('window:popstate')
  protected onPopState() {
    const direction = this.historyDirection();
    const path = this.getPath();
    console.debug('[ion-router] URL changed -> update nav', path, direction);
    return this.writeNavStateRoot(path, direction);
  }

  @Method()
  push(url: string, direction: RouterDirection = 'forward') {
    const path = parsePath(url);
    const intent = DIRECTION_TO_INTENT[direction];
    console.debug('[ion-router] URL pushed -> updating nav', url, direction);

    this.setPath(path, intent);
    return this.writeNavStateRoot(path, intent);
  }

  @Method()
  printDebug() {
    console.debug('CURRENT PATH', this.getPath());
    console.debug('PREVIOUS PATH', this.previousPath);
    printRoutes(readRoutes(this.el));
    printRedirects(readRedirects(this.el));
  }

  @Method()
  async navChanged(intent: RouterIntent): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    const { ids, outlet } = readNavState(this.win.document.body);
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
    this.setPath(path, intent);

    await this.writeNavState(outlet, chain, RouterIntent.None, path, null, ids.length);
    return true;
  }

  private onRedirectChanged() {
    const path = this.getPath();
    if (path && routeRedirect(path, readRedirects(this.el))) {
      this.writeNavStateRoot(path, RouterIntent.None);
    }
  }

  private onRoutesChanged() {
    return this.writeNavStateRoot(this.getPath(), RouterIntent.None);
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
      return RouterIntent.Forward;
    } else if (state < lastState) {
      return RouterIntent.Back;
    } else {
      return RouterIntent.None;
    }
  }


  private async writeNavStateRoot(path: string[]|null, intent: RouterIntent): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    if (!path) {
      console.error('[ion-router] URL is not part of the routing set');
      return false;
    }

    // lookup redirect rule
    const redirects = readRedirects(this.el);
    const redirect = routeRedirect(path, redirects);
    let redirectFrom: string[]|null = null;
    if (redirect) {
      this.setPath(redirect.to, intent);
      redirectFrom = redirect.from;
      path = redirect.to;
    }

    // lookup route chain
    const routes = readRoutes(this.el);
    const chain = routerPathToChain(path, routes);
    if (!chain) {
      console.error('[ion-router] the path does not match any route');
      return false;
    }

    // write DOM give
    return this.writeNavState(this.win.document.body, chain, intent, path, redirectFrom);
  }

  private async writeNavState(
    node: HTMLElement|undefined, chain: RouteChain, intent: RouterIntent,
    path: string[], redirectFrom: string[] | null,
    index = 0
  ): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    this.busy = true;

    // generate route event and emit will change
    const routeEvent = this.routeChangeEvent(path, redirectFrom);
    routeEvent && this.ionRouteWillChange.emit(routeEvent);

    const changed = await writeNavState(node, chain, intent, index);
    this.busy = false;

    if (changed) {
      console.debug('[ion-router] route changed', path);
    }

    // emit did change
    routeEvent && this.ionRouteDidChange.emit(routeEvent);

    return changed;
  }

  private setPath(path: string[], intent: RouterIntent) {
    this.state++;
    writePath(this.win.history, this.root, this.useHash, path, intent, this.state);
  }

  private getPath(): string[] | null {
    return readPath(this.win.location, this.root, this.useHash);
  }

  private routeChangeEvent(path: string[], redirectFromPath: string[]|null): RouterEventDetail | null {
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

const DIRECTION_TO_INTENT = {
  'back': RouterIntent.Back,
  'root': RouterIntent.None,
  'forward': RouterIntent.Forward
};
