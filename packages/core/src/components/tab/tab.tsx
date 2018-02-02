import { Component, Element, Event, EventEmitter, Method, Prop, State, Watch } from '@stencil/core';

import { getNavAsChildIfExists } from '../../utils/helpers';

@Component({
  tag: 'ion-tab',
})
export class Tab {

  @Element() el: HTMLElement;

  @State() init = false;
  @State() active = false;

  /**
   * Set the root page for this tab.
   */
  @Prop() btnId: string;

  /**
   * The URL path name to represent this tab within the URL.
   */
  @Prop() path: string;

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
   * The badge color for the tab button.
   */
  @Prop() badgeStyle = 'default';

  /**
   * If true, enable the tab. If false,
   * the user cannot interact with this element.
   * Default: `true`.
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
    const nav = getNavAsChildIfExists(this.el);
    if (nav && nav.getViews().length === 0 && nav.root) {
      // we need to initialize
      return nav.setRoot(nav.root);
    }
    // it's already been initialized if it exists
    return Promise.resolve();
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
    return <slot></slot>;
  }
}

export interface TabEvent extends CustomEvent {
  detail: TabEventDetail;
}

export interface TabEventDetail {

}
