import { Build, Component, ComponentInterface, Element, Method, Prop } from '@stencil/core';

import { ComponentRef, FrameworkDelegate } from '../../interface';
import { attachComponent } from '../../utils/framework-delegate';

@Component({
  tag: 'ion-tab-view',
  styleUrl: 'tab-view.scss',
  shadow: true
})
export class TabView implements ComponentInterface {

  private loaded = false;
  @Element() el!: HTMLIonTabViewElement;

  /**
   * If `true`, sets the tab as the active tab.
   */
  @Prop({ mutable: true }) active = false;

  /** @internal */
  @Prop() btnId?: string;

  /** @internal */
  @Prop() delegate?: FrameworkDelegate;

  /**
   * A tab id must be provided for each `ion-tab-view`. It's used internally to reference
   * the selected tab or by the router to switch between them.
   */
  @Prop() tabId?: string;

  /**
   * The component to display inside of the tab.
   */
  @Prop() component?: ComponentRef;

  componentWillLoad() {

    if (Build.isDev) {
      if (this.component !== undefined && this.el.childElementCount > 0) {
        console.error('You can not use a lazy-loaded component in a tab and inlined content at the same time.' +
      `- Remove the component attribute in: <ion-tab component="${this.component}">` +
      ` or` +
      `- Remove the embedded content inside the ion-tab: <ion-tab></ion-tab>`);
      }

      if (this.tabId === undefined) {
        console.error(`Tab views need to have an unique id attribute:
  <ion-tab-view tab-id="my-unique-id">`);
      }
    }
  }

  /** Set the active component for the tab */
  @Method()
  async setActive(): Promise<void> {
    await this.prepareLazyLoaded();
    this.active = true;
  }

  private prepareLazyLoaded(): Promise<HTMLElement | void> {
    if (!this.loaded && this.component != null) {
      this.loaded = true;
      return attachComponent(this.delegate, this.el, this.component, ['ion-page']);
    }
    return Promise.resolve();
  }

  hostData() {
    const { btnId, active, component } = this;
    return {
      'aria-labelledby': btnId,
      'aria-hidden': !active ? 'true' : null,
      'role': 'tabpanel',
      'class': {
        'ion-page': component === undefined,
        'tab-hidden': !active
      }
    };
  }

  render() {
    return <slot></slot>;
  }
}
