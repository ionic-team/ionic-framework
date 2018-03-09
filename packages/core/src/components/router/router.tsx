import { Build, Component, Element, Listen, Method, Prop } from '@stencil/core';
import { Config, DomController } from '../../index';
import { flattenRouterTree, readRedirects, readRoutes } from './utils/parser';
import { readNavState, writeNavState } from './utils/dom';
import { chainToPath, generatePath, parsePath, readPath, writePath } from './utils/path';
import { RouteChain, RouteRedirect } from './utils/interfaces';
import { routeRedirect, routerIDsToChain, routerPathToChain } from './utils/matching';


@Component({
  tag: 'ion-router'
})
export class Router {

  private routes: RouteChain[];
  private redirects: RouteRedirect[];
  private busy = false;
  private state = 0;

  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;

  @Prop() base = '';
  @Prop() useHash = true;

  @Element() el: HTMLElement;

  componentDidLoad() {
    // read config
    const tree = readRoutes(this.el);
    this.routes = flattenRouterTree(tree);
    this.redirects = readRedirects(this.el);

    if (Build.isDev) {
      console.debug('%c[@ionic/core]', 'font-weight: bold', `ion-router registered ${this.routes.length} routes`);
      for (const chain of this.routes) {
        const path: string[] = [];
        chain.forEach(r => path.push(...r.path));
        const ids = chain.map(r => r.id);
        console.debug(`%c ${generatePath(path)}`, 'font-weight: bold; padding-left: 20px', '=>\t', `(${ids.join(', ')})`);
      }
    }

    // perform first write
    this.dom.raf(() => {
      console.debug('[OUT] page load -> write nav state');
      this.onPopState();
    });
  }

  @Listen('window:popstate')
  protected onPopState() {
    if (window.history.state === null) {
      this.state++;
      window.history.replaceState(this.state, document.title, document.location.href);
    }
    this.writeNavStateRoot(this.readPath());
  }

  @Method()
  navChanged(isPop: boolean) {
    if (!this.busy) {
      console.debug('[IN] nav changed -> update URL');
      const { ids, pivot } = this.readNavState();
      const chain = routerIDsToChain(ids, this.routes);
      if (chain) {
        const path = chainToPath(chain);
        this.writePath(path, isPop);

        if (chain.length > ids.length) {
          // readNavState() found a pivot that is not initialized
          console.debug('[IN] pivot uninitialized -> write partial nav state');
          return this.writeNavState(pivot, chain.slice(ids.length), 0);
        }
      } else {
        console.warn('no matching URL for ', ids.map(i => i.id));
      }
    }
    return Promise.resolve();
  }


  @Method()
  push(url: string, backDirection = false) {
    const path = parsePath(url);
    this.writePath(path, backDirection);
    return this.writeNavStateRoot(path);
  }

  private writeNavStateRoot(path: string[]): Promise<any> {
    if (this.busy) {
      return Promise.resolve();
    }
    const redirect = routeRedirect(path, this.redirects);
    if (redirect) {
      this.writePath(redirect.to, true);
      path = redirect.to;
    }
    const direction = window.history.state >= this.state ? 1 : -1;
    const node = document.querySelector('ion-app');
    const chain = routerPathToChain(path, this.routes);
    return this.writeNavState(node, chain, direction);
  }

  private writeNavState(node: any, chain: RouteChain, direction: number): Promise<any> {
    if (this.busy) {
      return Promise.resolve();
    }
    this.busy = true;
    return writeNavState(node, chain, 0, direction)
      .catch(err => console.error(err))
      .then(() => this.busy = false);
  }

  private readNavState() {
    const root = document.querySelector('ion-app') as HTMLElement;
    return readNavState(root);
  }

  private writePath(path: string[], isPop: boolean) {
    // busyURL is used to prevent reentering in the popstate event
    this.state++;
    writePath(window.history, this.base, this.useHash, path, isPop, this.state);
  }

  private readPath(): string[] | null {
    return readPath(window.location, this.base, this.useHash);
  }
}
