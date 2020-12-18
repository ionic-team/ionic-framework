import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

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

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  componentDidLoad() {
    this.setBreadcrumbSeparator();
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

      // If there is not a current breadcrumb already
      // set the last one to current
      if (!active && last) {
        breadcrumb.active = true;
      }
    }
  }

  private getBreadcrumbs(): HTMLIonBreadcrumbElement[] {
    return Array.from(this.el.querySelectorAll('ion-breadcrumb'));
  }

  render() {
    const mode = getIonMode(this);
    return (
      <Host
        class={createColorClasses(this.color, {
          [mode]: true,
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}
