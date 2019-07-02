import { Component, ComponentInterface, Element, Listen, Prop, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { Color, CssClassMap, StyleEventDetail } from '../../interface';
import { ButtonInterface } from '../../utils/element-interface';
import { createColorClasses } from '../../utils/theme';

@Component({
  tag: 'ion-menu-button',
  styleUrls: {
    ios: 'menu-button.ios.scss',
    md: 'menu-button.md.scss'
  },
  shadow: true
})
export class MenuButton implements ComponentInterface, ButtonInterface {
  private buttonStyles = new Map<string, CssClassMap>();

  @Element() el!: HTMLIonMenuButtonElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * If `true`, the user cannot interact with the menu button.
   */
  @Prop() disabled = false;

  /**
   * Optional property that maps to a Menu's `menuId` prop. Can also be `start` or `end` for the menu side. This is used to find the correct menu to toggle
   */
  @Prop() menu?: string;

  /**
   * Automatically hides the menu button when the corresponding menu is not active
   */
  @Prop() autoHide = true;

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  @Listen('ionStyle')
  buttonStyle(ev: CustomEvent<StyleEventDetail>) {
    ev.stopPropagation();

    const tagName = (ev.target as HTMLElement).tagName;
    const updatedStyles = ev.detail;
    const newStyles = {} as any;
    const childStyles = this.buttonStyles.get(tagName) || {};

    let hasStyleChange = false;
    Object.keys(updatedStyles).forEach(key => {
      if (updatedStyles[key]) {
        const classKey = `menu-button-${key}`;
        if (!childStyles[classKey]) {
          hasStyleChange = true;
        }
        newStyles[classKey] = true;
      }
    });
    if (!hasStyleChange && Object.keys(newStyles).length !== Object.keys(childStyles).length) {
      hasStyleChange = true;
    }
    if (hasStyleChange) {
      this.buttonStyles.set(tagName, newStyles);
      this.el.forceUpdate();
    }
  }

  hostData() {
    const childStyles = {};
    this.buttonStyles.forEach(value => {
      Object.assign(childStyles, value);
    });

    const mode = getIonMode(this);
    const { color, disabled } = this;

    return {
      'aria-disabled': disabled ? 'true' : null,
      class: {
        ...childStyles,
        ...createColorClasses(color),

        [mode]: true,

        'button': true,  // ion-buttons target .button
        'menu-button-disabled': disabled,
        'ion-activatable': true,
        'ion-focusable': true
      }
    };
  }

  render() {
    const mode = getIonMode(this);
    const menuIcon = config.get('menuIcon', 'menu');

    const attrs = {
      type: this.type
    };

    return (
      <ion-menu-toggle menu={this.menu} autoHide={this.autoHide}>
        <button
          {...attrs}
          disabled={this.disabled}
          class="button-native"
        >
          <slot>
            <ion-icon icon={menuIcon} mode={mode} lazy={false}></ion-icon>
          </slot>
          {mode === 'md' && <ion-ripple-effect type="unbounded"></ion-ripple-effect>}
        </button>
      </ion-menu-toggle>
    );
  }
}
