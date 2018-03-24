import { Build, Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Config, DomController } from '../../index';
import { flattenRouterTree, readRedirects, readRoutes } from './utils/parser';
import { readNavState, writeNavState } from './utils/dom';
import { chainToPath, generatePath, parsePath, readPath, writePath } from './utils/path';
import { RouteChain, RouteRedirect, RouterEventDetail } from './utils/interfaces';
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

    if (Build.isDev) {
      printRoutes(this.routes);
    }

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
    const direction = window.history.state >= this.state ? 1 : -1;
    this.writeNavStateRoot(this.getPath(), direction);
  }

  @Method()
  async navChanged(isPop: boolean): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    console.debug('[IN] nav changed -> update URL');
    const { ids, pivot } = readNavState(document.body);
    const chain = routerIDsToChain(ids, this.routes);
    if (!chain) {
      console.warn('no matching URL for ', ids.map(i => i.id));
      return false;
    }

    const path = chainToPath(chain);
    this.setPath(path, isPop);

    if (chain.length > ids.length) {
      await this.writeNavState(pivot, chain.slice(ids.length), 0);
    }
    this.emitRouteChange(path, null);
    return true;
  }

  @Method()
  push(url: string, backDirection = false) {
    const path = parsePath(url);
    this.setPath(path, backDirection);

    return this.writeNavStateRoot(path, backDirection ? -1 : 1);
  }

  private async writeNavStateRoot(path: string[], direction: number): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    const redirect = routeRedirect(path, this.redirects);
    let redirectFrom: string[] = null;
    if (redirect) {
      this.setPath(redirect.to, true);
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

  private async writeNavState(node: any, chain: RouteChain, direction: number): Promise<boolean> {
    if (this.busy) {
      return false;
    }
    try {
      this.busy = true;
      const changed = await writeNavState(node, chain, 0, direction);
      this.busy = false;
      return changed;
    } catch (e) {
      this.busy = false;
      throw e;
    }
  }

  private setPath(path: string[], isPop: boolean) {
    this.state++;
    writePath(window.history, this.base, this.useHash, path, isPop, this.state);
  }

  private getPath(): string[] | null {
    return readPath(window.location, this.base, this.useHash);
  }

  private emitRouteChange(path: string[], redirectPath: string[]|null) {
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
