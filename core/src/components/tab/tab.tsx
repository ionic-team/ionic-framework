import type { ComponentInterface } from '@stencil/core';
import { Build, Component, Element, Host, Method, Prop, Watch, h } from '@stencil/core';
import { attachComponent } from '@utils/framework-delegate';

import type { ComponentRef, FrameworkDelegate } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of components.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-tab',
  styleUrl: 'tab.scss',
  shadow: true,
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

  async componentWillLoad() {
    if (Build.isDev) {
      if (this.component !== undefined && this.el.childElementCount > 0) {
        console.error(
          'You can not use a lazy-loaded component in a tab and inlined content at the same time.' +
            `- Remove the component attribute in: <ion-tab component="${this.component}">` +
            ` or` +
            `- Remove the embedded content inside the ion-tab: <ion-tab></ion-tab>`
        );
      }
    }
    if (this.active) {
      await this.setActive();
    }
  }

  /** Set the active component for the tab */
  @Method()
  async setActive(): Promise<void> {
    await this.prepareLazyLoaded();
    this.active = true;
  }

  @Watch('active')
  changeActive(isActive: boolean) {
    if (isActive) {
      this.prepareLazyLoaded();
    }
  }

  private prepareLazyLoaded(): Promise<HTMLElement | undefined> {
    if (!this.loaded && this.component != null) {
      this.loaded = true;
      try {
        return attachComponent(this.delegate, this.el, this.component, ['ion-page']);
      } catch (e) {
        console.error(e);
      }
    }
    return Promise.resolve(undefined);
  }

  render() {
    const { tab, active, component } = this;
    return (
      <Host
        role="tabpanel"
        aria-hidden={!active ? 'true' : null}
        aria-labelledby={`tab-button-${tab}`}
        class={{
          'ion-page': component === undefined,
          'tab-hidden': !active,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}
