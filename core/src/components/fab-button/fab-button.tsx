import { Component, ComponentInterface, Element, Prop } from '@stencil/core';

import { Color, Mode, RouterDirection } from '../../interface';
import { createColorClasses, hostContext, openURL } from '../../utils/theme';

@Component({
  tag: 'ion-fab-button',
  styleUrls: {
    ios: 'fab-button.ios.scss',
    md: 'fab-button.md.scss'
  },
  shadow: true
})
export class FabButton implements ComponentInterface {

  @Prop({ context: 'window' }) win!: Window;

  @Element() el!: HTMLElement;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * If true, the fab button will be show a close icon. Defaults to `false`.
   */
  @Prop() activated = false;

  /**
   * If true, the user cannot interact with the fab button. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * When using a router, it specifies the transition direction when navigating to
   * another page using `href`.
   */
  @Prop() routerDirection?: RouterDirection;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  /**
   * If true, the fab button will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  /**
   * If true, the fab button will show when in a fab-list.
   */
  @Prop() show = false;

  hostData() {
    const inList = hostContext('ion-fab-list', this.el);
    return {
      'ion-activatable': true,
      class: {
        ...createColorClasses(this.color),
        'fab-button-in-list': inList,
        'fab-button-translucent-in-list': inList && this.translucent,
        'fab-button-close-active': this.activated,
        'fab-button-show': this.show,
        'fab-button-disabled': this.disabled,
        'fab-button-translucent': this.translucent
      }
    };
  }

  render() {
    const TagType = this.href === undefined ? 'button' : 'a';

    return (
      <TagType
        class="button-native"
        disabled={this.disabled}
        href={this.href}
        onClick={ev => openURL(this.win, this.href, ev, this.routerDirection)}
      >
        <span class="close-icon">
          <ion-icon name="close" lazy={false}></ion-icon>
        </span>
        <span class="button-inner">
          <slot></slot>
        </span>
        {this.mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </TagType>
    );
  }
}
