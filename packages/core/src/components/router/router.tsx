import { Component, Element, Listen, Method, Prop } from '@stencil/core';
import { Config, DomController } from '../../index';
import { flattenRouterTree, readRoutes } from './utils/parser';
import { readNavState, writeNavState } from './utils/dom';
import { chainToPath, parsePath, readPath, writePath } from './utils/path';
import { RouteChain } from './utils/interfaces';
import { routerIDsToChain, routerPathToChain } from './utils/matching';


@Component({
  tag: 'ion-router'
})
export class Router {

  private routes: RouteChain[];
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

    // perform first write
    this.dom.raf(() => {
      console.debug('[OUT] page load -> write nav state');
      this.writeNavStateRoot();
    });
  }

  @Listen('window:popstate')
  protected onPopState() {
    if (window.history.state === null) {
      this.state++;
      window.history.replaceState(this.state, document.title, document.location.href);
    }
    this.writeNavStateRoot();
  }

  @Listen('body:ionNavChanged')
  protected onNavChanged(ev: CustomEvent) {
    if (this.busy) {
      return;
    }
    console.debug('[IN] nav changed -> update URL');
    const { ids, pivot } = this.readNavState();
    const { chain, matches } = routerIDsToChain(ids, this.routes);
    if (chain.length > matches) {
      // readNavState() found a pivot that is not initialized
      console.debug('[IN] pivot uninitialized -> write partial nav state');
      this.writeNavState(pivot, chain.slice(matches), 0);
    }

    const isPop = ev.detail.isPop === true;
    const path = chainToPath(chain);
    this.writePath(path, isPop);
  }

  @Method()
  pushURL(url: string) {
    this.writePath(parsePath(url), false);
    return this.writeNavStateRoot();
  }

  private writeNavStateRoot(): Promise<any> {
    if (this.busy) {
      return Promise.resolve();
    }
    const currentPath = this.readPath();
    if (!currentPath) {
      return Promise.resolve();
    }
    const direction = window.history.state >= this.state ? 1 : -1;
    const node = document.querySelector('ion-app');
    const {chain} = routerPathToChain(currentPath, this.routes);
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
    this.state = writePath(window.history, this.base, this.useHash, path, isPop, this.state);
  }

  private readPath(): string[] | null {
    return readPath(window.location, this.base, this.useHash);
  }

  render() {
    return <slot/>;
  }
}
