import { Component, ComponentInterface, Element, Event, EventEmitter, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, RouterDirection } from '../../interface';
import { AnchorInterface, ButtonInterface } from '../../utils/element-interface';
import { createColorClasses, hostContext, openURL } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-fab-button',
  styleUrls: {
    ios: 'fab-button.ios.scss',
    md: 'fab-button.md.scss'
  },
  shadow: true
})
export class FabButton implements ComponentInterface, AnchorInterface, ButtonInterface {
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * If `true`, the fab button will be show a close icon.
   */
  @Prop() activated = false;

  /**
   * If `true`, the user cannot interact with the fab button.
   */
  @Prop() disabled = false;

  /**
   * This attribute instructs browsers to download a URL instead of navigating to
   * it, so the user will be prompted to save it as a local file. If the attribute
   * has a value, it is used as the pre-filled file name in the Save prompt
   * (the user can still change the file name if they want).
   */
  @Prop() download: string | undefined;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string | undefined;

  /**
   * Specifies the relationship of the target object to the link object.
   * The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).
   */
  @Prop() rel: string | undefined;

  /**
   * When using a router, it specifies the transition direction when navigating to
   * another page using `href`.
   */
  @Prop() routerDirection: RouterDirection = 'forward';

  /**
   * Specifies where to display the linked URL.
   * Only applies when an `href` is provided.
   * Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.
   */
  @Prop() target: string | undefined;

  /**
   * If `true`, the fab button will show when in a fab-list.
   */
  @Prop() show = false;

  /**
   * If `true`, the fab button will be translucent.
   * Only applies to `ios` mode on devices that support
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  /**
   * The type of the button.
   */
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  /**
   * The size of the button. Set this to `small` in order to have a mini fab.
   */
  @Prop() size?: 'small';

  /**
   * Emitted when the button has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the button loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  private onFocus = () => {
    this.ionFocus.emit();
  }

  private onBlur = () => {
    this.ionBlur.emit();
  }

  hostData() {
    const { el, disabled, color, activated, show, translucent, size } = this;
    const inList = hostContext('ion-fab-list', el);
    const mode = getIonMode(this);
    return {
      'aria-disabled': disabled ? 'true' : null,
      class: {
        ...createColorClasses(color),
        [mode]: true,
        'fab-button-in-list': inList,
        'fab-button-translucent-in-list': inList && translucent,
        'fab-button-close-active': activated,
        'fab-button-show': show,
        'fab-button-disabled': disabled,
        'fab-button-translucent': translucent,
        'ion-activatable': true,
        'ion-focusable': true,
        [`fab-button-${size}`]: size !== undefined,
      }
    };
  }

  render() {
    const mode = getIonMode(this);
    const TagType = this.href === undefined ? 'button' : 'a' as any;
    const attrs = (TagType === 'button')
      ? { type: this.type }
      : {
        download: this.download,
        href: this.href,
        rel: this.rel,
        target: this.target
      };

    return (
      <TagType
        {...attrs}
        class="button-native"
        disabled={this.disabled}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onClick={(ev: Event) => openURL(this.href, ev, this.routerDirection)}
      >
        <span class="close-icon">
          <ion-icon name="close" lazy={false}></ion-icon>
        </span>
        <span class="button-inner">
          <slot></slot>
        </span>
        {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </TagType>
    );
  }
}
