import list from '@phosphor-icons/core/assets/regular/list.svg';
import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, h } from '@stencil/core';
import { reorderThreeOutline, reorderTwoSharp } from 'ionicons/icons';

import { config } from '../../global/config';
import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @part icon - The icon of the reorder handle (uses ion-icon).
 */
@Component({
  tag: 'ion-reorder',
  styleUrls: {
    ios: 'reorder.ios.scss',
    md: 'reorder.md.scss',
    ionic: 'reorder.md.scss',
  },
  shadow: true,
})
export class Reorder implements ComponentInterface {
  @Element() el!: HTMLIonReorderElement;

  @Listen('click', { capture: true })
  onClick(ev: Event) {
    const reorderGroup = this.el.closest('ion-reorder-group');

    ev.preventDefault();

    // Only stop event propagation if the reorder is inside of an enabled
    // reorder group. This allows interaction with clickable children components.
    if (!reorderGroup || !reorderGroup.disabled) {
      ev.stopImmediatePropagation();
    }
  }

  /**
   * Get the icon to use for the handle icon.
   * Otherwise, use the icon set in the config.
   * If no icon is set in the config, use the default icon.
   *
   * @returns {string} The icon to use for the handle icon.
   */
  get reorderHandleIcon(): string {
    // Determine the theme and map to default icons
    const theme = getIonTheme(this);
    const defaultIcons = {
      ios: reorderThreeOutline,
      ionic: list,
      md: reorderTwoSharp,
    };

    // Get the default icon based on the theme, falling back to 'md' icon if necessary
    const defaultIcon = defaultIcons[theme] || defaultIcons.md;

    // Return the configured reorder handle icon or the default icon
    return config.get('reorderHandleIcon', defaultIcon);
  }

  render() {
    const { reorderHandleIcon } = this;
    const theme = getIonTheme(this);

    return (
      <Host
        class={{
          [theme]: true,
        }}
      >
        <slot>
          <ion-icon icon={reorderHandleIcon} lazy={false} class="reorder-icon" part="icon" aria-hidden="true" />
        </slot>
      </Host>
    );
  }
}
