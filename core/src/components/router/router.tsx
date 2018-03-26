import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Config, DomController } from '../../index';
import { flattenRouterTree, readRedirects, readRoutes } from './utils/parser';
import { readNavState, writeNavState } from './utils/dom';
import { chainToPath, generatePath, parsePath, readPath, writePath } from './utils/path';
import { RouteChain, RouteRedirect, RouterDirection, RouterEventDetail } from './utils/interfaces';
import { routeRedirect, routerIDsToChain, routerPathToChain } from './utils/matching';
import { printRoutes } from './utils/debug';


@Component({
  tag: 'ion-router'
})
export class Router {

  private routes: RouteChain[];
  private previousPath: string = null;
  private redirects: RouteRedirect[];
  private busy = false;
  private init = false;
  private state = 0;
  private timer: any;

  @Element() el: HTMLElement;

  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;

  @Prop() base = '';
  @Prop() useHash = true;

  @Event() ionRouteChanged: EventEmitter<RouterEventDetail>;

  componentDidLoad() {
    this.init = true;
    this.onRedirectChanged();
    this.onRoutesChanged();
  }

  @Listen('ionRouteRedirectChanged')
  protected onRedirectChanged() {
    if (!this.init) {
      return;
    }
    this.redirects = readRedirects(this.el);
  }

  @Listen('ionRouteDataChanged')
  protected onRoutesChanged() {
    if (!this.init) {
      return;
    }
    const tree = readRoutes(this.el);
    this.routes = flattenRouterTree(tree);

    printRoutes(this.routes);

    // schedule write
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = undefined;
    }
    this.timer = requestAnimationFrame(() => {
      this.timer = undefined;
      this.onPopState();
    });
  }


  @Listen('window:popstate')
  protected onPopState() {
    if (window.history.state === null) {
      this.state++;
      window.history.replaceState(this.state, document.title, document.location.href);
    }
    const direction = window.history.state >= this.state
      ? RouterDirection.Forward
      : RouterDirection.Back;

    const path = this.getPath();
    console.debug('[ion-router] URL changed -> update nav', path, direction);
    this.writeNavStateRoot(path, direction);
  }

  @Method()
  async navChanged(direction: RouterDirection): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    const { ids, outlet } = readNavState(document.body);
    const chain = routerIDsToChain(ids, this.routes);
    if (!chain) {
      console.warn('no matching URL for ', ids.map(i => i.id));
      return false;
    }

    const path = chainToPath(chain);
    if (!path) {
      console.warn('router could not match path because some required param is missing');
      return false;
    }

    console.debug('[ion-router] nav changed -> update URL', ids, path);
    this.setPath(path, direction);
    if (outlet) {
      console.debug('[ion-router] updating nested outlet', outlet);
      await this.writeNavState(outlet, chain, RouterDirection.None, ids.length);
    }
    this.emitRouteChange(path, null);
    return true;
  }

  @Method()
  push(url: string, direction = RouterDirection.Forward) {
    const path = parsePath(url);
    this.setPath(path, direction);

    console.debug('[ion-router] URL pushed -> updating nav', url, direction);
    return this.writeNavStateRoot(path, direction);
  }

  private async writeNavStateRoot(path: string[], direction: RouterDirection): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    const redirect = routeRedirect(path, this.redirects);
    let redirectFrom: string[] = null;
    if (redirect) {
      this.setPath(redirect.to, direction);
      redirectFrom = redirect.from;
      path = redirect.to;
    }
    const chain = routerPathToChain(path, this.routes);
    const changed = await this.writeNavState(document.body, chain, direction);
    if (changed) {
      this.emitRouteChange(path, redirectFrom);
    }
    return changed;
  }

  private async writeNavState(node: any, chain: RouteChain, direction: RouterDirection, index = 0): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    try {
      this.busy = true;
      const changed = await writeNavState(node, chain, direction, index);
      this.busy = false;
      return changed;
    } catch (e) {
      this.busy = false;
      console.error(e);
      return false;
    }
  }

  private setPath(path: string[], direction: RouterDirection) {
    this.state++;
    writePath(window.history, this.base, this.useHash, path, direction, this.state);
  }

  private getPath(): string[] | null {
    return readPath(window.location, this.base, this.useHash);
  }

  private emitRouteChange(path: string[], redirectPath: string[]|null) {
    console.debug('[ion-router] route changed', path);
    const from = this.previousPath;
    const redirectedFrom = redirectPath ? generatePath(redirectPath) : null;
    const to = generatePath(path);
    this.previousPath = to;
    this.ionRouteChanged.emit({
      from,
      redirectedFrom,
      to: to
    });
  }
}
