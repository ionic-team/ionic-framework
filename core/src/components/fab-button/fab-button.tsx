import { Component, Element, Prop } from '@stencil/core';

import { Color, CssClassMap, Mode, RouterDirection } from '../../interface';
import { createColorClasses, openURL } from '../../utils/theme';

@Component({
  tag: 'ion-fab-button',
  styleUrls: {
    ios: 'fab-button.ios.scss',
    md: 'fab-button.md.scss'
  },
  shadow: true
})
export class FabButton {
  private inList = false;

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

  componentWillLoad() {
    const parentNode = this.el.parentNode;
    const parentTag = parentNode ? parentNode.nodeName : null;

    this.inList = parentTag === 'ION-FAB-LIST';
  }

  /**
   * Get the classes for fab buttons in lists
   */
  private getFabClassMap(): CssClassMap {
    return {
      'fab-button-in-list': this.inList,
      'fab-button-translucent-in-list': this.inList && this.translucent,
      'fab-button-close-active': this.activated,
      'fab-button-show': this.show
    };
  }

  hostData() {
    return {
      'ion-activatable': true,
      class: {
        ...createColorClasses(this.color),
        ...this.getFabClassMap(),
        'fab-button-disabled': this.disabled,
        'fab-button-translucent': this.translucent
      }
    };
  }

  render() {
    const TagType = this.href === undefined ? 'button' : 'a';

    return (
      <TagType
        class="fab-button-native"
        disabled={this.disabled}
        href={this.href}
        onClick={ev => openURL(this.win, this.href, ev, this.routerDirection)}
      >
        <span class="fab-button-close-icon">
          <ion-icon name="close" lazy={false}></ion-icon>
        </span>
        <span class="fab-button-inner">
          <slot></slot>
        </span>
        {this.mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </TagType>
    );
  }
}
