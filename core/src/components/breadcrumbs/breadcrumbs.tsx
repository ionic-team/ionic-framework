import { Component, ComponentInterface, Element, Host, Prop, State, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-breadcrumbs',
  styleUrl: 'breadcrumbs.scss',
  shadow: true
})
export class Breadcrumbs implements ComponentInterface {

  @State() collapsed!: boolean;

  @State() indicatorOrder!: string;

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  componentDidLoad() {
    this.setBreadcrumbSeparator();
    this.setCollapsed();
    this.setOrder();
  }

  private setCollapsed = () => {
    const breadcrumbs = this.getBreadcrumbs();

    const collapsedBreadcrumbs = breadcrumbs.filter(breadcrumb => breadcrumb.collapsed);

    for (const [index, collapsed] of collapsedBreadcrumbs.entries()) {
      const last = collapsed === collapsedBreadcrumbs[collapsedBreadcrumbs.length - 1];

      if (last) {
        collapsed.lastCollapsed = true;
        this.indicatorOrder = `${index}`;
      }
    }

    if (collapsedBreadcrumbs.length > 0) {
      this.collapsed = true;
    }
  }

  private setOrder = () => {
    const breadcrumbs = this.getBreadcrumbs();

    for (const [index, breadcrumb] of breadcrumbs.entries()) {
      breadcrumb.style.order = `${index}`;
    }
  }

  private setBreadcrumbSeparator = () => {
    const breadcrumbs = this.getBreadcrumbs();

    // Check if an active breadcrumb exists already
    const active = breadcrumbs.find(breadcrumb => breadcrumb.active);

    // Set the separator on all but the last breadcrumb
    for (const breadcrumb of breadcrumbs) {
      const last = breadcrumb === breadcrumbs[breadcrumbs.length - 1];

      // If the breadcrumb has defined whether or not to show the
      // separator then use that value, otherwise check if it's the
      // last breadcrumb
      const separator = breadcrumb.separator !== undefined
        ? breadcrumb.separator
        : (last ? undefined : true);
      breadcrumb.separator = separator;

      // If there is not an active breadcrumb already
      // set the last one to active
      if (!active && last) {
        breadcrumb.active = true;
      }
    }
  }

  private getBreadcrumbs(): HTMLIonBreadcrumbElement[] {
    return Array.from(this.el.querySelectorAll('ion-breadcrumb'));
  }

  render() {
    const { color, collapsed, indicatorOrder } = this;
    const mode = getIonMode(this);

    return (
      <Host
        class={createColorClasses(color, {
          [mode]: true,
          'breadcrumbs-collapsed': collapsed,
        })}

      >
        <div class="breadcrumbs-collapsed-indicator" style={{
          'order': indicatorOrder
        }}>
          <ion-icon name="ellipsis-horizontal"></ion-icon>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
