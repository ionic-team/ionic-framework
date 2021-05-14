import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Listen, Prop, State, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color } from '../../interface';
import { createColorClasses, hostContext } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part collapsed-indicator - The indicator element that shows when at least one child breadcrumb is collapsed.
 */
@Component({
  tag: 'ion-breadcrumbs',
  styleUrls: {
    'ios': 'breadcrumbs.ios.scss',
    'md': 'breadcrumbs.md.scss'
  },
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

  /**
   * Emitted when the collapsed button is clicked on.
   */
  @Event() ionCollapsedClick!: EventEmitter<void>;

  @Listen('ionCollapsed')
  collapsedChanged() {
    this.setCollapsed();
  }

  componentWillLoad() {
    this.setBreadcrumbSeparator();
    this.setCollapsed();
    this.setOrder();
  }

  private setCollapsed = () => {
    const breadcrumbs = this.getBreadcrumbs();

    // Initialize all breadcrumbs as not being the last
    // in case multiple breadcrumbs are collapsed at once
    for (const breadcrumb of breadcrumbs) {
      breadcrumb.lastCollapsed = false;
    }

    const collapsedBreadcrumbs = breadcrumbs.filter(breadcrumb => breadcrumb.collapsed);

    for (const [index, collapsed] of collapsedBreadcrumbs.entries()) {
      const last = collapsed === collapsedBreadcrumbs[collapsedBreadcrumbs.length - 1];

      if (last) {
        collapsed.lastCollapsed = true;
        this.indicatorOrder = `${index}`;
      }
    }

    this.collapsed = collapsedBreadcrumbs.length > 0 ? true : false;
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

  private getBreadcrumbs = (): HTMLIonBreadcrumbElement[] => {
    return Array.from(this.el.querySelectorAll('ion-breadcrumb'));
  }

  private collapsedIndicatorClick = () => {
    this.ionCollapsedClick.emit();
  }

  render() {
    const { color, collapsed, indicatorOrder } = this;
    const mode = getIonMode(this);

    return (
      <Host
        class={createColorClasses(color, {
          [mode]: true,
          'in-toolbar': hostContext('ion-toolbar', this.el),
          'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
          'breadcrumbs-collapsed': collapsed,
        })}

      >
        <button
          part="collapsed-indicator"
          onClick={() => this.collapsedIndicatorClick()}
          class={{
            'breadcrumbs-collapsed-indicator': true,
            'ion-focusable': true,
          }}
          style={{
            'order': indicatorOrder
          }}>
          <ion-icon name="ellipsis-horizontal" lazy={false}></ion-icon>
        </button>
        <slot></slot>
      </Host>
    );
  }
}
