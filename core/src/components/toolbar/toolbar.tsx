import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Listen, Prop, forceUpdate, h } from '@stencil/core';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color, CssClassMap, StyleEventDetail } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the toolbar text in LTR, and to the right in RTL.
 * @slot secondary - Content is placed to the left of the toolbar text in the `"ios"` theme, and directly to the right in the `"md"` theme.
 * @slot primary - Content is placed to the right of the toolbar text in the `"ios"` theme, and to the far right in the `"md"` theme.
 * @slot end - Content is placed to the right of the toolbar text in LTR, and to the left in RTL.
 */
@Component({
  tag: 'ion-toolbar',
  styleUrls: {
    ios: 'toolbar.ios.scss',
    md: 'toolbar.md.scss',
    ionic: 'toolbar.md.scss',
  },
  shadow: true,
})
export class Toolbar implements ComponentInterface {
  private childrenStyles = new Map<string, CssClassMap>();

  @Element() el!: HTMLIonToolbarElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  componentWillLoad() {
    const buttons = Array.from(this.el.querySelectorAll('ion-buttons'));

    const firstButtons = buttons.find((button) => {
      return button.slot === 'start';
    });
    if (firstButtons) {
      firstButtons.classList.add('buttons-first-slot');
    }

    const buttonsReversed = buttons.reverse();
    const lastButtons =
      buttonsReversed.find((button) => button.slot === 'end') ||
      buttonsReversed.find((button) => button.slot === 'primary') ||
      buttonsReversed.find((button) => button.slot === 'secondary');
    if (lastButtons) {
      lastButtons.classList.add('buttons-last-slot');
    }
  }

  @Listen('ionStyle')
  childrenStyle(ev: CustomEvent<StyleEventDetail>) {
    ev.stopPropagation();

    const tagName = (ev.target as HTMLElement).tagName;
    const updatedStyles = ev.detail;
    const newStyles = {} as CssClassMap;
    const childStyles = this.childrenStyles.get(tagName) || {};

    let hasStyleChange = false;
    Object.keys(updatedStyles).forEach((key) => {
      const childKey = `toolbar-${key}`;
      const newValue = updatedStyles[key];
      if (newValue !== childStyles[childKey]) {
        hasStyleChange = true;
      }
      if (newValue) {
        newStyles[childKey] = true;
      }
    });

    if (hasStyleChange) {
      this.childrenStyles.set(tagName, newStyles);
      forceUpdate(this);
    }
  }

  render() {
    const theme = getIonTheme(this);
    const childStyles = {};
    this.childrenStyles.forEach((value) => {
      Object.assign(childStyles, value);
    });
    return (
      <Host
        class={{
          ...childStyles,
          ...createColorClasses(this.color, {
            [theme]: true,
            'in-toolbar': hostContext('ion-toolbar', this.el),
          }),
        }}
      >
        <div class="toolbar-background"></div>
        <div class="toolbar-container">
          <slot name="start"></slot>
          <slot name="secondary"></slot>
          <div class="toolbar-content">
            <slot></slot>
          </div>
          <slot name="primary"></slot>
          <slot name="end"></slot>
        </div>
      </Host>
    );
  }
}
