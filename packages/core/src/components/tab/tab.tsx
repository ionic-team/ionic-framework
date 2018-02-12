import { Component, Element, Event, EventEmitter, Method, Prop, State, Watch } from '@stencil/core';

import { getNavAsChildIfExists } from '../../utils/helpers';
import { FrameworkDelegate } from '../..';

@Component({
  tag: 'ion-tab',
  styleUrl: 'tab.scss'
})
export class Tab {

  private loaded = false;
  @Element() el: HTMLElement;

  @State() init = false;
  @State() active = false;

  /**
   * Set the root page for this tab.
   */
  @Prop() btnId: string;

  /**
   * The title of the tab button.
   */
  @Prop() title: string;

  /**
   * The icon for the tab button.
   */
  @Prop() icon: string;

  /**
   * The badge for the tab button.
   */
  @Prop() badge: string;

  /**
   * The badge for the tab button.
   */
  @Prop() component: any;
  @Prop() name: string;

  /**
   * The badge color for the tab button.
   */
  @Prop() badgeStyle = 'default';

  /**
   * If true, the user cannot interact with the tab. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * If true, the tab button is visible within the
   * tabbar. Default: `true`.
   */
  @Prop() show = true;

  /**
   * If true, hide the tabs on child pages.
   */
  @Prop() tabsHideOnSubPages = false;

  @Prop() delegate: FrameworkDelegate;

  @Prop({ mutable: true }) selected = false;

  @Watch('selected')
  selectedChanged(selected: boolean) {
    if (selected) {
      this.ionSelect.emit();
    }
  }

  /**
   * Emitted when the current tab is selected.
   */
  @Event() ionSelect: EventEmitter<TabEventDetail>;

  @Method()
  setActive(active: boolean): Promise<any> {
    this.active = active;
    if (this.loaded || !active) {
      return Promise.resolve();
    }

    this.loaded = true;

    let promise: Promise<any>;
    if (this.component) {
      promise = (this.delegate)
       ? this.delegate.attachViewToDom(this.el, this.component)
       : attachViewToDom(this.el, this.component);

    } else {
      promise = Promise.resolve();
    }
    return promise.then(() => this.fireChildren());
  }

  @Method()
  getRouteId(): string|null {
    if (this.name) {
      return this.name;
    }
    if (typeof this.component === 'string') {
      return this.component;
    }
    return null;
  }

  private fireChildren() {
    const nav = getNavAsChildIfExists(this.el);
    if (nav && nav.getViews().length === 0 && nav.root) {
      // we need to initialize
      return nav.setRoot(nav.root);
    }
    // it's already been initialized if it exists
    return Promise.resolve();
  }

  hostData() {
    const visible = this.active && this.selected;
    return {
      'aria-hidden': !visible,
      'aria-labelledby': this.btnId,
      'role': 'tabpanel',
      class: {
        'show-tab': this.active
      }
    };
  }

  render() {
    return <slot/>;
  }
}

function attachViewToDom(container: HTMLElement, cmp: string): Promise<any> {
  const el = document.createElement(cmp) as HTMLStencilElement;
  container.appendChild(el);
  if (el.componentOnReady ) {
    return el.componentOnReady();
  }
  return Promise.resolve();
}

export interface TabEvent extends CustomEvent {
  detail: TabEventDetail;
}

export interface TabEventDetail {

}
