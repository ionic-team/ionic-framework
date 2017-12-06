import { Component, Element, Event, EventEmitter, Method, Prop, PropDidChange, State } from '@stencil/core';
import { PublicViewController, StencilElement } from '../../index';


@Component({
  tag: 'ion-tab',
})
export class Tab {

  private nav: Promise<HTMLIonNavElement>;
  private resolveNav: (el: HTMLIonNavElement) => void;

  @Element() el: HTMLElement;

  @State() init = false;
  @State() active = false;

  /**
   * @input {Page} Set the root page for this tab.
   */
  @Prop() root: string;

  /**
   * @input {object} Any nav-params to pass to the root page of this tab.
   */
  @Prop() rootParams: any;

  /**
   * @input {string} Set the root page for this tab.
   */
  @Prop() btnId: string;

  /**
   * @input {string} The URL path name to represent this tab within the URL.
   */
  @Prop() path: string;

  /**
   * @input {string} The title of the tab button.
   */
  @Prop() title: string;

  /**
   * @input {string} The icon for the tab button.
   */
  @Prop() icon: string;

  /**
   * @input {string} The badge for the tab button.
   */
  @Prop() badge: string;

  /**
   * @input {string} The badge color for the tab button.
   */
  @Prop() badgeStyle: string = 'default';

  /**
   * @input {boolean} If true, enable the tab. If false,
   * the user cannot interact with this element.
   * Default: `true`.
   */
  @Prop() enabled = true;

  /**
   * @input {boolean} If true, the tab button is visible within the
   * tabbar. Default: `true`.
   */
  @Prop() show = true;

  /**
   * @input {boolean} If true, hide the tabs on child pages.
   */
  @Prop() tabsHideOnSubPages = false;

  constructor() {
    this.nav = new Promise((resolve) => this.resolveNav = resolve);
  }

  @Prop({ mutable: true }) selected = false;
  @PropDidChange('selected')
  selectedChanged(selected: boolean) {
    if (selected) {
      this.ionSelect.emit(this.el);
    }
  }

  /**
   * @output {Tab} Emitted when the current tab is selected.
   */
  @Event() ionSelect: EventEmitter;

  protected componentDidUpdate() {
    if (this.init && this.resolveNav) {
      const nav = this.el.querySelector('ion-nav') as any as StencilElement;
      nav.componentOnReady(this.resolveNav);
      this.resolveNav = null;
    }
  }

  @Method()
  _setActive(shouldActive: boolean): Promise<any> {
    if (this.active === shouldActive) {
      return Promise.resolve();
    }
    this.active = shouldActive;
    this.selected = shouldActive;

    const needsLifecycle = this.init;
    if (shouldActive) {
      this.init = true;
    }
    if (needsLifecycle) {
      if (shouldActive) {
        // lifecycle didEnter
      } else {
        // lifecycle didLeave
      }
    }
    return this.nav;
  }

  @Method()
  getPath(): string {
    if (this.path != null) {
      return this.path;
    }
    if (this.title) {
      return this.title.toLowerCase();
    }
    return '';
  }

  @Method()
  goToRoot(opts: any = {}) {
    return this.nav.then(nav => nav && nav.setRoot(nav.root, null, opts));
  }

  @Method()
  getActive(): Promise<PublicViewController> {
    return this.nav.then(nav => nav && nav.getActive());
  }

  @Method()
  getNav(): Promise<HTMLIonNavElement> {
    return this.nav;
  }

  hostData() {
    const visible = this.active && this.selected;
    return {
      'aria-hidden': !visible ? 'true' : null,
      'aria-labelledby': this.btnId,
      'role': 'tabpanel',
      class: {
        'show-tab': this.active
      }
    };
  }

  render() {
    if (this.init) {
      return <ion-nav><slot></slot></ion-nav>;
    }
    return null;
  }
}
