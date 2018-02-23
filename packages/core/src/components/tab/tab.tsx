import { Component, Element, Event, EventEmitter, Method, Prop, State, Watch } from '@stencil/core';

import { FrameworkDelegate } from '../..';
import { asyncRaf, getIonApp, getNavAsChildIfExists } from '../../utils/helpers';


@Component({
  tag: 'ion-tab',
  styleUrl: 'tab.scss'
})
export class Tab {

  private loaded = false;
  @Element() el: HTMLElement;

  @State() init = false;

  @Prop() delegate: FrameworkDelegate;

  @Prop({ mutable: true }) active = false;

  @Prop() btnId: string;

  /**
   * The title of the tab.
   */
  @Prop() title: string;

  /**
   * The icon for the tab.
   */
  @Prop() icon: string;

  /**
   * The badge for the tab.
   */
  @Prop() badge: string;

  /**
   * The badge color for the tab button.
   */
  @Prop() badgeStyle = 'default';

  /**
   * The component to display inside of the tab.
   */
  @Prop() component: any;

  /**
   * The name of the tab.
   */
  @Prop() name: string;

  /**
   * If true, the user cannot interact with the tab. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * If true, the tab will be selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) selected = false;

  @Watch('selected')
  selectedChanged(selected: boolean) {
    if (selected) {
      this.ionSelect.emit();
    }
  }

  /**
   * If true, the tab button is visible within the tabbar. Defaults to `true`.
   */
  @Prop() show = true;

  /**
   * If true, hide the tabs on child pages.
   */
  @Prop() tabsHideOnSubPages = false;


  /**
   * Emitted when the current tab is selected.
   */
  @Event() ionSelect: EventEmitter<void>;

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

  @Method()
  setActive(): Promise<any> {
    return this.prepareLazyLoaded().then(() => this.showTab());
  }

  private prepareLazyLoaded(): Promise<any> {
    if (!this.loaded && this.component) {
      this.loaded = true;
      const promise = (this.delegate)
        ? this.delegate.attachViewToDom(this.el, this.component)
        : attachViewToDom(this.el, this.component);

      return promise.then(() => asyncRaf());
    }
    return Promise.resolve();
  }

  private showTab(): Promise<any|void> {
    this.active = true;
    const nav = getNavAsChildIfExists(this.el);
    if (!nav) {
      return Promise.resolve();
    }
    // the tab's nav has been initialized externally
    return getIonApp().then((ionApp) => {
      const externalNavPromise = ionApp ? ionApp.getExternalNavPromise() : null;
      if (externalNavPromise) {
        return (externalNavPromise as any).then(() => {
          ionApp.setExternalNavPromise(null);
        });
      }

      // the tab's nav has not been initialized externally, so
      // check if we need to initiailize it
      return nav.componentOnReady()
      .then(() => nav.activateFromTab(this.selected));
    });
  }

  hostData() {
    const hidden = !this.active || !this.selected;
    return {
      'aria-hidden': hidden,
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
  if (el.componentOnReady) {
    return el.componentOnReady();
  }
  return Promise.resolve();
}
