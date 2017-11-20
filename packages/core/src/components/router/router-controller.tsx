import { Component, Listen, Prop } from '@stencil/core';
import { RouterSegments, generateURL, parseURL, readNavState, writeNavState } from './router-utils';
import { Config } from '../../index';

@Component({
  tag: 'ion-router-controller'
})
export class RouterController {

  private busy = false;
  private enabled = false;
  private basePrefix: string = '#';

  @Prop({ context: 'config' }) config: Config;

  protected ionViewDidLoad() {
    const enabled = this.enabled = this.config.getBoolean('useRouter', false);
    if (enabled) {
      const base = document.querySelector('head > base');
      if (base) {
        const baseURL = base.getAttribute('href');
        if (baseURL.length > 0) {
          this.basePrefix = baseURL;
        }
      }

      Context.dom.raf(() => {
        console.debug('[OUT] page load -> write nav state');
        this.writeNavStateRoot();
      });
    }
  }

  @Listen('window:hashchange')
  protected onURLHashChanged() {
    if (!this.isBlocked()) {
      console.debug('[OUT] hash changed -> write nav state');
      this.writeNavStateRoot();
    }
  }

  @Listen('body:ionNavChanged')
  protected onNavChanged(ev: CustomEvent) {
    if (this.isBlocked()) {
      return;
    }
    console.debug('[IN] nav changed -> update URL');
    const { stack, pivot } = this.readNavState();
    if (pivot) {
      // readNavState() found a pivot that is not initialized
      console.debug('[IN] pivot uninitialized -> write partial nav state');
      this.writeNavState(pivot, []);
    }

    const isPop = ev.detail.isPop === true;
    this.setURL(generateURL(stack), isPop);
  }

  private setURL(url: string, isPop: boolean) {
    url = this.basePrefix + url;
    const history = window.history;
    if (isPop) {
      history.back();
      history.replaceState(null, null, url);
    } else {
      history.pushState(null, null, url);
    }
  }

  private isBlocked(): boolean {
    return this.busy || !this.enabled;
  }

  private writeNavStateRoot(): Promise<any> {
    const node = document.querySelector('ion-app') as HTMLElement;
    return this.writeNavState(node, this.readURL());
  }

  private writeNavState(node: any, url: string[]): Promise<any> {
    const segments = new RouterSegments(url);
    this.busy = true; //  prevents reentrance
    return writeNavState(node, segments)
      .catch(err => console.error(err))
      .then(() => this.busy = false);
  }

  private readNavState() {
    let root = document.querySelector('ion-app') as HTMLElement;
    return readNavState(root);
  }

  private isHash() {
    return this.basePrefix.length > 0 && this.basePrefix[0];
  }

  private readURL(): string[] {
    const url = this.isHash()
      ? window.location.hash.substr(1)
      : window.location.pathname;
    return parseURL(url);
  }
}
