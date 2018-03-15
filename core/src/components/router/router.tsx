import { Build, Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { Config, DomController } from '../../index';
import { flattenRouterTree, readRedirects, readRoutes } from './utils/parser';
import { readNavState, writeNavState } from './utils/dom';
import { chainToPath, parsePath, readPath, writePath } from './utils/path';
import { RouteChain, RouteRedirect, RouterEventDetail } from './utils/interfaces';
import { routeRedirect, routerIDsToChain, routerPathToChain } from './utils/matching';
import { printRoutes } from './utils/debug';


@Component({
  tag: 'ion-router'
})
export class Router {

  private routes: RouteChain[];
  private previousPath: string[] = null;
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
    this.onRouteChanged();
  }

  @Listen('ionRouteDataChanged')
  protected onRouteChanged() {
    if (!this.init) {
      return;
    }
    const tree = readRoutes(this.el);
    this.routes = flattenRouterTree(tree);
    this.redirects = readRedirects(this.el);

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
    this.writeNavStateRoot(this.getPath());
  }

  @Method()
  navChanged(isPop: boolean): Promise<boolean> {
    if (this.busy) {
      return Promise.resolve(false);
    }
    console.debug('[IN] nav changed -> update URL');
    const { ids, pivot } = readNavState(document.body);
    const chain = routerIDsToChain(ids, this.routes);
    if (!chain) {
      console.warn('no matching URL for ', ids.map(i => i.id));
      return Promise.resolve(false);
    }

    const path = chainToPath(chain);
    this.setPath(path, isPop);

    const promise = (chain.length > ids.length)
      ? this.writeNavState(pivot, chain.slice(ids.length), 0)
      : Promise.resolve(true);

    return promise.then(() => {
      this.emitRouteChange(path, null);
      return true;
    });
  }

  @Method()
  push(url: string, backDirection = false) {
    const path = parsePath(url);
    this.setPath(path, backDirection);
    return this.writeNavStateRoot(path);
  }

  private writeNavStateRoot(path: string[]): Promise<boolean> {
    if (this.busy) {
      return Promise.resolve(false);
    }
    const redirect = routeRedirect(path, this.redirects);
    let redirectFrom: string[] = null;
    if (redirect) {
      this.setPath(redirect.to, true);
      redirectFrom = redirect.path;
      path = redirect.to;
    }
    const direction = window.history.state >= this.state ? 1 : -1;
    const chain = routerPathToChain(path, this.routes);
    return this.writeNavState(document.body, chain, direction).then(changed => {
      if (changed) {
        this.emitRouteChange(path, redirectFrom);
      }
      return changed;
    });
  }

  private writeNavState(node: any, chain: RouteChain, direction: number): Promise<boolean> {
    if (this.busy) {
      return Promise.resolve(false);
    }
    this.busy = true;
    return writeNavState(node, chain, 0, direction).then(changed => {
      this.busy = false;
      return changed;
    });
  }

  private setPath(path: string[], isPop: boolean) {
    this.state++;
    writePath(window.history, this.base, this.useHash, path, isPop, this.state);
  }

  private getPath(): string[] | null {
    return readPath(window.location, this.base, this.useHash);
  }

  private emitRouteChange(path: string[], redirectedFrom: string[]|null) {
    const from = this.previousPath;
    const to = path.slice();
    this.previousPath = to;
    this.ionRouteChanged.emit({
      from,
      redirectedFrom,
      to: to
    });
  }
}
