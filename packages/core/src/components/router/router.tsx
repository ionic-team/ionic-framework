import { Component, Element, Listen, Prop } from '@stencil/core';
import { RouterEntries, matchPath, matchRouteChain, readNavState, readPath, readRoutes, writeNavState, writePath } from './router-utils';
import { Config, DomController } from '../../index';


@Component({
  tag: 'ion-router'
})
export class Router {

  private routes: RouterEntries;
  private busy = false;
  private state = 0;

  @Prop({ context: 'config' }) config: Config;
  @Prop({ context: 'dom' }) dom: DomController;

  @Prop() base = '';
  @Prop() useHash = true;

  @Element() el: HTMLElement;

  componentDidLoad() {
    // read config
    this.routes = readRoutes(this.el);

    // perform first write
    this.dom.raf(() => {
      console.debug('[OUT] page load -> write nav state');
      this.writeNavStateRoot();
    });
  }

  @Listen('window:popstate')
  protected onURLHashChanged() {
    if (window.history.state === null) {
      this.state++;
      window.history.replaceState(this.state, document.title, document.location.href);
    }
    if (!this.busy) {
      console.debug('[OUT] hash changed -> write nav state');
      this.writeNavStateRoot();
    }
  }

  @Listen('body:ionNavChanged')
  protected onNavChanged(ev: CustomEvent) {
    if (this.busy) {
      return;
    }
    console.debug('[IN] nav changed -> update URL');
    const { stack, pivot } = this.readNavState();
    const { path, routes } = matchPath(stack, this.routes);
    if (pivot) {
      // readNavState() found a pivot that is not initialized
      console.debug('[IN] pivot uninitialized -> write partial nav state');
      this.writeNavState(pivot, [], routes, 0);
    }

    const isPop = ev.detail.isPop === true;
    this.writePath(path, isPop);
  }

  private writeNavStateRoot(): Promise<any> {
    const node = document.querySelector('ion-app') as HTMLElement;
    const currentPath = this.readPath();
    const direction = window.history.state >= this.state ? 1 : -1;
    if (currentPath) {
      return this.writeNavState(node, currentPath, this.routes, direction);
    }
    return Promise.resolve();
  }

  private writeNavState(node: any, path: string[], routes: RouterEntries, direction: number): Promise<any> {
    const chain = matchRouteChain(path, routes);

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
