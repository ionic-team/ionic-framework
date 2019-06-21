import { Build, Component, ComponentInterface, Element, Method, Prop, h } from '@stencil/core';

import { ComponentRef, FrameworkDelegate } from '../../interface';
import { attachComponent } from '../../utils/framework-delegate';

@Component({
  tag: 'ion-tab',
  styleUrl: 'tab.scss',
  shadow: true
})
export class Tab implements ComponentInterface {

  private loaded = false;
  @Element() el!: HTMLIonTabElement;

  /** @internal */
  @Prop({ mutable: true }) active = false;

  /** @internal */
  @Prop() delegate?: FrameworkDelegate;

  /**
   * A tab id must be provided for each `ion-tab`. It's used internally to reference
   * the selected tab or by the router to switch between them.
   */
  @Prop() tab!: string;

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
    }
  }

  /** Set the active component for the tab */
  @Method()
  async setActive(): Promise<void> {
    await this.prepareLazyLoaded();
    this.active = true;
  }

  private async prepareLazyLoaded(): Promise<HTMLElement | undefined> {
    if (!this.loaded && this.component != null) {
      this.loaded = true;
      try {
        return attachComponent(this.delegate, this.el, this.component, ['ion-page']);
      } catch (e) {
        console.error(e);
      }
    }
    return undefined;
  }

  hostData() {
    const { tab, active, component } = this;
    return {
      'role': 'tabpanel',
      'aria-hidden': !active ? 'true' : null,
      'aria-labelledby': `tab-button-${tab}`,
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
